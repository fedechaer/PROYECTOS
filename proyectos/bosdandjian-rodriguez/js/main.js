// ── Nav scroll class ──
const nav = document.querySelector('.site-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Hamburger / mobile drawer ──
const hamburger = document.getElementById('hamburger');
const drawer    = document.getElementById('nav-drawer');

function closeMenu() {
  hamburger.classList.remove('open');
  drawer.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  drawer.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── FAQ keyboard accessibility ──
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      q.closest('details').toggleAttribute('open');
    }
  });
});

// ── Contact form ──
(function () {
  const form    = document.getElementById('contacto-form');
  const submit  = document.getElementById('form-submit');
  const status  = document.getElementById('form-status');
  const textarea= document.getElementById('cf-mensaje');
  const charEl  = document.getElementById('cf-chars');

  if (!form) return;

  // Character counter
  textarea.addEventListener('input', () => {
    charEl.textContent = textarea.value.length + ' / 3000';
  });

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = 'form-status ' + type;
    status.removeAttribute('hidden');
  }

  function clearFieldErrors() {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFieldErrors();
    status.setAttribute('hidden', '');

    // Basic client-side validation
    let valid = true;
    ['cf-nombre', 'cf-email', 'cf-area', 'cf-mensaje'].forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    });
    const emailEl = document.getElementById('cf-email');
    if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.classList.add('error'); valid = false;
    }
    if (!valid) {
      setStatus('Por favor completá todos los campos obligatorios.', 'error');
      return;
    }

    // Send
    submit.disabled = true;
    submit.classList.add('loading');

    try {
      const res  = await fetch('contactar.php', {
        method: 'POST',
        body: new FormData(form),
      });
      const data = await res.json();

      if (data.ok) {
        window.location.href = 'gracias.html';
      } else {
        setStatus(data.msg || 'Ocurrió un error. Intentá por WhatsApp.', 'error');
        submit.disabled = false;
        submit.classList.remove('loading');
      }
    } catch {
      setStatus('Sin conexión. Intentá de nuevo o escribinos por WhatsApp.', 'error');
      submit.disabled = false;
      submit.classList.remove('loading');
    }
  });
})();

