# Story : Inscription d'un nouveau compte

| | |
|---|---|
| **Où en est-on** | Terminé |
| **Prochaine action** | Aucune |
| **Story Jira** | [Inscription d'un nouveau compte](https://testacademy.atlassian.net/browse/HVC-6) |
| **Dernière mise à jour** | 20/10/2026 19:18 par l'agent rapporteur |

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

Note du 20/10/2026 19:14 : nouveau passage. Le cas est déjà approuvé dans Squash et la
story Jira n'a pas changé (titre, description et critères d'acceptation identiques) : le cas
n'a pas été modifié.

## 2. Validation humaine

Cas déjà approuvé, story inchangée depuis : validation non redemandée (passage du 20/10/2026 19:14).

Cas validé le 20/10/2026 19:14 (approbation d'un passage précédent, reconduite). Aucune
remarque du valideur.

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

## 5. Anomalies — agent gestionnaire d'anomalies

**Passage du 20/10/2026 19:17**

- **Anomalies liées à cette story : aucune** (le cas TC-HVC-6 a réussi).
- Anomalies traitées pour les autres stories de la campagne : 1 (déjà connue, reproduite à
  nouveau : [HVC-11 — Recherche non refusée quand le champ Destination est vide](https://testacademy.atlassian.net/browse/HVC-11)).
  Aucun nouveau ticket créé. Un commentaire « reproduit à nouveau » a été ajouté au ticket,
  et la capture d'écran avec une explication a été jointe dans Squash.

**Traçabilité** : cas Squash TC-HVC-1 · exécution n° 58 · itération Squash 1 (IT-01 Recette v1)

## 6. Comptes rendus publiés — agent rapporteur

**Passage du 20/10/2026 19:18**

- **Verdict de la story : réussie.** Le cas TC-HVC-6 est passé, aucune anomalie liée.
- [Compte rendu final dans la story Jira](https://testacademy.atlassian.net/browse/HVC-6?focusedCommentId=10018)
- [Bilan global dans l'itération Squash IT-01 Recette v1](http://127.0.0.1:8090/squash/campaign-workspace/iteration/1/content)
  (7 cas joués : 6 réussis, 1 échoué, TC-HVC-1, anomalie déjà connue HVC-11)

**Traçabilité** : commentaire Jira n° 10018 · bilan `suivi-des-stories/donnees-squash/bilan-2026-10-20-1918.html` · itération Squash 1
