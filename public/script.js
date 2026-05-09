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
  return cart.reduce((sum, item) => sum + getUnitPriceByMethod(item.price, paymentMethod) * item.qty, 0);
}

function getTotalWithFrete(paymentMethod = 'avista') {
  const subtotal = getSubtotal(paymentMethod);
  const freteValue = selectedFrete ? selectedFrete.price : 0;
  return subtotal + freteValue;
}

let cart = [];
let activeFilter = 'todos';
let selectedFrete = null;
let selectedCep = sessionStorage.getItem('atelie_session_cep') || null;
let toastTimer = null;

try {
  const raw = JSON.parse(localStorage.getItem('atelie_cart') || '[]');
  cart = raw.filter(item => item && CATALOG[item.id] && !CATALOG[item.id].custom).map(item => ({
    id:    CATALOG[item.id].id,
    qty:   Math.max(1, Math.min(99, parseInt(item.qty, 10) || 1)),
    name:  CATALOG[item.id].name,
    price: CATALOG[item.id].price,
    image: CATALOG[item.id].image
  }));
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
  for (let i = 0; i < 30; i++) {
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

function setPaymentStatus(msg) {
  const el = document.getElementById('payment-status');
  if (el) el.textContent = msg || '';
}

function refreshUI() {
  const count = cart.reduce((s, x) => s + x.qty, 0);
  const badge = document.getElementById('cart-count');
  if(badge) badge.textContent = count;
  
  const subEl = document.getElementById('cart-subtotal');
  if(subEl) subEl.textContent = 'R$ ' + fmt(getSubtotal('avista'));
  
  const freteEl = document.getElementById('cart-frete');
  if(freteEl) {
    if (selectedFrete) freteEl.textContent = 'R$ ' + fmt(selectedFrete.price);
    else freteEl.textContent = selectedCep ? 'Calculando...' : 'A calcular';
  }
  
  const totalEl = document.getElementById('cart-total');
  if(totalEl) totalEl.textContent = 'R$ ' + fmt(getTotalWithFrete('avista'));
  
  const checkBtn = document.getElementById('checkout-btn');
  if(checkBtn) checkBtn.disabled = cart.length === 0;
}

function renderCartBody() {
  const body = document.getElementById('cart-body');
  if(!body) return;

  if (!cart.length) {
    body.innerHTML = '<div class="cart-empty"><span class="cart-empty-ico">🧺</span><p>Seu carrinho está vazio</p><p style="font-size:.78rem;margin-top:.4rem;opacity:.7">Adicione produtos para começar</p></div>';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="ci-icon">
        <img src="${escapeHtml(item.image || '')}" alt="${escapeHtml(item.name)}" class="ci-thumb">
      </div>
      <div class="ci-info">
        <p class="ci-name">${escapeHtml(item.name)}</p>
        <p class="ci-price">R$ ${fmt(item.price)} <span style="opacity:.7">(PIX)</span></p>
        <div class="ci-controls">
          <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
          <span class="qty-n">${item.qty}</span>
          <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="ci-del" data-action="del" data-id="${item.id}">🗑️</button>
    </div>`
  ).join('');
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
  refreshUI();
}

// ==========================================
// FUNÇÕES DE CHECKOUT & INTEGRAÇÃO WHATSAPP
// ==========================================
window.openCheckoutDirectly = function() {
  const cartSide = document.getElementById('cart-sidebar');
  if (cartSide) cartSide.classList.remove('open');
  
  const cartOverlayEl = document.getElementById('cart-overlay');
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
  } else {
    sendOrderToWhatsApp();
  }
};

function updateCheckoutSummary() {
  const paymentMethod = getPaymentMethod();
  const sumItems = document.getElementById('sum-items');
  
  if (sumItems) {
    sumItems.innerHTML = cart.map(x => {
      const unitPrice = getUnitPriceByMethod(x.price, paymentMethod);
      return `<div class="sum-row"><span>${escapeHtml(x.name)} × ${x.qty}</span><span>R$ ${fmt(unitPrice * x.qty)}</span></div>`;
    }).join('');
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
  if (!cart.length) { showToast('Seu carrinho está vazio.'); return false; }
  if (!selectedFrete && !selectedCep) { showToast('Selecione uma opção de frete.'); return false; }
  
  const form = document.getElementById('checkout-form');
  if (form) {
    const customer = getCustomerData();
    if (!customer.name) { showToast('Por favor, preencha o seu nome ou apelido.'); return false; }
    if (!customer.lgpd) { showToast('Você precisa concordar com o envio dos dados.'); return false; }
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

  let freteText = `🚚 *FRETE*: A combinar`;
  if (selectedFrete) {
    freteText = selectedFrete.name.includes('Cidades vizinhas') 
      ? `🚚 *FRETE*: A combinar / Retirada` 
      : `🚚 *FRETE*: ${selectedFrete.name} - R$ ${fmt(selectedFrete.price)}`;
  }

  const lblPay = paymentMethod === 'cartao' ? 'Cartão em até 6x sem juros' : 'PIX';

  return `Olá! Gostaria de finalizar este pedido:

🛍️ *PEDIDO*
${itemsText}

💳 *FORMA DE PAGAMENTO*: ${lblPay}

${freteText}

💰 *TOTAL FINAL*: R$ ${fmt(getTotalWithFrete(paymentMethod))}

👤 *DADOS DO CLIENTE*
Nome: ${customer.name || 'Não informado'}
Observações: ${customer.note || 'Nenhuma'}

_(O endereço de entrega e os dados de contato completos serão combinados por aqui na conversa)_`;
}

function sendOrderToWhatsApp() {
  if (!validateCheckout()) return;
  setPaymentStatus('Abrindo WhatsApp...');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`, '_blank', 'noopener,noreferrer');
}

function sendCustomOrderToWhatsApp(productId) {
  const p = PRODUCTS.find(x => x.id === productId && x.custom);
  if (!p) return;
  const msg = `Olá! Tenho interesse em uma peça personalizada.\n\n✨ *PEDIDO PERSONALIZADO*\nReferência: ${p.name}\nSKU: ${p.sku}\n\nQuero enviar minha inspiração, foto de referência, cores, medidas e demais detalhes para orçamento.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
}

// ==========================================
// CÁLCULO E APLICAÇÃO DE FRETE
// ==========================================
function applyFrete(price, name) {
  selectedFrete = { price: Number(price), name: name };
  
  const ppCepInput = document.getElementById('pp-cep-input');
  const cepInput = document.getElementById('cep-input');
  
  if (ppCepInput && ppCepInput.value) selectedCep = ppCepInput.value.replace(/\D/g, '');
  else if (cepInput && cepInput.value) selectedCep = cepInput.value.replace(/\D/g, '');
  
  const fs = document.getElementById('frete-selected');
  if (fs) fs.style.display = 'block';
  
  const fst = document.getElementById('frete-selected-text');
  if (fst) fst.textContent = `${name}${!name.includes('Cidades vizinhas') ? ' - R$ ' + fmt(price) : ''}`;

  const lista = document.getElementById('frete-options');
  if (lista) {
    lista.style.transition = "all 0.3s ease";
    lista.style.maxHeight = "0px";
    lista.style.opacity = "0";
    lista.style.overflow = "hidden";
  }

  refreshUI();
  updateCheckoutSummary();
}

function trocarFrete() {
  const lista = document.getElementById('frete-options');
  const resumo = document.getElementById('frete-selected');
  if(lista) {
    lista.style.display = 'block';
    lista.style.opacity = '1';
    lista.style.maxHeight = '500px';
    lista.style.overflow = 'visible';
  }
  if(resumo) resumo.style.display = 'none';
}

window.calculateProductFrete = async function() {
  const input = document.getElementById('pp-cep-input');
  if(!input) return;
  const cep = input.value.replace(/\D/g, '');
  const resultsDiv = document.getElementById('pp-frete-results');

  if (cep.length !== 8) return showToast("Digite um CEP válido");

  sessionStorage.setItem('atelie_session_cep', cep);
  selectedCep = cep;

  const cartCep = document.getElementById('cep-input');
  if (cartCep) cartCep.value = cep;

  resultsDiv.innerHTML = '<div style="margin-top:10px; color:var(--rose-dark); font-size:0.85rem;"><span class="loading-spinner"></span> Calculando...</div>';
  resultsDiv.style.display = 'block';

  try {
    const idProd = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
    const bodyItems = cart.length > 0 ? cart : [{ id: idProd, qty: 1 }];
    
    const response = await fetch("/api/frete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cep: cep, items: bodyItems })
    });

    const fretes = await response.json();
    if (!Array.isArray(fretes)) {
      resultsDiv.innerHTML = '<p style="color:red; font-size:0.8rem; margin-top:10px;">Erro ao calcular frete.</p>';
      return;
    }

    const allFretes = [...fretes, { company: 'Ateliê', name: 'Cidades vizinhas', price: 0, delivery_time: 0 }];

    resultsDiv.innerHTML = allFretes.map((f, i) => {
      const isChecked = (selectedFrete && selectedFrete.name === (f.company + ' ' + f.name)) || (!selectedFrete && i === 0) ? 'checked' : '';
      return `
      <label style="display:flex; justify-content:space-between; align-items:center; padding:12px 8px; border-bottom:1px solid rgba(216,182,185,.2); font-size:0.88rem; cursor:pointer;">
        <div style="display:flex; align-items:center; gap:10px;">
          <input type="radio" name="ppFreteRadio" value="${f.price}" data-name="${f.company} ${f.name}" style="accent-color: var(--rose-dark); transform: scale(1.1); cursor:pointer;" ${isChecked}>
          <div>
            <span style="color:var(--brown); display:block;"><strong>${f.company}</strong> ${f.name}</span>
            ${f.delivery_time ? `<span style="font-size:0.75rem; color:var(--brown-light); display:block; margin-top:3px;">Prazo: até <strong>${f.delivery_time} dias úteis</strong></span>` : ''}
          </div>
        </div>
        <span style="color:var(--rose-dark); font-weight:700;">${f.price > 0 ? 'R$ ' + fmt(f.price) : 'A combinar'}</span>
      </label>
    `}).join('') + `<p style="font-size:0.7rem; color:var(--brown-light); margin-top:8px;">* Prazos e valores são estimativas.</p>`;

    const checkedRadio = resultsDiv.querySelector('input[name="ppFreteRadio"]:checked');
    if (checkedRadio) applyFrete(checkedRadio.value, checkedRadio.dataset.name);

    resultsDiv.querySelectorAll('input[name="ppFreteRadio"]').forEach(radio => {
      radio.addEventListener('change', (e) => applyFrete(e.target.value, e.target.dataset.name));
    });

  } catch (e) {
    resultsDiv.innerHTML = '<p style="color:red; font-size:0.8rem;">Erro de conexão.</p>';
  }
};

// ==========================================
// RENDERS DAS PÁGINAS (HOME E PRODUTO)
// ==========================================
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if(!grid) return;
  grid.style.display = 'grid';
  
  const list = activeFilter === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeFilter);

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

    return `
    <div class="product-card" style="animation-delay:${i * 0.08}s; display: flex; flex-direction: column;">
      <a href="/produto.html?id=${p.id}" class="product-img" style="background:${safeColor}; text-decoration: none; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; height: 220px;">
        ${p.custom 
          ? `<div class="custom-visual"><div class="custom-visual-ico">✨</div><div class="custom-visual-title">Peça sob medida</div><div class="custom-visual-sub">Transforme sua ideia em uma criação exclusiva</div></div>`
          : `<img src="${safeImage}" class="product-image" alt="${safeName}">`
        }
        ${safeBadge ? `<span class="product-badge">${safeBadge}</span>` : ''}
      </a>

      <div class="product-info" style="display: flex; flex-direction: column; flex: 1;">
        <p class="product-cat">${safeCat}</p>
        <a href="/produto.html?id=${p.id}" style="text-decoration: none; color: inherit;">
          <h3 class="product-name">${safeName}</h3>
        </a>
        ${safeMeasure ? `<p class="product-measure">Medida: ${safeMeasure}</p>` : ''}
        <p class="product-desc">${safeDesc}</p>

        <div class="product-footer" style="flex-wrap: wrap; margin-top: auto; display: flex; gap: 1rem; justify-content: space-between;">
          ${p.custom
            ? `
              <div class="product-price">Sob encomenda<br><small>Consulte valor e prazo</small></div>
              <button class="custom-btn" data-custom-id="${p.id}">${escapeHtml(p.buttonText || 'Solicitar')}</button>
            `
            : `
              <div class="price-focus-box" style="flex: 1; min-width: 100%;">
                <div class="price-main-line">
                  <span class="price-main">R$ ${fmt(p.price)}</span>
                  <span class="pix-chip">NO PIX</span>
                </div>
                <div class="price-economy-badge">💰 Economize R$ ${fmt(getCashSavings(p.price))}</div>
                <div style="margin-top:.6rem">
                  <div style="font-size:1.25rem;font-weight:700;color:#1c4f1f;display:flex;align-items:center;gap:.4rem;">
                    💳ou R$ ${fmt(getCardPrice(p.price))} em 6x de R$ ${fmt(getInstallment(p.price))}
                  </div>
                  <div style="font-size:.75rem;color:var(--brown-mid);margin-top:.2rem;">
                    sem juros no cartão
                  </div>
                </div>
              </div>
            `
          }
        </div>
      </div>
    </div>`;
  }).join('');
}

window.switchMedia = function(type, src, element) {
  const img = document.getElementById('zoom-img');
  const video = document.getElementById('viewer-video');
  const container = document.getElementById('zoom-container');
  
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
    container.innerHTML = '<div style="text-align:center; padding: 4rem;"><h2>Produto não encontrado</h2><br><a href="/" class="btn-pri">Voltar para a loja</a></div>';
    return;
  }

  const safeName = escapeHtml(p.name);
  const safeDesc = escapeHtml(p.desc);
  const safeMeasure = escapeHtml(p.measure || '');
  const safeCat = escapeHtml(CAT_LABELS[p.cat] || p.cat);
  const safeColor = escapeHtml(p.color);
  const safeImage = escapeHtml(p.image || '');
  
  document.title = `${p.name} — Ateliê Priscila Lima`;

  const mediaHtml = `
    <div class="pp-media-gallery">
      <div class="pp-main-viewer" id="zoom-container" style="background:${safeColor}">
        ${p.custom ? `<div class="custom-visual-ico" style="font-size: 6rem;">✨</div>` : `
          <img src="${safeImage}" id="zoom-img" alt="${safeName}">
          <video id="viewer-video" controls playsinline style="display:none; width:100%; height:100%; background:#000;"></video>
        `}
      </div>
      ${!p.custom ? `
      <div class="pp-thumbnails">
        <div class="pp-thumb active" data-type="image" data-src="${safeImage}" style="background:${safeColor}">
          <img src="${safeImage}" alt="Foto Principal">
        </div>
        ${p.video ? `
        <div class="pp-thumb" data-type="video" data-src="${escapeHtml(p.video)}" style="position:relative; background:#000;">
          <span style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:white; font-size:1.2rem; pointer-events:none;">▶</span>
          <video src="${escapeHtml(p.video)}" style="opacity:0.7"></video>
        </div>
        ` : ''}
      </div>
      ` : ''}
    </div>
  `;

  let buyBoxHtml = `
    <div class="pp-buy-box">
      <div class="pp-breadcrumb"><a href="/">Início</a> / <a href="/#produtos">${safeCat}</a></div>
      <h1 class="pp-title">${safeName}</h1>
      ${p.badge ? `<span class="product-badge" style="position:relative; margin-bottom:1rem; display:inline-block;">${escapeHtml(p.badge)}</span>` : ''}
  `;

  if (p.custom) {
    buyBoxHtml += `
      <div class="product-price" style="margin-top:1rem;">Sob encomenda</div>
      <button class="pp-btn-comprar custom-btn" data-custom-id="${p.id}" style="margin-top:1.5rem;">Solicitar Orçamento no WhatsApp</button>
    `;
  } else {
    buyBoxHtml += `
      <div class="price-focus-box" style="margin-top:1.5rem;">
        <div style="font-size:0.9rem; color:var(--brown-light); text-decoration:line-through;">R$ ${fmt(getCardPrice(p.price))}</div>
        <div class="price-main-line">
          <span class="price-main" style="font-size:2.2rem;">R$ ${fmt(p.price)}</span>
          <span style="font-size:0.9rem; color:var(--rose-dark); font-weight:700; margin-left:8px;">no PIX</span>
        </div>
        <div style="font-size:1rem; color:#2e7d32; margin-top:0.5rem;">ou R$ ${fmt(getCardPrice(p.price))} em 6x de R$ ${fmt(getInstallment(p.price))} sem juros</div>
      </div>
      
      <div class="pp-frete-box">
        <p style="margin:0 0 8px 0; font-weight:600; color:var(--brown); font-size:0.9rem;">🚚 Calcular frete e prazo</p>
        <div style="display:flex; gap:8px;">
          <input type="text" id="pp-cep-input" placeholder="00000-000" maxlength="9" value="${selectedCep || ''}" style="flex:1; padding:10px; border-radius:8px; border:1px solid rgba(169,120,125,.3);">
          <button id="pp-calc-frete-btn" style="background:var(--brown); color:white; border:none; padding:0 12px; border-radius:8px; cursor:pointer; font-weight:600;">Calcular</button>
        </div>
        <div id="pp-frete-results" style="margin-top:12px; display:${selectedCep ? 'block' : 'none'};"></div>
      </div>

      <div class="pp-actions">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.8rem; margin-top: 0.5rem;">
          <span style="font-size: 0.95rem; color: var(--brown); font-weight: 600;">Quantidade:</span>
          <div style="display: flex; border: 1px solid rgba(169,120,125,.4); border-radius: 8px; overflow: hidden; background: #fff; width: fit-content;">
            <button id="pp-btn-minus" style="padding: 6px 14px; background: rgba(216,182,185,.1); border: none; cursor: pointer; font-size: 1.2rem; color: var(--brown); transition: background 0.2s;">-</button>
            <input type="number" id="pp-qty" value="1" min="1" max="99" style="width: 45px; text-align: center; border: none; font-size: 1rem; color: var(--brown); outline: none; pointer-events: none; font-weight: 600;">
            <button id="pp-btn-plus" style="padding: 6px 14px; background: rgba(216,182,185,.1); border: none; cursor: pointer; font-size: 1.2rem; color: var(--brown); transition: background 0.2s;">+</button>
          </div>
        </div>

        <button class="pp-btn-sacola add-btn" data-product-id="${p.id}">🛍️ Adicionar à sacola</button>
        <button class="pp-btn-comprar quick-buy-btn" data-product-id="${p.id}">💳 Comprar agora</button>
      </div>
    `;
  }
  buyBoxHtml += `</div>`;

  container.innerHTML = `
    <div class="pp-top-section">${mediaHtml}${buyBoxHtml}</div>
    <div class="pp-bottom-section">
      <h2 class="pp-bottom-title">Descrição e ficha técnica</h2>
      <div style="font-size:0.85rem; color:var(--brown-light); margin-bottom:1rem;">SKU: ${p.sku || 'SKU-'+p.id}</div>
      <div class="pp-desc-content">
        <p>${safeDesc}</p>
        ${safeMeasure ? `<p style="margin-top:1rem;"><strong>📏 Medidas:</strong> ${safeMeasure}</p>` : ''}
        <p style="margin-top:0.5rem;"><strong>🧶 Material:</strong> Fios de alta qualidade, 100% artesanal.</p>
      </div>
    </div>
  `;

  if (selectedCep) window.calculateProductFrete();

  // Lógica do Zoom
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
// EVENT LISTENERS GLOBAIS
// ==========================================
document.body.addEventListener('click', (e) => {
  // Lógica dos botões de Quantidade
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

  // Pega o valor da quantidade na página (ou 1 por padrão)
  const qtyInputEl = document.getElementById('pp-qty');
  const selectedQty = qtyInputEl ? parseInt(qtyInputEl.value, 10) : 1;

  // Botão "Comprar Agora" (Direto para o Checkout)
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

  // Troca de Mídia (Miniaturas)
  const thumb = e.target.closest('.pp-thumb');
  if (thumb) {
    window.switchMedia(thumb.dataset.type, thumb.dataset.src, thumb);
    return;
  }

  // Calcular Frete (Página de Produto)
  if (e.target.closest('#pp-calc-frete-btn')) {
    window.calculateProductFrete();
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
    const p  = PRODUCTS.find(x => x.id === id);
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

  // Lógica do Carrinho Lateral (Deletar, Somar, Subtrair)
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
        item.qty  = Math.min(99, Math.max(0, item.qty));
        if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
      }
    }
    saveCart();
    refreshUI();
    renderCartBody();
  }
});

// Listener extra para botão de frete na barra lateral (Home)
document.addEventListener('click', async (e) => {
  if (e.target.id === 'calc-frete-btn') {
    const cep = document.getElementById('cep-input').value.replace(/\D/g, '');
    const optionsDiv = document.getElementById('frete-options');

    if (cep.length !== 8) return showToast("Digite um CEP válido");
    
    optionsDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 6px; color: var(--rose-dark);"><span class="loading-spinner"></span> Calculando...</div>';

    try {
      const response = await fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep: cep, items: cart })
      });

      const fretes = await response.json();
      if (!Array.isArray(fretes)) {
        optionsDiv.innerHTML = "Erro interno ao calcular frete.";
        return;
      }

      const allFretes = [...fretes, { company: 'Ateliê', name: 'Cidades vizinhas - Valores a combinar', price: 0, delivery_time: 0 }];

      optionsDiv.innerHTML = allFretes.map((f, i) => `
        <label style="display:block; margin-bottom:8px; cursor:pointer; padding:8px; border:1px solid rgba(169,120,125,.22); border-radius:8px; background: #fff;">
          <input type="radio" name="freteRadio" value="${f.price}" data-name="${f.company} ${f.name}" ${i === 0 ? 'checked' : ''} style="cursor: pointer; margin-right: 6px;">
          <strong style="color: var(--brown);">${f.company} - ${f.name}</strong><br>
          <span style="font-size:0.8rem; color:var(--brown-mid)">
            ${f.price > 0 ? `R$ ${f.price.toFixed(2).replace('.', ',')}` : 'Sob consulta'} ${f.delivery_time > 0 ? `| Prazo: ${f.delivery_time} dias` : ''}
          </span>
        </label>
      `).join('');

      applyFrete(fretes[0]?.price || 0, `${fretes[0]?.company || 'Ateliê'} ${fretes[0]?.name || 'Cidades vizinhas - Valores a combinar'}`);

      document.querySelectorAll('input[name="freteRadio"]').forEach(radio => {
        radio.addEventListener('change', (ev) => applyFrete(ev.target.value, ev.target.dataset.name));
      });
    } catch (err) {
      optionsDiv.innerHTML = "Erro de conexão.";
    }
  }
});

// Listeners simples de botões
const addEvent = (id, event, handler) => { const el = document.getElementById(id); if (el) el.addEventListener(event, handler); };

addEvent('cart-toggle-btn', 'click', openCart);
addEvent('cart-close-btn', 'click', closeCart);
addEvent('cart-overlay', 'click', closeCart);
addEvent('checkout-btn', 'click', () => {
  const checkModal = document.getElementById('checkout-modal');
  if (checkModal) window.openCheckoutDirectly();
});
addEvent('checkout-close-btn', 'click', () => document.getElementById('checkout-modal').classList.remove('open'));
addEvent('checkout-modal', 'click', function(e) { if (e.target === this) this.classList.remove('open'); });
addEvent('payment-method', 'change', updateCheckoutSummary);
addEvent('whatsapp-checkout-btn', 'click', sendOrderToWhatsApp);
addEvent('btn-trocar-frete', 'click', trocarFrete);

// ==========================================
// INICIALIZAÇÃO
// ==========================================
if (document.getElementById('products-grid')) renderProducts();
renderSingleProduct(); 
refreshUI();
