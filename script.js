const defaultProducts = [
  { name: "Kanjivaram Silk", price: 3200, originalPrice: 4800, image: "saree_kanjivaram.png", type: "Silk", origin: "Tamil Nadu", craft: "Pure Mulberry Silk with Zari Borders", desc: "A classic Kanjivaram silk saree woven by hand. Characterized by wide contrast borders, rich gold brocade patterns, and vibrant wedding-ready hues.", color: "Red", rating: 4.8 },
  { name: "Banarasi Weave", price: 2800, originalPrice: 4200, image: "saree_banarasi.png", type: "Brocade", origin: "Uttar Pradesh", craft: "Handwoven Brocade Silk", desc: "Finely woven Banarasi silk featuring dense floral creepers, silver brocade work, and visual weight. Ideal for formal ethnic celebrations.", color: "Pink", rating: 4.6 },
  { name: "Chanderi Charm", price: 2000, originalPrice: 3000, image: "saree_chanderi.png", type: "Lightweight", origin: "Madhya Pradesh", craft: "Silk Cotton Blend", desc: "Lightweight and sheer, this Chanderi saree boasts intricate silver motifs, delicate borders, and a sophisticated finish.", color: "Cream", rating: 4.3 },
  { name: "Tussar Elegance", price: 1800, originalPrice: 2600, image: "saree_kanjivaram.png", type: "Organic", origin: "Jharkhand", craft: "Handspun Tussar Silk", desc: "Crafted from wild Tussar silk fibers, showcasing a natural copper-gold sheen and textured, organic hand-feel.", color: "Gold", rating: 4.4 },
  { name: "Paithani Classic", price: 3500, originalPrice: 5000, image: "saree_banarasi.png", type: "Silk", origin: "Maharashtra", craft: "Oblique Weft Silk", desc: "A royal Paithani silk saree featuring a signature square-designed border and a pallu decorated with detailed peacock shapes.", color: "Blue", rating: 4.7 },
  { name: "Muga Marvel", price: 4000, originalPrice: 5800, image: "saree_chanderi.png", type: "Rare", origin: "Assam", craft: "Rare Golden Muga Silk", desc: "Woven with naturally golden Assamese Muga silk thread, valued for its luster, longevity, and heritage value.", color: "Gold", rating: 4.9 },
  { name: "Kota Doria", price: 1500, originalPrice: 2200, image: "saree_chanderi.png", type: "Lightweight", origin: "Rajasthan", craft: "Checked Cotton Silk", desc: "An airy, checked light saree from Kota, Rajasthan. Delicately handwoven for hot climates, styled with gold thread borders.", color: "Green", rating: 4.1 },
  { name: "Gadwal Grace", price: 3300, originalPrice: 4800, image: "saree_kanjivaram.png", type: "Brocade", origin: "Telangana", craft: "Cotton Body with Silk Border", desc: "An architectural wonder combining a light, breathable cotton body with solid, heavy silk borders and pallu segments.", color: "Yellow", rating: 4.5 },
  { name: "Ikat Fusion", price: 2100, originalPrice: 3000, image: "saree_banarasi.png", type: "Organic", origin: "Odisha / Telangana", craft: "Tie-and-Dye Ikat Weave", desc: "Features geometrically precise warp-and-weft tie-dye threads, handwoven into sharp zigzags and classical motifs.", color: "Black", rating: 4.2 }
];

let products = JSON.parse(localStorage.getItem('products'));
if (products && products.length && (products[0].price < 1000 || !products[0].hasOwnProperty('color') || !products[0].hasOwnProperty('rating'))) {
  localStorage.removeItem('products');
  products = null;
}
if (!products || !products.length) {
  products = defaultProducts;
  localStorage.setItem('products', JSON.stringify(products));
}
window.products = products;

// LocalStorage Helpers
function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch (e) { return []; }
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch (e) { return []; }
}
function saveWishlist(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Global Badge & UI Sync
function updateCounts() {
  const cart = getCart();
  const wishlist = getWishlist();
  
  const cartTotalQty = cart.reduce((s, i) => s + (i.qty || 1), 0);
  
  const cartCountBadge = document.getElementById('cart-count');
  if (cartCountBadge) cartCountBadge.textContent = cartTotalQty;

  const wishlistCountBadge = document.getElementById('wishlist-count');
  if (wishlistCountBadge) wishlistCountBadge.textContent = wishlist.length;

  // Sync secondary or mobile badge elements if present
  const mobileCartCount = document.getElementById('mobile-cart-count');
  if (mobileCartCount) mobileCartCount.textContent = cartTotalQty;

  const mobileWishlistCount = document.getElementById('mobile-wishlist-count');
  if (mobileWishlistCount) mobileWishlistCount.textContent = wishlist.length;
}

function checkLoginState() {
  const user = localStorage.getItem('userSession');
  const accountLink = document.getElementById('account-link');
  if (accountLink) {
    if (user) {
      accountLink.href = "account.html";
      accountLink.title = "My Account";
    } else {
      accountLink.href = "login.html";
      accountLink.title = "Login / Sign Up";
    }
  }
}

// Dynamic Popup/Toast System
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  // Trigger layout calculations for transition to work
  toast.offsetHeight;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { toast.remove(); }, 300);
  }, 3000);
}

