# Story : Inscription d'un nouveau compte

| | |
|---|---|
| **Où en est-on** | Étape 2 sur 6 — 3 cas de test en attente de votre validation |
| **Prochaine action** | Relire les 3 cas TC-HVC-6-1 à TC-HVC-6-3 dans Squash, puis cliquer sur [Valider ou refuser les cas](http://localhost:5678/form-waiting/121?signature=57ff7fad4d7d5764ad2fc3339815212ea2e491524e4920e2e76e395ecb822899) |
| **Story Jira** | [Inscription d'un nouveau compte](https://testacademy.atlassian.net/browse/HVC-6) |
| **Dernière mise à jour** | 25/10/2026 12:23 par l'agent analyste |

## 1. Cas de test rédigés — agent analyste

### Passage du 25/10/2026 12:23 — un cas par critère d'acceptation

La story n'a pas changé (titre, description et critères d'acceptation identiques). Mais elle
compte **3 critères d'acceptation** et Squash n'avait qu'un seul cas (TC-HVC-6). Le cas a donc
été découpé en **3 cas, un par critère**. L'ancien cas TC-HVC-6 devient TC-HVC-6-1 (son
historique est conservé). Les cas TC-HVC-6-2 et TC-HVC-6-3 ont été créés. Les 3 cas sont au
statut « À approuver ». Ce découpage règle aussi les points à surveiller notés lors des
passages précédents (voir plus bas) : le critère 1 est maintenant vérifié, et chaque résultat
attendu dit ce que le testeur doit voir à l'écran.

#### TC-HVC-6-1 — Inscription d'un nouveau compte : champs et case des conditions obligatoires (critère 1)

**Ce qu'il vérifie** : le formulaire exige nom d'utilisateur, email, mot de passe,
confirmation du mot de passe et acceptation des conditions. L'inscription est refusée si l'un
d'eux manque.

**Les étapes** (6) :
1. Depuis la page d'accueil, cliquer sur « S'inscrire ».
   → Le formulaire s'affiche avec les champs Nom d'utilisateur, Email, Mot de passe,
   Confirmation du mot de passe et la case d'acceptation des conditions.
2. Tout remplir correctement, sauf le nom d'utilisateur (laissé vide), puis valider.
   → Le formulaire reste affiché et un message indique que le nom d'utilisateur est obligatoire.
3. Renseigner le nom d'utilisateur, vider l'email, puis valider.
   → Le formulaire reste affiché et un message indique que l'email est obligatoire.
4. Renseigner l'email, vider le mot de passe, puis valider.
   → Le formulaire reste affiché et un message indique que le mot de passe est obligatoire.
5. Renseigner le mot de passe, vider la confirmation, puis valider.
   → Le formulaire reste affiché et un message indique que la confirmation est obligatoire.
6. Renseigner la confirmation, laisser la case des conditions décochée, puis valider.
   → Le formulaire reste affiché et un message indique qu'il faut accepter les conditions.

#### TC-HVC-6-2 — Inscription d'un nouveau compte : inscription réussie (critère 2)

**Ce qu'il vérifie** : une inscription correcte connecte le visiteur ou lui confirme que son
compte a été créé.

**Les étapes** (2) :
1. Depuis la page d'accueil, cliquer sur « S'inscrire ».
   → Le formulaire d'inscription s'affiche.
2. Saisir un nom d'utilisateur, un email, un mot de passe et une confirmation identique,
   cocher la case des conditions, puis valider.
   → Un message confirme la création du compte, ou le visiteur est connecté (son nom
   d'utilisateur ou un accès à son compte apparaît à l'écran).

#### TC-HVC-6-3 — Inscription d'un nouveau compte : mots de passe différents refusés (critère 3)

**Ce qu'il vérifie** : l'inscription est refusée quand le mot de passe et sa confirmation
sont différents.

**Les étapes** (2) :
1. Depuis la page d'accueil, cliquer sur « S'inscrire ».
   → Le formulaire d'inscription s'affiche.
2. Tout remplir, avec une confirmation différente du mot de passe, cocher la case des
   conditions, puis valider.
   → Le formulaire reste affiché, un message d'erreur signale que les mots de passe ne
   correspondent pas, et le visiteur n'est pas connecté.

**À noter pour l'automaticien** : le cas TC-HVC-6-1 reprend l'ancien cas TC-HVC-6. Dans
Squash, il reste déclaré « automatisé » sous l'ancienne référence TC-HVC-6, avec le test
existant (qui vérifiait l'inscription réussie et les mots de passe différents). Son contenu
correspond maintenant au critère 1. Il faut donc revoir le test automatisé et sa déclaration,
cas par cas. Les cas TC-HVC-6-2 et TC-HVC-6-3 ne sont pas encore automatisés.

**Traçabilité** : `suivi-des-stories/donnees-squash/story-inscription-d-un-nouveau-compte.json`
· commande `modifier-cas` · cas Squash id 8 (TC-HVC-6-1), 53 (TC-HVC-6-2), 55 (TC-HVC-6-3)

### Historique des passages précédents (cas unique TC-HVC-6)

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

Note du 20/10/2026 19:14 : nouveau passage. Le cas est déjà approuvé dans Squash et la
story Jira n'a pas changé (titre, description et critères d'acceptation identiques) : le cas
n'a pas été modifié.

