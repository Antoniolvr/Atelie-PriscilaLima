import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from 'express-rate-limit'; // Instalado via npm

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────
// 1. CONFIGURAÇÃO DE SEGURANÇA: CATALOGO DE PREÇOS (Anti-fraude)
// AVISO: Edite este objeto com os preços reais dos seus produtos.
// O sistema ignorará qualquer preço enviado pelo navegador do usuário.
// ─────────────────────────────────────────────────────────
const CATALOGO_PRECOS = {
  "produto_1_id": 32.99,
  "produto_2_id": 38.99,
  "produto_3_id": 27.99,
  "produto_4_id": 27.99,
  "produto_5_id": 65.99,
  "produto_6_id": 65.99,
  "produto_7_id": 32.99,
  "produto_8_id": 10.99,
  "produto_9_id": 59.99,
  // Adicione todos os seus IDs e preços aqui...
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

// Configuração estrita de CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (como postman) ou da sua URL permitida
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acesso não autorizado pelo CORS'));
    }
  },
  credentials: true
}));

// Rate Limiting (Proteção contra abuso)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // Limite de 50 requisições por IP
  message: { error: 'Muitas tentativas, tente novamente mais tarde.' }
});

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ limit: "20kb", extended: true }));

// ─────────────────────────────────────────────────────────
// Rota de Cálculo de Frete (Protegida)
// ─────────────────────────────────────────────────────────
app.post('/api/frete', limiter, async (req, res) => {
  try {
    const { cep, items } = req.body;

    if (!cep || typeof cep !== 'string') {
      return res.status(400).json({ error: 'CEP inválido' });
    }

    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      return res.status(400).json({ error: 'CEP inválido' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Nenhum item no carrinho' });
    }

    // Preparar payload consultando a base segura (CATALOGO_PRECOS)
    const payload = {
      from: { postal_code: process.env.STORE_CEP || "55820000" },
      to: { postal_code: cleanCep },
      products: items.map((item, index) => {
        // SEGURANÇA: Busca o preço oficial do servidor, ignora item.price do body
        const precoOficial = CATALOGO_PRECOS[item.id] || 0;
        
        return {
          id: String(item.id || index),
          width: 20,
          height: 10,
          length: 15,
          weight: 0.3,
          insurance_value: precoOficial, 
          quantity: Math.max(1, parseInt(item.qty) || 1)
        };
      })
    };

    const response = await fetch(
      'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'AteliePriscilaLima (email: atelieplima@gmail.com)',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) return res.status(502).json({ error: 'Erro na API de frete' });

    const data = await response.json();
    const fretesProcessados = (Array.isArray(data) ? data : [])
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
    res.status(500).json({ error: 'Erro interno' });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Middleware de Erro Global (Não expõe detalhes em produção)
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`✓ Servidor rodando na porta ${PORT}`);
});
