'use strict';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str ?? '')));
  return div.innerHTML;
}

const WHATSAPP_NUMBER = '5581996809206';
const CARD_FEE_PERCENT = 8.69;

const PRODUCTS = [
  {
    id: 1,
    sku: 'SOUSPLAT-001',
    name: 'Sousplat Majestade Verde Musgo com Dourado',
    cat: 'decoracao',
    price: 30.00,
    image: '/imagens/produto1.png',
    badge: 'Novidade',
    color: 'linear-gradient(135deg,#F2E2E4,#E8CDD0)',
    measure: '38cm x 38cm',
    desc: 'Sousplat artesanal em crochê com acabamento delicado para valorizar sua mesa com charme e elegância.',
    rating: '5.0',
    reviews: 14,
    sold: '18 Vendidos'
  },
  {
    id: 2,
    sku: 'TAPETE-OVAL-002',
    name: 'Tapete Oval Verde e Off White',
    cat: 'decoracao',
    price: 35.00,
    image: '/imagens/produto2.webp',
    video: '/videos/produto2.mp4',
    badge: 'Novo',
    color: 'linear-gradient(135deg,#E8F1EC,#D9E9E0)',
    measure: '58cm x 38cm',
    desc: 'Peça artesanal em formato oval com composição elegante em verde e off white.',
    rating: '4.8',
    reviews: 8,
    sold: '12 Vendidos'
  },
  {
    id: 3,
    sku: 'CENTRO-MESA-003',
    name: 'Sousplat Redondo Verde com Dourado',
    cat: 'decoracao',
    price: 25.00,
    image: '/imagens/produto3.png',
    badge: 'Destaque',
    color: 'linear-gradient(135deg,#E7EFE5,#DCE9D7)',
    measure: '36cm x 36cm',
    desc: 'Sousplat em crochê artesanal com formato redondo, tom verde suave e delicado detalhe dourado.',
    rating: '5.0',
    reviews: 21,
    sold: '30+ Vendidos'
  },
  {
    id: 4,
    sku: 'SOUSPLAT-COLOR-004',
    name: 'Sousplat Redondo Candy Colors',
    cat: 'decoracao',
    price: 25.00,
    image: '/imagens/produto4.png',
    badge: 'Encantador',
    color: 'linear-gradient(135deg,#FFF1F5,#FDE6EE)',
    measure: '36cm x 36cm',
    desc: 'Sousplat redondo em crochê com combinação delicada de tons candy: rosa, amarelo, azul e base clara.',
    rating: '4.9',
    reviews: 15,
    sold: '25 Vendidos'
  },
  {
    id: 5,
    sku: 'CAMINHO-MESA-005',
    name: 'Caminho de Mesa Corações Off White com Dourado',
    cat: 'decoracao',
    price: 60.00,
    image: '/imagens/produto5.png',
    video: '/videos/produto5.mp4',
    badge: 'Especial',
    color: 'linear-gradient(135deg,#FFF8F1,#F8EEDC)',
    measure: '100cm~120cm x 20cm',
    desc: 'Caminho de mesa em crochê artesanal na cor off white com acabamento dourado e delicado desenho de corações.',
    rating: '5.0',
    reviews: 5,
    sold: '8 Vendidos'
  },
  {
    id: 6,
    sku: 'CAMINHO-MESA-006',
    name: 'Caminho de Mesa Marrom com Dourado',
    cat: 'decoracao',
    price: 60.00,
    image: '/imagens/produto6.png',
    badge: 'Novo',
    color: 'linear-gradient(135deg,#F3ECE7,#E8DDD4)',
    measure: '95cm x 22cm',
    desc: 'Caminho de mesa em crochê artesanal na cor marrom com detalhes dourados e acabamento delicado.',
    rating: '4.7',
    reviews: 3,
    sold: '5 Vendidos'
  },
  {
    id: 7,
    sku: 'CENTRO-MESA-007',
    name: 'Sousplat Marsala, Cru e Dourado',
    cat: 'decoracao',
    price: 30.00,
    image: '/imagens/produto7.png',
    video: '/videos/produto7.mp4',
    badge: 'Novo',
    color: 'linear-gradient(135deg,#F7EEF0,#EAD8DC)',
    measure: 'Aprox. 34cm x 34cm',
    desc: 'Sousplat em crochê artesanal com combinação sofisticada em marsala, cru e acabamento dourado.',
    rating: '5.0',
    reviews: 11,
    sold: '15 Vendidos'
  },
  {
    id: 8,
    sku: 'PORTACOPOS-FLORAL-008',
    name: 'Porta Copos Tulipas Vermelhas com Base Cru',
    cat: 'decoracao',
    price: 10.00,
    image: '/imagens/produto8.png',
    video: '/videos/produto8.mp4',
    badge: 'Novo',
    color: 'linear-gradient(135deg,#F8ECEC,#F1DADA)',
    measure: 'Aprox. 17cm x 17cm',
    desc: 'Porta Copos artesanal com flores vermelhas e base em tom cru.',
    rating: '4.9',
    reviews: 9,
    sold: '22 Vendidos'
  },
  {
    id: 9,
    sku: 'BIKINE-CROCHE-009',
    name: 'Bikine em Crochê Vermelho Artesanal',
    cat: 'moda',
    price: 55.00,
    image: '/imagens/produto9.png',
    video: '/videos/produto9.mp4',
    badge: 'Verão',
    color: 'linear-gradient(135deg,#F7E9EA,#EFD6D8)',
    measure: 'Tamanho ajustável (P/M/G/GG)',
    desc: 'Bikine em crochê vermelho com amarração ajustável e acabamento delicado.',
    rating: '5.0',
    reviews: 4,
    sold: '6 Vendidos'
  },
  {
    id: 10,
    sku: 'CENTRO-MESA-FLORAL-011',
    name: 'Centro de Mesa Tulipas Rosa com Base Cru',
    cat: 'decoracao',
    price: 40.00,
    image: '/imagens/produto10.png',
    video: '/videos/produto10.mp4',
    badge: 'Novo',
    color: 'linear-gradient(135deg,#F8ECEF,#F1DADD)',
    measure: 'Aprox. 40cm x 40cm',
    desc: 'Centro de mesa em crochê com delicado acabamento floral em Tulipas de tons rosa e verde, perfeito para decoração elegante.',
    rating: '4.8',
    reviews: 7,
    sold: '10 Vendidos'
  },
  {
    id: 11,
    sku: 'CHAVEIRO-CORACAO-012',
    name: 'Chaveiro Coração Vermelho em Crochê',
    cat: 'decoracao',
    price: 4.00,
    image: '/imagens/produto11.png',
    badge: 'Fofo',
    color: 'linear-gradient(135deg,#FDEBEC,#F8D7DA)',
    measure: 'Aprox. 5cm x 6cm',
    desc: 'Chaveiro artesanal em formato de coração, feito em crochê vermelho com acabamento macio e delicado. Ideal para presentear.',
    rating: '5.0',
    reviews: 35,
    sold: '50+ Vendidos'
  },
  {
    id: 12,
    sku: 'BOLSA-MARINHO-12',
    name: 'Bolsa de Crochê Azul Marinho com Alça trançada',
    cat: 'moda',
    price: 90.00,
    image: '/imagens/produto12.jpg',
    gallery: ['/imagens/produto12_extra1.jpg', '/imagens/produto12_extra2.jpg'],
    video: '/videos/produto12.mp4',
    badge: 'Lançamento',
    color: 'linear-gradient(135deg,#F7EEF0,#EAD8DC)',
    measure: 'Aprox. 20cm x 20cm',
    desc: 'Bolsa artesanal em crochê na cor azul marinho, com textura sofisticada em relevo, alça trançada e argolas com acabamento dourado. Uma peça elegante e exclusiva.',
    rating: '5.0',
    reviews: 2,
    sold: '3 Vendidos'
  },
  {
    id: 13,
    sku: 'SAIA-ROSA-013',
    name: 'Saia de Crochê Vazada Rosa com Franjas e Pérolas',
    cat: 'moda',
    price: 85.00,
    image: '/imagens/produto14.jpg',
    badge: 'Verão',
    color: 'linear-gradient(135deg,#F7EEF0,#EAD8DC)',
    measure: 'Tamanho ajustável (peça sob medida)',
    desc: 'Saída de banho artesanal na cor rosa vibrante. Possui trama vazada, ajuste na cintura com amarração, aplicação delicada de pérolas e lindo caimento com franjas na barra.',
    rating: '5.0',
    reviews: 1,
    sold: 'Lançamento'
  },
  {
    id: 14,
    sku: 'PERSONALIZADO-008',
    name: 'Mande sua Inspiração',
    cat: 'decoracao',
    price: null,
    image: '',
    badge: 'Exclusivo',
    color: 'linear-gradient(135deg,#F8E8EC,#EFD7D9)',
    measure: 'Sob encomenda',
    desc: 'Envie sua inspiração no WhatsApp com foto, cores e medidas para receber atendimento personalizado.',
    custom: true,
    buttonText: 'Solicitar'
  }
];

