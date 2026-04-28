import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────
// CATÁLOGO DE PRODUTOS — preços e pesos (sincronizados com o frontend)
// Peso em Quilos (ex: 0.3 = 300g)
// ─────────────────────────────────────────────────────────
const CATALOGO_PRODUTOS = {
  1:  { price: 30.00, weight: 0.195 },
  2:  { price: 35.00, weight: 0.246 },
  3:  { price: 25.00, weight: 0.159 },
  4:  { price: 25.00, weight: 0.185 },
  5:  { price: 60.00, weight: 0.600 },
  6:  { price: 60.00, weight: 0.600 },
  7:  { price: 30.00, weight: 0.175 },
  8:  { price: 10.00, weight: 0.036 },
  9:  { price: 55.00, weight: 0.083 },
  10: { price: 40.00, weight: 0.186 },
  11: { price:  4.00, weight: 0.080 }
};

// IDs válidos de produto (sem o produto personalizado)
const IDS_VALIDOS = new Set(Object.keys(CATALOGO_PRODUTOS).map(Number));

// ─────────────────────────────────────────────────────────
// MIDDLEWARES DE SEGURANÇA
// ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("X-UA-Compatible", "IE=edge");
  next();
});

// CORREÇÃO: CORS restrito ao domínio da loja (não mais '*')
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://atelie-priscilalima.onrender.com';
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// CORREÇÃO: Rate limit global para todas as rotas
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Muitas tentativas, tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// Rate limit mais restrito especificamente para o cálculo de frete
const freteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Muitas consultas de frete. Aguarde um minuto.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ limit: "20kb", extended: true }));

// ─────────────────────────────────────────────────────────
// ROTA: Cálculo de Frete
// ─────────────────────────────────────────────────────────
app.post('/api/frete', freteLimiter, async (req, res) => {
  try {
    const { cep, items } = req.body;

    // Validar CEP
    if (!cep || typeof cep !== 'string') return res.json([]);
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return res.json([]);

    // CORREÇÃO: Validar e limitar o array de itens (máx. 20 itens distintos)
    if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
      return res.json([]);
    }

    let quantidadeTotalItens = 0;
    let valorTotalSeguro = 0;
    let pesoTotalFisico = 0;

    for (const item of items) {
      // CORREÇÃO: Validar id como número inteiro dentro do catálogo
      const id = parseInt(item.id, 10);
      if (!Number.isFinite(id) || !IDS_VALIDOS.has(id)) continue;

      // CORREÇÃO: parseInt com radix 10 e limite de quantidade (1–99)
      const qtd = Math.max(1, Math.min(99, parseInt(item.qty, 10) || 1));
      const produto = CATALOGO_PRODUTOS[id];

      quantidadeTotalItens += qtd;
      valorTotalSeguro     += produto.price  * qtd;
      pesoTotalFisico      += produto.weight * qtd;
    }

    if (quantidadeTotalItens === 0) return res.json([]);

    // Lógica de caixas (até 6 produtos por caixa)
    const LIMITE_POR_CAIXA = 6;
    const numeroDeCaixas   = Math.ceil(quantidadeTotalItens / LIMITE_POR_CAIXA);
    const pesoPorCaixa     = pesoTotalFisico / numeroDeCaixas;
    const seguroPorCaixa   = valorTotalSeguro / numeroDeCaixas;

    const payload = {
      from: { postal_code: process.env.STORE_CEP }, // CORREÇÃO: sem fallback hardcoded
      to:   { postal_code: cleanCep },
      products: [
        {
          id: "caixa_padrao",
          width: 20,
          height: 10,
          length: 15,
          weight: pesoPorCaixa,
          insurance_value: seguroPorCaixa,
          quantity: numeroDeCaixas
        }
      ]
    };

    // CORREÇÃO: Timeout de 8 segundos na chamada ao Melhor Envio
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 8000);

    let response;
    try {
      response = await fetch('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'AteliePriscilaLima (email: atelieplima@gmail.com)',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) return res.json([]);

    const data = await response.json();
    if (!Array.isArray(data)) return res.json([]);

    const fretesProcessados = data
      .filter(f => f && f.price && f.company)
      .map(f => ({
        company:       String(f.company.name).trim(),
        name:          String(f.name || 'Envio').trim(),
        price:         parseFloat(f.price),
        delivery_time: parseInt(f.delivery_time, 10) || 0,
        id:            f.id || Math.random().toString(36)
      }))
      .sort((a, b) => a.price - b.price)
      .slice(0, 3);

    res.json(fretesProcessados);

  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('[FRETE] Timeout na chamada ao Melhor Envio');
    } else {
      console.error('[FRETE ERROR]', err.message);
    }
    res.json([]);
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, req, res, next) => {
  console.error('[UNHANDLED ERROR]', err.message);
  res.json([]);
});

app.listen(PORT, () => {
  console.log(`✓ Servidor rodando na porta ${PORT}`);
});
