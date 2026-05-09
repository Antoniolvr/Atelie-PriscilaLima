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
let selectedCep = sessionStorage.getItem('atelie_session_cep') ||null;
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
    
    // Tamanho aleatório
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
  if (el) el.textContent = msg || '';
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
  
  // Trava de segurança para garantir que a grade está ativa
  grid.style.display = 'grid';
  
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
    <div class="product-card" style="animation-delay:${i * 0.08}s; display: flex; flex-direction: column;">
      <a href="/produto.html?id=${p.id}" class="product-img" style="background:${safeColor}; text-decoration: none; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; height: 220px;">
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
      </a>

      <div class="product-info" style="display: flex; flex-direction: column; flex: 1;">
        <p class="product-cat">${safeCat}</p>
        <a href="/produto.html?id=${p.id}" style="text-decoration: none; color: inherit;">
          <h3 class="product-name">${safeName}</h3>
        </a>
        ${safeMeasure ? `<p class="product-measure">Medida: ${safeMeasure}</p>` : ''}
        <p class="product-desc">${safeDesc}</p>

        <div class="product-footer" style="flex-wrap: wrap; margin-top: auto; display: flex; gap: 1rem; justify-content: space-between;">
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
                <div class="price-focus-box" style="flex: 1; min-width: 100%;">
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
                
                <div class="product-actions" style="display: flex; gap: 0.55rem; flex-wrap: wrap; align-items: center; justify-content: flex-start; width: 100%; margin-top: 0.5rem;">
                  ${p.video ? `
                    <button class="video-btn" 
                            data-video-src="${escapeHtml(p.video)}" 
                            data-video-name="${safeName}">
                      🎥 Vídeo
                    </button>
                  ` : ''}
    
<button class="quick-buy-btn pp-btn-comprar" data-product-id="${p.id}" style="position: relative; flex: 1;">
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

  selectedCep = null;
  selectedFrete = null;

  document.getElementById('frete-selected').style.display = 'none';
  
  const lista = document.getElementById('frete-options');
  lista.innerHTML = '';
  lista.style.maxHeight = '500px';
  lista.style.opacity = '1';
  lista.style.overflow = 'visible';
  lista.style.display = 'block';

  refreshUI();
}

function closeProductVideo() {
  const modal = document.getElementById('video-modal');
  const player = document.getElementById('product-video-player');

  player.pause();
  player.removeAttribute('src');
  player.load();
  modal.classList.remove('open');
}

function openProductVideo(src, name, poster) {
  const modal = document.getElementById('video-modal');
  const player = document.getElementById('product-video-player');

  if (src) {
    player.src = src;
  }

  if (poster && poster !== 'undefined') {
    player.poster = poster;
  } else {
    player.removeAttribute('poster');
  }

  modal.classList.add('open');

  player.play().catch(error => {
    console.log("O autoplay foi bloqueado pelo navegador, o usuário precisa dar play manualmente.", error);
  });
}

function updateCheckoutSummary() {
  const paymentMethod = getPaymentMethod();

  const sumItems = document.getElementById('sum-items');
  if (sumItems) {
    sumItems.innerHTML = cart.map(x => {
      const unitPrice = getUnitPriceByMethod(x.price, paymentMethod);
      const subtotal  = unitPrice * x.qty;
      const safeName  = escapeHtml(x.name);
      return `<div class="sum-row"><span>${safeName} × ${x.qty}</span><span>R$ ${fmt(subtotal)}</span></div>`;
    }).join('');
  }

  const sumTotalVal = document.getElementById('sum-total-val');
  if (sumTotalVal) {
    sumTotalVal.textContent = 'R$ ' + fmt(getTotalWithFrete(paymentMethod));
  }
}

