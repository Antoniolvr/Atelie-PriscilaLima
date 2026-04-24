// ============================================
// SERVER.JS CORRIGIDO - PRONTO PARA USAR
// ============================================
// USE ESTE ARQUIVO COMO ESTÁ
// NÃO ADICIONE NADA, NÃO TIRE NADA

'use strict';

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware: Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Middleware: Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Middleware: Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'desenvolvimento-secret-trocar',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ✅ Middleware: CSRF
const csrfProtection = csrf({ cookie: false });

// ✅ Middleware: Rate limiting
const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

const freteRateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 3,
  skipSuccessfulRequests: true,
  message: 'Muitas tentativas de cálculo de frete. Tente novamente mais tarde.'
});

// ============================================
// ROTAS
// ============================================

// 🏠 GET /
app.get('/', csrfProtection, (req, res) => {
  try {
    let html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');
    html = html.replace(
      '<meta name="csrf-token" content="">',
      `<meta name="csrf-token" content="${req.csrfToken()}">`
    );
    res.send(html);
  } catch (error) {
    console.error('Erro ao servir index.html:', error);
    res.status(500).send('Erro ao carregar página');
  }
});

// 📦 POST /api/frete
app.post('/api/frete', csrfProtection, freteRateLimiter, async (req, res) => {
  try {
    const { cep, items } = req.body;

    // Validação: CEP
    if (!cep || typeof cep !== 'string') {
      return res.status(400).json({ error: 'CEP inválido' });
    }

    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      return res.status(400).json({ error: 'CEP deve ter 8 dígitos' });
    }

    if (cepLimpo === '00000000') {
      return res.status(400).json({ error: 'CEP inválido' });
    }

    // Validação: Items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    // Validação: Items válidos
    const validItems = items.filter(item => {
      if (!item) return false;
      if (!Number.isInteger(item.id) || item.id <= 0) return false;
      if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 99) return false;
      if (typeof item.price !== 'number' || item.price < 0 || item.price > 10000) return false;
      return true;
    });

    if (validItems.length === 0) {
      return res.status(400).json({ error: 'Items do carrinho inválidos' });
    }

    // Calcular peso total
    const pesoTotal = validItems.reduce((sum, item) => sum + (item.qty * 0.5), 0);
    if (pesoTotal > 50) {
      return res.status(400).json({ error: 'Peso total excede limite' });
    }

    // ============================================
    // FRETES SIMULADOS (substitua por API real)
    // ============================================
    const fretes = [
      {
        company: 'Correios',
        name: 'PAC',
        price: 25.50,
        delivery_time: 10
      },
      {
        company: 'Correios',
        name: 'Sedex',
        price: 45.00,
        delivery_time: 2
      },
      {
        company: 'Loggi',
        name: 'Rápido',
        price: 35.00,
        delivery_time: 3
      }
    ];

    // Validar fretes
    const fretesValidos = fretes.filter(f => 
      f && 
      typeof f.company === 'string' &&
      typeof f.name === 'string' &&
      typeof f.price === 'number' &&
      f.price >= 0 &&
      f.price < 5000 &&
      f.company.length > 0 &&
      f.company.length < 100 &&
      f.name.length > 0 &&
      f.name.length < 200
    );

    if (fretesValidos.length === 0) {
      return res.status(404).json({ 
        error: 'Nenhuma opção de frete disponível para este CEP' 
      });
    }

    res.json(fretesValidos);

  } catch (error) {
    console.error('Erro em /api/frete:', error);
    res.status(500).json({ 
      error: 'Erro ao calcular frete. Tente novamente mais tarde.' 
    });
  }
});

// 📧 POST /api/checkout
app.post('/api/checkout', csrfProtection, apiRateLimiter, async (req, res) => {
  try {
    const { items, customer, frete, paymentMethod } = req.body;

    // Validações
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    if (!customer || !customer.name || !customer.phone || !customer.email) {
      return res.status(400).json({ error: 'Dados do cliente inválidos' });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(customer.email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Validar telefone
    const phoneCleaned = customer.phone.replace(/\D/g, '');
    if (phoneCleaned.length < 10) {
      return res.status(400).json({ error: 'Telefone inválido' });
    }

    const whatsappNumber = process.env.WHATSAPP_NUMBER;
    
    res.json({ 
      success: true, 
      message: 'Pedido preparado. Redirecionando para WhatsApp...',
      whatsappUrl: `https://wa.me/${whatsappNumber}?text=seu-pedido`
    });

  } catch (error) {
    console.error('Erro em /api/checkout:', error);
    res.status(500).json({ 
      error: 'Erro ao processar pedido. Tente novamente.' 
    });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// 500
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Token CSRF inválido' });
  }
  
  res.status(500).json({ 
    error: 'Erro interno do servidor.' 
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CSRF: ativado`);
  console.log(`⏱️  Rate limit: ativado`);
});
