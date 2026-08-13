/* OPS JARC e.U. – Shared JavaScript */

// ── NAV SCROLL BEHAVIOR ─────────────────────────────────────────────
const nav = document.getElementById('mainNav');
if (nav) {
  const isHomepage = document.querySelector('.hero') !== null;
  if (isHomepage) {
    nav.classList.add('dark');
    const heroEl = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('dark', window.pageYOffset < heroEl.offsetHeight - 80);
    }, { passive: true });
  } else {
    // Inner pages: nav always light but show border on scroll
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.pageYOffset > 10
        ? '0 1px 20px rgba(0,0,0,0.08)' : '';
    }, { passive: true });
  }
  // Active nav link
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/index';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href')?.replace(/\/$/, '') || '';
    if (href && currentPath.endsWith(href.replace(/^\.\.\//, '').replace(/\.html$/, ''))) {
      a.classList.add('active');
    }
  });
}

// ── MOBILE MENU ─────────────────────────────────────────────────────
const mobileBtn  = document.getElementById('mobileBtn');
const mobileNav  = document.getElementById('mobileNav');
const mnClose    = document.getElementById('mnClose');
if (mobileBtn && mobileNav) {
  const openMenu = () => {
    mobileNav.classList.add('open');
    mobileBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mobileNav.classList.remove('open');
    mobileBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  mobileBtn.addEventListener('click', openMenu);
  if (mnClose) mnClose.addEventListener('click', closeMenu);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

// ── SCROLL REVEAL ───────────────────────────────────────────────────
const rvObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      rvObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

// ── COUNT-UP ────────────────────────────────────────────────────────
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (!target) return;
    const dur = 1400, start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

// ── PARALLAX (homepage only) ─────────────────────────────────────────
const heroBg      = document.getElementById('heroBg');
const heroContent = document.getElementById('heroContent');
if (heroBg && heroContent) {
  window.addEventListener('scroll', () => {
    const s = window.pageYOffset;
    if (s < window.innerHeight * 1.2) {
      heroBg.style.transform      = `translateY(${s * 0.2}px)`;
      heroContent.style.transform = `translateY(${s * 0.28}px)`;
      heroContent.style.opacity   = Math.max(0, 1 - s / 650);
    }
  }, { passive: true });
}

// ── FAQ ACCORDION ───────────────────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── CONTACT FORM ────────────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn   = contactForm.querySelector('[type=submit]');
    const msg   = document.getElementById('formMsg');
    const origText = btn.textContent;
    btn.textContent = 'Wird gesendet …';
    btn.disabled = true;
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        msg.className = 'form-msg show-success';
        msg.textContent = '✓ Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden.';
        contactForm.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      msg.className = 'form-msg show-error';
      msg.textContent = 'Fehler beim Senden. Bitte schreiben Sie uns direkt an ops.jarc@outlook.com';
    }
    btn.textContent = origText;
    btn.disabled = false;
    msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

// ── SMOOTH ANCHOR SCROLLING ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