// Dynamic Drawer DOM Insertion
const drawerHTML = `
  <div id="drawer-backdrop" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9000] hidden opacity-0 transition-opacity duration-300"></div>
  <div id="drawer-panel" class="fixed top-0 right-0 h-full w-full max-w-md bg-white/95 dark:bg-[#0c1e44]/95 shadow-2xl border-l border-white/20 dark:border-white/10 glass z-[9001] transform translate-x-full transition-transform duration-300 flex flex-col">
    <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
      <h2 id="drawer-title" class="text-xl font-anton text-slate-800 dark:text-white tracking-wider">Shopping Basket</h2>
      <button id="drawer-close" class="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer font-bold text-lg" aria-label="Close drawer">×</button>
    </div>
    <div id="drawer-content" class="flex-1 overflow-y-auto p-6 space-y-4"></div>
    <div id="drawer-footer" class="p-6 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/10 space-y-4"></div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', drawerHTML);

// Quick View Modal DOM Insertion
const quickViewHTML = `
  <div id="quickview-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-md z-[9500] hidden opacity-0 transition-opacity duration-300 flex items-center justify-center p-4">
    <div id="quickview-panel" class="bg-white/95 dark:bg-[#0c1e44]/95 text-slate-800 dark:text-white max-w-2xl w-full rounded-3xl shadow-2xl glass border border-white/20 dark:border-white/10 overflow-hidden transform scale-90 opacity-0 transition-all duration-300 flex flex-col md:flex-row relative">
      <!-- Close button -->
      <button id="quickview-close" class="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer z-50 font-bold" aria-label="Close Quick View">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
      </button>
      
      <!-- Left Side: Image -->
      <div class="w-full md:w-1/2 aspect-square md:aspect-auto md:h-[420px] bg-slate-100 dark:bg-black/20 relative p-4 flex items-center justify-center">
        <img id="qv-image" src="" alt="" class="product-image-tap w-full h-full object-cover rounded-2xl" />
        <span id="qv-badge" class="absolute top-4 left-4 bg-slate-800/80 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"></span>
      </div>
      
      <!-- Right Side: Details -->
      <div class="w-full md:w-1/2 p-6 flex flex-col justify-between h-auto md:h-[420px] overflow-y-auto">
        <div class="space-y-3">
          <div class="flex items-center gap-1.5 text-[10px] font-bold text-[#d9a05b] uppercase tracking-widest">
            <span id="qv-origin"></span>
            <span>•</span>
            <span id="qv-craft"></span>
          </div>
          <h2 id="qv-name" class="text-xl font-anton tracking-wider text-slate-800 dark:text-white uppercase"></h2>
          <div class="flex items-center gap-3">
            <span id="qv-price" class="text-lg font-bold text-slate-900 dark:text-white"></span>
            <span id="qv-original-price" class="text-sm line-through text-slate-400"></span>
          </div>
          <hr class="border-slate-200 dark:border-slate-800" />
          <p id="qv-desc" class="text-slate-650 dark:text-slate-300 text-xs leading-relaxed"></p>
        </div>
        
        <div class="space-y-2.5 mt-6">
          <!-- Stylized WhatsApp Button -->
          <button id="qv-whatsapp-btn" class="w-full bg-[#25D366] hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-full border border-[#25D366] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer text-center text-xs flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4"><path d="M12.012 2c-5.506 0-9.972 4.466-9.972 9.974 0 1.758.459 3.479 1.33 5.003L2.028 22l5.166-1.355a9.92 9.92 0 0 0 4.814 1.258h.004c5.503 0 9.973-4.467 9.973-9.975C21.985 6.467 17.518 2 12.012 2zm5.727 13.993c-.25.707-1.464 1.3-2.025 1.385-.561.085-1.042.348-3.486-.643-2.937-1.196-4.81-4.184-4.957-4.382-.148-.198-1.197-1.591-1.197-3.036 0-1.444.757-2.15 1.026-2.433.269-.283.593-.354.79-.354.198 0 .396.002.567.01.178.008.419-.068.657.506.25.599.852 2.083.926 2.233.074.15.124.325.025.525-.099.2-.148.324-.297.499-.148.175-.313.39-.446.524-.148.15-.304.312-.132.607.172.296.764 1.259 1.636 2.036.873.778 1.611 1.018 1.908 1.168.297.15.469.125.643-.075.172-.2.757-.881.956-1.181.2-.3.4-.25.674-.15.275.1 1.748.824 2.049.975.301.15.501.225.576.35.074.125.074.723-.176 1.43z"/></svg>
            <span>Ask for Second Opinion on WhatsApp</span>
          </button>
          
          <!-- Primary Actions -->
          <div class="flex gap-2.5">
            <button id="qv-cart-btn" class="flex-1 bg-[#183fad] hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-full border border-[#183fad] transition-colors cursor-pointer text-center text-xs">Add to Cart</button>
            <button id="qv-wishlist-btn" class="bg-slate-100 hover:bg-rose-50 text-rose-500 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/20 py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-center text-xs font-semibold">Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', quickViewHTML);

// Quick View Handles
const qvBackdrop = document.getElementById('quickview-backdrop');
const qvPanel = document.getElementById('quickview-panel');
const qvClose = document.getElementById('quickview-close');

const qvImage = document.getElementById('qv-image');
const qvBadge = document.getElementById('qv-badge');
const qvOrigin = document.getElementById('qv-origin');
const qvCraft = document.getElementById('qv-craft');
const qvName = document.getElementById('qv-name');
const qvPrice = document.getElementById('qv-price');
const qvOriginalPrice = document.getElementById('qv-original-price');
const qvDesc = document.getElementById('qv-desc');

const qvWhatsappBtn = document.getElementById('qv-whatsapp-btn');
const qvCartBtn = document.getElementById('qv-cart-btn');
const qvWishlistBtn = document.getElementById('qv-wishlist-btn');

