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
// CATALOGO DE PRODUTOS (Preço e Peso)
// AVISO: Atualize o 'weight' (peso) de cada produto em Quilos (ex: 0.3 = 300g)
// ─────────────────────────────────────────────────────────
const CATALOGO_PRODUTOS = {
  1: { price: 32.99, weight: 0.195 }, // Ex: 300g
  2: { price: 38.99, weight: 0.246 }, // Ex: 450g
  3: { price: 27.99, weight: 0.159 }, // Ex: 250g
  4: { price: 27.99, weight: 0.185 },
  5: { price: 65.99, weight: 0.60 }, // Ex: 600g
  6: { price: 65.99, weight: 0.60 },
  7: { price: 32.99, weight: 0.175 },
  8: { price: 10.99, weight: 0.036 }, // Ex: 100g
  9: { price: 59.99, weight: 0.083 },
  10: { price: 40.00, weight: 0.186 },
  11: { price: 4.00, weight: 0.08 }
};

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

app.use(cors({ origin: '*', credentials: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Muitas tentativas, tente novamente mais tarde.' }
});

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ limit: "20kb", extended: true }));

// ─────────────────────────────────────────────────────────
// Rota de Cálculo de Frete (Com Inteligência de Peso e Empacotamento)
// ─────────────────────────────────────────────────────────
app.post('/api/frete', limiter, async (req, res) => {
  try {
    const { cep, items } = req.body;

    if (!cep || typeof cep !== 'string') return res.json([]);
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return res.json([]);
    if (!Array.isArray(items) || items.length === 0) return res.json([]);

    // 1. CONTABILIZAR TOTAIS DO CARRINHO (Agora soma o peso exato)
    let quantidadeTotalItens = 0;
    let valorTotalSeguro = 0;
    let pesoTotalFisico = 0;

    items.forEach(item => {
      const qtd = Math.max(1, parseInt(item.qty) || 1);
      quantidadeTotalItens += qtd;

      // Busca o produto no catálogo. Se não achar, usa valores zerados/padrão
      const produtoOficial = CATALOGO_PRODUTOS[item.id] || { price: 0, weight: 0.3 };
      
      valorTotalSeguro += (produtoOficial.price * qtd);
      pesoTotalFisico += (produtoOficial.weight * qtd);
    });

    // 2. LÓGICA DE CAIXAS (Até 6 produtos por caixa)
    const LIMITE_POR_CAIXA = 6;
    const numeroDeCaixas = Math.ceil(quantidadeTotalItens / LIMITE_POR_CAIXA);
    
    // Divide o peso total e o seguro igualmente pelo número de caixas físicas
    const pesoPorCaixa = pesoTotalFisico / numeroDeCaixas;
    const seguroPorCaixa = valorTotalSeguro / numeroDeCaixas;

    // 3. MONTAR O PACOTE PARA O MELHOR ENVIO
    const payload = {
      from: { postal_code: process.env.STORE_CEP || "55820000" },
      to: { postal_code: cleanCep },
      products: [
        {
          id: "caixa_padrao",
          width: 20,  // Largura da sua caixa padrão (cm)
          height: 10, // Altura da sua caixa padrão (cm)
          length: 15, // Comprimento da sua caixa padrão (cm)
          weight: pesoPorCaixa, // Peso calculado dinamicamente!
          insurance_value: seguroPorCaixa,
          quantity: numeroDeCaixas // Quantas caixas serão enviadas
        }
      ]
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

    if (!response.ok) return res.json([]);

    const data = await response.json();
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
    res.json([]); 
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, req, res, next) => {
  res.json([]); 
});

app.listen(PORT, () => {
  console.log(`✓ Servidor rodando na porta ${PORT}`);
});
