import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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
      `script-src 'self' 'unsafe-inline'`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      `font-src 'self' https://fonts.gstatic.com`,
      `img-src 'self' data:`,
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



// Arquivos estáticos e catch-all

app.get("/robots.txt", (req, res) => {
  res.set("Cache-Control", "public, max-age=0, must-revalidate");
  res.type("text/plain");
  res.sendFile(path.join(__dirname, "public", "robots.txt"));
});

app.get("/sitemap.xml", (req, res) => {
  res.set("Cache-Control", "public, max-age=0, must-revalidate");
  res.type("application/xml");
  res.sendFile(path.join(__dirname, "public", "sitemap.xml"));
});


app.use(express.static(path.join(__dirname, "public"), {
  maxAge: "30d",
  etag: true
}));

app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "atelie-priscila-lima-profissional.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
