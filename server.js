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
// 1. CATALOGO DE PREÇOS (IDs corrigidos para bater com o HTML)
// ─────────────────────────────────────────────────────────
const CATALOGO_PRECOS = {
  1: 32.99,
  2: 38.99,
  3: 27.99,
  4: 27.99,
  5: 65.99,
  6: 65.99,
  7: 32.99,
  8: 10.99,
  9: 59.99
};

// ─────────────────────────────────────────────────────────
// 2. MIDDLEWARES DE SEGURANÇA
// ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("X-UA-Compatible", "IE=edge");
  next();
});

// CORS corrigido para não causar erro 500
app.use(cors({ origin: '*', credentials: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Muitas tentativas, tente novamente mais tarde.' }
});

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ limit: "20kb", extended: true }));

// ─────────────────────────────────────────────────────────
// Rota de Cálculo de Frete
// ─────────────────────────────────────────────────────────
app.post('/api/frete', limiter, async (req, res) => {
  try {
    const { cep, items } = req.body;

    if (!cep || typeof cep !== 'string') return res.json([]);
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return res.json([]);
    if (!Array.isArray(items) || items.length === 0) return res.json([]);

    const payload = {
      from: { postal_code: process.env.STORE_CEP || "55820000" },
      to: { postal_code: cleanCep },
      products: items.map((item, index) => {
        // Busca o preço pelo ID numérico
        const precoOficial = CATALOGO_PRECOS[item.id] || 0;
        
        return {
          id: String(item.id || index),
          width: 20,
          height: 10,
          length: 15,
          weight: 0.3,
          insurance_value: Number(precoOficial), 
          quantity: Math.max(1, parseInt(item.qty) || 1)
        };
      })
    };

    const response = await fetch('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'AteliePriscilaLima (email: atelieplima@gmail.com)',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    // Se a API do Melhor Envio der erro (Token invalido, etc), envia array vazio
    if (!response.ok) return res.json([]);

    const data = await response.json();
    
    // Garante que é array
    if (!Array.isArray(data)) return res.json([]);

    const fretesProcessados = data
      .filter(f => f && f.price && f.company)
      .map(f => ({
        company: String(f.company.name).trim(),
        name: String(f.name || 'Envio').trim(),
        price: parseFloat(f.price),
        delivery_time: parseInt(f.delivery_time) || 0,
        id: f.id || Math.random().toString(36)
      }))
      .sort((a, b) => a.price - b.price)
      .slice(0, 3);

    res.json(fretesProcessados);

  } catch (err) {
    console.error('[FRETE ERROR]', err.message);
    res.json([]); // Impede que o erro 500 quebre o site
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Impede que erros globais travem a API enviando HTML/Objeto
app.use((err, req, res, next) => {
  res.json([]); 
});

app.listen(PORT, () => {
  console.log(`✓ Servidor rodando na porta ${PORT}`);
});
