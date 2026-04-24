import  from "";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const session = require('express-session');
require('dotenv').config();

// Session middleware (necessário para CSRF)
app.use(session({
  secret: process.env.SESSION_SECRET || 'seu-secret-aleatorio-seguro',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // true em produção
    httpOnly: true,
    sameSite: 'strict'
  }
}));

// CSRF middleware
const csrfProtection = csrf({ cookie: false });

// Rate limiting para API de frete
const freteRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // máx 5 requisições por IP
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────────────────────
// Middlewares de Segurança
// ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("X-UA-Compatible", "IE=edge");
  next();
});

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

app.use(.json({ limit: "20kb" }));
app.use(.urlencoded({ limit: "20kb", extended: true }));

// ─────────────────────────────────────────────────────────
// Rota de Cálculo de Frete (Melhor Envio)
// ─────────────────────────────────────────────────────────
app.post('/api/frete', async (req, res) => {
  try {
    const { cep, items } = req.body;

    // Validação básica
    if (!cep || typeof cep !== 'string') {
      return res.status(400).json({ error: 'CEP inválido', code: 'INVALID_CEP' });
    }

    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      return res.status(400).json({ error: 'CEP deve conter 8 dígitos', code: 'INVALID_CEP_LENGTH' });
    }

    // Validação de items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Nenhum item no carrinho', code: 'NO_ITEMS' });
    }

    // Preparar payload para Melhor Envio
    const payload = {
      from: {
        postal_code: process.env.STORE_CEP || "55820000"
      },
      to: {
        postal_code: cleanCep
      },
      products: items.map((item, index) => ({
        id: String(item.id || index),
        width: 20,
        height: 10,
        length: 15,
        weight: 0.3,
        insurance_value: Number(item.price) || 0,
        quantity: Math.max(1, parseInt(item.qty) || 1)
      }))
    };

    // Chamar API do Melhor Envio
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

    // Verificar status da resposta
    if (!response.ok) {
      console.error(`Melhor Envio API error: ${response.status} ${response.statusText}`);
      return res.status(502).json({
        error: 'Erro ao consultar transportadoras',
        code: 'API_ERROR'
      });
    }

    const data = await response.json();

    // Verificar se é array
    if (!Array.isArray(data)) {
      console.warn('Unexpected Melhor Envio response format:', typeof data);
      return res.json([]);
    }

    // Processar e formatar fretes
    const fretesProcessados = data
      .filter(frete => {
        // Validar dados obrigatórios
        if (!frete || typeof frete !== 'object') return false;
        if (!frete.price || isNaN(parseFloat(frete.price))) return false;
        if (!frete.company || !frete.company.name) return false;
        return true;
      })
      .map(frete => {
        const price = parseFloat(frete.price);
        return {
          company: String(frete.company.name).trim(),
          name: String(frete.name || 'Envio').trim(),
          price: Math.round(price * 100) / 100, // Garantir 2 casas decimais
          delivery_time: parseInt(frete.delivery_time) || 0,
          id: frete.id || Math.random().toString(36)
        };
      })
      .sort((a, b) => a.price - b.price)
      .slice(0, 3); // Limitar a 3 melhores opções

    // Log para debug
    console.log(`[FRETE] CEP: ${cleanCep} | Opções encontradas: ${fretesProcessados.length}`);

    res.json(fretesProcessados);

  } catch (err) {
    console.error('[FRETE ERROR]', err.message);
    res.status(500).json({
      error: 'Erro ao calcular frete',
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ─────────────────────────────────────────────────────────
// Health check endpoint
// ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────────────────
// Servir arquivos estáticos
// ─────────────────────────────────────────────────────────
app.use(.static(path.join(__dirname, "public")));

// Fallback para SPA
app.get('/', csrfProtection, (req, res) => {
  // Ler o arquivo HTML
  const fs = require('fs');
  let html = fs.readFileSync(__dirname + '/public/index.html', 'utf-8');
  
  // Injetar CSRF token na meta tag
  html = html.replace(
    '<meta name="csrf-token" content="">',
    `<meta name="csrf-token" content="${req.csrfToken()}">`
  );
  
  res.send(html);
});

// ─────────────────────────────────────────────────────────
// Error handling middleware
// ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    code: 'INTERNAL_SERVER_ERROR'
  });
});

// ─────────────────────────────────────────────────────────
// Iniciar servidor
// ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✓ Servidor rodando na porta ${PORT}`);
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Store CEP: ${process.env.STORE_CEP || '55820000'}`);
});
