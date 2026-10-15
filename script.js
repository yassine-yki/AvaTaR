const menuButton = document.querySelector('.menu-toggle');
const drawer = document.querySelector('.navigation-drawer');
const closeButton = document.querySelector('.menu-close');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function closeMenu() {
  drawer?.close();
  document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}
menuButton?.addEventListener('click', () => {
  drawer.showModal();
  document.body.classList.add('menu-open');
  menuButton.setAttribute('aria-expanded', 'true');
});
closeButton?.addEventListener('click', closeMenu);
drawer?.addEventListener('close', () => {
  document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
});
drawer?.addEventListener('click', event => {
  if (event.target !== drawer) return;
  const rect = drawer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeMenu();
});
// Reveal words in reading order. The original heading remains available without JS.
const headings = document.querySelectorAll('.word-reveal');
headings.forEach(heading => {
  let index = 0;
  const children = [...heading.childNodes];
  children.forEach(node => {
    if (node.nodeType !== Node.TEXT_NODE) return;
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(text => {
      if (!text.trim()) fragment.append(document.createTextNode(text));
      else {
        const span = document.createElement('span');
        span.className = 'word'; span.style.setProperty('--word', index++); span.textContent = text;
        fragment.append(span);
      }
    });
    node.replaceWith(fragment);
  });
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: .4 });
  headings.forEach(heading => observer.observe(heading));
} else headings.forEach(heading => heading.classList.add('is-visible'));
// Native scrolling remains intact: only images and the corner lockup respond to it.
const scenes = [...document.querySelectorAll('.scene')];
const footer = document.querySelector('.site-footer');
let scrollPending = false;
function paintScroll() {
  scrollPending = false;
  const height = window.innerHeight;
  const progress = Math.min(1, Math.max(0, window.scrollY / (height * .65)));
  document.body.classList.toggle('past-hero', Boolean(scenes[0] && scenes[0].getBoundingClientRect().bottom <= 0));
  const startSize = window.innerWidth <= 600 ? 140 : 190;
  const size = reducedMotion.matches ? (progress > .15 ? 62 : startSize) : startSize - (startSize - 62) * progress;
  document.documentElement.style.setProperty('--brand-size', `${size}px`);
  document.documentElement.style.setProperty('--brand-name-opacity', String(1 - Math.min(1,progress * 2)));
  document.documentElement.style.setProperty('--brand-name-height', `${64 * (1-progress)}px`);
  document.body.classList.toggle('footer-visible', Boolean(footer && footer.getBoundingClientRect().top < height - 80));
  if (!reducedMotion.matches) {
    scenes.forEach(scene => {
      const rect = scene.getBoundingClientRect();
      if (rect.top > height || rect.bottom < 0) return;
      const image = scene.querySelector('.scene-media img');
      const offset = Math.max(-height*.055, Math.min(height*.055, -rect.top*.12));
      image.style.transform = `translate3d(0,${offset}px,0) scale(1.12)`;
    });
  }
}
function scheduleScroll() { if (!scrollPending) { scrollPending = true; requestAnimationFrame(paintScroll); } }
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll);
reducedMotion.addEventListener('change', scheduleScroll);
paintScroll();
// Keep real pages, native browser history, and modifier-click behavior.
let departing = false;
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
  const url = new URL(link.href, location.href);
  if (!['http:', 'https:', 'file:'].includes(url.protocol) || url.origin !== location.origin) return;
  if (url.pathname === location.pathname && url.hash) return;
  if (!/\.html$/.test(url.pathname) && url.pathname !== '/') return;
  if (reducedMotion.matches) { closeMenu(); return; }
  event.preventDefault();
  if (departing) return;
  departing = true;
  closeMenu();
  document.body.classList.add('is-departing');
  window.setTimeout(() => location.assign(url.href), 280);
});
window.addEventListener('pageshow', event => {
  departing = false;
  document.body.classList.remove('is-departing');
  if (event.persisted) closeMenu();
  scheduleScroll();
});
// Preserve old incoming section bookmarks after the information architecture changed.
if (document.body.classList.contains('home-page')) {
  const redirects = { '#process': './approche.html#process', '#faq': './questions.html#faq', '#contact': './reservation.html' };
  if (redirects[location.hash]) location.replace(redirects[location.hash]);
}
