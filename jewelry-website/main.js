(function () {
  'use strict';

  // ── NAV SCROLL SHADOW ────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // ── HAMBURGER MENU ───────────────────────────────
  const hamburger   = document.getElementById('hamburger');
  const navMobile   = document.getElementById('nav-mobile');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navMobile.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // ── PAGE NAVIGATION ──────────────────────────────
  const pages    = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link');

  function showPage(id, filter) {
    pages.forEach(p => p.classList.toggle('active', p.id === id));
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.page === id));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // close mobile menu
    hamburger.classList.remove('open');
    navMobile.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');

    // apply filter on collections page
    if (id === 'collections' && filter) {
      applyFilter(filter);
    } else if (id === 'collections') {
      applyFilter('all');
    }
  }

  // delegate all [data-page] clicks
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-page]');
    if (!el) return;
    e.preventDefault();
    const page   = el.dataset.page;
    const filter = el.dataset.filter || null;
    if (page) showPage(page, filter);
  });

  // nav logo
  document.querySelector('.nav-logo').addEventListener('click', e => {
    e.preventDefault();
    showPage('home');
  });

  // ── SHOP FILTER ──────────────────────────────────
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('#shop-grid .product-card');

  function applyFilter(cat) {
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === cat));
    productCards.forEach(card => {
      const match = cat === 'all' || card.dataset.cat === cat;
      card.style.display = match ? '' : 'none';
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // ── CONTACT FORM ──────────────────────────────────
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      btn.textContent = 'Message Sent';
      btn.disabled = true;
      btn.style.background = '#2D6A4F';
      btn.style.borderColor = '#2D6A4F';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
        contactForm.reset();
      }, 3500);
    });
  }

  // ── NEWSLETTER FORM ───────────────────────────────
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn   = newsletterForm.querySelector('button');
      const input = newsletterForm.querySelector('input');
      btn.textContent = 'Subscribed!';
      btn.disabled = true;
      btn.style.background = '#2D6A4F';
      btn.style.borderColor = '#2D6A4F';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 3000);
    });
  }

  // ── PRODUCT CARD ANIMATION ON SCROLL ─────────────
  if ('IntersectionObserver' in window) {
    const cards = document.querySelectorAll('.product-card, .category-card, .value-item, .trust-item');
    const style = document.createElement('style');
    style.textContent = `
      .animate-in { opacity: 0; transform: translateY(20px); }
      .animate-in.visible { opacity: 1; transform: translateY(0); transition: opacity 0.5s ease, transform 0.5s ease; }
    `;
    document.head.appendChild(style);

    cards.forEach((card, i) => {
      card.classList.add('animate-in');
      card.style.transitionDelay = `${(i % 4) * 60}ms`;
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    cards.forEach(card => observer.observe(card));
  }
})();
