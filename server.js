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
// SECURITY HEADERS
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
  ? process.env.FRONTEND_URL.split(",").map(v => v.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("CORS bloqueado"));
    }
  })
);

app.use(express.json({ limit: "20kb" }));

// ─────────────────────────────────────────────
// RATE LIMIT
// ─────────────────────────────────────────────
const store = new Map();
function rateLimit(max) {
  return (req, res, next) => {
    const key = req.ip + req.path;
    const now = Date.now();
    const entry = store.get(key) || { count: 0, reset: now + 60000 };

    if (now > entry.reset) {
      entry.count = 0;
      entry.reset = now + 60000;
    }

    entry.count++;
    store.set(key, entry);

    if (entry.count > max) {
      return res.status(429).json({ error: "Muitas requisições" });
    }

    next();
  };
}

// ─────────────────────────────────────────────
// SAME ORIGIN
// ─────────────────────────────────────────────
function requireSameOrigin(req, res, next) {
  const origin = req.headers.origin || "";
  if (!origin) return next();
  if (allowedOrigins.some(o => origin.startsWith(o))) return next();
  return res.status(403).json({ error: "Origem não permitida" });
}

// ─────────────────────────────────────────────
// CATÁLOGO
// ─────────────────────────────────────────────
const CATALOG = {
  1: { id: 1, name: "Sousplat de Crochê", unitPrice: 30, weight: 0.2, width: 20, height: 5, length: 20 },
  2: { id: 2, name: "Tapete Oval", unitPrice: 35, weight: 0.2, width: 20, height: 5, length: 20 }
};

// ─────────────────────────────────────────────
// FRETE (CORRIGIDO)
// ─────────────────────────────────────────────
app.post('/api/frete', async (req, res) => {
  try {
    const { cep, items } = req.body;

    if (!cep || cep.length !== 8) {
      return res.status(400).json({ error: 'CEP inválido' });
    }

    const response = await fetch('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: {
          postal_code: "55820000"
        },
        to: {
          postal_code: cep
        },
        products: items.map(item => ({
          id: String(item.id),
          width: 20,
          height: 10,
          length: 15,
          weight: 0.3,
          insurance_value: item.price,
          quantity: item.qty
        }))
      })
    });

    const data = await response.json();

    // se vier vazio ou erro da API
    if (!data || data.length === 0) {
      return res.json([
        {
          id: "fallback",
          name: "Frete padrão",
          price: 15,
          delivery: 7
        }
      ]);
    }

    res.json(data);

  } catch (err) {
    console.error(err);

    // fallback em caso de erro
    res.json([
      {
        id: "fallback",
        name: "Frete padrão",
        price: 15,
        delivery: 7
      }
    ]);
  }
});
// ─────────────────────────────────────────────
// STATIC
// ─────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
