import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.warn("[CONFIG] STRIPE_SECRET_KEY não definida. O checkout com Stripe não funcionará até configurar o .env.");
}
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────
// SEGURANÇA
// ─────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    [
      `default-src 'self'`,
      `script-src 'self' 'unsafe-inline'`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      `font-src 'self' https://fonts.gstatic.com`,
      `img-src 'self' data:`,
      `connect-src 'self'`,
      `frame-ancestors 'none'`,
      `form-action 'self'`,
      `base-uri 'self'`
    ].join("; ")
  );

  next();
});

// ─────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map(v => v.trim()).filter(Boolean)
  : [];

if (allowedOrigins.length === 0) {
  console.warn("[SEGURANÇA] FRONTEND_URL não definida no .env — CORS bloqueará todas as origens externas.");
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
);

// ─────────────────────────────────────────────
// RATE LIMIT
// ─────────────────────────────────────────────
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMITS = {
  "/api/stripe/create-checkout-session": 10,
  "/api/stripe/webhook": 30,
  "/api/health": 60
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

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitStore) {
    if (now > val.resetAt) rateLimitStore.delete(key);
  }
}, 5 * 60 * 1000);

// ─────────────────────────────────────────────
// CONTROLE DE ORIGEM
// ─────────────────────────────────────────────
function requireSameOrigin(req, res, next) {
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";

  if (!origin && !referer) return next();

  const isOriginAllowed = allowedOrigins.length === 0 || allowedOrigins.some(o => origin.startsWith(o));
  const isRefererAllowed = allowedOrigins.length === 0 || allowedOrigins.some(o => referer.startsWith(o));

  if (!isOriginAllowed && !isRefererAllowed) {
    return res.status(403).json({ error: "Acesso negado: origem não autorizada." });
  }

  next();
}

// ─────────────────────────────────────────────
// UTILITÁRIOS
// ─────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const FIELD_LIMITS = { note: 500 };

const CATALOG = {
  1: { id: 1, sku: "SOUSPLAT-001",       name: "Sousplat de Crochê",                             unitPrice: 30.00, image: "/produto1.png" },
  2: { id: 2, sku: "TAPETE-OVAL-002",    name: "Tapete Oval Verde e Off White",                  unitPrice: 35.00, image: "/produto2.png" },
  3: { id: 3, sku: "CENTRO-MESA-003",    name: "Centro de Mesa Redondo Verde com Dourado",       unitPrice: 25.00, image: "/produto3.png" },
  4: { id: 4, sku: "SOUSPLAT-COLOR-004", name: "Sousplat Redondo Candy Colors",                  unitPrice: 25.00, image: "/produto4.png" },
  5: { id: 5, sku: "CAMINHO-MESA-005",   name: "Caminho de Mesa Corações Off White com Dourado", unitPrice: 60.00, image: "/produto5.png" },
  6: { id: 6, sku: "CAMINHO-MESA-006",   name: "Caminho de Mesa Marrom com Dourado",             unitPrice: 60.00, image: "/produto6.png" }
};

const orders = new Map();

function normalizeCartItems(rawCart) {
  if (!Array.isArray(rawCart) || rawCart.length === 0) {
    throw new Error("Carrinho vazio.");
  }

  if (rawCart.length > 30) {
    throw new Error("Número de itens no carrinho excede o limite permitido.");
  }

  return rawCart.map(item => {
    const productId = Number(item.productId);
    const catalogItem = CATALOG[productId];

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
      unitPrice: catalogItem.unitPrice,
      image: catalogItem.image
    };
  });
}

function calcTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  return { subtotal: subtotal.toFixed(2) };
}

function getAbsoluteImageUrl(relativePath) {
  const baseUrl = String(process.env.FRONTEND_URL || "").trim().replace(/\/+$/, "");
  if (!baseUrl || !relativePath) return null;
  return `${baseUrl}${relativePath.startsWith("/") ? relativePath : `/${relativePath}`}`;
}

function updateOrderFromSession(session, statusOverride = null) {
  const existingOrder = orders.get(session.id) || {};
  const finalStatus = statusOverride || (session.payment_status === "paid" ? "PAID" : existingOrder.status || "CREATED");
  const localOrderId = existingOrder.localOrderId || `ATL-${Date.now()}`;

  const nextOrder = {
    ...existingOrder,
    stripeSessionId: session.id,
    status: finalStatus,
    localOrderId,
    stripePaymentIntentId: session.payment_intent || null,
    stripePaymentStatus: session.payment_status || null,
    updatedAt: new Date().toISOString()
  };

  if (finalStatus === "PAID" && !existingOrder.paidAt) {
    nextOrder.paidAt = new Date().toISOString();
  }

  orders.set(session.id, nextOrder);
  return nextOrder;
}

