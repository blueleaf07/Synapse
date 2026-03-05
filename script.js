/* ═══════════════════════════════════════════
   SYNAPSE — script.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. CUSTOM CURSOR
  ───────────────────────────────────────── */
  const ring = document.getElementById('cursorRing');
  const dot  = document.getElementById('cursorDot');
  let rx = 0, ry = 0, mx = 0, my = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    (function animCursor() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animCursor);
    })();

    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button, [data-cursor]')) ring.classList.add('hovered');
      else ring.classList.remove('hovered');
    });
  }


  /* ─────────────────────────────────────────
     2. NAVBAR SCROLL
  ───────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  /* ─────────────────────────────────────────
     3. HAMBURGER / MOBILE MENU
  ───────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mob-link, .mob-cta').forEach(el => {
    el.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  /* ─────────────────────────────────────────
     4. SPA-STYLE PAGE NAVIGATION
  ───────────────────────────────────────── */
  function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update nav link active state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });

    // Update hash
    history.pushState({ page: pageId }, '', '#' + pageId);

    // Trigger reveals for the new page
    setTimeout(triggerReveals, 100);
  }

  // Attach to ALL links that have data-page
  document.addEventListener('click', e => {
    const link = e.target.closest('[data-page]');
    if (!link) return;
    e.preventDefault();
    const page = link.dataset.page;
    if (page) navigateTo(page);
  });

  // Handle browser back/forward
  window.addEventListener('popstate', e => {
    const page = (e.state && e.state.page) || 'home';
    navigateTo(page);
  });

  // Handle initial hash
  const initPage = window.location.hash.replace('#', '') || 'home';
  navigateTo(initPage);


  /* ─────────────────────────────────────────
     5. SCROLL REVEAL
  ───────────────────────────────────────── */
  function triggerReveals() {
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;

    const revealEls = activePage.querySelectorAll('.reveal');
    const staggerEls = activePage.querySelectorAll('.stagger');

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => obs.observe(el));
    staggerEls.forEach(el => obs.observe(el));
  }

  // Also run on scroll for page re-use
  window.addEventListener('scroll', triggerReveals, { passive: true });
  triggerReveals();


  /* ─────────────────────────────────────────
     6. HERO PARALLAX
  ───────────────────────────────────────── */
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('#home.active .hero');
    if (!hero) return;
    const y = window.scrollY;
    hero.querySelectorAll('.blob').forEach((blob, i) => {
      blob.style.transform = `translateY(${y * (i % 2 === 0 ? 0.12 : -0.08)}px)`;
    });
  }, { passive: true });


  /* ─────────────────────────────────────────
     7. INDUSTRY TABS
  ───────────────────────────────────────── */
  const indTabs = document.getElementById('indTabs');
  if (indTabs) {
    indTabs.addEventListener('click', e => {
      const tab = e.target.closest('.ind-tab');
      if (!tab) return;
      const target = tab.dataset.ind;

      // Update tabs
      indTabs.querySelectorAll('.ind-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels
      document.querySelectorAll('.ind-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  }


  /* ─────────────────────────────────────────
     8. PORTFOLIO FILTER
  ───────────────────────────────────────── */
  const portFilters = document.getElementById('portFilters');
  const portGrid    = document.getElementById('portGrid');

  if (portFilters && portGrid) {
    portFilters.addEventListener('click', e => {
      const btn = e.target.closest('.pf-btn');
      if (!btn) return;
      const filter = btn.dataset.filter;

      // Update buttons
      portFilters.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards with animation
      portGrid.querySelectorAll('.port-card').forEach(card => {
        const cat = card.dataset.cat;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeUp 0.4s cubic-bezier(0.19,1,0.22,1) both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }


  /* ─────────────────────────────────────────
     9. BUDGET BUTTONS (Contact)
  ───────────────────────────────────────── */
  document.querySelectorAll('.budget-btns').forEach(group => {
    group.addEventListener('click', e => {
      const btn = e.target.closest('.bb');
      if (!btn) return;
      group.querySelectorAll('.bb').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });


  /* ─────────────────────────────────────────
     10. CONTACT FORM SUBMIT
  ───────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const successMsg  = document.getElementById('successMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      // Validate
      const name  = contactForm.querySelector('[name="name"]').value.trim();
      const email = contactForm.querySelector('[name="email"]').value.trim();
      const msg   = contactForm.querySelector('[name="message"]').value.trim();

      if (!name || !email || !msg) {
        // Simple shake on invalid fields
        [contactForm.querySelector('[name="name"]'),
         contactForm.querySelector('[name="email"]'),
         contactForm.querySelector('[name="message"]')].forEach(field => {
          if (!field.value.trim()) {
            field.style.borderColor = '#E07070';
            field.style.animation = 'shake 0.4s ease';
            setTimeout(() => {
              field.style.animation = '';
              field.style.borderColor = '';
            }, 600);
          }
        });
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending…';

      // Simulate send
      setTimeout(() => {
        contactForm.style.display = 'none';
        successMsg.style.display = 'block';
      }, 1800);
    });
  }


  /* ─────────────────────────────────────────
     11. INDUSTRY CARDS → Navigate to industries page
  ───────────────────────────────────────── */
  // Industry cards on home page already have data-page="industries"
  // and are handled by the generic [data-page] click listener above.


  /* ─────────────────────────────────────────
     12. SMOOTH HOVER ON NAV LINKS (active underline)
  ───────────────────────────────────────── */
  // Already handled via CSS


  /* ─────────────────────────────────────────
     13. ANIMATE HERO STATS ON LOAD (count-up effect)
  ───────────────────────────────────────── */
  function countUp(el, target, suffix, duration = 1200) {
    const isNum = !isNaN(parseInt(target));
    if (!isNum) return;
    const num = parseInt(target);
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * num) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Trigger count-up when hero stats are visible
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const statEls = entry.target.querySelectorAll('.hstat-v');
      statEls.forEach(el => {
        const raw = el.textContent;
        const num = raw.replace(/[^0-9]/g, '');
        const suffix = raw.replace(/[0-9]/g, '');
        if (num) countUp(el, num, suffix);
      });
      statsObs.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObs.observe(heroStats);


  /* ─────────────────────────────────────────
     14. ADD SHAKE KEYFRAME DYNAMICALLY
  ───────────────────────────────────────── */
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
  `;
  document.head.appendChild(shakeStyle);


  /* ─────────────────────────────────────────
     15. LOGO CLICK → home
  ───────────────────────────────────────── */
  document.querySelectorAll('.logo, .footer-logo').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigateTo('home');
    });
  });

}); // end DOMContentLoaded