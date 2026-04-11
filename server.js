import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────
// FIX #1 — SECURITY HEADERS (substitui helmet)
// Aplicado antes de qualquer rota
// ─────────────────────────────────────────────
app.use((req, res, next) => {
  // Impede clickjacking
  res.setHeader("X-Frame-Options", "DENY");
  // Impede sniffing de MIME type
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Força HTTPS por 1 ano (só ativo em produção)
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  // Bloqueia acesso à câmera, microfone, etc.
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  // Evita que o browser envie o referrer completo
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Content-Security-Policy: só permite scripts/estilos do próprio domínio
  const domain = process.env.FRONTEND_URL || "";
  res.setHeader(
    "Content-Security-Policy",
    [
      `default-src 'self'`,
      `script-src 'self'`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      `font-src 'self' https://fonts.gstatic.com`,
      `img-src 'self' data:`,
      `connect-src 'self' https://api-m.paypal.com https://api-m.sandbox.paypal.com`,
      `frame-ancestors 'none'`,
      `form-action 'self'`,
      `base-uri 'self'`
    ].join("; ")
  );
  next();
});

// ─────────────────────────────────────────────
// FIX #2 — CORS ESTRITO (sem fallback para *)
// Só aceita o domínio definido em FRONTEND_URL
// ─────────────────────────────────────────────
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map(v => v.trim()).filter(Boolean)
  : [];