function buildPage({ title, heading, message, orderId = "", clearCart = false }) {
  const safeOrderId = orderId ? `<p><strong>Pedido:</strong> ${escapeHtml(orderId)}</p>` : "";
  const clearScript = clearCart ? "<script>try { localStorage.removeItem('atelie_cart'); } catch (e) {}</script>" : "";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
  <title>${escapeHtml(title)} — Ateliê Priscila Lima</title>
  <style>
    body{font-family:Arial,sans-serif;padding:40px;text-align:center;background:#faf7f1;color:#3A1E0E}
    .box{max-width:560px;margin:60px auto;background:white;padding:30px;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.08)}
    a{display:inline-block;margin-top:20px;text-decoration:none;background:#A9787D;color:white;padding:12px 22px;border-radius:999px}
    p{line-height:1.6}
  </style>
</head>
<body>
  <div class="box">
    <h1>${escapeHtml(heading)}</h1>
    <p>${escapeHtml(message)}</p>
    ${safeOrderId}
    <a href="/">Voltar para a loja</a>
  </div>
  ${clearScript}
</body>
</html>`;
}

// ─────────────────────────────────────────────
// WEBHOOK DA STRIPE
// PRECISA VIR ANTES DO express.json()
// ─────────────────────────────────────────────
app.post(
  "/api/stripe/webhook",
  rateLimit(RATE_LIMITS["/api/stripe/webhook"]),
  express.raw({ type: "application/json" }),
  (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).send("Stripe não configurada.");
      }

      const signature = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!signature || !webhookSecret) {
        return res.status(400).send("Webhook da Stripe não configurado corretamente.");
      }

      const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const nextStatus = session.payment_status === "paid" ? "PAID" : "AWAITING_ASYNC_PAYMENT";
        updateOrderFromSession(session, nextStatus);
      }

      if (event.type === "checkout.session.async_payment_succeeded") {
        const session = event.data.object;
        updateOrderFromSession(session, "PAID");
      }

      if (event.type === "checkout.session.async_payment_failed") {
        const session = event.data.object;
        updateOrderFromSession(session, "PAYMENT_FAILED");
      }

      return res.json({ received: true });
    } catch (error) {
      console.error("[stripe-webhook] Erro:", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

app.use(express.json({ limit: "20kb" }));

// ─────────────────────────────────────────────
// ROTAS
// ─────────────────────────────────────────────
app.get("/api/health", rateLimit(RATE_LIMITS["/api/health"]), (_req, res) => {
  res.json({ ok: true });
});

app.post(
  "/api/stripe/create-checkout-session",
  rateLimit(RATE_LIMITS["/api/stripe/create-checkout-session"]),
  requireSameOrigin,
  async (req, res) => {
    try {
      if (!stripe) {
        throw new Error("Stripe não configurada no servidor.");
      }

      const frontUrl = String(process.env.FRONTEND_URL || "").trim().replace(/\/+$/, "");
      if (!frontUrl) {
        throw new Error("FRONTEND_URL não configurada no servidor.");
      }

      const pixExpiresAfterSeconds = Math.max(
        10,
        Math.min(259200, Number(process.env.STRIPE_PIX_EXPIRES_AFTER_SECONDS || 14400))
      );

      const items = normalizeCartItems(req.body.cart);
      const totals = calcTotals(items);

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card", "pix"],
        line_items: items.map(item => {
          const imageUrl = getAbsoluteImageUrl(item.image);
          const productData = {
            name: item.name,
            metadata: { sku: item.sku }
          };

          if (imageUrl) {
            productData.images = [imageUrl];
          }

          return {
            quantity: item.quantity,
            price_data: {
              currency: "brl",
              unit_amount: Math.round(item.unitPrice * 100),
              product_data: productData
            }
          };
        }),
        shipping_address_collection: {
          allowed_countries: ["BR"]
        },
        phone_number_collection: {
          enabled: true
        },
        billing_address_collection: "auto",
        customer_creation: "always",
        payment_method_options: {
          pix: {
            expires_after_seconds: pixExpiresAfterSeconds
          }
        },
        locale: "pt-BR",
        submit_type: "pay",
        success_url: `${frontUrl}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontUrl}/stripe-cancel`
      });

      orders.set(session.id, {
        stripeSessionId: session.id,
        status: "CREATED",
        createdAt: new Date().toISOString(),
        items,
        totals
      });

      return res.json({
        sessionId: session.id,
        url: session.url
      });
    } catch (error) {
      console.error("[stripe-create-checkout-session] Erro:", error.message);
      return res.status(400).json({ error: error.message || "Erro ao iniciar checkout." });
    }
  }
);

app.get("/stripe-success", rateLimit(20), async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).send("Stripe não configurada no servidor.");
    }

    const sessionId = String(req.query.session_id || "").trim();
    if (!sessionId) {
      return res.status(400).send("Sessão inválida.");
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const order = updateOrderFromSession(session, session.payment_status === "paid" ? "PAID" : undefined);

    if (session.payment_status === "paid") {
      return res.send(buildPage({
        title: "Pagamento aprovado",
        heading: "Pagamento aprovado",
        message: "Seu pedido foi confirmado com sucesso.",
        orderId: order.localOrderId,
        clearCart: true
      }));
    }

    return res.send(buildPage({
      title: "Pagamento em processamento",
      heading: "Pagamento em processamento",
      message: "O checkout foi concluído, mas o pagamento ainda está em processamento. Isso pode acontecer com Pix. Aguarde a confirmação final da Stripe.",
      orderId: order.localOrderId,
      clearCart: false
    }));
  } catch (error) {
    console.error("[stripe-success] Erro:", error.message);
    return res.status(500).send("Erro ao consultar pagamento.");
  }
});

app.get("/stripe-cancel", rateLimit(20), (_req, res) => {
  return res.send(buildPage({
    title: "Pagamento cancelado",
    heading: "Pagamento cancelado",
    message: "O checkout foi cancelado. Seu carrinho continua salvo para tentar novamente."
  }));
});

// ─────────────────────────────────────────────
// ESTÁTICOS E CATCH-ALL
// ─────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "atelie-priscila-lima-profissional.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
