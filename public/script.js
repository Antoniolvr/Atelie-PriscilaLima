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
    desc: 'Sousplat artesanal em crochê com acabamento delicado para valorizar sua mesa com charme e elegância.'
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
    desc: 'Peça artesanal em formato oval com composição elegante em verde e off white.'
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
    desc: 'Sousplat em crochê artesanal com formato redondo, tom verde suave e delicado detalhe dourado.'
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
    desc: 'Sousplat redondo em crochê com combinação delicada de tons candy: rosa, amarelo, azul e base clara.'
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
    desc: 'Caminho de mesa em crochê artesanal na cor off white com acabamento dourado e delicado desenho de corações.'
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
    desc: 'Caminho de mesa em crochê artesanal na cor marrom com detalhes dourados e acabamento delicado.'
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
    desc: 'Sousplat em crochê artesanal com combinação sofisticada em marsala, cru e acabamento dourado.'
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
    desc: 'Porta Copos artesanal com flores vermelhas e base em tom cru.'
  },
  {
    id: 9,
    sku: 'BIKINE-CROCHE-009',
    name: 'Bikine em Crochê Vermelho Artesanal',
    cat: 'moda',
    price: 55.00,
    image: '/imagens/produto9.png',
    video: '/videos/produto9.mp4',
    badge: 'Novo',
    color: 'linear-gradient(135deg,#F7E9EA,#EFD6D8)',
    measure: 'Tamanho ajustável (P/M/G/GG)',
    desc: 'Bikine em crochê vermelho com amarração ajustável e acabamento delicado.'
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
    desc: 'Centro de mesa em crochê com delicado acabamento floral em Tulipas de tons rosa e verde, perfeito para decoração elegante.'
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
    desc: 'Chaveiro artesanal em formato de coração, feito em crochê vermelho com acabamento macio e delicado. Ideal para presentear.'
  },
  {
    id: 12,
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

// CORREÇÃO: CATALOG exclui produtos customizados (price: null) para evitar NaN no carrinho
const CATALOG = PRODUCTS
  .filter(p => !p.custom)
  .reduce((acc, item) => { acc[item.id] = item; return acc; }, {});

const CAT_LABELS = {
  decoracao: 'Decoração',
  moda: 'Moda',
  bolsas: 'Bolsas',
  bebe: 'Bebê',
  inverno: 'Inverno'
};

const fmt = n => Number(n).toFixed(2).replace('.', ',');

function getCardPrice(price) {
  const base   = Number(price) * (1 + CARD_FEE_PERCENT / 100);
  const inteiro = Math.ceil(base);
  const final   = inteiro - 0.01;
  return Number(final.toFixed(2));
}

function getCashSavings(price) {
  return Number((getCardPrice(price) - Number(price)).toFixed(2));
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
  return getSubtotal(paymentMethod) + (selectedFrete ? selectedFrete.price : 0);
}

let cart = [];
let activeFilter = 'todos';
let selectedFrete = null;
let selectedCep = null;
let toastTimer = null;

// CORREÇÃO: localStorage com validade de 24 horas
const CART_TTL_MS = 24 * 60 * 60 * 1000;
try {
  const raw     = JSON.parse(localStorage.getItem('atelie_cart') || '{}');
  const payload = Array.isArray(raw) ? { cart: raw, ts: 0 } : raw;

  const expirado = !payload.ts || (Date.now() - payload.ts) > CART_TTL_MS;

  if (!expirado && Array.isArray(payload.cart)) {
    cart = payload.cart
      .filter(item => item && CATALOG[item.id])
      .map(item => {
        const c = CATALOG[item.id];
        return {
          id:    c.id,
          qty:   Math.max(1, Math.min(99, parseInt(item.qty, 10) || 1)),
          name:  c.name,
          price: c.price,
          image: c.image
        };
      });
  }
} catch (e) {
  cart = [];
}

function saveCart() {
  try {
    localStorage.setItem('atelie_cart', JSON.stringify({ cart, ts: Date.now() }));
  } catch (e) {}
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

function bumpBadge() {
  const b = document.getElementById('cart-count');
  b.classList.add('bump');
  setTimeout(() => b.classList.remove('bump'), 300);
}

function createConfetti(x, y) {
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D'];
  for (let i = 0; i < 30; i++) {
    const el = document.createElement('div');
    el.classList.add('confetti');
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.left        = (x + (Math.random() - 0.5) * 100) + 'px';
    el.style.top         = y + 'px';
    const size           = Math.random() * 8 + 5;
    el.style.width       = size + 'px';
    el.style.height      = size + 'px';
    el.style.animationDelay = Math.random() * 0.2 + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }
}

function createFloatingCounter(x, y, qty) {
  const el    = document.createElement('div');
  el.classList.add('add-counter');
  el.textContent  = `+${qty}`;
  el.style.left   = x + 'px';
  el.style.top    = y + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

function setPaymentStatus(msg) {
  document.getElementById('payment-status').textContent = msg || '';
}

function refreshUI() {
  const count = cart.reduce((s, x) => s + x.qty, 0);
  document.getElementById('cart-count').textContent    = count;
  document.getElementById('cart-subtotal').textContent = 'R$ ' + fmt(getSubtotal('avista'));

  if (selectedFrete) {
    document.getElementById('cart-frete').textContent = 'R$ ' + fmt(selectedFrete.price);
  } else {
    document.getElementById('cart-frete').textContent = selectedCep ? 'Calculando...' : 'A calcular';
  }

  document.getElementById('cart-total').textContent    = 'R$ ' + fmt(getTotalWithFrete('avista'));
  document.getElementById('checkout-btn').disabled     = cart.length === 0;
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  grid.style.display = 'grid';

  const list = activeFilter === 'todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.cat === activeFilter);

  if (!list.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--brown-mid);font-family:Playfair Display,serif;font-size:1.1rem">Nenhum produto nesta categoria ainda.</div>';
    return;
  }

  grid.innerHTML = list.map((p, i) => {
    const safeName    = escapeHtml(p.name);
    const safeDesc    = escapeHtml(p.desc);
    const safeMeasure = escapeHtml(p.measure || '');
    const safeBadge   = p.badge ? escapeHtml(p.badge) : '';
    const safeCat     = escapeHtml(CAT_LABELS[p.cat] || p.cat);
    const safeColor   = escapeHtml(p.color);
    const safeImage   = escapeHtml(p.image || '');
    const safeBtnText = p.custom ? escapeHtml(p.buttonText || 'Solicitar') : '';

    return `
    <div class="product-card" style="animation-delay:${i * 0.08}s; display: flex; flex-direction: column;">
      <div class="product-img" style="background:${safeColor}">
        ${
          p.custom
            ? `<div class="custom-visual">
                <div class="custom-visual-ico">✨</div>
                <div class="custom-visual-title">Peça sob medida</div>
                <div class="custom-visual-sub">Transforme sua ideia em uma criação exclusiva</div>
               </div>`
            : `<img src="${safeImage}" class="product-image" alt="${safeName}">`
        }
        ${safeBadge ? `<span class="product-badge">${safeBadge}</span>` : ''}
      </div>

      <div class="product-info" style="display: flex; flex-direction: column; flex: 1;">
        <p class="product-cat">${safeCat}</p>
        <h3 class="product-name">${safeName}</h3>
        ${safeMeasure ? `<p class="product-measure">Medida: ${safeMeasure}</p>` : ''}
        <p class="product-desc">${safeDesc}</p>

        <div class="product-footer" style="margin-top: auto;">
          ${
            p.custom
              ? `
                <div class="product-price">
                  Sob encomenda
                  <small>Consulte valor e prazo</small>
                </div>
                <button class="custom-btn" data-custom-id="${p.id}">
                  ${safeBtnText}
                </button>
              `
              : `
                <div class="price-focus-box">
                  <div class="price-main-line">
                    <span class="price-main">R$ ${fmt(p.price)}</span>
                    <span class="pix-chip">PIX</span>
                  </div>

                  <div class="price-economy-badge">
                    💰 Economize R$ ${fmt(getCashSavings(p.price))}
                  </div>

                  <div style="margin-top:.6rem">
                    <div style="font-size:1.25rem;font-weight:700;color:#2e7d32;display:flex;align-items:center;gap:.4rem;">
                      💳 6x de R$ ${fmt(getInstallment(p.price))}
                    </div>
                    <div style="font-size:.75rem;color:var(--brown-mid);margin-top:.2rem;">
                      sem juros no cartão
                    </div>
                    <div style="font-size:.68rem;opacity:.55;margin-top:.25rem;">
                      Total no cartão: R$ ${fmt(getCardPrice(p.price))}
                    </div>
                  </div>
                </div>

                <div class="product-actions">
                  ${p.video ? `
                    <button class="video-btn"
                            data-video-src="${escapeHtml(p.video)}"
                            data-video-name="${safeName}">
                      🎥 Vídeo
                    </button>
                  ` : ''}

                  <button class="add-btn" data-product-id="${p.id}">
                    🛍️ Compre agora
                  </button>
                </div>
              `
          }
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderCartBody() {
  const body = document.getElementById('cart-body');

  if (!cart.length) {
    body.innerHTML = '<div class="cart-empty"><span class="cart-empty-ico">🧺</span><p>Seu carrinho está vazio</p><p style="font-size:.78rem;margin-top:.4rem;opacity:.7">Adicione produtos para começar</p></div>';
    return;
  }

  body.innerHTML = cart.map(item => {
    const safeName  = escapeHtml(item.name);
    const safeImage = escapeHtml(item.image || '');
    return `
    <div class="cart-item">
      <div class="ci-icon">
        <img src="${safeImage}" alt="${safeName}" class="ci-thumb">
      </div>
      <div class="ci-info">
        <p class="ci-name">${safeName}</p>
        <p class="ci-price">R$ ${fmt(item.price)} <span style="opacity:.7">(PIX)</span></p>
        <div class="ci-controls">
          <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
          <span class="qty-n">${item.qty}</span>
          <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="ci-del" data-action="del" data-id="${item.id}">🗑️</button>
    </div>`;
  }).join('');
}

function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  renderCartBody();
  refreshUI();
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');

  document.getElementById('cep-input').value = '';
  selectedCep   = null;
  selectedFrete = null;

  document.getElementById('frete-selected').style.display = 'none';

  const lista = document.getElementById('frete-options');
  lista.innerHTML   = '';
  lista.style.maxHeight = '500px';
  lista.style.opacity   = '1';
  lista.style.overflow  = 'visible';
  lista.style.display   = 'block';

  refreshUI();
}

function closeProductVideo() {
  const modal  = document.getElementById('video-modal');
  const player = document.getElementById('product-video-player');
  player.pause();
  player.removeAttribute('src');
  player.load();
  modal.classList.remove('open');
}

function openProductVideo(src, name, poster) {
  const modal  = document.getElementById('video-modal');
  const player = document.getElementById('product-video-player');

  if (src) player.src = src;

  // CORREÇÃO: verificar apenas se poster existe e não é vazio
  if (poster) {
    player.poster = poster;
  } else {
    player.removeAttribute('poster');
  }

  modal.classList.add('open');
  player.play().catch(() => {});
}

function updateCheckoutSummary() {
  const paymentMethod = getPaymentMethod();

  document.getElementById('sum-items').innerHTML = cart.map(x => {
    const unitPrice = getUnitPriceByMethod(x.price, paymentMethod);
    const subtotal  = unitPrice * x.qty;
    const safeName  = escapeHtml(x.name);
    return `<div class="sum-row"><span>${safeName} × ${x.qty}</span><span>R$ ${fmt(subtotal)}</span></div>`;
  }).join('');

  document.getElementById('sum-total-val').textContent = 'R$ ' + fmt(getTotalWithFrete(paymentMethod));
}

function getCustomerData() {
  const form = document.getElementById('checkout-form');
  const data = new FormData(form);
  return {
    paymentMethod: String(data.get('paymentMethod') || 'avista').trim(),
    name:    String(data.get('name')    || '').trim(),
    phone:   String(data.get('phone')   || '').trim(),
    email:   String(data.get('email')   || '').trim(),
    address: String(data.get('address') || '').trim(),
    note:    String(data.get('note')    || '').trim()
  };
}

function validateCheckout() {
  if (!cart.length) { showToast('Seu carrinho está vazio.'); return false; }

  // CORREÇÃO: exigir frete selecionado, não apenas CEP preenchido
  if (!selectedFrete) {
    showToast('Selecione uma opção de frete.');
    return false;
  }

  const customer = getCustomerData();
  if (!customer.name || !customer.phone || !customer.email || !customer.address) {
    showToast('Preencha todos os campos obrigatórios.');
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    showToast('Informe um e-mail válido.');
    return false;
  }
  return true;
}

function getPaymentMethodLabel(paymentMethod) {
  return paymentMethod === 'cartao' ? 'Cartão em até 6x sem juros' : 'PIX';
}

function buildWhatsAppMessage() {
  const customer      = getCustomerData();
  const paymentMethod = customer.paymentMethod;

  const itemsText = cart.map((item, index) => {
    const unitPrice = getUnitPriceByMethod(item.price, paymentMethod);
    const subtotal  = unitPrice * item.qty;
    const sku       = CATALOG[item.id]?.sku ? ` | SKU: ${CATALOG[item.id].sku}` : '';
    return `${index + 1}. ${item.name}${sku}\nQtd: ${item.qty}\nValor unitário: R$ ${fmt(unitPrice)}\nSubtotal: R$ ${fmt(subtotal)}`;
  }).join('\n\n');

  let freteText = '';
  if (selectedFrete) {
    freteText = selectedFrete.name === 'Cidades vizinhas - Valores a combinar'
      ? `🚚 *FRETE*: ${selectedFrete.name}`
      : `🚚 *FRETE*: ${selectedFrete.name} - R$ ${fmt(selectedFrete.price)}`;
  } else {
    freteText = `🚚 *FRETE*: A combinar`;
  }

  return `Olá! Gostaria de finalizar este pedido:

🛍️ *PEDIDO*
${itemsText}

💳 *FORMA DE PAGAMENTO*: ${getPaymentMethodLabel(paymentMethod)}

${freteText}

💰 *TOTAL FINAL*: R$ ${fmt(getTotalWithFrete(paymentMethod))}

👤 *DADOS DO CLIENTE*
Nome: ${customer.name}
Telefone: ${customer.phone}
E-mail: ${customer.email}
Endereço: ${customer.address}
Observações: ${customer.note || 'Nenhuma'}`;
}

function buildCustomOrderMessage(product) {
  return `Olá! Tenho interesse em uma peça personalizada.\n\n✨ *PEDIDO PERSONALIZADO*\nReferência: ${product.name}\nSKU: ${product.sku}\n\nQuero enviar minha inspiração, foto de referência, cores, medidas e demais detalhes para orçamento.`;
}

function sendOrderToWhatsApp() {
  if (!validateCheckout()) return;
  const message = buildWhatsAppMessage();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  setPaymentStatus('Abrindo WhatsApp...');
  window.open(url, '_blank', 'noopener,noreferrer');
}

function sendCustomOrderToWhatsApp(productId) {
  const product = PRODUCTS.find(x => x.id === productId && x.custom);
  if (!product) return;
  const message = buildCustomOrderMessage(product);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}

function applyFrete(price, name) {
  selectedFrete = { price: Number(price), name };
  selectedCep   = document.getElementById('cep-input').value;

  document.getElementById('frete-selected').style.display    = 'block';
  document.getElementById('frete-selected-text').textContent =
    `${name}${name !== 'Cidades vizinhas - Valores a combinar' ? ' - R$ ' + fmt(price) : ''}`;

  const lista = document.getElementById('frete-options');
  lista.style.transition = 'all 0.3s ease';
  lista.style.maxHeight  = '0px';
  lista.style.opacity    = '0';
  lista.style.overflow   = 'hidden';

  refreshUI();
  updateCheckoutSummary();
}

function trocarFrete() {
  const lista   = document.getElementById('frete-options');
  const resumo  = document.getElementById('frete-selected');
  lista.style.display   = 'block';
  lista.style.opacity   = '1';
  lista.style.maxHeight = '500px';
  lista.style.overflow  = 'visible';
  resumo.style.display  = 'none';
}

document.getElementById('calc-frete-btn').addEventListener('click', async () => {
  const cep        = document.getElementById('cep-input').value.replace(/\D/g, '');
  const optionsDiv = document.getElementById('frete-options');

  if (cep.length !== 8) return showToast('Digite um CEP válido (8 dígitos)');

  optionsDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 6px; color: var(--rose-dark);"><span class="loading-spinner"></span> Calculando opções de frete...</div>';

  try {
    const response = await fetch('/api/frete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cep, items: cart })
    });

    const fretes = await response.json();

    if (!Array.isArray(fretes)) {
      optionsDiv.innerHTML = 'Não foi possível calcular o frete para este CEP (Erro interno).';
      return;
    }

    const allFretes = [
      ...fretes,
      { company: 'Ateliê', name: 'Cidades vizinhas - Valores a combinar', price: 0, delivery_time: 0 }
    ];

    if (allFretes.length === 0) {
      optionsDiv.innerHTML = 'Nenhuma opção de frete encontrada.';
      return;
    }

    optionsDiv.innerHTML = allFretes.map((f, i) => `
      <label style="display:block; margin-bottom:8px; cursor:pointer; padding:8px; border:1px solid rgba(169,120,125,.22); border-radius:8px; transition: all .2s; background: #fff;">
        <input type="radio" name="freteRadio" value="${f.price}" data-name="${escapeHtml(f.company + ' ' + f.name)}" ${i === 0 ? 'checked' : ''} style="cursor: pointer; margin-right: 6px;">
        <strong style="color: var(--brown);">${escapeHtml(f.company)} - ${escapeHtml(f.name)}</strong><br>
        <span style="font-size:0.8rem; color:var(--brown-mid)">
          ${f.price > 0 ? `R$ ${f.price.toFixed(2).replace('.', ',')}` : 'Sob consulta'} ${f.delivery_time > 0 ? `| Prazo: ${f.delivery_time} dias úteis` : ''}
        </span>
      </label>
    `).join('');

    const primeiroFrete = fretes[0];
    if (primeiroFrete) {
      applyFrete(primeiroFrete.price, `${primeiroFrete.company} ${primeiroFrete.name}`);
    } else {
      applyFrete(0, 'Cidades vizinhas - Valores a combinar');
    }

    document.querySelectorAll('input[name="freteRadio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        applyFrete(e.target.value, e.target.dataset.name);
      });
    });

  } catch (e) {
    console.error(e);
    optionsDiv.innerHTML = 'Erro de conexão ao buscar frete.';
  }
});

document.getElementById('filter-tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  renderProducts();
});

document.getElementById('products-grid').addEventListener('click', (e) => {
  const customBtn = e.target.closest('.custom-btn');
  if (customBtn) {
    sendCustomOrderToWhatsApp(parseInt(customBtn.dataset.customId, 10));
    return;
  }

  const videoBtn = e.target.closest('.video-btn');
  if (videoBtn) {
    openProductVideo(
      videoBtn.dataset.videoSrc,
      videoBtn.dataset.videoName,
      videoBtn.dataset.videoPoster || ''
    );
    return;
  }

  const btn = e.target.closest('.add-btn');
  if (!btn) return;

  const id = parseInt(btn.dataset.productId, 10);
  const p  = PRODUCTS.find(x => x.id === id);
  if (!p || p.custom) return;

  const existing = cart.find(x => x.id === id);
  if (existing) {
    existing.qty = Math.min(99, existing.qty + 1);
  } else {
    cart.push({ id: p.id, qty: 1, name: p.name, price: p.price, image: p.image });
  }

  saveCart();
  refreshUI();
  renderCartBody();
  showToast(`${p.name} adicionado!`);
  bumpBadge();

  const rect      = btn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width  / 2;
  const btnCenterY = rect.top  + rect.height / 2;
  createConfetti(btnCenterX, btnCenterY);
  createFloatingCounter(btnCenterX - 15, btnCenterY - 30, 1);
});

document.getElementById('cart-body').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const id     = parseInt(btn.dataset.id, 10);
  const action = btn.dataset.action;

  if (action === 'del') {
    cart = cart.filter(x => x.id !== id);
  } else {
    const item = cart.find(x => x.id === id);
    if (item) {
      item.qty += action === 'plus' ? 1 : -1;
      item.qty  = Math.min(99, Math.max(0, item.qty));
      if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
    }
  }

  saveCart();
  refreshUI();
  renderCartBody();
});

document.getElementById('cart-toggle-btn').addEventListener('click', openCart);
document.getElementById('cart-close-btn').addEventListener('click', closeCart);
document.getElementById('cart-overlay').addEventListener('click', closeCart);

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (!cart.length) return;
  if (!selectedFrete) {
    showToast('Selecione uma opção de frete antes de continuar.');
    return;
  }
  closeCart();
  setPaymentStatus('');

  document.getElementById('modal-cep-display').textContent = selectedCep || 'Não informado';
  if (selectedFrete) {
    document.getElementById('modal-frete-display').textContent =
      selectedFrete.name === 'Cidades vizinhas - Valores a combinar'
        ? selectedFrete.name
        : `${selectedFrete.name} - R$ ${fmt(selectedFrete.price)}`;
  }

  document.getElementById('checkout-modal').classList.add('open');
  updateCheckoutSummary();
});

document.getElementById('checkout-close-btn').addEventListener('click', () => {
  document.getElementById('checkout-modal').classList.remove('open');
});

document.getElementById('checkout-modal').addEventListener('click', function(e) {
  if (e.target === this) this.classList.remove('open');
});

document.getElementById('video-close-btn').addEventListener('click', closeProductVideo);

document.getElementById('video-modal').addEventListener('click', function(e) {
  if (e.target === this) closeProductVideo();
});

document.getElementById('payment-method').addEventListener('change', updateCheckoutSummary);
document.getElementById('whatsapp-checkout-btn').addEventListener('click', sendOrderToWhatsApp);

const btnTrocarFrete = document.getElementById('btn-trocar-frete');
if (btnTrocarFrete) {
  btnTrocarFrete.addEventListener('click', trocarFrete);
}

renderProducts();
refreshUI();