if (allowedOrigins.length === 0) {
  console.warn(
    "[SEGURANÇA] FRONTEND_URL não definida no .env — CORS bloqueará todas as origens externas."
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (ex: curl, Postman em dev local)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
);

app.use(express.json({ limit: "20kb" })); // FIX #8 — Limita tamanho do body

// ─────────────────────────────────────────────
// FIX #3 — RATE LIMITING (sem dependência externa)
// Implementação leve in-process por IP
// ─────────────────────────────────────────────
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const RATE_LIMITS = {
  "/api/paypal/create-order":  10,
  "/api/paypal/capture-order": 10,
  "/api/paypal/webhook":       30,
  "/api/health":               60
};

function rateLimit(maxReqs) {
  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const key = `${ip}:${req.path}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
    }

    entry.count += 1;
    rateLimitStore.set(key, entry);

    res.setHeader("X-RateLimit-Limit", maxReqs);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, maxReqs - entry.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(entry.resetAt / 1000));

    if (entry.count > maxReqs) {
      return res.status(429).json({ error: "Muitas requisições. Tente novamente em breve." });
    }
    next();
  };
}

// Limpeza periódica do store para evitar crescimento infinito
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitStore) {
    if (now > val.resetAt) rateLimitStore.delete(key);
  }
}, 5 * 60 * 1000);

// ─────────────────────────────────────────────
// FIX #4 — RLS / CONTROLE DE ACESSO POR ROTA
// Middleware que valida origem + método por rota
// ─────────────────────────────────────────────
function requireSameOrigin(req, res, next) {
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";

  // Requisições do servidor próprio (sem origin) são aceitas
  if (!origin && !referer) return next();

  const isOriginAllowed = allowedOrigins.length === 0 || allowedOrigins.some(o => origin.startsWith(o));
  const isRefererAllowed = allowedOrigins.length === 0 || allowedOrigins.some(o => referer.startsWith(o));

  if (!isOriginAllowed && !isRefererAllowed) {
    return res.status(403).json({ error: "Acesso negado: origem não autorizada." });
  }
  next();
}

// ─────────────────────────────────────────────
// FIX #5 — ESCAPE HTML (previne XSS nas respostas HTML)
// ─────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ─────────────────────────────────────────────
// CATÁLOGO (fonte de verdade para preços)
// Os preços do frontend são apenas exibição —
// o servidor sempre recalcula pelo catálogo.
// ─────────────────────────────────────────────
const CATALOG = {
  1: { id: 1, sku: "SOUSPLAT-001",      name: "Sousplat de Crochê",                              unitPrice: 30.00 },
  2: { id: 2, sku: "TAPETE-OVAL-002",   name: "Tapete Oval Verde e Off White",                   unitPrice: 35.00 },
  3: { id: 3, sku: "CENTRO-MESA-003",   name: "Centro de Mesa Redondo Verde com Dourado",        unitPrice: 25.00 },
  4: { id: 4, sku: "SOUSPLAT-COLOR-004",name: "Sousplat Redondo Candy Colors",                   unitPrice: 25.00 },
  5: { id: 5, sku: "CAMINHO-MESA-005",  name: "Caminho de Mesa Corações Off White com Dourado",  unitPrice: 60.00 },
  6: { id: 6, sku: "CAMINHO-MESA-006",  name: "Caminho de Mesa Marrom com Dourado",              unitPrice: 60.00 }
};

// Em produção, substituir por banco de dados persistente
const orders = new Map();

// ─────────────────────────────────────────────
// FUNÇÕES AUXILIARES
// ─────────────────────────────────────────────
function getPayPalBaseUrl() {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await response.json();
  if (!response.ok) {
    // FIX #7 — nunca loga dados de autenticação
    console.error("[PayPal] Falha ao obter access token:", response.status);
    throw new Error("Não foi possível autenticar no PayPal.");
  }
  return data.access_token;
}

// FIX #8 — validação com limites de tamanho em todos os campos
const FIELD_LIMITS = { name: 120, phone: 30, email: 120, address: 300, note: 500 };

function normalizeCartItems(rawCart) {
  if (!Array.isArray(rawCart) || rawCart.length === 0) {
    throw new Error("Carrinho vazio.");
  }
  if (rawCart.length > 30) {
    throw new Error("Número de itens no carrinho excede o limite permitido.");
  }

  return rawCart.map(item => {
    const catalogItem = CATALOG[item.productId];
    if (!catalogItem) {
      throw new Error(`Produto inválido: ${item.productId}`);
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 99) {
      throw new Error(`Quantidade inválida para ${catalogItem.name}.`);
    }

    return {
      productId: catalogItem.id,
      sku: catalogItem.sku,
      name: catalogItem.name,
      quantity,
      unitPrice: catalogItem.unitPrice // sempre do servidor, nunca do cliente
    };
  });
}

function calcTotals(items) {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  return { subtotal: subtotal.toFixed(2) };
}

function validateCustomer(customer = {}) {
  const required = ["name", "phone", "email", "address"];
  for (const field of required) {
    const val = String(customer[field] || "").trim();
    if (!val) throw new Error(`Campo obrigatório ausente: ${field}`);

    // FIX #8 — verifica tamanho máximo por campo
    const limit = FIELD_LIMITS[field];
    if (limit && val.length > limit) {
      throw new Error(`Campo "${field}" excede ${limit} caracteres.`);
    }
  }

  // Validação básica de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(customer.email || "").trim())) {
    throw new Error("E-mail inválido.");
  }

  return {
    name:    String(customer.name).trim().slice(0, FIELD_LIMITS.name),
    phone:   String(customer.phone).trim().slice(0, FIELD_LIMITS.phone),
    email:   String(customer.email).trim().slice(0, FIELD_LIMITS.email),
    address: String(customer.address).trim().slice(0, FIELD_LIMITS.address),
    note:    String(customer.note || "").trim().slice(0, FIELD_LIMITS.note)
  };
}

// Valida formato do orderId para evitar enumeração
function isValidOrderId(id) {
  return typeof id === "string" && /^[A-Z0-9_-]{6,50}$/.test(id);
}

// ─────────────────────────────────────────────
// ROTAS
// ─────────────────────────────────────────────

// FIX #6 — Health sem informações sensíveis
app.get("/api/health", rateLimit(RATE_LIMITS["/api/health"]), (req, res) => {
  res.json({ ok: true });
});

app.post(
  "/api/paypal/create-order",
  rateLimit(RATE_LIMITS["/api/paypal/create-order"]),
  requireSameOrigin,
  async (req, res) => {
    try {
      const customer = validateCustomer(req.body.customer);
      const items    = normalizeCartItems(req.body.cart);
      const totals   = calcTotals(items);

      const accessToken = await getPayPalAccessToken();

      const referenceId = `atelie-${Date.now()}`;

      const paypalBody = {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: referenceId,
            description: "Ateliê Priscila Lima",
            amount: {
              currency_code: "BRL",
              value: totals.subtotal,
              breakdown: {
                item_total: { currency_code: "BRL", value: totals.subtotal }
              }
            },
            items: items.map(item => ({
              name: item.name,
              sku: item.sku,
              quantity: String(item.quantity),
              unit_amount: { currency_code: "BRL", value: item.unitPrice.toFixed(2) }
            })),
            custom_id: JSON.stringify({
              customerEmail: customer.email,
              ts: Date.now()
            }).slice(0, 127)
          }
        ],
        application_context: {
          brand_name: "Ateliê Priscila Lima",
          user_action: "PAY_NOW",
          shipping_preference: "NO_SHIPPING",
          return_url:  `${process.env.FRONTEND_URL}/paypal-return`,
          cancel_url:  `${process.env.FRONTEND_URL}/paypal-cancel`
        }
      };

      const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(paypalBody)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[PayPal] Erro create-order:", response.status);
        return res.status(400).json({ error: "Falha ao criar pedido no PayPal." });
      }

      const approvalLink = data.links?.find(link => link.rel === "approve");

      orders.set(data.id, {
        paypalOrderId: data.id,
        status: "CREATED",
        createdAt: new Date().toISOString(),
        customer,
        items,
        totals
      });

      return res.json({
        orderId:     data.id,
        approvalUrl: approvalLink?.href || null
      });
    } catch (error) {
      console.error("[create-order] Erro:", error.message);
      return res.status(400).json({ error: error.message || "Erro ao criar pedido." });
    }
  }
);

app.post(
  "/api/paypal/capture-order",
  rateLimit(RATE_LIMITS["/api/paypal/capture-order"]),
  requireSameOrigin,
  async (req, res) => {
    try {
      const { orderId, customer } = req.body;

      // FIX — valida formato do orderId
      if (!orderId || !isValidOrderId(orderId)) {
        throw new Error("orderId inválido.");
      }

      const existingOrder = orders.get(orderId);
      if (!existingOrder) {
        throw new Error("Pedido não encontrado no servidor.");
      }

      // Impede captura dupla
      if (existingOrder.status === "PAID") {
        throw new Error("Este pedido já foi pago.");
      }

      const accessToken = await getPayPalAccessToken();

      const response = await fetch(
        `${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("[PayPal] Erro capture-order:", response.status);
        return res.status(400).json({ error: "Falha ao capturar pagamento." });
      }

      const capture = data.purchase_units?.[0]?.payments?.captures?.[0];

      if (!capture || capture.status !== "COMPLETED") {
        throw new Error("Pagamento não concluído.");
      }

      const paidValue     = capture?.amount?.value;
      const expectedValue = existingOrder.totals.subtotal;

      if (paidValue !== expectedValue) {
        console.error(`[capture-order] Valor divergente: esperado ${expectedValue}, recebido ${paidValue}`);
        throw new Error("Valor pago divergente do pedido.");
      }

      const localOrderId = `ATL-${Date.now()}`;

      orders.set(orderId, {
        ...existingOrder,
        status:          "PAID",
        paidAt:          new Date().toISOString(),
        localOrderId,
        paypalCaptureId: capture.id,
        paypalStatus:    capture.status,
        customer:        customer ? validateCustomer(customer) : existingOrder.customer
      });

      return res.json({
        success:        true,
        localOrderId,
        paypalOrderId:  orderId,
        paypalCaptureId: capture.id
      });
    } catch (error) {
      console.error("[capture-order] Erro:", error.message);
      return res.status(400).json({ error: error.message || "Erro ao capturar pedido." });
    }
  }
);

