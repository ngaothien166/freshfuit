// ============================================================
// FreshFruit - Universal Store Manager (Cart + Wishlist + UI)
// ============================================================

const Store = (() => {
  // ── Cart ──────────────────────────────────────────────
  function getCart() {
    try {
      const raw = JSON.parse(localStorage.getItem('ff_cart') || '[]');
      return raw.map(item => {
        // Hydrate from PRODUCTS if missing fields
        const product = (typeof PRODUCTS !== 'undefined')
          ? PRODUCTS.find(p => String(p.id) === String(item.id) || p.slug === item.slug)
          : null;

        const qty = item.qty || item.quantity || 1;
        const name = item.name || product?.name || 'Sản phẩm';
        const price = item.price !== undefined ? item.price : (product?.price || 0);
        const originalPrice = item.originalPrice !== undefined ? item.originalPrice : (product?.originalPrice || null);
        const image = item.image || product?.image || '';
        const unit = item.unit || product?.unit || 'kg';
        const slug = item.slug || product?.slug || '';
        const badge = item.badge || product?.badge || '';
        const discount = item.discount !== undefined ? item.discount : (product?.discount || 0);

        return {
          ...item,
          id: String(item.id),
          name,
          price,
          originalPrice,
          image,
          unit,
          qty,
          quantity: qty,
          slug,
          badge,
          discount,
          product: product || { id: item.id, name, price, image, unit, slug },
        };
      });
    } catch (e) {
      console.error('Error reading cart', e);
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('ff_cart', JSON.stringify(cart));
    updateHeaderCounts();
  }

  function setCart(cart) {
    saveCart(cart);
  }

  function addToCart(productOrId, qty = 1) {
    const cart = getCart();
    let product = null;

    if (typeof productOrId === 'object' && productOrId !== null) {
      product = productOrId;
    } else if (typeof PRODUCTS !== 'undefined') {
      product = PRODUCTS.find(p => String(p.id) === String(productOrId) || p.slug === productOrId);
    }

    if (!product) return;

    const productId = String(product.id);
    const existing = cart.find(i => String(i.id) === productId);

    if (existing) {
      existing.qty = Math.min((existing.qty || 1) + qty, 99);
      existing.quantity = existing.qty;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || null,
        image: product.image,
        unit: product.unit || 'kg',
        qty: qty,
        quantity: qty,
        slug: product.slug,
        badge: product.badge || '',
        discount: product.discount || 0,
      });
    }

    saveCart(cart);
    showToast(`🛒 Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
  }

  function removeFromCart(productId) {
    const cart = getCart().filter(i => String(i.id) !== String(productId));
    saveCart(cart);
    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  }

  function updateQty(productId, qty) {
    const cart = getCart();
    const item = cart.find(i => String(i.id) === String(productId));
    if (item) {
      if (qty <= 0) {
        removeFromCart(productId);
        return;
      }
      item.qty = Math.min(Math.max(1, qty), 99);
      item.quantity = item.qty;
      saveCart(cart);
    }
  }

  function updateQuantity(productId, qty) {
    updateQty(productId, qty);
  }

  function getCartCount() {
    return getCart().reduce((sum, i) => sum + (i.qty || i.quantity || 1), 0);
  }

  function getCartTotal() {
    return getCart().reduce((sum, i) => sum + (i.price * (i.qty || i.quantity || 1)), 0);
  }

  function getCartSubtotal() {
    return getCartTotal();
  }

  function clearCart() {
    saveCart([]);
  }

  // ── Wishlist ──────────────────────────────────────────
  function getWishlist() {
    try {
      const raw = JSON.parse(localStorage.getItem('ff_wishlist') || '[]');
      if (!Array.isArray(raw)) return [];
      // If it contains IDs, map to full products
      return raw.map(entry => {
        if (typeof entry === 'object' && entry !== null && entry.name) {
          return entry;
        }
        const id = typeof entry === 'object' ? entry.id : entry;
        if (typeof PRODUCTS !== 'undefined') {
          return PRODUCTS.find(p => String(p.id) === String(id) || p.slug === id) || null;
        }
        return null;
      }).filter(Boolean);
    } catch {
      return [];
    }
  }

  function saveWishlist(list) {
    localStorage.setItem('ff_wishlist', JSON.stringify(list));
    updateHeaderCounts();
  }

  function isInWishlist(productId) {
    const list = getWishlist();
    return list.some(item => String(item.id) === String(productId) || item.slug === productId);
  }

  function toggleWishlist(productOrId) {
    let product = null;
    if (typeof productOrId === 'object' && productOrId !== null) {
      product = productOrId;
    } else if (typeof PRODUCTS !== 'undefined') {
      product = PRODUCTS.find(p => String(p.id) === String(productOrId) || p.slug === productOrId);
    }
    if (!product) return false;

    const list = getWishlist();
    const idx = list.findIndex(i => String(i.id) === String(product.id));
    let added = false;

    if (idx >= 0) {
      list.splice(idx, 1);
      showToast(`💔 Đã bỏ "${product.name}" khỏi yêu thích`, 'info');
      added = false;
    } else {
      list.push(product);
      showToast(`❤️ Đã thêm "${product.name}" vào yêu thích!`, 'success');
      added = true;
    }

    saveWishlist(list);
    return added;
  }

  function getWishlistCount() {
    return getWishlist().length;
  }

  // ── Header Counts ─────────────────────────────────────
  function updateHeaderCounts() {
    const cCount = getCartCount();
    const wCount = getWishlistCount();

    document.querySelectorAll('#cartCount').forEach(el => {
      el.textContent = cCount;
    });

    document.querySelectorAll('#wishlistCount').forEach(el => {
      el.textContent = wCount;
      el.classList.toggle('hidden', wCount === 0);
    });
  }

  function initUI() {
    updateHeaderCounts();
  }

  // ── Toast ─────────────────────────────────────────────
  let toastTimer;
  function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast) return;

    if (toastMsg) {
      toastMsg.textContent = msg;
    } else {
      toast.textContent = msg;
    }

    toast.className = 'toast px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-white text-sm font-medium';
    if (type === 'success') {
      toast.classList.add('bg-primary');
    } else if (type === 'info') {
      toast.classList.add('bg-gray-800');
    } else if (type === 'error') {
      toast.classList.add('bg-red-600');
    } else {
      toast.classList.add('bg-primary');
    }

    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  // ── Product Card Renderer ─────────────────────────────
  function renderProductCard(product, extraClass = '') {
    const hasDiscount = product.discount > 0 || (product.originalPrice && product.originalPrice > product.price);
    const discountVal = product.discount || (product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0);
    const inWl = isInWishlist(product.id);
    const starsHtml = typeof renderStars === 'function' ? renderStars(product.rating) : '⭐⭐⭐⭐⭐';
    const catName = (typeof CATEGORIES !== 'undefined')
      ? (CATEGORIES.find(c => c.id === product.category)?.name || 'Trái cây')
      : 'Trái cây';

    return `
      <div class="product-card group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 flex flex-col justify-between ${extraClass}" data-id="${product.id}">
        <div>
          <div class="relative overflow-hidden">
            <a href="product-detail.html?slug=${product.slug}">
              <img src="${product.image}" alt="${product.name}"
                class="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500 bg-gray-50"
                loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&h=600&fit=crop&auto=format&q=80'">
            </a>
            <div class="absolute top-3 left-3 flex flex-col gap-1 z-10">
              ${hasDiscount ? `<span class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">-${discountVal}%</span>` : ''}
              ${product.isNew ? `<span class="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Mới</span>` : ''}
              ${product.badge ? `<span class="${product.badgeColor || 'bg-accent'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">${product.badge}</span>` : ''}
            </div>
            <button onclick="handleWishlist(event, '${product.id}')"
              class="wishlist-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow flex items-center justify-center hover:bg-white transition-colors z-10"
              title="Yêu thích">
              <i class="${inWl ? 'fas text-red-500' : 'far text-gray-400'} fa-heart text-xs"></i>
            </button>
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between text-[10px] text-gray-400 mb-1">
              <span>${catName}</span>
              ${product.origin ? `<span class="truncate max-w-[90px]"><i class="fas fa-map-marker-alt text-primary mr-1"></i>${product.origin}</span>` : ''}
            </div>
            <a href="product-detail.html?slug=${product.slug}">
              <h3 class="font-semibold text-gray-800 mb-1.5 line-clamp-2 hover:text-primary transition-colors text-sm leading-snug">${product.name}</h3>
            </a>
            <div class="flex items-center gap-1 mb-2">
              <div class="flex">${starsHtml}</div>
              <span class="text-[10px] text-gray-400 ml-0.5">(${product.reviewCount || product.reviews || 0})</span>
            </div>
          </div>
        </div>
        <div class="p-4 pt-0">
          <div class="flex items-end justify-between pt-2 border-t border-gray-50">
            <div>
              <p class="text-primary font-bold text-base leading-tight">${formatPrice(product.price)}<span class="text-[10px] font-normal text-gray-400">/${product.unit || 'kg'}</span></p>
              ${product.originalPrice ? `<p class="text-gray-400 text-xs line-through leading-tight">${formatPrice(product.originalPrice)}</p>` : ''}
            </div>
            <button onclick="handleAddToCart(event, '${product.id}')"
              class="w-9 h-9 bg-primary hover:bg-primary-dark active:scale-95 text-white rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow"
              title="Thêm vào giỏ">
              <i class="fas fa-plus text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Expose global handlers
  window.renderProductCard = renderProductCard;
  window.handleAddToCart = (e, id) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    addToCart(id, 1);
  };

  window.handleWishlist = (e, id) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    const added = toggleWishlist(id);
    const btn = e?.currentTarget;
    if (btn) {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = added ? 'fas fa-heart text-red-500 text-xs' : 'far fa-heart text-gray-400 text-xs';
      }
    }
  };

  window.toggleMobileMenu = () => {
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('menuIcon');
    if (menu) {
      menu.classList.toggle('hidden');
      if (icon) icon.className = menu.classList.contains('hidden') ? 'fas fa-bars' : 'fas fa-times';
    }
  };

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    updateHeaderCounts();
  });

  return {
    getCart,
    saveCart,
    setCart,
    addToCart,
    removeFromCart,
    updateQty,
    updateQuantity,
    getCartCount,
    getCartTotal,
    getCartSubtotal,
    clearCart,
    getWishlist,
    saveWishlist,
    isInWishlist,
    toggleWishlist,
    getWishlistCount,
    updateHeaderCounts,
    initUI,
    showToast,
    renderProductCard,
  };
})();

// Provide formatPrice & renderStars globally if not already declared in data.js
if (typeof formatPrice !== 'function') {
  function formatPrice(amount) {
    if (amount === undefined || amount === null) return '0đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
  }
}

if (typeof renderStars !== 'function') {
  function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) html += '<i class="fas fa-star text-yellow-400 text-xs"></i>';
      else if (i - 0.5 <= rating) html += '<i class="fas fa-star-half-alt text-yellow-400 text-xs"></i>';
      else html += '<i class="far fa-star text-yellow-400 text-xs"></i>';
    }
    return html;
  }
}
