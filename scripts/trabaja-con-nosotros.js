'use strict';

/* ================================================================
   CLARITYLINES — trabaja-con-nosotros.js
   Versión: 2026
================================================================ */

/* ----------------------------------------------------------------
   Sticky nav — añade .scrolled al superar 70px de scroll
---------------------------------------------------------------- */
(function initStickyNav() {
  const header = document.getElementById('site-header');
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
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));

    const spans = btn.querySelectorAll('span');
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
      const id = this.getAttribute('href');
      if (id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      const headerH = document.getElementById('site-header').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();


/* ----------------------------------------------------------------
   Newsletter — confirmación inline sin recarga
---------------------------------------------------------------- */
(function initNewsletter() {
  const btn        = document.getElementById('newsletter-btn');
  const emailInput = document.getElementById('newsletter-email');
  const wrap       = document.getElementById('newsletter-input-wrap');
  if (!btn || !emailInput || !wrap) return;

  btn.addEventListener('click', function () {
    const email = emailInput.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

      const confirm = document.createElement('div');
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
  const el = document.getElementById('footer-year');
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

  const observer = new IntersectionObserver(function (entries) {
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
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    bar.style.display = 'none';
    return;
  }

  function updateBar() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const porcentaje = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = porcentaje + '%';
  }

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
})();


/* ----------------------------------------------------------------
   Acordeón de posiciones abiertas
   Abre y cierra cada .tcn-posicion-body con animación de altura.
   Gestiona el atributo aria-expanded en el botón correspondiente.
   Solo una posición puede estar abierta simultáneamente.
---------------------------------------------------------------- */
(function initAcordeon() {
  var headers = document.querySelectorAll('.tcn-posicion-header');
  if (!headers.length) return;

  function openItem(header, body) {
    header.setAttribute('aria-expanded', 'true');
    body.removeAttribute('hidden');
    body.style.overflow  = 'hidden';
    body.style.maxHeight = '0px';
    body.style.transition = 'max-height 0.45s cubic-bezier(0.22,1,0.36,1)';
    requestAnimationFrame(function () {
      body.style.maxHeight = body.scrollHeight + 'px';
    });
    body.addEventListener('transitionend', function cleanup() {
      body.style.maxHeight  = '';
      body.style.overflow   = '';
      body.style.transition = '';
      body.removeEventListener('transitionend', cleanup);
    });
  }

  function closeItem(header, body) {
    header.setAttribute('aria-expanded', 'false');
    body.style.overflow   = 'hidden';
    body.style.maxHeight  = body.scrollHeight + 'px';
    body.style.transition = 'max-height 0.35s cubic-bezier(0.22,1,0.36,1)';
    requestAnimationFrame(function () {
      body.style.maxHeight = '0px';
    });
    body.addEventListener('transitionend', function cleanup() {
      body.setAttribute('hidden', '');
      body.style.maxHeight  = '';
      body.style.overflow   = '';
      body.style.transition = '';
      body.removeEventListener('transitionend', cleanup);
    });
  }

  headers.forEach(function (header) {
    header.addEventListener('click', function () {
      var bodyId = header.getAttribute('aria-controls');
      var body   = document.getElementById(bodyId);
      if (!body) return;

      var isOpen = header.getAttribute('aria-expanded') === 'true';

      headers.forEach(function (h) {
        if (h === header) return;
        if (h.getAttribute('aria-expanded') === 'true') {
          var otherId = h.getAttribute('aria-controls');
          var other   = document.getElementById(otherId);
          if (other) closeItem(h, other);
        }
      });

      if (isOpen) {
        closeItem(header, body);
      } else {
        openItem(header, body);
      }
    });

    header.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var idx   = Array.prototype.indexOf.call(headers, header);
        var nextH = headers[idx + 1];
        if (nextH) nextH.focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        var idx   = Array.prototype.indexOf.call(headers, header);
        var prevH = headers[idx - 1];
        if (prevH) prevH.focus();
      }
    });
  });
})();