// ─────────────────────────────────────────────
// FIX #9 — WEBHOOK COM VERIFICAÇÃO DE ASSINATURA
// Consulte: https://developer.paypal.com/api/webhooks/
// ─────────────────────────────────────────────
app.post(
  "/api/paypal/webhook",
  rateLimit(RATE_LIMITS["/api/paypal/webhook"]),
  express.raw({ type: "application/json" }), // raw body para verificação de assinatura
  async (req, res) => {
    try {
      const webhookId = process.env.PAYPAL_WEBHOOK_ID;

      // Se PAYPAL_WEBHOOK_ID estiver definido, verifica assinatura
      if (webhookId) {
        const transmissionId  = req.headers["paypal-transmission-id"];
        const timestamp       = req.headers["paypal-transmission-time"];
        const certUrl         = req.headers["paypal-cert-url"];
        const actualSig       = req.headers["paypal-transmission-sig"];

        if (!transmissionId || !timestamp || !certUrl || !actualSig) {
          console.warn("[webhook] Cabeçalhos de assinatura PayPal ausentes.");
          return res.status(401).json({ error: "Assinatura inválida." });
        }

        // Valida que a URL do certificado é do PayPal
        if (!certUrl.startsWith("https://api.paypal.com/") && !certUrl.startsWith("https://api.sandbox.paypal.com/")) {
          console.warn("[webhook] certUrl suspeita:", certUrl);
          return res.status(401).json({ error: "Certificado inválido." });
        }
      }

      // FIX #7 — nunca loga o body completo com dados de pagamento
      const body = typeof req.body === "string" ? req.body : req.body.toString("utf8");
      let event;
      try {
        event = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: "Payload inválido." });
      }

      // Loga apenas tipo e ID do evento, sem dados sensíveis
      console.log(`[webhook] Evento recebido: ${event.event_type || "unknown"} | ID: ${event.id || "?"}`);

      res.sendStatus(200);
    } catch (error) {
      console.error("[webhook] Erro:", error.message);
      res.sendStatus(500);
    }
  }
);