window.openQuickView = function(idx) {
  const product = products[idx];
  if (!product) return;
  
  qvImage.src = product.image;
  qvImage.alt = product.name;
  qvImage.dataset.productIndex = idx;
  qvBadge.textContent = product.type || 'Saree';
  qvOrigin.textContent = product.origin || '';
  qvCraft.textContent = product.craft || '';
  qvName.textContent = product.name;
  qvPrice.textContent = `₹${product.price.toLocaleString('en-IN')}`;
  qvOriginalPrice.textContent = product.originalPrice ? `₹${product.originalPrice.toLocaleString('en-IN')}` : '';
  qvDesc.textContent = product.desc || '';
  
  qvWhatsappBtn.onclick = () => {
    shareOnWhatsApp(idx);
  };
  qvCartBtn.onclick = () => {
    addToCart(idx);
    closeQuickView();
    setTimeout(() => {
      openDrawer('Shopping Cart');
      renderCartDrawer();
    }, 350);
  };
  qvWishlistBtn.onclick = () => {
    addToWishlist(idx);
    closeQuickView();
  };
  
  qvBackdrop.classList.remove('hidden');
  setTimeout(() => {
    qvBackdrop.classList.add('opacity-100');
    qvPanel.classList.remove('scale-90', 'opacity-0');
    qvPanel.classList.add('scale-100', 'opacity-100');
  }, 10);
};

window.closeQuickView = function() {
  qvBackdrop.classList.remove('opacity-100');
  qvPanel.classList.remove('scale-100', 'opacity-100');
  qvPanel.classList.add('scale-90', 'opacity-0');
  setTimeout(() => {
    qvBackdrop.classList.add('hidden');
  }, 300);
};

if (qvClose) qvClose.addEventListener('click', closeQuickView);
if (qvBackdrop) qvBackdrop.addEventListener('click', (e) => {
  if (e.target === qvBackdrop) closeQuickView();
});

// Drawer Handles
const backdrop = document.getElementById('drawer-backdrop');
const panel = document.getElementById('drawer-panel');
const titleEl = document.getElementById('drawer-title');
const contentEl = document.getElementById('drawer-content');
const footerEl = document.getElementById('drawer-footer');
const closeBtn = document.getElementById('drawer-close');

function openDrawer(title) {
  titleEl.textContent = title;
  backdrop.classList.remove('hidden');
  setTimeout(() => {
    backdrop.classList.add('opacity-100');
    panel.classList.remove('translate-x-full');
  }, 10);
}

function closeDrawer() {
  backdrop.classList.remove('opacity-100');
  panel.classList.add('translate-x-full');
  setTimeout(() => {
    backdrop.classList.add('hidden');
  }, 300);
}

if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
if (backdrop) backdrop.addEventListener('click', closeDrawer);

// Drawer Renderers
function renderCartDrawer() {
  const cart = getCart();
  if (cart.length === 0) {
    contentEl.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full py-12 text-center text-slate-500 dark:text-slate-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-16 mb-4 text-slate-400"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
        <p class="font-semibold text-base text-slate-700 dark:text-slate-200">Your cart is empty</p>
        <p class="text-xs mt-1">Browse our collection and find your perfect weave.</p>
      </div>
    `;
    footerEl.innerHTML = `
      <a href="new-arrivals.html" class="block w-full bg-[#183fad] hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-full text-center shadow-md transition-transform active:scale-95 cursor-pointer text-sm">Shop Our Collection</a>
    `;
    return;
  }

  contentEl.innerHTML = cart.map((item, idx) => `
    <div class="flex items-center gap-4 p-3 bg-white/40 dark:bg-black/10 border border-black/5 dark:border-white/5 rounded-2xl">
      <img src="${item.image}" alt="${item.name}" class="size-16 object-cover rounded-xl shadow-sm border border-black/5" />
      <div class="flex-1 min-w-0">
        <h4 class="font-semibold text-slate-800 dark:text-white text-sm truncate">${item.name}</h4>
        <p class="text-xs text-slate-500 mt-1">₹${item.price.toLocaleString('en-IN')} x ${item.qty || 1}</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
          <button onclick="changeDrawerQty(${idx}, -1)" class="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">-</button>
          <span class="px-2 text-xs font-semibold text-slate-800 dark:text-slate-200">${item.qty || 1}</span>
          <button onclick="changeDrawerQty(${idx}, 1)" class="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">+</button>
        </div>
        <button onclick="removeFromDrawerCart(${idx})" class="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer" title="Remove">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
        </button>
      </div>
    </div>
  `).join("");

  const subtotal = cart.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);
  footerEl.innerHTML = `
    <div class="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
      <span>Subtotal</span>
      <span class="text-base font-bold text-slate-800 dark:text-white">₹${subtotal.toLocaleString('en-IN')}</span>
    </div>
    <div class="grid grid-cols-2 gap-3 pt-2">
      <a href="cart.html" class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold py-2.5 px-4 rounded-full text-center transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center justify-center">View Cart</a>
      <button onclick="triggerDrawerCheckout()" class="bg-[#183fad] hover:bg-blue-800 text-white text-xs font-semibold py-2.5 px-4 rounded-full text-center transition-transform active:scale-95 cursor-pointer shadow-sm">Checkout</button>
    </div>
  `;
}

function renderWishlistDrawer() {
  const wishlist = getWishlist();
  if (wishlist.length === 0) {
    contentEl.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full py-12 text-center text-slate-500 dark:text-slate-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-16 mb-4 text-slate-400"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
        <p class="font-semibold text-base text-slate-700 dark:text-slate-200">Your wishlist is empty</p>
        <p class="text-xs mt-1">Tap the heart icon on any saree to save it here.</p>
      </div>
    `;
    footerEl.innerHTML = `
      <a href="new-arrivals.html" class="block w-full bg-[#183fad] hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-full text-center shadow-md transition-transform active:scale-95 cursor-pointer text-sm">Explore Collection</a>
    `;
    return;
  }

  contentEl.innerHTML = wishlist.map((item, idx) => `
    <div class="flex items-center gap-4 p-3 bg-white/40 dark:bg-black/10 border border-black/5 dark:border-white/5 rounded-2xl">
      <img src="${item.image}" alt="${item.name}" class="size-16 object-cover rounded-xl shadow-sm border border-black/5" />
      <div class="flex-1 min-w-0">
        <h4 class="font-semibold text-slate-800 dark:text-white text-sm truncate">${item.name}</h4>
        <p class="text-xs text-slate-500 mt-1">₹${item.price.toLocaleString('en-IN')}</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="moveDrawerWishlistToCart(${idx})" class="p-2 bg-[#F1BF0A] hover:bg-yellow-500 text-slate-900 rounded-xl transition-colors cursor-pointer" title="Move to Cart">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
        </button>
        <button onclick="removeFromDrawerWishlist(${idx})" class="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer" title="Remove">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
        </button>
      </div>
    </div>
  `).join("");

  footerEl.innerHTML = `
    <a href="wishlist.html" class="block w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold py-2.5 px-4 rounded-full text-center border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-xs">View Full Wishlist</a>
  `;
}

