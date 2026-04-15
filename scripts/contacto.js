'use strict';

/* ================================================================
   CLARITYLINES — contacto.js
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
   Formulario de contacto — validación inline y confirmación
   Lógica análoga al newsletter: borde rojo + mensaje de error en
   placeholder, sin submit real, confirmación animada al completar
---------------------------------------------------------------- */
(function initContactForm() {
  const submitBtn = document.getElementById('cf-submit');
  const confirm   = document.getElementById('cf-confirm');
  const formWrap  = document.getElementById('contacto-form');
  if (!submitBtn || !confirm || !formWrap) return;

  /* Helpers de validación */
  function markError(input, placeholder) {
    input.classList.add('cf-input--error');
    input.value = '';
    input.setAttribute('placeholder', placeholder);
    input.focus();
  }

  function clearError(input, placeholder) {
    input.classList.remove('cf-input--error');
    input.setAttribute('placeholder', placeholder);
  }

  /* Limpiar error al empezar a escribir */
  formWrap.querySelectorAll('.cf-input').forEach(function (input) {
    input.addEventListener('input', function () {
      if (input.classList.contains('cf-input--error')) {
        clearError(input, input.dataset.placeholder || '');
      }
    });
  });

  /* Guardar placeholders originales */
  formWrap.querySelectorAll('.cf-input').forEach(function (input) {
    input.dataset.placeholder = input.getAttribute('placeholder') || '';
  });

  submitBtn.addEventListener('click', function () {
    const nombre  = document.getElementById('cf-nombre');
    const email   = document.getElementById('cf-email');
    const asunto  = document.getElementById('cf-asunto');
    const mensaje = document.getElementById('cf-mensaje');

    /* Restablecer estados previos */
    [nombre, email, asunto, mensaje].forEach(function (f) {
      f.classList.remove('cf-input--error');
    });

    let firstError = null;

    /* Validar nombre */
    if (!nombre.value.trim()) {
      markError(nombre, 'Campo obligatorio');
      firstError = firstError || nombre;
    }

    /* Validar email */
    const emailVal = email.value.trim();
    if (!emailVal) {
      markError(email, 'Campo obligatorio');
      firstError = firstError || email;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      markError(email, 'Correo electrónico no válido');
      firstError = firstError || email;
    }

    /* Validar asunto select */
    if (!asunto.value) {
      asunto.classList.add('cf-input--error');
      firstError = firstError || asunto;
    }

    /* Validar mensaje */
    if (!mensaje.value.trim()) {
      markError(mensaje, 'Por favor, escribe tu mensaje');
      firstError = firstError || mensaje;
    }

    /* Si hay errores, mostrar el primero y detener */
    if (firstError) {
      /* Revertir estilos de error tras 2.5 s */
      setTimeout(function () {
        [nombre, email, asunto, mensaje].forEach(function (f) {
          f.classList.remove('cf-input--error');
          if (f.dataset.placeholder) {
            f.setAttribute('placeholder', f.dataset.placeholder);
          }
        });
      }, 2500);
      return;
    }

    /* Todo correcto — animar salida del formulario y mostrar confirmación */
    formWrap.style.transition = 'opacity 0.4s';
    formWrap.style.opacity    = '0';
    submitBtn.disabled        = true;

    setTimeout(function () {
      formWrap.style.display = 'none';

      confirm.removeAttribute('hidden');
      confirm.style.opacity   = '0';
      confirm.style.transform = 'translateY(10px)';
      confirm.style.transition = 'opacity 0.5s var(--ease), transform 0.5s var(--ease)';

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          confirm.style.opacity   = '1';
          confirm.style.transform = 'translateY(0)';
        });
      });
    }, 400);
  });
})();
