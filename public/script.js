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
  selectedFrete = null;
  
  const freteSel = document.getElementById('frete-selected');
  if(freteSel) freteSel.style.display = 'none';
  
  const lista = document.getElementById('frete-options');
  if(lista) {
    lista.innerHTML = '';
    lista.style.maxHeight = '500px';
    lista.style.opacity = '1';
    lista.style.overflow = 'visible';
    lista.style.display = 'block';
  }
  
  refreshUI();
}

window.switchMedia = function(type, src, element) {
  const img = document.getElementById('zoom-img');
  const video = document.getElementById('viewer-video');
  const container = document.getElementById('zoom-container');
  
  if(!img || !video || !container) return;

  document.querySelectorAll('.pp-thumb').forEach(t => t.classList.remove('active'));
  if(element) element.classList.add('active');

  if (type === 'image') {
    video.style.display = 'none';
    video.pause();
    img.style.display = 'block';
    img.src = src;
    container.style.cursor = 'zoom-in';
  } else if (type === 'video') {
    img.style.display = 'none';
    video.style.display = 'block';
    video.src = src;
    video.play().catch(e => console.log(e));
    container.style.cursor = 'default';
  }
};

function renderSingleProduct() {
  const container = document.getElementById('single-product-container');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const p = PRODUCTS.find(x => x.id === id);

  if (!p) {
    container.innerHTML = '<div style="padding:4rem; text-align:center;">Produto não encontrado.<br><br><a href="/" class="pp-btn">Voltar para a loja</a></div>';
    return;
  }

  const safeName = escapeHtml(p.name);
  const safeDesc = escapeHtml(p.desc);
  const safeMeasure = escapeHtml(p.measure || '');
  const safeCat = escapeHtml(CAT_LABELS[p.cat] || p.cat);
  const safeImage = escapeHtml(p.image || '');

  document.title = `${p.name} — Ateliê Priscila Lima`;

  let thumbsHtml = '';
  if (!p.custom) {
    thumbsHtml += `<img src="${safeImage}" class="pp-thumb active" data-type="image" data-src="${safeImage}" alt="Miniatura">`;
    if (p.gallery && p.gallery.length > 0) {
      thumbsHtml += p.gallery.map(img => `<img src="${escapeHtml(img)}" class="pp-thumb" data-type="image" data-src="${escapeHtml(img)}" alt="Miniatura">`).join('');
    }
    if (p.video) {
      thumbsHtml += `
        <div class="pp-thumb" data-type="video" data-src="${escapeHtml(p.video)}" style="position:relative; background:#000;">
          <span style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:white; font-size:1.2rem; pointer-events:none;">▶</span>
          <video src="${escapeHtml(p.video)}" style="opacity:0.7; width:100%; height:100%; object-fit:cover;"></video>
        </div>
      `;
    }
  }

  const mediaHtml = `
    <div class="product-media-column">
      ${p.custom ? `<div style="background:#f9f9f9; padding:4rem; text-align:center; font-size:3rem; border-radius:12px;">✨</div>` : `
        <div class="main-media-box" id="zoom-container" style="border-radius:12px; overflow:hidden; background:#fff; position:relative;">
          <img src="${safeImage}" alt="${safeName}" id="zoom-img" style="width:100%; display:block; transition: transform 0.2s;">
          <video id="viewer-video" style="display:none; width:100%; border-radius:12px;" controls></video>
        </div>
        <div class="pp-thumbnails" style="display:flex; gap:10px; margin-top:15px; overflow-x:auto;">
          ${thumbsHtml}
        </div>
      `}
    </div>
  `;

  let buyBoxHtml = `
    <div class="product-details-content">
      <div class="breadcrumb" style="font-size:0.85rem; color:#888; margin-bottom:1rem;">Início / ${safeCat}</div>
      <h1 class="product-title" style="font-size:1.8rem; color:var(--brown-dark);">${safeName}</h1>
      ${p.badge ? `<span class="badge" style="display:inline-block; margin-top:0.5rem; background:var(--rose-light); color:var(--brown-dark); padding:4px 10px; border-radius:20px; font-size:0.8rem;">${escapeHtml(p.badge)}</span>` : ''}
      
      ${p.rating ? `
      <div style="display: flex; align-items: center; gap: 10px; margin: 12px 0; font-size: 0.85rem; color: #666; border-bottom: 1px solid #eee; padding-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 4px; color: #333; font-weight: 600;">
          <span style="font-size: 1.1rem;">${escapeHtml(p.rating)}</span>
          <span style="color: #FFC107; font-size: 1.2rem; letter-spacing: -2px;">★★★★★</span>
        </div>
        <span style="color: #ccc;">|</span>
        <span style="text-decoration: underline;">${escapeHtml(String(p.reviews))} Avaliações</span>
        <span style="color: #ccc;">|</span>
        <span>${escapeHtml(p.sold || 'Produto Exclusivo')}</span>
      </div>
      ` : ''}
  `;

  if (p.custom) {
    buyBoxHtml += `
      <div style="margin: 2rem 0;">
        <p style="font-weight:600; font-size:1.2rem;">Sob encomenda</p>
      </div>
      <button class="custom-btn pp-btn" data-custom-id="${p.id}" style="width:100%; padding:15px; font-size:1.1rem;">Solicitar Orçamento no WhatsApp</button>
    </div>`;
  } else {
    buyBoxHtml += `
      <div class="price-box" style="margin: 1.5rem 0; padding:1.5rem; background:#fafafa; border-radius:12px;">
        <div style="font-size:1.8rem; font-weight:700; color:var(--brown-dark);">R$ ${fmt(p.price)} <span style="font-size:1rem; font-weight:400; color:#666;">no PIX</span></div>
        <div style="font-size:0.9rem; color:#666; margin-top:5px;">ou R$ ${fmt(getCardPrice(p.price))} em 6x de R$ ${fmt(getInstallment(p.price))} sem juros</div>
      </div>
      
      <div style="display:flex; gap:10px; margin-bottom:2rem;">
        <div style="flex:1;">
          <label style="font-size:0.8rem; color:#888;">Quantidade</label>
          <div style="display:flex; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
            <button id="pp-btn-minus" style="padding:10px 15px; background:#f5f5f5; border:none; cursor:pointer;">-</button>
            <input type="number" id="pp-qty" value="1" min="1" max="99" style="width:100%; text-align:center; border:none; font-size:1rem;" readonly>
            <button id="pp-btn-plus" style="padding:10px 15px; background:#f5f5f5; border:none; cursor:pointer;">+</button>
          </div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        <button class="add-btn pp-btn pp-btn-outline" data-product-id="${p.id}" style="padding:15px; font-size:1.1rem;">🛍️ Adicionar à sacola</button>
        <button class="quick-buy-btn pp-btn" data-product-id="${p.id}" style="padding:15px; font-size:1.1rem;">💳 Comprar agora</button>
      </div>
    </div>`;
  }

  container.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:3rem; max-width:1000px; margin:0 auto;">
      ${mediaHtml}
      ${buyBoxHtml}
    </div>
    <div style="margin-top:4rem; border-top:1px solid #eee; padding-top:3rem;">
      <h2 style="font-size:1.5rem; color:var(--brown-dark); margin-bottom:1.5rem;">Descrição e ficha técnica</h2>
      <p style="font-size:0.9rem; color:#888; margin-bottom:1rem;">SKU: ${p.sku || 'SKU-'+p.id}</p>
      <p style="line-height:1.6; color:#444;">${safeDesc}</p>
      <ul style="margin-top:1.5rem; color:#444; padding-left:20px; line-height:1.8;">
        ${safeMeasure ? `<li><strong>📏 Medidas:</strong> ${safeMeasure}</li>` : ''}
        <li><strong>🧶 Material:</strong> Fios de alta qualidade, 100% artesanal.</li>
      </ul>
    </div>
  `;

  // Lógica de Zoom na página de produto
  const zoomContainer = document.getElementById('zoom-container');
  const zoomImg = document.getElementById('zoom-img');

  if (zoomContainer && zoomImg) {
    zoomContainer.addEventListener('mousemove', (e) => {
      if(zoomImg.style.display === 'none') return;
      const rect = zoomContainer.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
      zoomImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
      zoomImg.style.transform = 'scale(2.5)';
    });
    zoomContainer.addEventListener('mouseleave', () => {
      zoomImg.style.transformOrigin = 'center center';
      zoomImg.style.transform = 'scale(1)';
    });
  }
}

// ==========================================
// FUNÇÕES DE CHECKOUT & INTEGRAÇÃO WHATSAPP
// ==========================================

window.openCheckoutDirectly = function() {
  const cartSide = document.getElementById('cart-sidebar');
  const cartOverlayEl = document.getElementById('cart-overlay');
  
  if (cartSide) cartSide.classList.remove('open');
  if (cartOverlayEl) cartOverlayEl.classList.remove('open');

  if (!selectedFrete && !selectedCep) {
    openCart();
    showToast('Por favor, informe seu CEP para calcular o total.');
    return;
  }

  const checkModal = document.getElementById('checkout-modal');
  if (checkModal) {
    checkModal.classList.add('open');
    updateCheckoutSummary();
    
    const cepDisplay = document.getElementById('modal-cep-display');
    if (cepDisplay) cepDisplay.textContent = selectedCep || 'Não informado';

    const freteDisplay = document.getElementById('modal-frete-display');
    if (freteDisplay && selectedFrete) {
      freteDisplay.textContent = selectedFrete.name.includes('Cidades vizinhas') 
        ? 'A combinar / Retirada' 
        : `${selectedFrete.name} - R$ ${fmt(selectedFrete.price)}`;
    }
  }
};

function updateCheckoutSummary() {
  const paymentMethod = getPaymentMethod();
  const sumItems = document.getElementById('sum-items');
  
  if (sumItems) {
    sumItems.innerHTML = cart.map(x => {
      const unitPrice = getUnitPriceByMethod(x.price, paymentMethod);
      return `<div>${escapeHtml(x.name)} × ${x.qty} <br> <small>R$ ${fmt(unitPrice * x.qty)}</small></div>`;
    }).join('<hr style="margin:10px 0; border:none; border-top:1px dashed #ddd;">');
  }

  const sumTotalVal = document.getElementById('sum-total-val');
  if (sumTotalVal) {
    sumTotalVal.textContent = 'R$ ' + fmt(getTotalWithFrete(paymentMethod));
  }
}

function getCustomerData() {
  const form = document.getElementById('checkout-form');
  if (!form) return { paymentMethod: 'avista', name: 'Não informado', note: '', lgpd: true };

  const data = new FormData(form);
  return {
    paymentMethod: String(data.get('paymentMethod') || 'avista').trim(),
    name:          String(data.get('name')          || '').trim(),
    note:          String(data.get('note')          || '').trim(),
    lgpd:          data.get('lgpdConsent') === 'on'
  };
}

function validateCheckout() {
  if (!cart.length) {
    showToast('Seu carrinho está vazio.');
    return false;
  }
  if (!selectedFrete && !selectedCep) {
    showToast('Selecione uma opção de frete.');
    return false;
  }
  
  const form = document.getElementById('checkout-form');
  if (form) {
    const customer = getCustomerData();
    if (!customer.name) {
      showToast('Por favor, preencha o seu nome ou apelido.');
      return false;
    }
    if (!customer.lgpd) {
      showToast('Você precisa concordar com o envio dos dados.');
      return false;
    }
  }
  return true;
}

function buildWhatsAppMessage() {
  const customer = getCustomerData();
  const paymentMethod = customer.paymentMethod || 'avista';

  const itemsText = cart.map((item, index) => {
    const unitPrice = getUnitPriceByMethod(item.price, paymentMethod);
    const sku = CATALOG[item.id]?.sku ? ` | SKU: ${CATALOG[item.id].sku}` : '';
    return `${index + 1}. ${item.name}${sku}\nQtd: ${item.qty}\nValor unitário: R$ ${fmt(unitPrice)}\nSubtotal: R$ ${fmt(unitPrice * item.qty)}`;
  }).join('\n\n');

  let freteText = '🚚 FRETE: A combinar';
  if (selectedFrete) {
    freteText = selectedFrete.name.includes('Cidades vizinhas')
      ? '🚚 FRETE: A combinar / Retirada'
      : `🚚 FRETE: ${selectedFrete.name} - R$ ${fmt(selectedFrete.price)}`;
  }

  const lblPay = paymentMethod === 'cartao' ? 'Cartão em até 6x sem juros' : 'PIX';
  
  return `Olá! Gostaria de finalizar este pedido:\n\n🛍️ *PEDIDO*\n${itemsText}\n\n💳 *FORMA DE PAGAMENTO*: ${lblPay}\n${freteText}\n\n💰 *TOTAL FINAL*: R$ ${fmt(getTotalWithFrete(paymentMethod))}\n\n👤 *DADOS DO CLIENTE*\nNome: ${customer.name || 'Não informado'}\nObservações: ${customer.note || 'Nenhuma'}\n\n*(O endereço de entrega e os detalhes de contacto serão combinados por aqui na conversa)*`;
}

function sendOrderToWhatsApp() {
  if (!validateCheckout()) return;
  setPaymentStatus('A abrir WhatsApp...');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`, '_blank', 'noopener,noreferrer');
}

