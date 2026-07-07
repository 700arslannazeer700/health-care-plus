/* =====================================================================
   HEALTHCARE PLUS — SCRIPT.JS
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------- PRELOADER ---------------------- */
  window.addEventListener('load', () => {
    const pre = document.getElementById('hp-preloader');
    if (pre) setTimeout(() => pre.classList.add('hide'), 300);
  });

  /* ---------------------- AOS ---------------------- */
  if (window.AOS) AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });

  /* ---------------------- PROGRESS BAR ---------------------- */
  const progressBar = document.querySelector('.hp-progress-bar');
  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, pct)) + '%';
  });

  /* ---------------------- NAVBAR SHRINK ---------------------- */
  const navbar = document.getElementById('mainNavbar');
  const onScrollNav = () => navbar && navbar.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScrollNav);
  onScrollNav();

  /* ---------------------- MOBILE NAV TOGGLE ---------------------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  navToggle?.addEventListener('click', () => navMenu.classList.toggle('open'));
  document.querySelectorAll('#navMenu a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));

  /* ---------------------- DARK MODE TOGGLE ---------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('i');
  const applyTheme = (mode) => {
    document.body.classList.toggle('dark-mode', mode === 'dark');
    if (themeIcon) themeIcon.className = mode === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  };
  applyTheme(localStorage.getItem('hp-theme') || 'light');
  themeToggle?.addEventListener('click', () => {
    const mode = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(mode);
    localStorage.setItem('hp-theme', mode);
  });

  /* ---------------------- BACK TO TOP ---------------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => backToTop && backToTop.classList.toggle('show', window.scrollY > 500));
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------------- RIPPLE ---------------------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const rect = this.getBoundingClientRect();
      circle.style.width = circle.style.height = diameter + 'px';
      circle.style.left = (e.clientX - rect.left - diameter / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - diameter / 2) + 'px';
      circle.classList.add('ripple-effect');
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ---------------------- CURSOR GLOW (mouse follow) ---------------------- */
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow && window.innerWidth > 991) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.opacity = '1';
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
  }

  /* ---------------------- HERO MOUSE PARALLAX ---------------------- */
  const heroVisual = document.querySelector('.hp-hero-visual');
  const heroSection = document.querySelector('.hp-hero');
  if (heroVisual && heroSection && window.innerWidth > 991) {
    heroSection.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      heroVisual.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  /* ---------------------- GSAP HERO REVEAL ---------------------- */
  if (window.gsap) {
    gsap.from('.hp-hero-content > *', { y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' });
    gsap.from('.hp-hero-visual', { x: 40, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
    gsap.utils.toArray('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(card, { rotateX: -y / 18, rotateY: x / 18, duration: 0.4, ease: 'power2.out', transformPerspective: 700 });
      });
      card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5 }));
    });
  }

  /* ---------------------- COUNTER ANIMATION ---------------------- */
  const counters = document.querySelectorAll('[data-counter]');
  const runCounter = (el) => {
    const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + (el.getAttribute('data-suffix') || '');
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { runCounter(entry.target); obs.unobserve(entry.target); } });
    }, { threshold: 0.4 });
    counters.forEach(c => obs.observe(c));
  }

  /* ---------------------- PROCESS STEP IN-VIEW (progress line fill) ---------------------- */
  const processSteps = document.querySelectorAll('.process-step');
  const processLineFill = document.querySelector('.process-line-fill');
  if (processSteps.length) {
    const stepObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          const visibleCount = document.querySelectorAll('.process-step.in-view').length;
          if (processLineFill) processLineFill.style.width = ((visibleCount - 0.5) / processSteps.length * 100) + '%';
        }
      });
    }, { threshold: 0.5 });
    processSteps.forEach(s => stepObs.observe(s));
  }

  /* ---------------------- PROGRESS BARS (Why Choose Us) ---------------------- */
  const progressItems = document.querySelectorAll('.progress-fill');
  if (progressItems.length) {
    const progObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-width') + '%';
          progObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    progressItems.forEach(p => progObs.observe(p));
  }

  /* ---------------------- SWIPERS ---------------------- */
  if (window.Swiper && document.querySelector('.testimonial-swiper')) {
    new Swiper('.testimonial-swiper', {
      loop: true, spaceBetween: 24, autoplay: { delay: 4500, disableOnInteraction: false },
      pagination: { el: '.testimonial-swiper .swiper-pagination', clickable: true },
      breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } },
    });
  }
  if (window.Swiper && document.querySelector('.doctors-swiper')) {
    new Swiper('.doctors-swiper', {
      loop: true, spaceBetween: 24, autoplay: { delay: 3800, disableOnInteraction: false },
      breakpoints: { 0: { slidesPerView: 1.2 }, 576: { slidesPerView: 2 }, 992: { slidesPerView: 4 } },
    });
  }

  /* ---------------------- APPOINTMENT FORM VALIDATION ---------------------- */
  const appointmentForm = document.getElementById('appointmentForm');
  appointmentForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    this.querySelectorAll('.form-floating-hp').forEach(group => {
      const field = group.querySelector('input, select, textarea');
      if (field.hasAttribute('required') && !field.value.trim()) {
        group.classList.add('is-invalid');
        valid = false;
      } else {
        group.classList.remove('is-invalid');
      }
      if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        group.classList.add('is-invalid');
        valid = false;
      }
    });
    if (valid) {
      const btn = this.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Request Submitted!';
      btn.disabled = true;
      setTimeout(() => { btn.innerHTML = original; btn.disabled = false; this.reset(); }, 2800);
    } else {
      this.querySelector('.is-invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  /* ---------------------- MAGNETIC BUTTONS ---------------------- */
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

});
