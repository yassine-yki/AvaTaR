// Illustrative local demo only: these controls never access or send real mail.
const demoMessages = [
  { summary: 'Amelia évalue Avatar AI pour une équipe de 12 personnes et souhaite mieux comprendre l’intégration et la sécurité.', confidence: '94 % de confiance', labels: ['Vente', 'Priorité haute', 'Réponse requise'], replies: ['Bonjour Amelia, merci pour votre message. Nous pouvons échanger sur les besoins de votre équipe de 12 personnes, vos outils et vos exigences de sécurité. Quel créneau vous conviendrait ?', 'Bonjour Amelia, merci de votre intérêt pour Avatar AI. Je vous propose un appel pour étudier votre workflow et les étapes d’un déploiement adapté à votre équipe.'] },
  { summary: 'James souhaite clarifier plusieurs points de la proposition avant de poursuivre les échanges.', confidence: '91 % de confiance', labels: ['Vente', 'Priorité normale', 'Réponse requise'], replies: ['Bonjour James, merci pour votre retour. Pourriez-vous nous transmettre vos questions sur la proposition ? Nous les reprendrons ensemble point par point.', 'Bonjour James, je reste disponible pour préciser la proposition. Envoyez-nous les points à clarifier et nous préparerons une réponse détaillée.'] },
  { summary: 'Stripe transmet un récapitulatif mensuel de l’activité du compte. Message informatif, sans réponse attendue.', confidence: '98 % de confiance', labels: ['Information', 'Priorité normale', 'Sans réponse'], replies: [] }
];
const tabButtons = [...document.querySelectorAll('[data-filter]')];
const mailItems = [...document.querySelectorAll('.mail-item')];
const panel = document.querySelector('.ai-panel');
const replyBox = document.querySelector('.reply-box');
const copyButton = document.querySelector('.copy-button');
let selectedIndex = 0;
let variant = 0;
let copyTimeout;
function selectMessage(index) {
  selectedIndex = index; variant = 0;
  mailItems.forEach((mail, i) => { mail.classList.toggle('active', i === index); mail.setAttribute('aria-pressed', String(i === index)); });
  const message = demoMessages[index];
  if (!panel || !message) return;
  panel.querySelector(':scope > p').textContent = message.summary;
  panel.querySelector('.confidence').textContent = message.confidence;
  panel.querySelectorAll('.ai-labels span').forEach((label, i) => { label.textContent = message.labels[i]; label.classList.toggle('priority', i === 1 && index === 0); });
  replyBox.hidden = message.replies.length === 0;
  replyBox.querySelector('p').textContent = message.replies[0] || '';
  window.clearTimeout(copyTimeout);
  copyButton.textContent = 'Copier la réponse';
}
tabButtons.forEach(button => button.addEventListener('click', () => {
  tabButtons.forEach(tab => { tab.classList.toggle('active', tab === button); tab.setAttribute('aria-pressed', String(tab === button)); });
  const filter = button.dataset.filter;
  mailItems.forEach(item => { item.hidden = filter !== 'all' && !item.dataset.tags.split(' ').includes(filter); });
  if (mailItems[selectedIndex]?.hidden) selectMessage(mailItems.findIndex(item => !item.hidden));
}));
mailItems.forEach((item, index) => item.addEventListener('click', () => selectMessage(index)));
document.querySelector('.regenerate-button')?.addEventListener('click', () => {
  const replies = demoMessages[selectedIndex].replies;
  variant = (variant + 1) % replies.length;
  replyBox.querySelector('p').textContent = replies[variant];
  window.clearTimeout(copyTimeout); copyButton.textContent = 'Copier la réponse';
});
copyButton?.addEventListener('click', async () => {
  const text = replyBox.querySelector('p').textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = 'Copié';
  } catch {
    const range = document.createRange(); range.selectNodeContents(replyBox.querySelector('p'));
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    copyButton.textContent = 'Texte sélectionné · Ctrl/Cmd+C';
  }
  window.clearTimeout(copyTimeout);
  copyTimeout = window.setTimeout(() => { copyButton.textContent = 'Copier la réponse'; }, 2200);
});
if (mailItems.length) selectMessage(0);
