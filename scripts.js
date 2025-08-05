const toggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// On toggle change
toggle.addEventListener('change', () => {
  const newTheme = toggle.checked ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
   console.log("Theme changed to:", newTheme);
});