const CATALOG = PRODUCTS.reduce((acc, item) => { acc[item.id] = item; return acc; }, {});

const CAT_LABELS = { decoracao: 'Decoração', moda: 'Moda', bolsas: 'Bolsas', bebe: 'Bebê', inverno: 'Inverno' };
const fmt = n => Number(n).toFixed(2).replace('.', ',');

function getCardPrice(price) {
  const base = Number(price) * (1 + CARD_FEE_PERCENT / 100);
  const inteiro = Math.ceil(base);
  const final = inteiro - 0.01;
  return Number(final.toFixed(2));
}

function getCashSavings(price) {
  const savings = getCardPrice(price) - Number(price);
  return Number(savings.toFixed(2));
}

function getInstallment(price) {
  return getCardPrice(price) / 6;
}

function getPaymentMethod() {
  const select = document.getElementById('payment-method');
  return select ? select.value : 'avista';
}

function getUnitPriceByMethod(price, paymentMethod) {
  return paymentMethod === 'cartao' ? getCardPrice(price) : Number(price);
}

function getSubtotal(paymentMethod = 'avista') {
  return cart.reduce((sum, item) => {
    return sum + getUnitPriceByMethod(item.price, paymentMethod) * item.qty;
  }, 0);
}

function getTotalWithFrete(paymentMethod = 'avista') {
  const subtotal = getSubtotal(paymentMethod);
  const freteValue = selectedFrete ? selectedFrete.price : 0;
  return subtotal + freteValue;
}

