const menuButton = document.querySelector('.menu-toggle');
const drawer = document.querySelector('.navigation-drawer');
const closeButton = document.querySelector('.menu-close');
function closeMenu() {
  drawer?.close();
  smoothScroll?.start();
  scheduleScroll();
  document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}
menuButton?.addEventListener('click', () => {
  smoothScroll?.stop();
  drawer.showModal();
  document.body.classList.add('menu-open');
  menuButton.setAttribute('aria-expanded', 'true');
});
closeButton?.addEventListener('click', closeMenu);
drawer?.addEventListener('close', () => {
  smoothScroll?.start();
  scheduleScroll();
  document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
});
drawer?.addEventListener('click', event => {
  if (event.target !== drawer) return;
  const rect = drawer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeMenu();
});
// The page stays in the native document flow. Lenis only smooths wheel input.
const scenes = [...document.querySelectorAll('.scene')];
const hero = scenes[0];
const heroImage = hero?.querySelector('.scene-media img');
const heroMedia = hero?.querySelector('.scene-media');
const footer = document.querySelector('.site-footer');
const footerReveal = document.querySelector('.footer-reveal');
const brandName = document.querySelector('.floating-name');
const root = document.documentElement;
const clamp = value => Math.min(1, Math.max(0, value));
let smoothScroll = null;
let frameId = 0;
let scrollDirty = true;
let measureDirty = true;
let heroHeight = innerHeight;
let footerHeight = 0;

// Preserve each heading's accessible name while revealing letters within whole words.
const headings = [...document.querySelectorAll('.word-reveal')];
headings.forEach(heading => {
  const text = [...heading.childNodes].map(node => node.nodeName === 'BR' ? '\n' : node.textContent).join('').trim();
  heading.setAttribute('aria-label', text.replace(/\s+/g, ' '));
  let index = 0;
  const fragment = document.createDocumentFragment();
  text.split(/(\s+)/).forEach(word => {
    if (!word.trim()) { fragment.append(word.includes('\n') ? document.createElement('br') : document.createTextNode(word)); return; }
    const wrap = document.createElement('span');
    wrap.className = 'reveal-word';
    wrap.setAttribute('aria-hidden', 'true');
    for (const letter of word) {
      const char = document.createElement('span');
      char.className = 'char';
      char.style.setProperty('--char', index++);
      char.textContent = letter;
      wrap.append(char);
    }
    fragment.append(wrap);
  });
  heading.replaceChildren(fragment);
});
function revealHeading(heading, visible = true) {
  heading.classList.toggle('is-visible', visible);
  heading.closest('.scene-copy')?.classList.toggle('is-visible', visible);
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      revealHeading(entry.target, entry.isIntersecting);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
  headings.forEach(heading => observer.observe(heading));
} else headings.forEach(heading => revealHeading(heading));

function paintScroll() {
  scrollDirty = false;
  if (measureDirty) {
    heroHeight = heroMedia?.clientHeight || innerHeight;
    footerHeight = footer?.offsetHeight || 0;
    root.style.setProperty('--brand-name-offset', (brandName?.offsetHeight || 0) + 'px');
    measureDirty = false;
  }
  // Read geometry together before updating compositor-only visual properties.
  const heroRect = hero?.getBoundingClientRect();
  const footerRect = (footerReveal || footer)?.getBoundingClientRect();
  const travel = heroRect ? Math.max(0, -heroRect.top) : 0;
  const heroProgress = clamp(travel / heroHeight);
  const brandProgress = heroRect ? clamp(travel / (heroHeight * .55)) : 1;
  const footerProgress = footerRect && footerHeight ? clamp((innerHeight - footerRect.top) / footerHeight) : 0;
  root.style.setProperty('--brand-progress', String(brandProgress));
  hero?.style.setProperty('--hero-progress', String(heroProgress));
  if (heroImage) heroImage.style.transform = 'scale(' + (1 + .2 * heroProgress) + ')';
  if (footerReveal) footerReveal.style.setProperty('--footer-shift', ((footerProgress - 1) * footerHeight).toFixed(2) + 'px');
  document.body.classList.toggle('past-hero', Boolean(heroRect && heroRect.bottom <= 0));
  document.body.classList.toggle('has-scrolled', scrollY > 40);
  document.body.classList.toggle('footer-visible', Boolean(footerRect && footerRect.top < innerHeight - 80));
}
function frame(time) {
  frameId = 0;
  smoothScroll?.raf(time);
  if (scrollDirty) paintScroll();
  if (smoothScroll && !smoothScroll.isStopped && !document.hidden && !frameId) frameId = requestAnimationFrame(frame);
}
function scheduleScroll() {
  scrollDirty = true;
  if (!frameId && !document.hidden) frameId = requestAnimationFrame(frame);
}
function configureMotion() {
  smoothScroll?.destroy();
  smoothScroll = null;
  root.classList.add('motion-ready');
  if (scenes.length && typeof window.Lenis === 'function') {
    smoothScroll = new window.Lenis({
      lerp: .1,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      anchors: true,
      prevent: node => node.closest?.('.navigation-drawer, [data-native-scroll]')
    });
    smoothScroll.on('scroll', () => { scrollDirty = true; });
    if (drawer?.open) smoothScroll.stop();
  }
  measureDirty = true;
  scheduleScroll();
}
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', () => { measureDirty = true; scheduleScroll(); }, { passive: true });
// The clipped footer must also be fully reachable by keyboard.
footerReveal?.addEventListener('focusin', () => {
  if (footerReveal.getBoundingClientRect().bottom > innerHeight + 1) {
    const bottom = document.documentElement.scrollHeight - innerHeight;
    if (smoothScroll) smoothScroll.scrollTo(bottom, { immediate: true });
    else window.scrollTo({ top: bottom, behavior: 'instant' });
    scheduleScroll();
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; }
  else scheduleScroll();
});
window.addEventListener('pagehide', () => { cancelAnimationFrame(frameId); frameId = 0; });
configureMotion();
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
  if (event.persisted) { closeMenu(); configureMotion(); }
  scheduleScroll();
});
// Preserve old incoming section bookmarks after the information architecture changed.
if (document.body.classList.contains('home-page')) {
  const redirects = { '#process': './approche.html#process', '#faq': './questions.html#faq', '#contact': './reservation.html' };
  if (redirects[location.hash]) location.replace(redirects[location.hash]);
}