function renderMobileMenu() {
  contentEl.innerHTML = `
    <ul class="space-y-4 text-base font-semibold">
      <li><a href="index.html" class="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 transition-colors">Home</a></li>
      <li><a href="about.html" class="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 transition-colors">About Story</a></li>
      <li><a href="new-arrivals.html" class="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 transition-colors">New Arrivals</a></li>
      <li><a href="stores.html" class="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 transition-colors">Stores Locator</a></li>
      <li><a href="wishlist.html" class="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 transition-colors flex items-center justify-between"><span>Wishlist</span><span class="bg-rose-500 text-white rounded-full text-xs px-2 py-0.5" id="mobile-wishlist-count">0</span></a></li>
      <li><a href="cart.html" class="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 transition-colors flex items-center justify-between"><span>Cart</span><span class="bg-[#F1BF0A] text-slate-900 rounded-full text-xs px-2 py-0.5" id="mobile-cart-count">0</span></a></li>
      <li><a href="cms.html" class="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 transition-colors">CMS Console</a></li>
      <li><a href="login.html" id="mobile-account-link" class="block p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 transition-colors">My Account / Log In</a></li>
    </ul>
  `;

  updateCounts();

  const session = JSON.parse(localStorage.getItem('userSession'));
  const mobileAccountLink = document.getElementById('mobile-account-link');
  if (mobileAccountLink && session && session.isLoggedIn) {
    mobileAccountLink.href = 'account.html';
    mobileAccountLink.textContent = `My Account (${session.username.toUpperCase()})`;
  }

  footerEl.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="text-xs text-slate-400">Theme Preference</span>
      <button id="drawer-theme-toggle" class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white p-2 rounded-full size-9 text-xs flex items-center justify-center cursor-pointer border border-slate-200 dark:border-slate-700"></button>
    </div>
  `;

  const drawerThemeToggle = document.getElementById('drawer-theme-toggle');
  if (drawerThemeToggle) {
    drawerThemeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀' : '☾';
    drawerThemeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      drawerThemeToggle.textContent = isDark ? '☀' : '☾';
      // Sync navbar theme icon
      const mainThemeToggle = document.getElementById('theme-toggle');
      if (mainThemeToggle) mainThemeToggle.textContent = isDark ? '☀' : '☾';
    });
  }
}

// Drawer Global Operations
window.changeDrawerQty = function(idx, delta) {
  const cart = getCart();
  const item = cart[idx];
  if (!item) return;
  item.qty = (item.qty || 1) + delta;
  if (item.qty <= 0) {
    cart.splice(idx, 1);
  }
  saveCart(cart);
  updateCounts();
  renderCartDrawer();
  if (typeof render === 'function') render(); // sync cart.html subtotal & listing
};

window.removeFromDrawerCart = function(idx) {
  const cart = getCart();
  const name = cart[idx]?.name || 'Item';
  cart.splice(idx, 1);
  saveCart(cart);
  updateCounts();
  renderCartDrawer();
  showToast(`"${name}" removed from Cart.`, 'info');
  if (typeof render === 'function') render(); // sync cart.html
};

window.triggerDrawerCheckout = function() {
  closeDrawer();
  showToast('Redirecting to Checkout...', 'success');
  setTimeout(() => {
    window.location.href = 'cart.html';
  }, 500);
};

window.moveDrawerWishlistToCart = function(idx) {
  const wishlist = getWishlist();
  const item = wishlist[idx];
  if (!item) return;

  const cart = getCart();
  const existing = cart.find(p => p.name === item.name);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  updateCounts();

  wishlist.splice(idx, 1);
  saveWishlist(wishlist);
  
  renderWishlistDrawer();
  showToast(`"${item.name}" moved to Cart!`, 'success');
  
  if (typeof renderWishlist === 'function') renderWishlist(); // sync wishlist.html
};

window.removeFromDrawerWishlist = function(idx) {
  const wishlist = getWishlist();
  const name = wishlist[idx]?.name || 'Item';
  wishlist.splice(idx, 1);
  saveWishlist(wishlist);
  updateCounts();
  renderWishlistDrawer();
  showToast(`"${name}" removed from Wishlist.`, 'info');
  
  if (typeof renderWishlist === 'function') renderWishlist(); // sync wishlist.html
};

// Intercept Nav clicks & hamburger clicks
document.addEventListener('click', (e) => {
  const cartLink = e.target.closest('#cart-link');
  if (cartLink) {
    e.preventDefault();
    openDrawer('Shopping Cart');
    renderCartDrawer();
    return;
  }

  const wishlistLink = e.target.closest('#wishlist-link');
  if (wishlistLink) {
    e.preventDefault();
    openDrawer('My Wishlist');
    renderWishlistDrawer();
    return;
  }

  const menuBtn = e.target.closest('button[aria-label="Toggle Menu"]');
  if (menuBtn) {
    e.preventDefault();
    openDrawer('Reenat Trends');
    renderMobileMenu();
    return;
  }
});

// Reusable Page Catalog Renderer
window.renderCatalog = function(filteredList = products) {
  const productList = document.getElementById("product-list");
  if (!productList) return;
  
  if (filteredList.length === 0) {
    productList.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-black/10 border border-black/5 dark:border-white/10 rounded-2xl glass">
        <p class="font-semibold text-base text-slate-700 dark:text-white">No sarees match your filter criteria.</p>
        <p class="text-xs mt-1 text-slate-500 dark:text-slate-400">Try resetting filters to view our full lineage.</p>
      </div>
    `;
    return;
  }

  productList.innerHTML = filteredList.map((product) => {
    // Find original index
    const idx = products.findIndex(p => p.name === product.name);
    const formattedPrice = Math.round(product.price).toLocaleString('en-IN');
    const formattedOriginal = Math.round(product.originalPrice).toLocaleString('en-IN');
    const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const rating = product.rating || 4.5;
    return `
      <li class="group product-card col-span-1 flex flex-col rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur-md">
        <!-- Image -->
        <div class="relative overflow-hidden aspect-[3/4] bg-[#0c1e44]/5 dark:bg-black/20 p-2">
          <a href="product.html?id=${idx}">
            <img src="${product.image}" alt="${product.name}" data-product-index="${idx}" class="product-image-tap w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          </a>
          <!-- Badge -->
          <span class="absolute top-4 left-4 bg-slate-800/80 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">${product.type}</span>
          
          <!-- Rating Badge -->
          <div class="absolute bottom-4 left-4 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5 shadow-md z-20">
            <span>${rating}</span>
            <span class="text-emerald-600">★</span>
          </div>

          <!-- Floating WhatsApp Shortcut -->
          <button type="button" onclick="shareOnWhatsApp(${idx}); event.preventDefault(); event.stopPropagation();" class="absolute top-4 right-4 bg-[#25D366] hover:bg-emerald-600 text-white p-2.5 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer z-20 flex items-center justify-center border border-white/20" title="Ask for Second Opinion on WhatsApp">
            <svg class="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.012 2c-5.506 0-9.972 4.466-9.972 9.974 0 1.758.459 3.479 1.33 5.003L2.028 22l5.166-1.355a9.92 9.92 0 0 0 4.814 1.258h.004c5.503 0 9.973-4.467 9.973-9.975C21.985 6.467 17.518 2 12.012 2zm5.727 13.993c-.25.707-1.464 1.3-2.025 1.385-.561.085-1.042.348-3.486-.643-2.937-1.196-4.81-4.184-4.957-4.382-.148-.198-1.197-1.591-1.197-3.036 0-1.444.757-2.15 1.026-2.433.269-.283.593-.354.79-.354.198 0 .396.002.567.01.178.008.419-.068.657.506.25.599.852 2.083.926 2.233.074.15.124.325.025.525-.099.2-.148.324-.297.499-.148.175-.313.39-.446.524-.148.15-.304.312-.132.607.172.296.764 1.259 1.636 2.036.873.778 1.611 1.018 1.908 1.168.297.15.469.125.643-.075.172-.2.757-.881.956-1.181.2-.3.4-.25.674-.15.275.1 1.748.824 2.049.975.301.15.501.225.576.35.074.125.074.723-.176 1.43z"/></svg>
          </button>

          <!-- Action Overlay -->
          <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 flex items-center justify-center gap-3">
            <button type="button" onclick="addToCart(${idx})" class="p-3 bg-white dark:bg-slate-900 hover:bg-[#F1BF0A] dark:hover:bg-[#F1BF0A] text-slate-800 dark:text-slate-100 rounded-full shadow-md transition-colors duration-200 cursor-pointer" title="Add to Cart">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
            </button>
            <button type="button" onclick="addToWishlist(${idx})" class="p-3 bg-white dark:bg-slate-900 hover:bg-rose-500 hover:text-white text-slate-800 dark:text-slate-100 rounded-full shadow-md transition-colors duration-200 cursor-pointer" title="Add to Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
            </button>
            <button type="button" onclick="openQuickView(${idx})" class="p-3 bg-white dark:bg-slate-900 hover:bg-[#183fad] hover:text-white text-slate-800 dark:text-slate-100 rounded-full shadow-md transition-colors duration-200 cursor-pointer" title="Quick View">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
            </button>
          </div>
        </div>
        <!-- Details -->
        <div class="p-3 sm:p-4 flex flex-col justify-between flex-1 bg-white/40 dark:bg-black/10 relative">
          <div>
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-[#183fad] dark:group-hover:text-[#F1BF0A] transition-colors duration-200 truncate">
              <a href="product.html?id=${idx}">${product.name}</a>
            </h3>
            <div class="text-[#16a34a] dark:text-[#25D366] text-xs font-semibold mt-1">${discountPercent}% OFF</div>
          </div>
          <div class="mt-1.5 flex items-center justify-between">
            <div class="flex flex-col pr-10">
              <div class="flex items-center gap-2">
                <span class="text-sm line-through text-slate-455 dark:text-slate-400">₹${formattedOriginal}</span>
                <span class="text-lg font-bold text-slate-900 dark:text-white">₹${formattedPrice}</span>
              </div>
              <div class="inline-block bg-[#16a34a]/10 dark:bg-[#25D366]/10 text-[#16a34a] dark:text-[#25D366] text-[10px] font-bold mt-1.5 px-2.5 py-0.5 rounded border border-[#16a34a]/20 dark:border-[#25D366]/20 shadow-[0_2px_6px_rgba(22,163,74,0.12)] dark:shadow-none w-fit">Hot Deal</div>
            </div>
            <button type="button" onclick="addToCart(${idx}); event.preventDefault(); event.stopPropagation();" class="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 p-2 sm:p-2.5 bg-[#F1BF0A] hover:bg-yellow-500 text-slate-900 rounded-full cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-sm" title="Add to Cart">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
            </button>
          </div>
        </div>
      </li>
    `;
  }).join("");
};

