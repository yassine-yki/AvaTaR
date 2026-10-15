# Avatar AI

Site vitrine français d’Avatar AI, destiné aux PME et aux professionnels. Le site reste statique, sans dépendance ni étape de build.

## Consulter le site

Ouvrir `index.html` pour une consultation locale, ou servir ce dossier avec un serveur HTTP statique pour tester l’ensemble des interactions. La page de réservation est `reservation.html`.

## Modifier le site

- `index.html` : contenu de la page d’accueil, navigation, démonstration et FAQ.
- `styles.css` : identité visuelle et mise en page responsive.
- `script.js` : menu accessible et démonstration interactive des e-mails.
- `reservation.html` et `reservation.css` : page de réservation et contact par e-mail.
- `assets/avatar-sculpture.svg` : illustration vectorielle originale, dérivée du symbole Avatar AI.

Le contenu et les liens de contact sont en français. Les messages de la démonstration sont fictifs ; elle n’accède à aucune boîte mail et n’envoie aucun message. Les boutons de filtre, de sélection, de régénération et de copie fonctionnent localement.

## Réserver un échange

Tous les liens de réservation mènent à `reservation.html`. Cette page conserve le calendrier Google Appointment Scheduling d’origine et son URL exacte. Les disponibilités et la confirmation de rendez-vous restent gérées par Google Calendar. Un lien direct vers ce même calendrier est également disponible si le navigateur bloque son intégration.

Le contact reste `contact@avatar-ai.xyz`, avec le message prérempli d’origine sur la page de réservation.

## Vérification avant publication

1. Vérifier l’accueil et le menu sur ordinateur et mobile ; la touche Échap ferme le menu.
2. Tester les trois filtres de la démonstration, sélectionner un message, régénérer une suggestion et la copier.
3. Ouvrir les questions fréquentes.
4. Ouvrir la page de réservation, vérifier les disponibilités Google Calendar et le retour à l’accueil. Ne confirmer un rendez-vous que pour un besoin réel.
5. Vérifier les liens e-mail et les ancres des sections.

## Déploiement

Publier la racine du dépôt sur l’hébergement existant. Aucune commande de build ni dossier de sortie ne sont nécessaires. `vercel.json` conserve l’option `cleanUrls`.

La refonte est préparée sur la branche locale `codex/general-matter-ui`. Elle n’est pas publiée automatiquement. La publication sur le dépôt distant se fait après validation.
