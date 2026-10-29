# Story : Connexion utilisateur

| | |
|---|---|
| **Où en est-on** | Étape 2 sur 6 — 3 cas de test en attente de votre validation |
| **Prochaine action** | Relire les cas TC-HVC-7-1 à TC-HVC-7-3 dans Squash, puis cliquer sur [Valider ou refuser les cas](http://localhost:5678/form-waiting/127?signature=01939759cce85aef2ed52894fb9b367e9fa0dcd9677a487e952f8f988e9e8ece) |
| **Story Jira** | [Connexion utilisateur](https://testacademy.atlassian.net/browse/HVC-7) |
| **Dernière mise à jour** | 25/10/2026 12:23 par l'agent analyste |

## 1. Cas de test rédigés — agent analyste

### Passage du 25/10/2026 12:23 — un cas par critère d'acceptation

La story a été relue dans Jira : son contenu n'a pas changé (mêmes 3 critères d'acceptation).
Mais le cas était encore au format à cas unique (TC-HVC-7), alors que la story compte
**3 critères d'acceptation**. Il a donc été scindé en 3 cas, un par critère : l'ancien cas
TC-HVC-7 a été renommé TC-HVC-7-1 (son historique est gardé) et réécrit, TC-HVC-7-2 et
TC-HVC-7-3 ont été créés. Les 3 cas sont au statut « À approuver ». Ce découpage corrige au
passage les trois points à surveiller notés plus bas (connexion par email, effet de « Se
souvenir de moi », message d'erreur).

#### TC-HVC-7-1 — Connexion utilisateur : connexion par nom d'utilisateur ou par email (critère 1)

**Ce qu'il vérifie** : le formulaire de connexion accepte le nom d'utilisateur **ou**
l'adresse email, avec le mot de passe.
**Avant de commencer** : un compte existe (nom d'utilisateur, email et mot de passe connus) ;
le testeur n'est pas connecté.

1. Ouvrir la page d'accueil, puis cliquer sur « Se connecter ».
   → Le formulaire de connexion s'affiche (champ nom d'utilisateur ou email, champ mot de
   passe, bouton pour valider).
2. Saisir le nom d'utilisateur et le mot de passe, puis valider.
   → L'utilisateur est connecté : le lien « Se connecter » n'est plus visible.
3. Se déconnecter.
   → Le lien « Se connecter » est de nouveau visible.
4. Cliquer sur « Se connecter », saisir cette fois l'adresse email et le mot de passe, puis valider.
   → L'utilisateur est connecté : le lien « Se connecter » n'est plus visible.

#### TC-HVC-7-2 — Connexion utilisateur : « Se souvenir de moi » prolonge la session (critère 2)

**Ce qu'il vérifie** : avec « Se souvenir de moi », l'utilisateur reste connecté après la
fermeture du navigateur ; sans cette option, il ne l'est plus.
**Avant de commencer** : un compte existe (identifiants connus) ; le testeur n'est pas connecté.

1. Ouvrir la page d'accueil, puis cliquer sur « Se connecter ».
   → Le formulaire propose une case à cocher « Se souvenir de moi ».
2. Saisir des identifiants valides, cocher « Se souvenir de moi », puis valider.
   → L'utilisateur est connecté.
3. Fermer complètement le navigateur, le rouvrir, revenir sur la page d'accueil.
   → L'utilisateur est toujours connecté, sans ressaisir ses identifiants.
4. Se déconnecter, se reconnecter **sans** cocher « Se souvenir de moi », fermer complètement
   le navigateur, le rouvrir et revenir sur la page d'accueil.
   → L'utilisateur n'est plus connecté : le lien « Se connecter » est de nouveau visible.

#### TC-HVC-7-3 — Connexion utilisateur : message d'erreur clair si les identifiants sont invalides (critère 3)

**Ce qu'il vérifie** : des identifiants invalides refusent la connexion et affichent un
message d'erreur clair.
**Avant de commencer** : un compte existe (nom d'utilisateur connu) ; le testeur n'est pas connecté.

1. Ouvrir la page d'accueil, cliquer sur « Se connecter », saisir le nom d'utilisateur d'un
   compte existant avec un mauvais mot de passe, puis valider.
   → La connexion est refusée : le formulaire reste affiché, un message d'erreur clair indique
   que les identifiants sont incorrects.
2. Saisir un nom d'utilisateur ou un email qui ne correspond à aucun compte, avec un mot de
   passe quelconque, puis valider.
   → La connexion est refusée et le même message d'erreur clair s'affiche.

**À noter pendant la relecture** : la story écrit « (à vérifier) » à côté du message d'erreur
et n'en donne pas le texte exact. Le cas demande donc un message « clair » sans imposer de
formulation. Si vous voulez imposer un texte précis, refusez le cas TC-HVC-7-3 en le donnant.

---

_Historique des passages précédents (ancien cas unique TC-HVC-7) :_

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

**⚠ Passage du 25/10/2026 12:18 — bloqué.** Le connecteur Atlassian de Claude demande une
nouvelle autorisation. L'agent analyste n'a donc pas pu lire la story dans Jira (ni le titre,
ni la description, ni les critères d'acceptation). Sans cette lecture, il est impossible de
savoir si la story a changé, ni d'écrire un cas par critère d'acceptation. Rien n'a été modifié
dans Squash : le cas TC-HVC-7 garde son contenu et son statut « Approuvé ». Aucun commentaire
n'a été posté dans Jira. À noter pour le prochain passage : le cas est encore au format à cas
unique (TC-HVC-7). Si la story compte plusieurs critères d'acceptation, il faudra le scinder
en TC-HVC-7-1, TC-HVC-7-2…

Note du 20/10/2026 19:30 : **cas inchangé depuis sa dernière approbation** (le 20/10/2026
12:18). La story n'a pas changé dans Jira depuis : son titre, sa description et ses critères
d'acceptation sont les mêmes ; seuls son statut et ses étiquettes de suivi ont bougé. Le cas
n'a donc pas été modifié. Il a seulement été remis au statut « À approuver », car un humain
valide le cas à chaque lancement. Les points à surveiller ci-dessus restent valables.

## 2. Validation humaine

Cas validé le 20/10/2026 12:18. Remarques du valideur : aucune.

Cas déjà approuvé, story inchangée depuis : validation non redemandée (passage du
20/10/2026 17:53). Le titre et la description de la story dans Jira n'ont pas changé depuis
la validation : seules les étiquettes de suivi ont bougé.

**Nouveau lancement du 20/10/2026 19:30** : le cas a été remis « À approuver » sans changer
son contenu.

**Cas validé le 20/10/2026 19:35.** Remarques du valideur : aucune.

**Nouveau lancement du 25/10/2026 12:23 — en attente de validation.** Le cas unique a été
scindé en 3 cas (TC-HVC-7-1 à TC-HVC-7-3), tous « À approuver ».
👉 [Valider ou refuser les cas](http://localhost:5678/form-waiting/127?signature=01939759cce85aef2ed52894fb9b367e9fa0dcd9677a487e952f8f988e9e8ece)

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

**Passage du 20/10/2026 19:35** : le cas validé n'a pas changé (mêmes 2 étapes), le test
existant n'a donc pas été modifié. Revérifié sur le vrai site : ✅ **passe sur le site**
(1 exécution réussie sur 1, du premier coup). Le cas reste déclaré « automatisé » dans Squash.

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