// Initial execution
if (document.getElementById("product-list")) {
  renderCatalog(products);
}

// Direct operations for list actions
window.addToCart = function(index) {
  const product = products[index];
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(p => p.name === product.name);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  updateCounts();
  showToast(`"${product.name}" added to Cart!`, 'success');
};

window.addToWishlist = function(index) {
  const product = products[index];
  if (!product) return;
  const wishlist = getWishlist();
  const existing = wishlist.find(p => p.name === product.name);
  if (!existing) {
    wishlist.push(product);
    saveWishlist(wishlist);
    updateCounts();
    showToast(`"${product.name}" added to Wishlist!`, 'info');
  } else {
    showToast(`"${product.name}" is already in Wishlist!`, 'info');
  }
};

window.shareOnWhatsApp = function(index) {
  const product = products[index];
  if (!product) return;
  const productUrl = `${window.location.origin}/product.html?id=${index}`;
  let imgPart = '';
  if (product.image) {
    if (product.image.startsWith('data:')) {
      imgPart = ''; // Avoid massive base64 in share URL text
    } else if (product.image.startsWith('http')) {
      imgPart = `\n\nHigh-Res Image: ${product.image}`;
    } else {
      imgPart = `\n\nHigh-Res Image: ${window.location.origin}/${product.image}`;
    }
  }
  const shareText = `Hey! What do you think of this gorgeous handloom saree? Check it out on Reenat Trends: ${product.name} (${product.craft} from ${product.origin}) for ₹${product.price.toLocaleString('en-IN')}.\n\nView details: ${productUrl}${imgPart}`;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
};