// ── Lightbox gallery ──
(function () {
  const GALLERIES = {
    'casa-buceo': {
      title: 'Oportunidad Buceo · Padrón único 320 m²',
      images: [
        'img/inmuebles/casa-buceo/portada.webp',
        'img/inmuebles/casa-buceo/01.webp',
        'img/inmuebles/casa-buceo/02.webp',
        'img/inmuebles/casa-buceo/03.webp',
        'img/inmuebles/casa-buceo/04.webp',
        'img/inmuebles/casa-buceo/05.webp',
        'img/inmuebles/casa-buceo/06.webp',
        'img/inmuebles/casa-buceo/07.webp',
        'img/inmuebles/casa-buceo/08.webp',
        'img/inmuebles/casa-buceo/09.webp',
        'img/inmuebles/casa-buceo/10.webp',
        'img/inmuebles/casa-buceo/11.webp',
        'img/inmuebles/casa-buceo/12.webp',
      ]
    },
    'apt-barrio-sur': {
      title: 'Apartamento con balcón · Barrio Sur',
      images: [
        'img/inmuebles/apto-barrio-sur/portada.webp',
        'img/inmuebles/apto-barrio-sur/01.webp',
        'img/inmuebles/apto-barrio-sur/02.webp',
        'img/inmuebles/apto-barrio-sur/03.webp',
        'img/inmuebles/apto-barrio-sur/04.webp',
        'img/inmuebles/apto-barrio-sur/05.webp',
        'img/inmuebles/apto-barrio-sur/06.webp',
        'img/inmuebles/apto-barrio-sur/07.webp',
        'img/inmuebles/apto-barrio-sur/08.webp',
        'img/inmuebles/apto-barrio-sur/09.webp',
        'img/inmuebles/apto-barrio-sur/10.webp',
      ]
    },
    'casa-playa-hermosa': {
      title: 'Casa con terreno · Playa Hermosa',
      images: [
        'img/inmuebles/casa-playa-hermosa/portada.webp',
        'img/inmuebles/casa-playa-hermosa/01.webp',
        'img/inmuebles/casa-playa-hermosa/02.webp',
        'img/inmuebles/casa-playa-hermosa/03.webp',
        'img/inmuebles/casa-playa-hermosa/04.webp',
        'img/inmuebles/casa-playa-hermosa/05.webp',
        'img/inmuebles/casa-playa-hermosa/06.webp',
        'img/inmuebles/casa-playa-hermosa/07.webp',
        'img/inmuebles/casa-playa-hermosa/08.webp',
        'img/inmuebles/casa-playa-hermosa/09.webp',
        'img/inmuebles/casa-playa-hermosa/10.webp',
        'img/inmuebles/casa-playa-hermosa/11.webp',
        'img/inmuebles/casa-playa-hermosa/12.webp',
        'img/inmuebles/casa-playa-hermosa/13.webp',
      ]
    },
    'terreno-tres-cruces': {
      title: 'Terreno de 900 m² · Próximo a Av. Italia',
      images: [
        'img/inmuebles/terreno-av-italia/portada.webp',
        'img/inmuebles/terreno-av-italia/01.webp',
        'img/inmuebles/terreno-av-italia/02.webp',
        'img/inmuebles/terreno-av-italia/03.webp',
        'img/inmuebles/terreno-av-italia/04.webp',
        'img/inmuebles/terreno-av-italia/05.webp'
      ]
    },
    'apt-tres-cruces': {
      title: 'Casa de dos plantas · Tres Cruces',
      images: [
        'img/inmuebles/casa-tres-cruces/01.webp',
        'img/inmuebles/casa-tres-cruces/02.webp',
        'img/inmuebles/casa-tres-cruces/03.webp',
        'img/inmuebles/casa-tres-cruces/04.webp',
        'img/inmuebles/casa-tres-cruces/05.webp',
        'img/inmuebles/casa-tres-cruces/06.webp',
        'img/inmuebles/casa-tres-cruces/07.webp',
        'img/inmuebles/casa-tres-cruces/08.webp',
        'img/inmuebles/casa-tres-cruces/09.webp',
        'img/inmuebles/casa-tres-cruces/10.webp',
        'img/inmuebles/casa-tres-cruces/11.webp'
  ]
    }
  };

  const overlay  = document.getElementById('lb-overlay');
  const lbImg    = document.getElementById('lb-img');
  const lbTitle  = document.getElementById('lb-title');
  const lbCounter= document.getElementById('lb-counter');
  const lbThumbs = document.getElementById('lb-thumbs');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');
  const lbClose  = document.getElementById('lb-close');

  if (!overlay) return;

  let current = 0;
  let images  = [];

  function openGallery(galleryId, startIndex = 0) {
    const g = GALLERIES[galleryId];
    if (!g) return;
    images  = g.images;
    lbTitle.textContent = g.title;

    // Build thumbnails
    lbThumbs.innerHTML = '';
    images.forEach((src, i) => {
      const thumb = document.createElement('button');
      thumb.className = 'lb-thumb' + (i === startIndex ? ' active' : '');
      thumb.setAttribute('aria-label', 'Ver foto ' + (i + 1));
      const img = document.createElement('img');
      img.src = src; img.alt = ''; img.loading = 'lazy';
      thumb.appendChild(img);
      thumb.addEventListener('click', () => goTo(i));
      lbThumbs.appendChild(thumb);
    });

    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    goTo(startIndex, false);
  }

  function goTo(index, animate = true) {
    current = Math.max(0, Math.min(index, images.length - 1));

    if (animate) {
      lbImg.classList.add('loading');
      setTimeout(() => {
        lbImg.src = images[current];
        lbImg.alt = 'Foto ' + (current + 1);
        lbImg.classList.remove('loading');
      }, 150);
    } else {
      lbImg.src = images[current];
      lbImg.alt = 'Foto ' + (current + 1);
    }

    lbCounter.textContent = (current + 1) + ' / ' + images.length;
    lbPrev.disabled = current === 0;
    lbNext.disabled = current === images.length - 1;

    lbThumbs.querySelectorAll('.lb-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === current);
    });

    // Scroll active thumb into view
    const activeThumb = lbThumbs.children[current];
    if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  function closeLightbox() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    lbImg.src = '';
    lbThumbs.innerHTML = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => goTo(current - 1));
  lbNext.addEventListener('click', () => goTo(current + 1));

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (overlay.hasAttribute('hidden')) return;
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'Escape')     closeLightbox();
  });

  // Touch swipe on lightbox
  let lbTouchX = 0;
  overlay.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
  overlay.addEventListener('touchend', e => {
    const diff = lbTouchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { if (diff > 0) goTo(current + 1); else goTo(current - 1); }
  }, { passive: true });

  // Wire up "Ver fotos" buttons
  document.querySelectorAll('.inmueble-ver-fotos').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openGallery(btn.dataset.gallery, 0);
    });
  });
})();
(function () {
  const viewport = document.getElementById('test-viewport');
  const track    = document.getElementById('test-track');
  const dotsEl   = document.getElementById('test-dots');
  const prevBtn  = document.getElementById('test-prev');
  const nextBtn  = document.getElementById('test-next');

  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.test-card'));
  let current = 0;
  let autoTimer = null;

  function getVisible() {
    const w = window.innerWidth;
    if (w < 640)  return 1;
    if (w < 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisible());
  }

  function getGap() {
    const raw = getComputedStyle(track).columnGap;
    const n = parseFloat(raw);
    return isNaN(n) ? 20 : n;
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    const max = getMaxIndex();
    for (let i = 0; i <= max; i++) {
      const btn = document.createElement('button');
      btn.className = 'test-dot' + (i === current ? ' active' : '');
      btn.setAttribute('aria-label', 'Ir a reseña ' + (i + 1));
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(i === current));
      btn.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
      dotsEl.appendChild(btn);
    }
  }

  function goTo(index) {
    const max = getMaxIndex();
    current = Math.max(0, Math.min(index, max));

    const cardW = cards[0].getBoundingClientRect().width;
    const gap   = getGap();
    track.style.transform = `translateX(-${current * (cardW + gap)}px)`;

    dotsEl.querySelectorAll('.test-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', String(i === current));
    });

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === max;
  }

  function next() { goTo(current >= getMaxIndex() ? 0 : current + 1); }
  function prev() { goTo(current <= 0 ? getMaxIndex() : current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 5000);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);

  // Touch swipe
  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAuto();
      if (diff > 0) next(); else prev();
      startAuto();
    }
  }, { passive: true });

  // Rebuild on resize
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      current = Math.min(current, getMaxIndex());
      buildDots();
      track.style.transition = 'none';
      goTo(current);
      requestAnimationFrame(() => { track.style.transition = ''; });
    }, 200);
  });

  // Init
  buildDots();
  goTo(0);
  startAuto();
})();
