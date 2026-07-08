/* ==========================================================================
   MAIN.JS — Theme toggle, Navigation, Scroll, Testimonials, Contact Form
   ========================================================================== */

(function () {
  'use strict';

  // ── Theme Toggle ──────────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Initialize theme
  setTheme(getPreferredTheme());

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ── Navigation ────────────────────────────────────────────────
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const navHamburger = document.getElementById('navHamburger');
  const allNavLinks = document.querySelectorAll('.nav__link');

  // Scroll detection for nav border
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile menu toggle
  navHamburger.addEventListener('click', () => {
    navHamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navHamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // ── Testimonials Carousel ─────────────────────────────────────
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.testimonials__dot');
  let currentTestimonial = 0;
  let autoplayInterval;

  function goToTestimonial(index) {
    currentTestimonial = index;
    if (track) {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
    }
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'));
      goToTestimonial(index);
      resetAutoplay();
    });
  });

  function nextTestimonial() {
    const total = dots.length;
    goToTestimonial((currentTestimonial + 1) % total);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextTestimonial, 5000);
  }

  // Start autoplay
  if (dots.length > 0) {
    resetAutoplay();
  }

  // Touch support for carousel
  if (track) {
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      const total = dots.length;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe left - next
          goToTestimonial((currentTestimonial + 1) % total);
        } else {
          // Swipe right - prev
          goToTestimonial((currentTestimonial - 1 + total) % total);
        }
        resetAutoplay();
      }
    }, { passive: true });
  }

  // ── Contact Form ──────────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
        .then(() => {
          contactForm.style.display = 'none';
          formSuccess.classList.add('visible');
        })
        .catch(() => {
          // Fallback: show success anyway for local dev
          contactForm.style.display = 'none';
          formSuccess.classList.add('visible');
        });
    });
  }

  // ── FAQ Accordion ─────────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        const q = i.querySelector('.faq__question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

})();