Note du 20/10/2026 19:30 : nouveau passage. La story Jira n'a pas changé (titre, description
et critères d'acceptation identiques). Le contenu du cas n'a donc pas été modifié : **le cas
est inchangé depuis sa dernière approbation**. Il a été remis au statut « À approuver », car
un humain doit le valider à chaque lancement. Les points à surveiller listés plus haut
restent valables.

**Passage du 25/10/2026 12:18 — bloqué.** La story n'a pas pu être lue dans Jira : le
connecteur Atlassian de Claude n'est pas autorisé dans cette session. Il faut le reconnecter
dans les réglages de claude.ai. Sans la story, impossible de savoir si elle a changé, ni de
découper le cas actuel en un cas par critère d'acceptation (la story compte 3 critères, et
Squash n'a toujours qu'un cas unique, TC-HVC-6). Pour ne rien deviner, **rien n'a été modifié
dans Squash** : le cas TC-HVC-6 reste tel quel, au statut « Approuvé ». Aucun commentaire n'a
été ajouté dans Jira.

## 2. Validation humaine

**Passage du 20/10/2026 19:30** : en attente de validation.
[Valider ou refuser le cas](http://localhost:5678/form-waiting/76?signature=819c6ca79e9427f39288dfd2b69329bbc3e4581a9be593e095ea8f1f73609aec)

Cas déjà approuvé, story inchangée depuis : validation non redemandée (passage du 20/10/2026 19:14).

Cas validé le 20/10/2026 19:14 (approbation d'un passage précédent, reconduite). Aucune
remarque du valideur.

Cas validé le 20/10/2026 19:35 (passage du 20/10/2026 19:30). Aucune remarque du valideur.

**Passage du 25/10/2026 12:18** : rien à valider pour l'instant. L'analyste est bloqué, car
la story Jira n'a pas pu être lue (voir section 1).

**Passage du 25/10/2026 12:23** : en attente de validation des 3 cas (TC-HVC-6-1,
TC-HVC-6-2, TC-HVC-6-3).
[Valider ou refuser les cas](http://localhost:5678/form-waiting/121?signature=57ff7fad4d7d5764ad2fc3339815212ea2e491524e4920e2e76e395ecb822899)

## 3. Test automatisé — agent automaticien

**Passage du 20/10/2026 19:14**

- Un test automatisé existait déjà pour ce cas : il a été repris tel quel, sans en créer un second.
- Il rejoue les **2 étapes** du cas validé, dans le même ordre :
  1. créer un compte avec un mot de passe et une confirmation identiques ; le test attend
     le message confirmant que le compte a été créé ;
  2. recommencer avec deux mots de passe différents ; le test attend le message signalant
     que les mots de passe ne correspondent pas.
- Chaque exécution utilise un nom d'utilisateur et une adresse email nouveaux, pour ne
  jamais tomber sur un compte qui existe déjà.
- **Vérification sur le vrai site : le test passe** (essai réussi du premier coup).
- Le cas est déclaré « automatisé » dans Squash : ses résultats pourront remonter
  automatiquement lors de la prochaine campagne.

**Traçabilité** : `tests/tc-hvc-6-inscription-compte.spec.ts` · cas Squash TC-HVC-6

**Passage du 20/10/2026 19:35**

- Le cas validé n'a pas changé : le test automatisé existant a été repris tel quel, sans en
  créer un second.
- Il rejoue toujours les **2 étapes** du cas validé, dans le même ordre (création d'un
  compte avec deux mots de passe identiques, puis refus quand les deux mots de passe
  diffèrent), avec un nom d'utilisateur et une adresse email nouveaux à chaque exécution.
- **Vérification sur le vrai site : le test passe** (essai réussi du premier coup).
- Le cas est toujours déclaré « automatisé » dans Squash.

**Traçabilité** : `tests/tc-hvc-6-inscription-compte.spec.ts` · cas Squash TC-HVC-6

## 4. Exécution de la campagne — agent exécutant

**Passage du 20/10/2026 19:15**

- Campagne « Recette v1 » jouée en entier : **7 cas joués, 6 réussis, 1 échoué.**
- **Cas de cette story (TC-HVC-6 Inscription d'un nouveau compte) : réussi.**
- Cas en échec : TC-HVC-1 (Recherche de logements par destination et dates). Une
  recherche sans destination est acceptée au lieu d'être refusée. Ce défaut était déjà connu.
- Point à signaler : 3 autres tests automatisés ont été joués et ont réussi (TC-HVC-8,
  TC-HVC-9, TC-HVC-10). Leurs résultats ne sont pas remontés dans Squash, parce que ces cas
  ne font pas partie de la campagne.

**Traçabilité** : itération Squash 1 (IT-01 Recette v1) · exécution TC-HVC-6 n° 60 ·
exécution TC-HVC-1 n° 58 · import partiel (HTTP 207, seuls TC-HVC-8, 9 et 10 n'ont pas été rattachés)

**Passage du 20/10/2026 19:39**

- Campagne « Recette v1 » jouée en entier : **7 cas joués, 5 réussis, 2 échoués.**
- **Cas de cette story (TC-HVC-6 Inscription d'un nouveau compte) : réussi.**
- Cas en échec :
  - TC-HVC-1 (Recherche de logements par destination et dates) ;
  - TC-HVC-7 (Connexion utilisateur) : le test n'a pas réussi à cliquer sur le bouton
    « Se connecter » à l'étape de connexion avec un compte inconnu (temps imparti dépassé).
    Ce cas avait réussi lors des passages précédents.
- Point à signaler : 3 autres tests automatisés ont été joués et ont réussi (TC-HVC-8,
  TC-HVC-9, TC-HVC-10). Leurs résultats ne sont pas remontés dans Squash, parce que ces cas
  ne font pas partie de la campagne.

**Traçabilité** : itération Squash 1 (IT-01 Recette v1) · exécution TC-HVC-6 n° 70 ·
exécution TC-HVC-1 n° 66 · exécution TC-HVC-7 n° 69 · import partiel (HTTP 207, seuls
TC-HVC-8, 9 et 10 n'ont pas été rattachés)

## 5. Anomalies — agent gestionnaire d'anomalies

**Passage du 20/10/2026 19:17**

- **Anomalies liées à cette story : aucune** (le cas TC-HVC-6 a réussi).
- Anomalies traitées pour les autres stories de la campagne : 1 (déjà connue, reproduite à
  nouveau : [HVC-11 — Recherche non refusée quand le champ Destination est vide](https://testacademy.atlassian.net/browse/HVC-11)).
  Aucun nouveau ticket créé. Un commentaire « reproduit à nouveau » a été ajouté au ticket,
  et la capture d'écran avec une explication a été jointe dans Squash.

**Traçabilité** : cas Squash TC-HVC-1 · exécution n° 58 · itération Squash 1 (IT-01 Recette v1)

**Passage du 20/10/2026 19:41**

- **Anomalies liées à cette story : aucune** (le cas TC-HVC-6 a réussi).
- Anomalies traitées pour les autres stories de la campagne : 1, déjà connue et reproduite à
  nouveau : [HVC-11 — Recherche non refusée quand le champ Destination est vide](https://testacademy.atlassian.net/browse/HVC-11).
  Aucun nouveau ticket n'a été créé. J'ai ajouté un commentaire « reproduit à nouveau » au
  ticket, joint dans Squash la capture d'écran avec une explication, et ajouté dans Jira un
  lien vers l'exécution Squash.
- À noter : la liste des échecs relue dans Squash ne contient que TC-HVC-1. Le cas TC-HVC-7
  (Connexion utilisateur), signalé en échec dans la section 4, n'y est plus : sa dernière
  exécution n'est pas en échec. Aucune anomalie n'a donc été ouverte pour lui.

**Traçabilité** : cas Squash TC-HVC-1 · exécution n° 79 · commentaire Jira n° 10026 ·
itération Squash 1 (IT-01 Recette v1)

## 6. Comptes rendus publiés — agent rapporteur

**Passage du 20/10/2026 19:18**

- **Verdict de la story : réussie.** Le cas TC-HVC-6 est passé, aucune anomalie liée.
- [Compte rendu final dans la story Jira](https://testacademy.atlassian.net/browse/HVC-6?focusedCommentId=10018)
- [Bilan global dans l'itération Squash IT-01 Recette v1](http://127.0.0.1:8090/squash/campaign-workspace/iteration/1/content)
  (7 cas joués : 6 réussis, 1 échoué, TC-HVC-1, anomalie déjà connue HVC-11)

**Traçabilité** : commentaire Jira n° 10018 · bilan `suivi-des-stories/donnees-squash/bilan-2026-10-20-1918.html` · itération Squash 1

**Passage du 20/10/2026 19:44**

- **Verdict de la story : réussie.** Le cas TC-HVC-6 est passé, aucune anomalie liée.
- [Compte rendu final dans la story Jira](https://testacademy.atlassian.net/browse/HVC-6?focusedCommentId=10028)
- [Bilan global dans l'itération Squash IT-01 Recette v1](http://127.0.0.1:8090/squash/campaign-workspace/iteration/1/content)
  (8 cas : 7 réussis, 1 échoué, TC-HVC-1, anomalie déjà connue
  [HVC-11](https://testacademy.atlassian.net/browse/HVC-11)). Le bilan signale aussi que
  TC-HVC-7, en échec lors de la campagne de 19:39, a réussi à l'exécution suivante.

**Traçabilité** : commentaire Jira n° 10028 · bilan `suivi-des-stories/donnees-squash/bilan-2026-10-20-1944.html` · itération Squash 1
