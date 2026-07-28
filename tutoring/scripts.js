const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- academy resource requests ---------- */

(function academyRequests() {
  const cards = document.querySelectorAll('.academy-card[data-resource]');
  if (!cards.length) return;

  const namespace = 'byliba-academy';

  cards.forEach((card) => {
    const resource = card.dataset.resource;
    const btn = card.querySelector('.request-btn');
    const countEl = card.querySelector('.request-count');
    const storageKey = `requested-${resource}`;

    function renderCount(value) {
      if (!value) {
        countEl.textContent = 'Be the first to request this';
        return;
      }
      countEl.textContent = value === 1 ? '1 request so far' : `${value} requests so far`;
    }

    fetch(`https://abacus.jasoncameron.dev/get/${namespace}/${resource}`)
      .then((res) => (res.ok ? res.json() : { value: 0 }))
      .then((data) => renderCount(data.value))
      .catch(() => renderCount(0));

    if (localStorage.getItem(storageKey) === 'true') {
      btn.disabled = true;
      btn.textContent = 'Requested ✓';
    }

    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      btn.disabled = true;
      btn.textContent = 'Requested ✓';
      localStorage.setItem(storageKey, 'true');

      fetch(`https://abacus.jasoncameron.dev/hit/${namespace}/${resource}`)
        .then((res) => res.json())
        .then((data) => renderCount(data.value))
        .catch(() => {});
    });
  });
})();

/* ---------- scroll animations (GSAP) ---------- */

(function scrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance, plays once on load
  gsap.from('.hero > *', {
    opacity: 0,
    y: 24,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out',
  });

  // Section headings fade up as they enter view
  gsap.utils.toArray('.section-heading, .section-sub').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  // Cards, steps, and rows reveal individually as they scroll into view
  const revealSelectors = [
    '.approach-card',
    '.lesson-step',
    '.subject-grid',
    '.pricing-card',
    '.testimonial-card',
    '.academy-card',
    '.about-grid',
    '.enquiry-form',
    '.contact-card',
    '.approach-list li',
  ];

  gsap.utils.toArray(revealSelectors.join(',')).forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
})();