function getCustomerData() {
  const form = document.getElementById('checkout-form');
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
  
  const customer = getCustomerData();
  
  if (!customer.name) {
    showToast('Por favor, preencha o seu nome ou apelido.');
    return false;
  }
  
  if (!customer.lgpd) {
    showToast('Você precisa concordar com o envio dos dados (Caixa de seleção).');
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
Observações: ${customer.note || 'Nenhuma'}

_(O endereço de entrega e os dados de contato completos serão combinados por aqui na conversa)_`;
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
  
  const ppCepInput = document.getElementById('pp-cep-input');
  const cepInput = document.getElementById('cep-input');
  
  if (ppCepInput && ppCepInput.value) {
    selectedCep = ppCepInput.value.replace(/\D/g, '');
  } else if (cepInput && cepInput.value) {
    selectedCep = cepInput.value.replace(/\D/g, '');
  }
  
  const fs = document.getElementById('frete-selected');
  if (fs) fs.style.display = 'block';
  
  const fst = document.getElementById('frete-selected-text');
  if (fst) fst.textContent = `${name}${name !== 'Cidades vizinhas - Valores a combinar' ? ' - R$ ' + fmt(price) : ''}`;

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

  lista.style.display = 'block';
  lista.style.opacity = '1';
  lista.style.maxHeight = '500px';
  lista.style.overflow = 'visible';

  resumo.style.display = 'none';
}

// ==========================================
// FUNÇÕES AUXILIARES DA PÁGINA DO PRODUTO
// ==========================================
window.switchMedia = function(type, src, element) {
  const img = document.getElementById('zoom-img');
  const video = document.getElementById('viewer-video');
  const container = document.getElementById('zoom-container');
  
  // Atualiza qual miniatura está selecionada
  document.querySelectorAll('.pp-thumb').forEach(t => t.classList.remove('active'));
  if(element) element.classList.add('active');

  if (type === 'image') {
    video.style.display = 'none';
    video.pause();
    img.style.display = 'block';
    img.src = src;
    container.style.cursor = 'zoom-in'; // Volta a permitir zoom
  } else if (type === 'video') {
    img.style.display = 'none';
    video.style.display = 'block';
    video.src = src;
    video.play().catch(e => console.log(e));
    container.style.cursor = 'default'; // Desativa zoom no vídeo
  }
};

window.comprarAgoraRapido = function(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(x => x.id === id);
  if (existing) {
    existing.qty = Math.min(99, existing.qty + 1);
  } else {
    cart.push({ id: p.id, qty: 1, name: p.name, price: p.price, image: p.image });
  }
  saveCart();
  refreshUI();
  renderCartBody();
  openCart(); // Abre o carrinho na lateral pronto para finalizar
};

// ==========================================
// FUNÇÕES AUXILIARES DA PÁGINA DO PRODUTO
// ==========================================

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

// Nova função para calcular frete diretamente na página do produto COM SELEÇÃO
window.calculateProductFrete = async function() {
  const input = document.getElementById('pp-cep-input');
  const cep = input.value.replace(/\D/g, '');
  const resultsDiv = document.getElementById('pp-frete-results');

  if (cep.length !== 8) {
    showToast("Digite um CEP válido");
    return;
  }

  // Salva na sessão para não pedir novamente
  sessionStorage.setItem('atelie_session_cep', cep);
  selectedCep = cep;

  // Sincroniza o CEP do carrinho invisível
  const cartCep = document.getElementById('cep-input');
  if (cartCep) cartCep.value = cep;

  resultsDiv.innerHTML = '<div style="margin-top:10px; color:var(--rose-dark); font-size:0.85rem;"><span class="loading-spinner"></span> Calculando...</div>';
  resultsDiv.style.display = 'block';

  try {
    const response = await fetch("/api/frete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cep: cep, items: cart.length > 0 ? cart : [{ id: parseInt(new URLSearchParams(window.location.search).get('id')), qty: 1 }] })
    });

    const fretes = await response.json();
    
    if (!Array.isArray(fretes)) {
      resultsDiv.innerHTML = '<p style="color:red; font-size:0.8rem; margin-top:10px;">Erro ao calcular frete.</p>';
      return;
    }

    const allFretes = [
      ...fretes,
      { company: 'Ateliê', name: 'Cidades vizinhas', price: 0, delivery_time: 0 }
    ];

    // 🟢 AQUI ESTÁ A MÁGICA: Adicionando os botões Radio (Bolinhas de seleção)
    resultsDiv.innerHTML = allFretes.map((f, i) => {
      // Marca o primeiro por padrão, ou o que já estava selecionado antes
      const isChecked = (selectedFrete && selectedFrete.name === (f.company + ' ' + f.name)) || (!selectedFrete && i === 0) ? 'checked' : '';
      
      return `
      <label style="display:flex; justify-content:space-between; align-items:center; padding:10px 8px; border-bottom:1px solid rgba(216,182,185,.2); font-size:0.88rem; cursor:pointer;">
        <div style="display:flex; align-items:center; gap:8px;">
          <input type="radio" name="ppFreteRadio" value="${f.price}" data-name="${f.company} ${f.name}" style="accent-color: var(--rose-dark); transform: scale(1.1); cursor:pointer;" ${isChecked}>
          <span style="color:var(--brown);"><strong>${f.company}</strong> ${f.name}</span>
        </div>
        <span style="color:var(--rose-dark); font-weight:700;">${f.price > 0 ? 'R$ ' + fmt(f.price) : 'A combinar'}</span>
      </label>
    `}).join('') + `<p style="font-size:0.7rem; color:var(--brown-light); margin-top:8px;">* Prazos e valores são estimativas.</p>`;

    // Aplica automaticamente o frete que veio marcado como 'checked'
    const checkedRadio = resultsDiv.querySelector('input[name="ppFreteRadio"]:checked');
    if (checkedRadio) {
       applyFrete(checkedRadio.value, checkedRadio.dataset.name);
    }

    // Quando o cliente clicar em outra bolinha, atualiza o frete no sistema
    resultsDiv.querySelectorAll('input[name="ppFreteRadio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        applyFrete(e.target.value, e.target.dataset.name);
      });
    });

  } catch (e) {
    resultsDiv.innerHTML = '<p style="color:red; font-size:0.8rem;">Erro de conexão.</p>';
  }
};

window.comprarAgoraRapido = function(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(x => x.id === id);
  if (existing) {
    existing.qty = Math.min(99, existing.qty + 1);
  } else {
    cart.push({ id: p.id, qty: 1, name: p.name, price: p.price, image: p.image });
  }
  saveCart();
  refreshUI();
  renderCartBody();
  openCart();

  // MUDANÇA AQUI: Em vez de openCart(), chamamos o checkout direto
  window.openCheckoutDirectly();
};

window.openCheckoutDirectly = function() {
  // 1. Fecha o carrinho e o overlay se estiverem abertos
  const cartSide = document.getElementById('cart-sidebar');
  if (cartSide) cartSide.classList.remove('open');
  
  const cartOverlayEl = document.getElementById('cart-overlay');
  if (cartOverlayEl) cartOverlayEl.classList.remove('open');

  // 2. Validação amigável: Se não tem frete, precisamos que o cliente calcule
  // para que o valor total no modal esteja correto.
  if (!selectedFrete && !selectedCep) {
    openCart(); // Abre o carrinho para ele ver o campo de CEP
    showToast('Por favor, informe seu CEP para calcular o total.');
    return;
  }

  // 3. Tenta abrir o modal de checkout
  const checkModal = document.getElementById('checkout-modal');
  if (checkModal) {
    checkModal.classList.add('open');
    updateCheckoutSummary();
    
    // Atualiza os textos de CEP e Frete dentro do modal
    const cepDisplay = document.getElementById('modal-cep-display');
    if (cepDisplay) cepDisplay.textContent = selectedCep || 'Não informado';
    
    const freteDisplay = document.getElementById('modal-frete-display');
    if (freteDisplay && selectedFrete) {
      freteDisplay.textContent = selectedFrete.name.includes('Cidades vizinhas') 
        ? 'A combinar / Retirada' 
        : `${selectedFrete.name} - R$ ${fmt(selectedFrete.price)}`;
    }
  } else {
    // Caso o modal não exista na página (fallback), envia direto pro WhatsApp
    sendOrderToWhatsApp();
  }
};

// ==========================================
// FUNÇÃO DA PÁGINA ÚNICA DE PRODUTO
// ==========================================
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
  <span style="position:absolute; ...">▶</span>
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
        <div style="font-size:1rem; color:#2e7d32; margin-top:0.5rem;">6x de R$ ${fmt(getInstallment(p.price))} sem juros</div>
      </div>
      
      <div class="pp-frete-box">
        <p style="margin:0 0 8px 0; font-weight:600; color:var(--brown); font-size:0.9rem;">🚚 Calcular frete e prazo</p>
        <div style="display:flex; gap:8px;">
          <input type="text" id="pp-cep-input" placeholder="00000-000" maxlength="9" value="${selectedCep || ''}" style="flex:1; padding:10px; border-radius:8px; border:1px solid rgba(169,120,125,.3);">
          <button id= "pp-calc-frete-btn" style="background:var(--brown); color:white; border:none; padding:0 12px; border-radius:8px; cursor:pointer; font-weight:600;">Calcular</button>
        </div>
        <div id="pp-frete-results" style="margin-top:12px; display:${selectedCep ? 'block' : 'none'};"></div>
      </div>

      <div class="pp-actions">
        <button class="pp-btn-sacola add-btn" data-product-id="${p.id}">🛍️ Adicionar à sacola</button>
        <button class="quick-buy-btn pp-btn-comprar" data-product-id="${p.id}"> 💳 Comprar agora </button>
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

  // Se já houver CEP na sessão, calcula automaticamente ao abrir o produto
  if (selectedCep) {
    window.calculateProductFrete();
  }

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
// EVENT LISTENERS GLOBAIS

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

const filterTabs = document.getElementById('filter-tabs');
if (filterTabs) {
  filterTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProducts();
  });
}

// Listener Global para adicionar produtos e interações (funciona na Home e na página individual)
// ==========================================
// LISTENER GLOBAL (Resolve CSP e Lógica de Compra)
// ==========================================
document.body.addEventListener('click', (e) => {
  // 1. Botão "Comprar Agora" (Direto para o Checkout)
  const quickBtn = e.target.closest('.quick-buy-btn');
  if (quickBtn) {
    const id = parseInt(quickBtn.dataset.product-id, 10);
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;

    // Apenas adiciona se não estiver no carrinho (não aumenta a qtd)
    const existing = cart.find(x => x.id === id);
    if (!existing) {
      cart.push({ id: p.id, qty: 1, name: p.name, price: p.price, image: p.image });
      saveCart();
      refreshUI();
      renderCartBody();
    }
    
    // Abre o checkout direto sem animações de "adicionado"
    window.openCheckoutDirectly();
    return;
  }

  // 2. Troca de Mídia (Miniaturas)
  const thumb = e.target.closest('.pp-thumb');
  if (thumb) {
    window.switchMedia(thumb.dataset.type, thumb.dataset.src, thumb);
    return;
  }

  // 3. Calcular Frete na página do produto
  if (e.target.id === 'pp-calc-frete-btn') {
    window.calculateProductFrete();
    return;
  }

  // 4. Botão Personalizado
  const customBtn = e.target.closest('.custom-btn');
  if (customBtn) {
    sendCustomOrderToWhatsApp(parseInt(customBtn.dataset.customId, 10));
    return;
  }

  // 5. Botão Adicionar à Sacola (Com animação e confete)
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
  
  const rect = btn.getBoundingClientRect();
  createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
  
  if(document.getElementById('single-product-container')) {
     openCart();
  }
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

// ==========================================
// EVENT LISTENERS SEGUROS (Evitam o erro "Cannot read properties of null")
// ==========================================

const cartToggle = document.getElementById('cart-toggle-btn');
if (cartToggle) cartToggle.addEventListener('click', openCart);

const cartClose = document.getElementById('cart-close-btn');
if (cartClose) cartClose.addEventListener('click', closeCart);

const cartOverlayEl = document.getElementById('cart-overlay');
if (cartOverlayEl) cartOverlayEl.addEventListener('click', closeCart);

const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (!cart.length) return;
    if (!selectedFrete && !selectedCep) {
      showToast('Selecione uma opção de frete antes de continuar.');
      return;
    }
    
    const cartSide = document.getElementById('cart-sidebar');
    if (cartSide) cartSide.classList.remove('open');
    
    if (cartOverlayEl) cartOverlayEl.classList.remove('open');
    
    setPaymentStatus('');
    
    const cepDisplay = document.getElementById('modal-cep-display');
    if (cepDisplay) cepDisplay.textContent = selectedCep || 'Não informado';
    
    const freteDisplay = document.getElementById('modal-frete-display');
    if (freteDisplay && selectedFrete) {
      if (selectedFrete.name === 'Cidades vizinhas - Valores a combinar') {
        freteDisplay.textContent = selectedFrete.name;
      } else {
        freteDisplay.textContent = `${selectedFrete.name} - R$ ${fmt(selectedFrete.price)}`;
      }
    }
    
    const checkModal = document.getElementById('checkout-modal');
    if (checkModal) checkModal.classList.add('open');
    
    updateCheckoutSummary();
  });
}

const checkoutCloseBtn = document.getElementById('checkout-close-btn');
if (checkoutCloseBtn) {
  checkoutCloseBtn.addEventListener('click', () => {
    const checkModal = document.getElementById('checkout-modal');
    if (checkModal) checkModal.classList.remove('open');
  });
}

const checkModalBg = document.getElementById('checkout-modal');
if (checkModalBg) {
  checkModalBg.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });
}

const videoClose = document.getElementById('video-close-btn');
if (videoClose) videoClose.addEventListener('click', closeProductVideo);

const videoModalBg = document.getElementById('video-modal');
if (videoModalBg) {
  videoModalBg.addEventListener('click', function(e) {
    if (e.target === this) closeProductVideo();
  });
}

const payMethod = document.getElementById('payment-method');
if (payMethod) payMethod.addEventListener('change', updateCheckoutSummary);

const zapBtn = document.getElementById('whatsapp-checkout-btn');
if (zapBtn) zapBtn.addEventListener('click', sendOrderToWhatsApp);

const btnTrocarFreteEx = document.getElementById('btn-trocar-frete');
if (btnTrocarFreteEx) {
  btnTrocarFreteEx.addEventListener('click', trocarFrete);
}

// ==========================================
// INICIALIZAÇÃO DEPENDENDO DA TELA
// ==========================================
const grid = document.getElementById('products-grid');
if (grid) {
  renderProducts(); 
}

renderSingleProduct(); 
refreshUI();