let cart = [];
let activeFilter = 'todos';
let selectedFrete = null;
let selectedCep = null;
let toastTimer = null;

try {
  const raw = JSON.parse(localStorage.getItem('atelie_cart') || '[]');
  cart = raw
    .filter(item => item && CATALOG[item.id] && !CATALOG[item.id].custom)
    .map(item => {
      const catalogItem = CATALOG[item.id];
      return {
        id: catalogItem.id,
        qty: Math.max(1, Math.min(99, parseInt(item.qty, 10) || 1)),
        name: catalogItem.name,
        price: catalogItem.price,
        image: catalogItem.image
      };
    });
} catch (e) {
  cart = [];
}

function saveCart() {
  try { localStorage.setItem('atelie_cart', JSON.stringify(cart)); } catch (e) {}
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

function bumpBadge() {
  const b = document.getElementById('cart-count');
  if(!b) return;
  b.classList.add('bump');
  setTimeout(() => b.classList.remove('bump'), 300);
}

function createConfetti(x, y) {
  const confettiCount = 30;
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D'];
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = (x + (Math.random() - 0.5) * 100) + 'px';
    confetti.style.top = y + 'px';
    const size = Math.random() * 8 + 5;
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';
    confetti.style.animationDelay = Math.random() * 0.2 + 's';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3200);
  }
}

function createFloatingCounter(x, y, qty) {
  const counter = document.createElement('div');
  counter.classList.add('add-counter');
  counter.textContent = `+${qty}`;
  counter.style.left = x + 'px';
  counter.style.top = y + 'px';
  document.body.appendChild(counter);
  setTimeout(() => counter.remove(), 1500);
}

function setPaymentStatus(msg) {
  const el = document.getElementById('payment-status');
  if(el) el.textContent = msg || '';
}

