const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-nav');
const header = document.querySelector('[data-header]');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileMenu?.classList.toggle('open', !open);
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 24), { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const tabButtons = document.querySelectorAll('[data-filter]');
const mailItems = document.querySelectorAll('.mail-item');
tabButtons.forEach((button) => button.addEventListener('click', () => {
  tabButtons.forEach((tab) => { tab.classList.remove('active'); tab.setAttribute('aria-selected', 'false'); });
  button.classList.add('active');
  button.setAttribute('aria-selected', 'true');
  const filter = button.dataset.filter;
  mailItems.forEach((item) => { item.hidden = filter !== 'all' && !item.dataset.tags.split(' ').includes(filter); });
}));

mailItems.forEach((item) => item.addEventListener('click', () => {
  mailItems.forEach((mail) => mail.classList.remove('active'));
  item.classList.add('active');
}));

document.querySelector('.copy-button')?.addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const text = button.closest('.reply-box')?.querySelector('p')?.textContent ?? '';
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied';
    window.setTimeout(() => { button.textContent = 'Copy reply'; }, 1500);
  } catch {
    button.textContent = 'Select & copy';
  }
});
