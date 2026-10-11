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

/* ---------- enquiry form honeypot ---------- */

(function enquiryHoneypot() {
  const form = document.querySelector('.enquiry-form');
  if (!form) return;

  const honey = form.querySelector('input[name="_honey"]');
  if (!honey) return;

  form.addEventListener('submit', (e) => {
    if (honey.value.trim() !== '') {
      // A hidden field only a bot would fill in — silently drop the submission.
      e.preventDefault();
    }
  });
})();

/* ---------- enquiry form validation ---------- */

(function enquiryValidation() {
  const form = document.querySelector('.enquiry-form');
  if (!form) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phonePattern = /^\+?\d{10,15}$/;

  const rules = [
    { id: 'name', required: 'Please enter your name.' },
    {
      id: 'email',
      required: 'Please enter your email address.',
      invalid: 'Please enter a valid email address, e.g. name@example.com.',
      test: (v) => emailPattern.test(v),
    },
    {
      id: 'phone',
      invalid: 'Please enter a valid phone number, e.g. 07123 456789.',
      test: (v) => phonePattern.test(v.replace(/[\s\-().]/g, '')),
    },
    { id: 'subject', required: 'Please select a subject.' },
    { id: 'year_group', required: 'Please select a year group.' },
    { id: 'preferred_contact', required: 'Please select how you would like to be contacted.' },
  ];

  function showError(input, message) {
    let el = input.parentElement.querySelector('.field-error');
    if (!el) {
      el = document.createElement('span');
      el.className = 'field-error';
      el.setAttribute('role', 'alert');
      input.parentElement.appendChild(el);
    }
    el.textContent = message;
    input.classList.toggle('has-error', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validate(rule) {
    const input = form.querySelector('#' + rule.id);
    const value = input.value.trim();
    let message = '';
    if (!value) {
      if (rule.required) message = rule.required;
    } else if (rule.test && !rule.test(value)) {
      message = rule.invalid;
    }
    showError(input, message);
    return !message;
  }

  rules.forEach((rule) => {
    const input = form.querySelector('#' + rule.id);
    input.addEventListener('blur', () => validate(rule));
    input.addEventListener('input', () => {
      if (input.classList.contains('has-error')) validate(rule);
    });
  });

  form.addEventListener('submit', (e) => {
    const results = rules.map((rule) => validate(rule));
    if (results.includes(false)) {
      e.preventDefault();
      const firstBad = rules.find((rule) => form.querySelector('#' + rule.id).classList.contains('has-error'));
      if (firstBad) form.querySelector('#' + firstBad.id).focus();
    }
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
