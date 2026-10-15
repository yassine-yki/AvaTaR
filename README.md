# Avatar AI — navigation et expérience

Site statique français, sans framework ni dépendance de build.

## Structure

- `index.html` : quatre scènes photographiques plein écran, puis un pied de page de navigation.
- `approche.html` : méthode, problèmes résolus et publics concernés.
- `solutions.html` : assistant e-mail interactif et autres possibilités d’automatisation.
- `securite.html` : contrôle humain et principes de sécurité.
- `questions.html` : FAQ d’origine.
- `reservation.html` : calendrier Google Appointment Scheduling d’origine et contact e-mail prérempli.
- `credits.html` : provenance des images et mention des scènes illustratives.

`styles.css` contient l’expérience commune : scènes, menu latéral, marque fixe, navigation et transitions. `content.css` conserve les composants de contenu détaillé. `reservation.css` gère la page de réservation. `script.js` anime la navigation ; `demo.js` pilote uniquement la démonstration locale.

## Parcours

La page d’accueil reprend le rythme du site de référence General Matter : grandes images bord à bord, texte court, marque en bas à gauche qui se réduit au défilement, menu à droite sur ordinateur et sur toute la largeur sur mobile, puis pages dédiées pour approfondir.

Le défilement reste natif. Aucun défilement forcé ni snap n’est imposé. Le réglage système de réduction des animations est respecté. Les liens sont de vrais liens HTML ; les retours navigateur, ouvertures dans un nouvel onglet et liens profonds restent disponibles. Sans JavaScript, une navigation de secours reste visible.

Les anciens liens `#process`, `#faq` et `#contact` mènent respectivement à la méthode, à la FAQ et à la réservation. `#solutions` et `#security` conservent leurs panneaux sur l’accueil.

## Réservation et démonstration

L’URL du calendrier et le lien e-mail prérempli sont identiques au dépôt original. Le lien direct Google Calendar reste disponible si l’intégration est bloquée. Aucun rendez-vous de test n’a été confirmé.

Les trois messages de démonstration sont fictifs. Les filtres, la sélection, la régénération et la copie fonctionnent localement. Aucun accès à une boîte mail ni aucun envoi de message n’est effectué.

## Aperçu et déploiement

Servir ce dossier avec un serveur HTTP statique. L’aperçu de cette session est `http://localhost:4173/`. Il dépend du serveur local actif. Les fichiers HTML peuvent aussi être ouverts directement pour consulter la version enregistrée.

Vercel continue à publier la racine du dépôt, sans build. `vercel.json` conserve `cleanUrls`. Les changements restent sur la branche locale `codex/general-matter-ui` tant qu’une publication n’est pas autorisée.

## Vérification effectuée

- Accueil et menu sur ordinateur et mobile ; fermeture par Échap.
- Réduction du logo pendant le défilement, accès aux pages détaillées et retour navigateur.
- Filtres et interactions de la démonstration e-mail.
- Accordéons de la FAQ.
- Chargement du calendrier intégré et affichage de créneaux disponibles.
- Vérification des liens locaux, des ancres, des assets et de la conservation du calendrier et des contacts.

Les sources et prompts des images sont détaillés dans `ASSETS.md`.