function sendCustomOrderToWhatsApp(productId) {
  const p = PRODUCTS.find(x => x.id === productId && x.custom);
  if (!p) return;
  const msg = `Olá! Tenho interesse em uma peça personalizada.\n\n✨ PEDIDO PERSONALIZADO\nReferência: ${p.name}\nSKU: ${p.sku}\n\nQuero enviar minha inspiração, foto de referência, cores, medidas e demais detalhes para orçamento.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
}

// ==========================================
// EVENT LISTENERS GLOBAIS
// ==========================================

document.body.addEventListener('click', (e) => {
  // Quantidade (Página de Produto)
  if (e.target.closest('#pp-btn-minus')) {
    const qtyInput = document.getElementById('pp-qty');
    if (qtyInput) qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
    return;
  }
  if (e.target.closest('#pp-btn-plus')) {
    const qtyInput = document.getElementById('pp-qty');
    if (qtyInput) qtyInput.value = Math.min(99, parseInt(qtyInput.value) + 1);
    return;
  }

  const qtyInputEl = document.getElementById('pp-qty');
  const selectedQty = qtyInputEl ? parseInt(qtyInputEl.value, 10) : 1;

  // Botão "Comprar Agora"
  const quickBtn = e.target.closest('.quick-buy-btn');
  if (quickBtn) {
    const id = parseInt(quickBtn.dataset.productId, 10);
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;

    const existing = cart.find(x => x.id === id);
    if (!existing) {
      cart.push({ id: p.id, qty: selectedQty, name: p.name, price: p.price, image: p.image });
    } else {
      existing.qty = selectedQty;
    }
    
    saveCart();
    refreshUI();
    renderCartBody();
    window.openCheckoutDirectly();
    return;
  }

  // Troca de Mídia
  const thumb = e.target.closest('.pp-thumb');
  if (thumb) {
    window.switchMedia(thumb.dataset.type, thumb.dataset.src, thumb);
    return;
  }

  // Botão Personalizado
  const customBtn = e.target.closest('.custom-btn');
  if (customBtn) {
    sendCustomOrderToWhatsApp(parseInt(customBtn.dataset.customId, 10));
    return;
  }

  // Botão Adicionar à Sacola
  const btn = e.target.closest('.add-btn');
  if (btn) {
    const id = parseInt(btn.dataset.productId, 10);
    const p = PRODUCTS.find(x => x.id === id);
    if (!p || p.custom) return;

    const existing = cart.find(x => x.id === id);
    if (existing) {
      existing.qty = Math.min(99, existing.qty + selectedQty);
    } else {
      cart.push({ id: p.id, qty: selectedQty, name: p.name, price: p.price, image: p.image });
    }
    saveCart();
    refreshUI();
    renderCartBody();
    showToast(`${p.name} adicionado!`);
    bumpBadge();
    
    const rect = btn.getBoundingClientRect();
    createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    if(document.getElementById('single-product-container')) openCart();
    return;
  }

  // Filtros (Home)
  const filterBtn = e.target.closest('.filter-btn');
  if (filterBtn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    filterBtn.classList.add('active');
    activeFilter = filterBtn.dataset.filter;
    renderProducts();
    return;
  }

  // Carrinho Lateral (Deletar, Somar, Subtrair)
  const actionBtn = e.target.closest('[data-action]');
  if (actionBtn && e.target.closest('#cart-body')) {
    const id = parseInt(actionBtn.dataset.id, 10);
    const action = actionBtn.dataset.action;
    
    if (action === 'del') {
      cart = cart.filter(x => x.id !== id);
    } else {
      const item = cart.find(x => x.id === id);
      if (item) {
        item.qty += action === 'plus' ? 1 : -1;
        item.qty = Math.min(99, Math.max(0, item.qty));
        if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
      }
    }
    saveCart();
    refreshUI();
    renderCartBody();
  }
});

// Eventos de Checkou e UI Adicional
const addEvent = (id, event, handler) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, handler);
};

addEvent('cart-toggle-btn', 'click', openCart);
addEvent('cart-close-btn', 'click', closeCart);
addEvent('cart-overlay', 'click', closeCart);

// Fechar carrinho usando apenas classList (Resolve o erro do CEP não informado)
addEvent('checkout-btn', 'click', () => {
  if (!cart.length) return;
  if (!selectedFrete && !selectedCep) {
    showToast('Selecione uma opção de frete antes de continuar.');
    return;
  }
  
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  
  setPaymentStatus('');
  const checkModal = document.getElementById('checkout-modal');
  if (checkModal) {
    checkModal.classList.add('open');
    updateCheckoutSummary();
    
    const cepDisplay = document.getElementById('modal-cep-display');
    if (cepDisplay) cepDisplay.textContent = selectedCep || 'Não informado';

    const freteDisplay = document.getElementById('modal-frete-display');
    if (freteDisplay && selectedFrete) {
      freteDisplay.textContent = selectedFrete.name.includes('Cidades vizinhas') 
        ? 'A combinar / Retirada' 
        : `${selectedFrete.name} - R$ ${fmt(selectedFrete.price)}`;
    }
  }
});

addEvent('checkout-close-btn', 'click', () => {
  const modal = document.getElementById('checkout-modal');
  if(modal) modal.classList.remove('open');
});

addEvent('payment-method', 'change', updateCheckoutSummary);
addEvent('whatsapp-checkout-btn', 'click', sendOrderToWhatsApp);

// Inicialização
if (document.getElementById('products-grid')) renderProducts();
renderSingleProduct();
refreshUI();