window.shareOnWhatsAppByName = function(name) {
  const idx = products.findIndex(p => p.name === name);
  if (idx !== -1) {
    shareOnWhatsApp(idx);
  } else {
    showToast(`Product "${name}" not found!`, 'error');
  }
};

// Global Theme Handler
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(pref) {
  if (pref === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}
const savedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀' : '☾';
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀' : '☾';
    // sync drawer theme toggle if drawer open
    const drawerThemeToggle = document.getElementById('drawer-theme-toggle');
    if (drawerThemeToggle) drawerThemeToggle.textContent = isDark ? '☀' : '☾';
  });
}

// Initial Sync Execution
updateCounts();
checkLoginState();

// Initialize Hero Image Carousel
const carouselSlides = [
  {
    subtitle: "Luxury Weaves",
    title: "KANJIVARAM SILK",
    desc: "Exquisite pure mulberry silk sarees woven with genuine gold zari borders, carrying centuries of wedding-day heritage.",
    image: "assets/hero (1).png"
  },
  {
    subtitle: "Royal Heritage",
    title: "BANARASI WEAVE",
    desc: "Dense and luxurious brocades from Varanasi, featuring elaborate floral vines and silver filigree for celebrations.",
    image: "assets/hero (2).png"
  },
  {
    subtitle: "Sheer Elegance",
    title: "CHANDERI CHARM",
    desc: "Whisper-light silk cotton blends adorned with delicate handwoven buttis, perfect for warm summers and day events.",
    image: "assets/hero (3).png"
  },
  {
    subtitle: "Organic Splendor",
    title: "TUSSAR ELEGANCE",
    desc: "Naturally textured wild silk sarees with a soft golden sheen, celebrating raw elegance and earth-toned charm.",
    image: "assets/hero (4).png"
  },
  {
    subtitle: "Regal Drape",
    title: "ROYAL PAITHANI",
    desc: "Vibrant Maharashtrian silks detailed with spectacular peacock pallus and signature square borders.",
    image: "assets/hero (5).png"
  },
  {
    subtitle: "Rare Golden Thread",
    title: "MUGA MARVEL",
    desc: "Assam’s exclusive golden silk, renowned for its glossy natural color and durability that outlasts a lifetime.",
    image: "assets/hero (6).png"
  }
];

