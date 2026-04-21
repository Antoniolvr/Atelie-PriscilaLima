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
app.post(
  "/api/frete",
  rateLimit(20),
  requireSameOrigin,
  async (req, res) => {
    try {
      const { cepDestino, cart } = req.body;

      const cep = String(cepDestino || "").replace(/\D/g, "");
      const cepOrigem = String(process.env.CEP_ORIGEM || "").replace(/\D/g, "");

      if (cep.length !== 8) {
        return res.status(400).json({ error: "CEP inválido" });
      }

      if (cepOrigem.length !== 8) {
        return res.status(500).json({ error: "CEP de origem inválido no servidor" });
      }

      if (!cart || cart.length === 0) {
        return res.status(400).json({ error: "Carrinho vazio" });
      }

      const products = cart.map(item => {
        const p = CATALOG[item.id];
        if (!p) throw new Error("Produto inválido");

        return {
          id: String(p.id),
          width: p.width,
          height: p.height,
          length: p.length,
          weight: p.weight,
          insurance_value: p.unitPrice,
          quantity: item.qty
        };
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(
        "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate",
        {
          method: "POST",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
            "User-Agent": "LojaCroche (contato@email.com)"
          },
          body: JSON.stringify({
            from: { postal_code: cepOrigem },
            to: { postal_code: cep },
            products,
            services: "1,2,3,4"
          })
        }
      );

      clearTimeout(timeout);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro API frete");
      }

      const options = data
        .filter(o => o.price && !o.error)
        .map(o => ({
          id: o.id,
          name: o.name,
          price: Number(o.price),
          delivery: o.delivery_time
        }));

      if (options.length === 0) {
        return res.json([
          {
            id: "fallback",
            name: "Frete padrão",
            price: 15,
            delivery: 7
          }
        ]);
      }

      res.json(options);

    } catch (err) {
      console.error("Erro frete:", err.message);

      // fallback seguro
      res.json([
        {
          id: "fallback",
          name: "Frete padrão",
          price: 15,
          delivery: 7
        }
      ]);
    }
  }
);

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
