const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- theme toggle ---------- */

(function themeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
  }

  function applyIcon(theme) {
    const icon = toggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    toggle.setAttribute('aria-pressed', String(theme === 'light'));
    toggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  }

  applyIcon(root.getAttribute('data-theme') || 'dark');

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    applyIcon(next);
  });
})();

/* ---------- profile photo fallback ---------- */

(function profilePhoto() {
  const img = document.getElementById('profile-photo');
  if (!img) return;

  if (img.complete && img.naturalWidth === 0) {
    img.style.display = 'none';
    return;
  }

  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
})();

/* ---------- project media fallback ---------- */

(function projectMedia() {
  document.querySelectorAll('.project-media-img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
      img.style.display = 'none';
      return;
    }
    img.addEventListener('error', () => {
      img.style.display = 'none';
    });
  });
})();

/* ---------- matrix rain background ---------- */

(function matrixRain() {
  const canvas = document.getElementById('matrix-rain');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  const glyphs = '01LIBA<>/{}[]#$%*+=010101アイウエオカキクケコ'.split('');
  const fontSize = 16;
  let columns, drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0).map(() => Math.random() * -50);
  }

  function draw() {
    if (document.documentElement.getAttribute('data-theme') === 'light') return;

    ctx.fillStyle = 'rgba(18, 16, 19, 0.14)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillStyle = Math.random() > 0.85 ? '#c23b64' : 'rgba(130, 126, 138, 0.7)';
      ctx.fillText(glyph, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 60);
})();

/* ---------- terminal typewriter effect ---------- */

function typeLines(lines, onDone) {
  if (!lines.length) return;

  if (prefersReducedMotion) {
    lines.forEach((line) => { line.textContent = line.dataset.line; });
    if (onDone) onDone();
    return;
  }

  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= lines.length) {
      if (onDone) onDone();
      return;
    }
    const el = lines[lineIndex];
    const text = el.dataset.line;
    let charIndex = 0;

    const interval = setInterval(() => {
      el.textContent = text.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex >= text.length) {
        clearInterval(interval);
        lineIndex++;
        setTimeout(typeLine, 250);
      }
    }, 16);
  }

  typeLine();
}

typeLines(document.querySelectorAll('#typed-terminal .type-line'));

/* ---------- welcome modal ---------- */

(function welcomeModal() {
  const modal = document.getElementById('welcome-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('welcome-modal-close');
  const portfolioBtn = document.getElementById('welcome-modal-portfolio');

  if (sessionStorage.getItem('welcomeSeen') === 'true') {
    modal.classList.add('is-hidden');
    return;
  }

  sessionStorage.setItem('welcomeSeen', 'true');

  function closeModal() {
    modal.classList.add('is-hidden');
  }

  closeBtn.addEventListener('click', closeModal);
  portfolioBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  typeLines(modal.querySelectorAll('.type-line'));
})();

/* ---------- scroll reveal ---------- */

(function scrollReveal() {
  const targets = document.querySelectorAll(
    '.project-card, .skill-block, .contact-card, .section-heading, .section-sub'
  );

  targets.forEach((el) => el.classList.add('reveal'));

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
})();