function initCarousel() {
  const heroImage = document.getElementById('hero-image');
  if (!heroImage) return;

  const heroSubtitle = document.getElementById('hero-subtitle');
  const heroTitle = document.getElementById('hero-title');
  const heroDesc = document.getElementById('hero-desc');
  const heroPrevBtn = document.getElementById('hero-prev');
  const heroNextBtn = document.getElementById('hero-next');

  if (!heroSubtitle || !heroTitle || !heroDesc || !heroPrevBtn || !heroNextBtn) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const slideDuration = 8000;

  function showSlide(index) {
    heroSubtitle.classList.add('carousel-text-hidden');
    heroTitle.classList.add('carousel-text-hidden');
    heroDesc.classList.add('carousel-text-hidden');
    heroImage.classList.add('carousel-image-hidden');

    setTimeout(() => {
      const slide = carouselSlides[index];

      heroImage.onload = () => {
        heroSubtitle.classList.remove('carousel-text-hidden');
        heroTitle.classList.remove('carousel-text-hidden');
        heroDesc.classList.remove('carousel-text-hidden');
        heroImage.classList.remove('carousel-image-hidden');
      };

      heroSubtitle.textContent = slide.subtitle;
      heroTitle.textContent = slide.title;
      heroDesc.textContent = slide.desc;
      heroImage.src = slide.image;

      // Fallback in case image is already fully loaded/cached and onload won't fire
      if (heroImage.complete) {
        heroSubtitle.classList.remove('carousel-text-hidden');
        heroTitle.classList.remove('carousel-text-hidden');
        heroDesc.classList.remove('carousel-text-hidden');
        heroImage.classList.remove('carousel-image-hidden');
      }
    }, 400);
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % carouselSlides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + carouselSlides.length) % carouselSlides.length;
    showSlide(currentIndex);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, slideDuration);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  heroPrevBtn.addEventListener('click', () => {
    prevSlide();
    startAutoplay();
  });

  heroNextBtn.addEventListener('click', () => {
    nextSlide();
    startAutoplay();
  });

  // Touch Swipe Gesture Support
  const heroHeader = document.querySelector('.page-hero');
  if (heroHeader) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    heroHeader.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    heroHeader.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;

      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Detect horizontal swipe with min distance of 40px, ensuring horizontal movement is dominant
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
        startAutoplay();
      }
    }, { passive: true });
  }

  startAutoplay();
}

initCarousel();

