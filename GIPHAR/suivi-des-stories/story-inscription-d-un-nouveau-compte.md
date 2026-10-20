# Story : Inscription d'un nouveau compte

| | |
|---|---|
| **Où en est-on** | Étape 2 sur 6 — cas de test en attente de votre validation |
| **Prochaine action** | Relire le cas de test dans Squash (référence TC-HVC-6), puis cliquer sur [Valider ou refuser le cas](http://localhost:5678/form-waiting/42?signature=8dd17e1c326905148fbace88b02e314e18b2a37b0a3df8a0993284c907c4e9e7) |
| **Story Jira** | [Inscription d'un nouveau compte](https://testacademy.atlassian.net/browse/HVC-6) |
| **Dernière mise à jour** | 20/10/2026 17:53 par l'agent analyste |

## 1. Cas de test rédigé — agent analyste

**Nom** : TC-HVC-6 - Inscription d'un nouveau compte (2 étapes)

**Ce qu'il vérifie** : un visiteur peut créer un compte en remplissant le formulaire
d'inscription et en acceptant les conditions, et un mot de passe différent de sa
confirmation est refusé avec un message d'erreur.

**Les étapes** :
1. Ouvrir la page d'accueil, cliquer sur « S'inscrire », remplir le formulaire (nom
   d'utilisateur, email, mot de passe et confirmation identiques), cocher l'acceptation des
   conditions, puis valider.
   → Le compte est créé (ou l'utilisateur est connecté).
2. Rouvrir le formulaire d'inscription, le remplir avec un mot de passe et une confirmation
   différents, puis valider.
   → Un message d'erreur signale que les mots de passe ne correspondent pas.

Note du 20/10/2026 17:53 : ce cas existait déjà dans Squash (rédigé lors d'un passage
précédent). Il n'a pas été recréé ; il a seulement été remis au statut « À approuver »
pour votre relecture.

**Points à surveiller lors de la relecture** (pas corrigés, car aucune remarque de refus
n'a été reçue) :
- Le premier critère d'acceptation dit que les champs et la case « conditions » sont
  **obligatoires**. Aucune étape ne vérifie qu'on est bloqué si l'un d'eux est laissé vide,
  ou si la case n'est pas cochée.
- L'étape 1 accepte deux résultats (« compte créé » **ou** « utilisateur connecté »), sans
  dire précisément ce que le testeur doit voir à l'écran.
- Le texte exact du message d'erreur attendu à l'étape 2 n'est pas précisé.

Si vous refusez le cas en citant ces points, il sera corrigé au prochain passage.

## 2. Validation humaine

En attente de validation : [valider ou refuser le cas](http://localhost:5678/form-waiting/42?signature=8dd17e1c326905148fbace88b02e314e18b2a37b0a3df8a0993284c907c4e9e7).

## 3. Test automatisé — agent automaticien

_En attente._

## 4. Exécution de la campagne — agent exécutant

_En attente._

## 5. Anomalies — agent gestionnaire d'anomalies

_En attente._

## 6. Comptes rendus publiés — agent rapporteur

_En attente._
