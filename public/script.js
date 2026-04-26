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
    image: '/produto1.png',
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
    image: '/produto2.webp',
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
    image: '/produto3.png',
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
    image: '/produto4.png',
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
    image: '/produto5.png',
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
    image: '/produto6.png',
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
    image: '/produto7.png',
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
    image: '/produto8.png',
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
    image: '/produto9.png',
    video: '/videos/produto9.mp4',
    badge: 'Novo',
    color: 'linear-gradient(135deg,#F7E9EA,#EFD6D8)',
    measure: 'Tamanho ajustável (P/M/G/GG)',
    desc: 'Bikine em crochê vermelho com amarração ajustável e acabamento delicado.'
  },
  {
    id: 10,
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

const CAT_LABELS = {
  decoracao: 'Decoração',
  moda: 'Moda',
  bolsas: 'Bolsas',
  bebe: 'Bebê',
  inverno: 'Inverno'
};

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
        id:    catalogItem.id,
        qty:   Math.max(1, Math.min(99, parseInt(item.qty, 10) || 1)),
        name:  catalogItem.name,
        price: catalogItem.price,
        image: catalogItem.image
      };
    });
} catch (e) {
  cart = [];
}

function saveCart() {
  try {
    localStorage.setItem('atelie_cart', JSON.stringify(cart));
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

// 🎊 CRIAR CONFETE
function createConfetti(x, y) {
  const confettiCount = 30;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    
    // Cores variadas
    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D'];
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Posição aleatória
    confetti.style.left = (x + (Math.random() - 0.5) * 100) + 'px';
    confetti.style.top = y + 'px';
    
    // Tamanho aleátório
    const size = Math.random() * 8 + 5;
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';
    
    // Delay aleatório
    confetti.style.animationDelay = Math.random() * 0.2 + 's';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3200);
  }
}

// 📊 CONTADOR FLUTUANTE
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
  el.textContent = msg || '';
}