function refreshUI() {
  const count = cart.reduce((s, x) => s + x.qty, 0);
  const countEl = document.getElementById('cart-count');
  if(countEl) countEl.textContent = count;

  const subEl = document.getElementById('cart-subtotal');
  if(subEl) subEl.textContent = 'R$ ' + fmt(getSubtotal('avista'));
  
  const freteEl = document.getElementById('cart-frete');
  if (freteEl) {
    if (selectedFrete) {
      freteEl.textContent = 'R$ ' + fmt(selectedFrete.price);
    } else {
      freteEl.textContent = selectedCep ? 'Calculando...' : 'A calcular';
    }
  }

  const totalEl = document.getElementById('cart-total');
  if(totalEl) totalEl.textContent = 'R$ ' + fmt(getTotalWithFrete('avista'));

  const btnCheck = document.getElementById('checkout-btn');
  if(btnCheck) btnCheck.disabled = cart.length === 0;
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  
  grid.style.display = 'grid';
  const list = activeFilter === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeFilter);

  if (!list.length) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">Nenhum produto nesta categoria ainda.</p>';
    return;
  }

  grid.innerHTML = list.map((p, i) => {
    const safeName = escapeHtml(p.name);
    const safeDesc = escapeHtml(p.desc);
    const safeBadge = p.badge ? escapeHtml(p.badge) : '';
    const safeCat = escapeHtml(CAT_LABELS[p.cat] || p.cat);
    const safeColor = escapeHtml(p.color);
    const safeImage = escapeHtml(p.image || '');

    if (p.custom) {
      return `
        <div class="product-card custom-card" style="background:${safeColor}">
          <div class="product-info" style="text-align:center; padding: 2rem;">
             <div style="font-size:2rem; margin-bottom:1rem;">✨</div>
             <h3 class="product-title">${safeName}</h3>
             <p>${safeDesc}</p>
             <button class="custom-btn pp-btn" data-custom-id="${p.id}" style="margin-top:1rem; width:100%;">Solicitar Orçamento</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="product-card">
        <div class="product-img-wrap">
          ${safeBadge ? `<span class="badge" style="background:${safeColor}">${safeBadge}</span>` : ''}
          <a href="/produto.html?id=${p.id}"><img src="${safeImage}" alt="${safeName}" loading="lazy"></a>
        </div>
        <div class="product-info">
          <div class="product-cat">${safeCat}</div>
          <h3 class="product-title"><a href="/produto.html?id=${p.id}">${safeName}</a></h3>
          
          ${p.sold ? `
            <div style="font-size: 0.75rem; color: #888; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
              <span style="color: var(--rose-dark);">🔥</span> ${escapeHtml(p.sold)}
            </div>
          ` : ''}

          <div class="product-price">
            <span class="price-cash">R$ ${fmt(p.price)}</span>
            <span class="price-pix">no PIX</span>
          </div>
          <div class="product-actions" style="margin-top: 1rem; display:flex; gap:0.5rem;">
             <button class="add-btn pp-btn pp-btn-outline" data-product-id="${p.id}" style="flex:1;">🛒 Adicionar</button>
             <button class="quick-buy-btn pp-btn" data-product-id="${p.id}" style="flex:1;">Comprar</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderCartBody() {
  const body = document.getElementById('cart-body');
  if(!body) return;

  if (!cart.length) {
    body.innerHTML = '<div style="text-align:center; padding: 2rem; color:#888;">🧺<br>Seu carrinho está vazio.<br>Adicione produtos para começar.</div>';
    return;
  }

  body.innerHTML = cart.map(item => {
    const safeName = escapeHtml(item.name);
    return `
      <div class="cart-item">
        <div class="cart-item-details">
          <h4>${safeName}</h4>
          <p>R$ ${fmt(item.price)} (PIX)</p>
          <div class="qty-controls">
            <button data-action="minus" data-id="${item.id}">−</button>
            <span>${item.qty}</span>
            <button data-action="plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="del-btn" data-action="del" data-id="${item.id}">🗑️</button>
      </div>
    `;
  }).join('');
}

function openCart() {
  const side = document.getElementById('cart-sidebar');
  const over = document.getElementById('cart-overlay');
  if(side) side.classList.add('open');
  if(over) over.classList.add('open');
  renderCartBody();
  refreshUI();
}

function closeCart() {
  const side = document.getElementById('cart-sidebar');
  const over = document.getElementById('cart-overlay');
  if(side) side.classList.remove('open');
  if(over) over.classList.remove('open');
  
  const cepInput = document.getElementById('cep-input');
  if(cepInput) cepInput.value = '';
  
  selectedCep = null;
  selected