// ========================================================
// Bottom-Anchored Filtering Sheet Logic
// ========================================================
if (document.getElementById('product-list')) {
  const filterHTML = `
    <!-- Floating Navigation Menu -->
    <div id="floating-nav-container" class="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40 bg-white/40 dark:bg-black/25 px-2.5 py-2 rounded-full border border-white/20 dark:border-white/10 glass shadow-lg max-w-[90vw] select-none">
      <!-- Home Shortcut -->
      <a href="index.html" id="floating-home-btn" class="bg-[#183fad]/90 dark:bg-[#0c1e44]/90 hover:bg-blue-800 dark:hover:bg-blue-950 text-white p-2.5 rounded-full shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center border border-white/10" title="Home">
        <svg class="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/>
        </svg>
      </a>

      <!-- Accounts Shortcut -->
      <a href="login.html" id="floating-accounts-btn" class="bg-[#183fad]/90 dark:bg-[#0c1e44]/90 hover:bg-blue-800 dark:hover:bg-blue-950 text-white p-2.5 rounded-full shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center border border-white/10" title="Accounts">
        <svg class="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </a>

      <!-- Cart Shortcut -->
      <button id="floating-cart-btn" class="bg-[#183fad]/90 dark:bg-[#0c1e44]/90 hover:bg-blue-800 dark:hover:bg-blue-950 text-white p-2.5 rounded-full shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center border border-white/10" title="Cart">
        <svg class="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      </button>

      <!-- Original Filter Button (Refactored) -->
      <button id="floating-filter-btn" class="bg-[#183fad]/90 dark:bg-[#0c1e44]/90 hover:bg-blue-800 dark:hover:bg-blue-950 text-white px-4 py-2.5 rounded-full shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-semibold border border-white/10">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        <span>Filter</span>
      </button>
    </div>

    <!-- Bottom Filtering Sheet Backdrop -->
    <div id="filter-backdrop" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[8000] hidden opacity-0 transition-opacity duration-300"></div>

    <!-- Bottom Filtering Sheet Panel -->
    <div id="filter-sheet" class="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/95 dark:bg-[#0c1e44]/95 border-t border-white/20 dark:border-white/10 rounded-t-3xl glass z-[8001] transform translate-y-full transition-transform duration-300 ease-out flex flex-col shadow-2xl">
      <!-- Drag/Pull indicator -->
      <div class="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-3 cursor-pointer"></div>
      
      <div class="px-6 pb-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <h3 class="text-lg font-anton text-slate-800 dark:text-white tracking-wider">FILTER SAREES</h3>
        <button id="filter-reset" class="text-xs text-[#183fad] dark:text-[#F1BF0A] font-bold hover:underline cursor-pointer">Clear All</button>
      </div>

      <div class="p-6 overflow-y-auto space-y-6 max-h-[60vh]">
        <!-- Filter by Weave Type -->
        <div class="space-y-2.5">
          <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weave Types</h4>
          <div class="flex flex-wrap gap-2" id="weave-filter-options"></div>
        </div>

        <!-- Filter by Color -->
        <div class="space-y-2.5">
          <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Colors</h4>
          <div class="flex flex-wrap gap-2" id="color-filter-options"></div>
        </div>

        <!-- Filter by Price Range -->
        <div class="space-y-2.5">
          <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price Cap</h4>
          <div class="flex items-center gap-4 bg-slate-100/50 dark:bg-black/10 px-4 py-3 rounded-2xl border border-black/5">
            <input type="range" id="price-filter-range" min="1000" max="5000" step="100" value="5000" class="flex-1 accent-[#183fad] dark:accent-[#F1BF0A] cursor-pointer" />
            <span class="text-xs font-bold text-slate-800 dark:text-white whitespace-nowrap bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg min-w-[110px] text-center" id="price-range-label">Under ₹5,000</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="p-5 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/10 flex gap-3">
        <button id="filter-close-btn" class="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold py-3 rounded-full text-center text-xs border border-slate-250 dark:border-slate-700 cursor-pointer">Cancel</button>
        <button id="filter-apply-btn" class="flex-1 bg-[#183fad] hover:bg-blue-800 text-white font-semibold py-3 rounded-full text-center text-xs shadow-md cursor-pointer">Apply Filters</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', filterHTML);

  const filterBackdrop = document.getElementById('filter-backdrop');
  const filterSheet = document.getElementById('filter-sheet');
  const floatingFilterBtn = document.getElementById('floating-filter-btn');

  const weaves = ['All', 'Silk', 'Brocade', 'Lightweight', 'Organic', 'Rare'];
  const colors = ['All', 'Red', 'Pink', 'Cream', 'Gold', 'Blue', 'Green', 'Yellow', 'Black'];
  const colorHex = {
    'All': 'linear-gradient(to right, red, orange, yellow, green, blue, violet)',
    'Red': '#dc2626',
    'Pink': '#f472b6',
    'Cream': '#fdf6e2',
    'Gold': '#f5c434',
    'Blue': '#1e3a8a',
    'Green': '#16a34a',
    'Yellow': '#facc15',
    'Black': '#0f172a'
  };

  let selectedWeave = 'All';
  let selectedColor = 'All';
  let maxPrice = 5000;

  window.renderFilterOptions = function() {
    const weaveContainer = document.getElementById('weave-filter-options');
    const colorContainer = document.getElementById('color-filter-options');
    
    if (weaveContainer) {
      weaveContainer.innerHTML = weaves.map(w => {
        const isSelected = selectedWeave === w;
        return `
          <button type="button" onclick="selectWeaveFilter('${w}')" class="filter-pill px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer select-none ${isSelected ? 'bg-[#183fad] text-white border-[#183fad] dark:bg-[#F1BF0A] dark:text-slate-900 dark:border-[#F1BF0A]' : 'bg-slate-100 hover:bg-slate-250 text-slate-800 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'}">
            ${w}
          </button>
        `;
      }).join("");
    }

    if (colorContainer) {
      colorContainer.innerHTML = colors.map(c => {
        const isSelected = selectedColor === c;
        const bgStyle = colorHex[c].startsWith('linear') ? `background: ${colorHex[c]}` : `background-color: ${colorHex[c]}`;
        const borderClass = c === 'Cream' ? 'border-slate-300 dark:border-slate-600' : 'border-transparent';
        return `
          <button type="button" onclick="selectColorFilter('${c}')" class="filter-pill flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer select-none ${isSelected ? 'bg-[#183fad] text-white border-[#183fad] dark:bg-[#F1BF0A] dark:text-slate-900 dark:border-[#F1BF0A]' : 'bg-slate-100 hover:bg-slate-250 text-slate-800 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'}">
            <span class="size-3.5 rounded-full border ${borderClass}" style="${bgStyle}"></span>
            <span>${c}</span>
          </button>
        `;
      }).join("");
    }
  };

  window.selectWeaveFilter = function(weave) {
    selectedWeave = weave;
    renderFilterOptions();
  };

  window.selectColorFilter = function(color) {
    selectedColor = color;
    renderFilterOptions();
  };

  window.openFilterSheet = function() {
    renderFilterOptions();
    filterBackdrop.classList.remove('hidden');
    setTimeout(() => {
      filterBackdrop.classList.add('opacity-100');
      filterSheet.classList.remove('translate-y-full');
    }, 10);
  };

  window.closeFilterSheet = function() {
    filterBackdrop.classList.remove('opacity-100');
    filterSheet.classList.add('translate-y-full');
    setTimeout(() => {
      filterBackdrop.classList.add('hidden');
    }, 300);
  };

  window.applyFilters = function() {
    const filtered = products.filter(product => {
      const matchesWeave = selectedWeave === 'All' || product.type === selectedWeave;
      const matchesColor = selectedColor === 'All' || product.color === selectedColor;
      const matchesPrice = product.price <= maxPrice;
      return matchesWeave && matchesColor && matchesPrice;
    });
    renderCatalog(filtered);
    closeFilterSheet();
    showToast(`Found ${filtered.length} matching sarees.`, 'success');
  };

  window.clearFilters = function() {
    selectedWeave = 'All';
    selectedColor = 'All';
    maxPrice = 5000;
    
    const slider = document.getElementById('price-filter-range');
    if (slider) slider.value = 5000;
    
    const label = document.getElementById('price-range-label');
    if (label) label.textContent = 'Under ₹5,000';
    
    renderFilterOptions();
    renderCatalog(products);
    closeFilterSheet();
    showToast('Filters cleared.', 'info');
  };

  // Listeners
  if (floatingFilterBtn) floatingFilterBtn.addEventListener('click', openFilterSheet);

  const floatingCartBtn = document.getElementById('floating-cart-btn');
  if (floatingCartBtn) {
    floatingCartBtn.addEventListener('click', () => {
      openDrawer('Shopping Cart');
      renderCartDrawer();
    });
  }

  const floatingAccountsBtn = document.getElementById('floating-accounts-btn');
  if (floatingAccountsBtn) {
    const session = JSON.parse(localStorage.getItem('userSession'));
    if (session && session.isLoggedIn) {
      floatingAccountsBtn.href = 'account.html';
    } else {
      floatingAccountsBtn.href = 'login.html';
    }
  }
  
  const applyBtn = document.getElementById('filter-apply-btn');
  const closeBtn = document.getElementById('filter-close-btn');
  const resetBtn = document.getElementById('filter-reset');
  const priceRange = document.getElementById('price-filter-range');
  const priceLabel = document.getElementById('price-range-label');

  if (applyBtn) applyBtn.addEventListener('click', window.applyFilters);
  if (closeBtn) closeBtn.addEventListener('click', window.closeFilterSheet);
  if (filterBackdrop) filterBackdrop.addEventListener('click', window.closeFilterSheet);
  if (resetBtn) resetBtn.addEventListener('click', window.clearFilters);
  
  if (priceRange && priceLabel) {
    priceRange.addEventListener('input', (e) => {
      maxPrice = Number(e.target.value);
      priceLabel.textContent = `Under ₹${maxPrice.toLocaleString('en-IN')}`;
    });
  }
}
