/* ==========================================================================
   ANIMATIONS.JS — Intersection Observer para scroll reveal
   ========================================================================== */

(function () {
  'use strict';

  // ── Intersection Observer for reveal animations ───────────────
  const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger';

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function observeElements() {
    document.querySelectorAll(revealSelectors).forEach(el => {
      if (!el.classList.contains('visible')) {
        observer.observe(el);
      }
    });
  }

  // Initial observation
  observeElements();

  // Expose for dynamic content (projects rendered by JS)
  window.observeNewElements = observeElements;

  // ── Smooth counter animation for hero stats ───────────────────
  const statValues = document.querySelectorAll('.hero__stat-value');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateStats();
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) {
    statsObserver.observe(heroStats);
  }

  function animateStats() {
    statValues.forEach(stat => {
      const text = stat.textContent;
      const match = text.match(/(\+?)(\d+)/);
      if (!match) return;

      const prefix = match[1];
      const target = parseInt(match[2]);
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        stat.textContent = prefix + current;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // ── Parallax effect on hero glows ─────────────────────────────
  const glows = document.querySelectorAll('.hero__glow');

  if (glows.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      glows.forEach((glow, i) => {
        const speed = (i + 1) * 15;
        glow.style.transform = 'translate(' + (x * speed) + 'px, ' + (y * speed) + 'px)';
      });
    }, { passive: true });
  }

})();
