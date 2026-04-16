'use strict';

/* ================================================================
   CLARITYLINES — clarity-pro.js
   Versión: 2026
================================================================ */

/* ----------------------------------------------------------------
   Sticky nav — añade .scrolled al superar 70px de scroll
---------------------------------------------------------------- */
(function initStickyNav() {
  var header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 70);
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ----------------------------------------------------------------
   Hamburguesa — apertura y cierre del menú móvil
---------------------------------------------------------------- */
(function initHamburger() {
  var btn = document.getElementById('hamburger');
  var nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));

    var spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(function (el) {
        el.style.transform = '';
        el.style.opacity   = '';
      });
    }
  });

  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelectorAll('span').forEach(function (el) {
        el.style.transform = '';
        el.style.opacity   = '';
      });
    });
  });
})();


/* ----------------------------------------------------------------
   Smooth scroll — compensación del header fijo
---------------------------------------------------------------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;

      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      var headerH = document.getElementById('site-header').offsetHeight;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();


/* ----------------------------------------------------------------
   Newsletter — confirmación inline sin recarga
---------------------------------------------------------------- */
(function initNewsletter() {
  var btn        = document.getElementById('newsletter-btn');
  var emailInput = document.getElementById('newsletter-email');
  var wrap       = document.getElementById('newsletter-input-wrap');
  if (!btn || !emailInput || !wrap) return;

  btn.addEventListener('click', function () {
    var email = emailInput.value.trim();
    var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) {
      emailInput.style.borderBottom = '1px solid #c0392b';
      emailInput.style.color        = '#c0392b';
      emailInput.value              = '';
      emailInput.setAttribute('placeholder', 'Introduce un correo válido');
      setTimeout(function () {
        emailInput.style.borderBottom = '';
        emailInput.style.color        = '';
        emailInput.setAttribute('placeholder', 'Tu correo electrónico');
      }, 2500);
      return;
    }

    wrap.style.transition = 'opacity 0.4s';
    wrap.style.opacity    = '0';

    setTimeout(function () {
      wrap.style.display = 'none';

      var confirm = document.createElement('div');
      confirm.className = 'newsletter-confirm';
      confirm.innerHTML =
        '<i class="fas fa-circle-check"></i>' +
        '<span>Genial. Pronto recibirás noticias de ClarityLines.</span>';

      wrap.parentNode.appendChild(confirm);

      confirm.style.opacity    = '0';
      confirm.style.transform  = 'translateY(8px)';
      confirm.style.transition = 'opacity 0.5s, transform 0.5s';

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          confirm.style.opacity   = '1';
          confirm.style.transform = 'translateY(0)';
        });
      });
    }, 400);
  });

  emailInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') btn.click();
  });
})();


/* ----------------------------------------------------------------
   Año en el footer
---------------------------------------------------------------- */
(function injectYear() {
  var el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ----------------------------------------------------------------
   Reveal — IntersectionObserver para .reveal
---------------------------------------------------------------- */
(function initRevealObserver() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('in-view');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
})();


/* ----------------------------------------------------------------
   Barra de progreso de lectura
---------------------------------------------------------------- */
(function initProgressBar() {
  var bar = document.getElementById('progress-bar');
  if (!bar) return;

  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    bar.style.display = 'none';
    return;
  }

  function updateBar() {
    var scrollTop  = window.scrollY;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var porcentaje = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = porcentaje + '%';
  }

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
})();


/* ----------------------------------------------------------------
   initSpecsTable — aplica .specs-row--alt a filas pares de la
   tabla de especificaciones para efecto zebra sin :nth-child
---------------------------------------------------------------- */
(function initSpecsTable() {
  var table = document.getElementById('pro-specs-table');
  if (!table) return;

  var rows = table.querySelectorAll('tbody .specs-row');
  rows.forEach(function (row, index) {
    if (index % 2 !== 0) {
      row.classList.add('specs-row--alt');
    }
  });
})();


/* ----------------------------------------------------------------
   initComparativaHighlight — destaca la columna del modelo actual
   y muestra indicador de scroll si la tabla desborda en móvil
---------------------------------------------------------------- */
(function initComparativaHighlight() {
  var table    = document.getElementById('comparativa-table');
  var scrollEl = document.getElementById('comparativa-scroll-wrap');
  var hint     = document.getElementById('comparativa-scroll-hint');
  if (!table) return;

  /* El modelo activo de esta página es "pro" */
  var activeCols = table.querySelectorAll('[data-model="pro"], .comparativa-col--active');
  activeCols.forEach(function (cell) {
    cell.classList.add('comparativa-col--active');
  });

  if (!scrollEl || !hint) return;

  function checkOverflow() {
    var inner = scrollEl.querySelector('.prod-comparativa-scroll');
    if (!inner) return;
    if (inner.scrollWidth > inner.clientWidth) {
      hint.classList.add('visible');
    } else {
      hint.classList.remove('visible');
    }
  }

  checkOverflow();
  window.addEventListener('resize', checkOverflow, { passive: true });

  var inner = scrollEl.querySelector('.prod-comparativa-scroll');
  if (inner) {
    inner.addEventListener('scroll', function () {
      if (inner.scrollLeft > 20) {
        hint.classList.remove('visible');
      }
    }, { passive: true });
  }
})();


/* ----------------------------------------------------------------
   Contador de carrito en header
---------------------------------------------------------------- */
(function initCartCount() {
  var badge = document.getElementById('cart-count');
  if (!badge || !window.CL_CART) return;

  function renderCount() {
    var count = window.CL_CART.getCount();
    badge.textContent = String(count);
    badge.style.display = count === 0 ? 'none' : 'inline-flex';
  }

  window.addEventListener('cl:cart:updated', renderCount);
  renderCount();
})();


/* ----------------------------------------------------------------
   Añadir al carrito con feedback inline
---------------------------------------------------------------- */
(function initAddToCart() {
  var btn = document.querySelector('.add-to-cart-btn[data-product-id]');
  if (!btn || !window.CL_CART) return;

  var original = btn.innerHTML;
  var timer = null;

  btn.addEventListener('click', function () {
    var productId = btn.getAttribute('data-product-id');
    if (!productId) return;

    window.CL_CART.addItem(productId, 1);
    btn.innerHTML = '✓ Añadido al carrito';

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(function () {
      btn.innerHTML = original;
      timer = null;
    }, 1200);
  });
})();


/* ----------------------------------------------------------------
   Enlaces de compra directa hacia carrito
---------------------------------------------------------------- */
(function initBuyLinks() {
  if (!window.CL_CART) return;

  var links = document.querySelectorAll('.add-to-cart-link[data-product-id]');
  if (!links.length) return;

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var productId = link.getAttribute('data-product-id');
      if (!productId) return;

      window.CL_CART.addItem(productId, 1);
      window.location.href = link.getAttribute('href');
    });
  });
})();