function refreshUI() {
  const count = cart.reduce((s, x) => s + x.qty, 0);
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-subtotal').textContent = 'R$ ' + fmt(getSubtotal('avista'));
  
  if (selectedFrete) {
    document.getElementById('cart-frete').textContent = 'R$ ' + fmt(selectedFrete.price);
  } else {
    document.getElementById('cart-frete').textContent = selectedCep ? 'Calculando...' : 'A calcular';
  }
  
  document.getElementById('cart-total').textContent = 'R$ ' + fmt(getTotalWithFrete('avista'));
  document.getElementById('checkout-btn').disabled = cart.length === 0;
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const list = activeFilter === 'todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.cat === activeFilter);

  if (!list.length) {
    grid.innerHTML =
      '<div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--brown-mid);font-family:Playfair Display,serif;font-size:1.1rem">Nenhum produto nesta categoria ainda.</div>';
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
    <div class="product-card" style="animation-delay:${i * 0.08}s">
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

      <div class="product-info">
        <p class="product-cat">${safeCat}</p>
        <h3 class="product-name">${safeName}</h3>
        ${safeMeasure ? `<p class="product-measure">Medida: ${safeMeasure}</p>` : ''}
        <p class="product-desc">${safeDesc}</p>

        <div class="product-footer">
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
                
                <button class="add-btn" data-product-id="${p.id}" style="position: relative;">
                  🛍️ Compre agora
                </button>
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
}

function openProductVideo(videoSrc, productName, poster = '') {
  const modal = document.getElementById('video-modal');
  const title = document.getElementById('video-modal-title');
  const player = document.getElementById('product-video-player');

  if (!videoSrc) return;

  title.textContent = `Vídeo: ${productName}`;
  player.src = videoSrc;

  if (poster) {
    player.setAttribute('poster', poster);
  } else {
    player.removeAttribute('poster');
  }

  modal.classList.add('open');
  player.load();
}

function closeProductVideo() {
  const modal = document.getElementById('video-modal');
  const player = document.getElementById('product-video-player');

  player.pause();
  player.removeAttribute('src');
  player.load();
  modal.classList.remove('open');
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
  if (!selectedFrete && !selectedCep) { showToast('Selecione uma opção de frete.'); return false; }
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
    const sku       = CATALOG[item.id]?.sku 
      ? ` | SKU: ${CATALOG[item.id].sku}` 
      : '';

    return `${index + 1}. ${item.name}${sku}
Qtd: ${item.qty}
Valor unitário: R$ ${fmt(unitPrice)}
Subtotal: R$ ${fmt(subtotal)}`;
  }).join('\n\n');

  let freteText = '';
  if (selectedFrete) {
    if (selectedFrete.name === 'Cidades vizinhas - Valores a combinar') {
      freteText = `🚚 *FRETE*: ${selectedFrete.name}`;
    } else {
      freteText = `🚚 *FRETE*: ${selectedFrete.name} - R$ ${fmt(selectedFrete.price)}`;
    }
  } else {
    freteText = `🚚 *FRETE*: A combinar`;
  }

  const totalComFrete = getTotalWithFrete(paymentMethod);

  return `Olá! Gostaria de finalizar este pedido:

🛍️ *PEDIDO*
${itemsText}

💳 *FORMA DE PAGAMENTO*: ${getPaymentMethodLabel(paymentMethod)}

${freteText}

💰 *TOTAL FINAL*: R$ ${fmt(totalComFrete)}

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
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function applyFrete(price, name) {
  selectedFrete = { price: Number(price), name: name };
  selectedCep = document.getElementById('cep-input').value;
  
  document.getElementById('frete-selected').style.display = 'block';
  document.getElementById('frete-selected-text').textContent =
    `${name}${name !== 'Cidades vizinhas - Valores a combinar' ? ' - R$ ' + fmt(price) : ''}`;

  const lista = document.getElementById('frete-options');
  lista.style.transition = "all 0.3s ease";
  lista.style.maxHeight = "0px";
  lista.style.opacity = "0";
  lista.style.overflow = "hidden";

  refreshUI();
  updateCheckoutSummary();
}

function trocarFrete() {
  const lista = document.getElementById('frete-options');
  const resumo = document.getElementById('frete-selected');

  lista.style.display = 'block';
  lista.style.opacity = '1';
  lista.style.maxHeight = '500px';
  lista.style.overflow = 'visible';

  resumo.style.display = 'none';
}

document.getElementById('calc-frete-btn').addEventListener('click', async () => {
  const cep = document.getElementById('cep-input').value.replace(/\D/g, '');
  const optionsDiv = document.getElementById('frete-options');

  if (cep.length !== 8) return showToast("Digite um CEP válido (8 dígitos)");
  
  optionsDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 6px; color: var(--rose-dark);"><span class="loading-spinner"></span> Calculando opções de frete...</div>';

  try {
    const response = await fetch("/api/frete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cep: cep, items: cart })
    });

    const fretes = await response.json();

    // 🔒 PROTEÇÃO: Se a resposta não for uma lista (array), exibe o erro e interrompe para não travar!
    if (!Array.isArray(fretes)) {
      optionsDiv.innerHTML = "Não foi possível calcular o frete para este CEP (Erro interno).";
      return;
    }

    const allFretes = [
      ...fretes,
      { company: 'Ateliê', name: 'Cidades vizinhas - Valores a combinar', price: 0, delivery_time: 0 }
    ];

    if (allFretes.length === 0) {
      optionsDiv.innerHTML = "Nenhuma opção de frete encontrada.";
      return;
    }

    optionsDiv.innerHTML = allFretes.map((f, i) => `
      <label style="display:block; margin-bottom:8px; cursor:pointer; padding:8px; border:1px solid rgba(169,120,125,.22); border-radius:8px; transition: all .2s; background: #fff;">
        <input type="radio" name="freteRadio" value="${f.price}" data-name="${f.company} ${f.name}" ${i === 0 ? 'checked' : ''} style="cursor: pointer; margin-right: 6px;">
        <strong style="color: var(--brown);">${f.company} - ${f.name}</strong><br>
        <span style="font-size:0.8rem; color:var(--brown-mid)">
          ${f.price > 0 ? `R$ ${f.price.toFixed(2).replace('.', ',')}` : 'Sob consulta'} ${f.delivery_time > 0 ? `| Prazo: ${f.delivery_time} dias úteis` : ''}
        </span>
      </label>
    `).join('');

    applyFrete(fretes[0]?.price || 0, `${fretes[0]?.company || 'Ateliê'} ${fretes[0]?.name || 'Cidades vizinhas - Valores a combinar'}`);

    document.querySelectorAll('input[name="freteRadio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        applyFrete(e.target.value, e.target.dataset.name);
      });
    });

  } catch (e) {
    console.error(e);
    optionsDiv.innerHTML = "Erro de conexão ao buscar frete.";
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
      videoBtn.dataset.videoPoster
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
  
  // 🎊 EFEITOS VISUAIS
  const rect = btn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;
  
  // Confete
  createConfetti(btnCenterX, btnCenterY);
  
  // Contador flutuante
  createFloatingCounter(btnCenterX - 15, btnCenterY - 30, existing ? 1 : 1);
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
  if (!selectedFrete && !selectedCep) {
    showToast('Selecione uma opção de frete antes de continuar.');
    return;
  }
  closeCart();
  setPaymentStatus('');
  
  document.getElementById('modal-cep-display').textContent = selectedCep || 'Não informado';
  if (selectedFrete) {
    if (selectedFrete.name === 'Cidades vizinhas - Valores a combinar') {
      document.getElementById('modal-frete-display').textContent = selectedFrete.name;
    } else {
      document.getElementById('modal-frete-display').textContent = `${selectedFrete.name} - R$ ${fmt(selectedFrete.price)}`;
    }
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

document.getElementById('btn-trocar-frete').addEventListener('click', trocarFrete);

renderProducts();
refreshUI();
