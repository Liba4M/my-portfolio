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
