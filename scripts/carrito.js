(function () {
  'use strict';

  const STORAGE_KEY = 'cl_cart';

  const CATALOG = {
    air: {
      id: 'air',
      name: 'Clarity Air',
      price: 399,
      description: 'Modelo ligero con lente adaptativa esencial.'
    },
    pro: {
      id: 'pro',
      name: 'Clarity Pro',
      price: 649,
      description: 'Modelo avanzado con mayor rango y autonomía.'
    },
    elite: {
      id: 'elite',
      name: 'Clarity Elite',
      price: 949,
      description: 'Edición premium con personalización y soporte 24/7.'
    }
  };

  function readStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed.filter(function (item) {
        return item && CATALOG[item.productId] && Number(item.qty) > 0;
      }).map(function (item) {
        return {
          productId: item.productId,
          qty: Math.max(1, Math.min(5, Number(item.qty) || 1))
        };
      });
    } catch (err) {
      return [];
    }
  }

  function writeStorage(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function dispatchUpdated() {
    window.dispatchEvent(new CustomEvent('cl:cart:updated'));
  }

  function addItem(productId, qty) {
    if (!CATALOG[productId]) return;

    const amount = Number(qty) || 1;
    const safeQty = Math.max(1, amount);
    const items = readStorage();
    const existing = items.find(function (item) { return item.productId === productId; });

    if (existing) {
      existing.qty = Math.min(5, existing.qty + safeQty);
    } else {
      items.push({
        productId: productId,
        qty: Math.min(5, safeQty)
      });
    }

    writeStorage(items);
    dispatchUpdated();
  }

  function removeItem(productId) {
    const items = readStorage().filter(function (item) {
      return item.productId !== productId;
    });

    writeStorage(items);
    dispatchUpdated();
  }

  function updateQty(productId, qty) {
    if (!CATALOG[productId]) return;

    const nextQty = Number(qty);
    if (!Number.isFinite(nextQty) || nextQty <= 0) {
      removeItem(productId);
      return;
    }

    const items = readStorage();
    const target = items.find(function (item) { return item.productId === productId; });
    if (!target) return;

    target.qty = Math.max(1, Math.min(5, Math.round(nextQty)));
    writeStorage(items);
    dispatchUpdated();
  }

  function getCart() {
    const items = readStorage();
    return items.map(function (item) {
      const product = CATALOG[item.productId];
      return {
        productId: item.productId,
        qty: item.qty,
        product: product,
        price: product.price,
        subtotal: product.price * item.qty
      };
    });
  }

  function getTotal() {
    return getCart().reduce(function (acc, item) {
      return acc + item.subtotal;
    }, 0);
  }

  function getCount() {
    return getCart().reduce(function (acc, item) {
      return acc + item.qty;
    }, 0);
  }

  window.CATALOG = CATALOG;
  window.CL_CART = {
    addItem: addItem,
    removeItem: removeItem,
    updateQty: updateQty,
    getCart: getCart,
    getTotal: getTotal,
    getCount: getCount
  };
})();
