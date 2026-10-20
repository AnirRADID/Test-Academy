# Story : Connexion utilisateur

| | |
|---|---|
| **Où en est-on** | Étape 2 sur 6 — cas de test déjà validé, story inchangée |
| **Prochaine action** | Automatisation du cas par l'agent automaticien |
| **Story Jira** | [Connexion utilisateur](https://testacademy.atlassian.net/browse/HVC-7) |
| **Dernière mise à jour** | 20/10/2026 17:53 par l'agent analyste |

## 1. Cas de test rédigé — agent analyste

**Nom** : TC-HVC-7 - Connexion utilisateur (2 étapes)

**Ce qu'il vérifie** : un utilisateur enregistré peut se connecter avec ses identifiants en
cochant « Se souvenir de moi », et des identifiants incorrects affichent un message d'erreur clair.

**Les étapes** :
1. Ouvrir la page d'accueil, cliquer sur « Se connecter », saisir des identifiants valides,
   cocher « Se souvenir de moi », puis valider.
   → L'utilisateur est connecté : le lien « Se connecter » n'est plus visible.
2. Se déconnecter, puis se connecter avec des identifiants invalides.
   → Un message d'erreur clair indique que les identifiants sont incorrects.

Note du 20/10/2026 08:54 : ce cas existait déjà dans Squash (rédigé lors d'un passage
précédent). Il n'a pas été recréé ; il a seulement été remis au statut « À approuver »
pour votre relecture.

**Points à surveiller lors de la relecture** (pas corrigés, car aucune remarque de refus
n'a été reçue) :
- La connexion par **email** (et pas seulement par nom d'utilisateur) n'est pas testée en
  tant que telle, alors que le premier critère d'acceptation la cite.
- L'effet de « Se souvenir de moi » (la session est prolongée) n'est pas vérifié : la case
  est seulement cochée.
- Le texte du message d'erreur attendu n'est pas précisé.

Si vous refusez le cas en citant ces points, il sera corrigé au prochain passage.

## 2. Validation humaine

Cas validé le 20/10/2026 12:18. Remarques du valideur : aucune.

Cas déjà approuvé, story inchangée depuis : validation non redemandée (passage du
20/10/2026 17:53). Le titre et la description de la story dans Jira n'ont pas changé depuis
la validation : seules les étiquettes de suivi ont bougé.

## 3. Test automatisé — agent automaticien

**Le test suit les 2 étapes du cas validé**, dans le même ordre :
1. Ouvrir la page d'accueil, se connecter avec des identifiants valides en cochant
   « Se souvenir de moi » → le lien « Se connecter » disparaît.
2. Se déconnecter, puis tenter de se connecter avec des identifiants invalides → le message
   d'erreur « identifiant ou email invalide » s'affiche.

**Préparation** : pour ne dépendre d'aucun compte ni mot de passe secret, le test crée
d'abord son propre compte (avec un nom unique à chaque exécution), puis repart d'une session
déconnectée avant la première étape. Cette préparation ne compte pas comme une étape du cas.

**Vérification sur le vrai site (20/10/2026)** : ✅ **passe sur le site** (2 exécutions
réussies sur 2). Le cas est déclaré « automatisé » dans Squash.

**Traçabilité** : fichier `tests/tc-hvc-7-connexion-utilisateur.spec.ts` (repris et
corrigé : il dépendait auparavant d'identifiants fournis par variables d'environnement, qui
n'existent pas ici) · cas Squash TC-HVC-7.

## 4. Exécution de la campagne — agent exécutant

**Campagne jouée le 20/10/2026 12:21** (itération Squash « IT-01 Recette v1 »).

**Dans Squash : 6 cas joués, 5 réussis, 1 échoué.**
- ❌ TC-HVC-1 Recherche de logements par destination et dates — échoué (défaut déjà connu :
  la recherche reste acceptée avec une destination vide).
- ✅ TC-HVC-2, TC-HVC-3, TC-HVC-4, TC-HVC-5, TC-HVC-7 — réussis.

**Cas de cette story (TC-HVC-7 Connexion utilisateur) : ✅ réussi.**

À noter : 10 tests automatisés ont été joués, mais 4 résultats n'ont pas pu être enregistrés
dans Squash, car ces cas ne figurent pas dans l'itération : TC-HVC-6, TC-HVC-8, TC-HVC-9,
TC-HVC-10 (tous les quatre réussis côté tests automatisés).

**Traçabilité** : itération Squash 1 · import des résultats en réponse partielle (HTTP 207) ·
exécution de TC-HVC-7 n° 55 · exécution de TC-HVC-1 n° 57.

## 5. Anomalies — agent gestionnaire d'anomalies

**Anomalies de cette story (Connexion utilisateur)** : aucune anomalie — le cas TC-HVC-7 a réussi.

**Autres stories de la campagne** : 1 anomalie traitée, déjà connue et reproduite à nouveau
([HVC-11 — Recherche non refusée quand le champ Destination est vide](https://testacademy.atlassian.net/browse/HVC-11),
story « Recherche de logements par destination et dates »). Aucun ticket en double n'a été
créé : un commentaire « reproduit à nouveau le 20/10/2026 » a été ajouté sur le ticket existant.

**Traçabilité** : cas Squash TC-HVC-1 · exécution Squash n° 57 (capture d'écran jointe en PDF,
commentaire avec lien vers HVC-11 posé sur l'exécution et sur le pas en échec) · lien web
ajouté dans HVC-11 vers cette exécution.

## 6. Comptes rendus publiés — agent rapporteur

**Publiés le 20/10/2026 10:23.**
- [Compte rendu final dans la story Jira « Connexion utilisateur »](https://testacademy.atlassian.net/browse/HVC-7?focusedCommentId=10013) :
  ✅ cas réussi, aucune anomalie pour cette story.
- Bilan global ajouté en tête de la description de l'itération Squash « IT-01 Recette v1 » :
  6 cas joués, 5 réussis, 1 échoué (TC-HVC-1, anomalie déjà connue
  [HVC-11](https://testacademy.atlassian.net/browse/HVC-11)).

Note : le bilan précédent de l'itération n'a pas pu être relu (lecture de la description
de l'itération non autorisée pendant ce passage). La ligne « Évolution » du bilan l'indique.

**Traçabilité** : itération Squash 1 · fichier du bilan
`suivi-des-stories/donnees-squash/bilan-2026-10-20-1023.html` · commentaire Jira n° 10013.