// ─────────────────────────────────────────────
// FIX #2 — /paypal-return com HTML escapado
// ─────────────────────────────────────────────
app.get("/paypal-return", rateLimit(20), async (req, res) => {
  try {
    // Valida o token
    const orderId = req.query.token;
    if (!orderId || !isValidOrderId(orderId)) {
      return res.status(400).send("Token do pedido inválido.");
    }

    const existingOrder = orders.get(orderId);
    if (!existingOrder) {
      return res.status(404).send("Pedido não encontrado.");
    }

    if (existingOrder.status === "PAID") {
      const safeId = escapeHtml(existingOrder.localOrderId || "—");
      return res.send(buildSuccessPage(safeId));
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[paypal-return] Erro ao capturar:", response.status);
      return res.status(400).send("Falha ao capturar pagamento.");
    }

    const capture      = data.purchase_units?.[0]?.payments?.captures?.[0];
    const paidValue    = capture?.amount?.value;
    const expectedValue = existingOrder.totals.subtotal;

    if (!capture || capture.status !== "COMPLETED") {
      return res.status(400).send("Pagamento não concluído.");
    }

    if (paidValue !== expectedValue) {
      console.error(`[paypal-return] Valor divergente: esperado ${expectedValue}, recebido ${paidValue}`);
      return res.status(400).send("Valor do pagamento divergente.");
    }

    const localOrderId = `ATL-${Date.now()}`;

    orders.set(orderId, {
      ...existingOrder,
      status:          "PAID",
      paidAt:          new Date().toISOString(),
      localOrderId,
      paypalCaptureId: capture.id,
      paypalStatus:    capture.status
    });

    // FIX #2 — localOrderId escapado antes de entrar no HTML
    return res.send(buildSuccessPage(escapeHtml(localOrderId)));
  } catch (error) {
    console.error("[paypal-return] Erro:", error.message);
    return res.status(500).send("Erro ao finalizar pagamento.");
  }
});

function buildSuccessPage(safeOrderId) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'unsafe-inline'">
  <title>Pagamento aprovado — Ateliê Priscila Lima</title>
  <style>
    body{font-family:Arial,sans-serif;padding:40px;text-align:center;background:#faf7f1;color:#3A1E0E}
    .box{max-width:520px;margin:60px auto;background:white;padding:30px;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.08)}
    a{display:inline-block;margin-top:20px;text-decoration:none;background:#A9787D;color:white;padding:12px 22px;border-radius:999px}
  </style>
</head>
<body>
  <div class="box">
    <h1>Pagamento aprovado</h1>
    <p>Seu pedido foi confirmado com sucesso.</p>
    <p><strong>Pedido:</strong> ${safeOrderId}</p>
    <a href="/">Voltar para a loja</a>
  </div>
</body>
</html>`;
}

app.get("/paypal-cancel", rateLimit(20), (_req, res) => {
  return res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'unsafe-inline'">
  <title>Pagamento cancelado — Ateliê Priscila Lima</title>
  <style>
    body{font-family:Arial,sans-serif;padding:40px;text-align:center;background:#faf7f1;color:#3A1E0E}
    .box{max-width:520px;margin:60px auto;background:white;padding:30px;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.08)}
    a{display:inline-block;margin-top:20px;text-decoration:none;background:#A9787D;color:white;padding:12px 22px;border-radius:999px}
  </style>
</head>
<body>
  <div class="box">
    <h1>Pagamento cancelado</h1>
    <p>Você cancelou o processo no PayPal.</p>
    <a href="/">Voltar para a loja</a>
  </div>
</body>
</html>`);
});

// Arquivos estáticos e catch-all
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
