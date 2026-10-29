# Story : Devenir hôte

| | |
|---|---|
| **Où en est-on** | Étape 6 sur 6 — anomalies analysées (aucune pour cette story), comptes rendus à publier |
| **Prochaine action** | L'agent rapporteur publie les comptes rendus dans Jira et Squash (aucune action humaine requise) |
| **Story Jira** | [Devenir hôte](https://testacademy.atlassian.net/browse/HVC-9) |
| **Dernière mise à jour** | 25/10/2026 12:28 par l'agent gestionnaire d'anomalies |

## 1. Cas de test rédigé — agent analyste

**Nom** : TC-HVC-9 - Devenir hôte (2 étapes)

**Ce qu'il vérifie** : depuis la page d'accueil, le lien « Devenir un hôte » mène à une page
dédiée qui présente le parcours pour publier une annonce.

**Les étapes** :
1. Depuis la page d'accueil, cliquer sur le lien « Devenir un hôte ».
   → La page dédiée « Devenir un hôte » s'affiche.
2. Observer le contenu de la page.
   → Le parcours ou le formulaire pour publier une annonce est présenté (titre
   « Become a Host » visible).

Note du 20/10/2026 17:53 : ce cas existait déjà dans Squash (rédigé lors d'un passage
précédent) et couvre les deux critères d'acceptation de la story. Il n'a pas été recréé ;
il a seulement été remis au statut « À approuver » pour votre relecture.

**Points à surveiller lors de la relecture** (pas corrigés, car aucune remarque de refus
n'a été reçue) :
- Le critère 2 précise que le contenu de la page est « à valider en page suivante » : le
  cas vérifie seulement que la page présente le parcours (son titre), pas le détail du
  formulaire.

Si vous refusez le cas en citant ce point, il sera corrigé au prochain passage.

Note du 20/10/2026 19:30 : nouveau lancement. La story Jira a été relue : son titre, sa
description et ses critères d'acceptation n'ont pas changé. Le cas est donc inchangé depuis
le passage précédent (cas inchangé depuis sa dernière approbation, s'il avait été approuvé) ;
il a seulement été remis au statut « À approuver », car un humain valide à chaque lancement.

**Blocage du 20/10/2026 19:32 suite aux remarques** : le valideur a refusé le cas et
demandé de « créer un cas de test pour chaque critère d'acceptation », donc deux cas
distincts pour cette story. Je n'ai rien créé ni modifié dans Squash, pour la raison
suivante : le cycle automatisé suit **un seul cas par story** (TC-HVC-9). C'est ce cas que
le formulaire fait approuver et que l'agent automaticien transforme en test. Un second cas
ne serait jamais approuvé ni automatisé et resterait en suspens dans Squash. Le cas
TC-HVC-9 reste tel qu'il était (2 étapes, une par critère d'acceptation).

Deux options pour débloquer :
- **Garder un seul cas, avec une étape par critère** : c'est déjà le découpage actuel
  (étape 1 = critère 1, étape 2 = critère 2). Relancer la story en précisant ce qu'il faut
  améliorer dans ces étapes.
- **Vraiment un cas par critère** : il faut d'abord faire évoluer le cycle (formulaire de
  validation, approbation, automatisation) pour qu'il gère plusieurs cas par story. C'est
  une décision à prendre par le formateur, pas par l'agent.

Note du 20/10/2026 19:37 : nouveau lancement, sans remarque de refus. La story Jira a été
relue : son titre, sa description et ses critères d'acceptation n'ont pas changé. Le cas
TC-HVC-9 est donc **inchangé depuis sa dernière version** (2 étapes, une par critère
d'acceptation) ; il a seulement été remis au statut « À approuver », car un humain valide à
chaque lancement. Le blocage précédent est levé : si vous souhaitez toujours un découpage
différent, refusez le cas en le précisant.

## 2. Validation humaine

Historique : cas refusé le 20/10/2026 avec la remarque « Créer un cas de test pour chaque
critère d'acceptation » (correction bloquée, voir section 1).

**20/10/2026 19:37 — En attente de validation** :
[valider ou refuser le cas](http://localhost:5678/form-waiting/96?signature=cd4c0a25f1828e4fc8f58130e252c2a01df6436560ce536f183d2ac8722db8c4).

**Cas validé le 25/10/2026 12:20.** Remarques du valideur : aucune.

## 3. Test automatisé — agent automaticien

25/10/2026 12:20 — le test automatisé existant a été repris et aligné sur le cas validé
(chaque étape du test porte désormais exactement le nom de l'étape du cas).

- **TC-HVC-9 — Devenir hôte** : 1 test, 2 étapes (cliquer sur « Devenir un hôte » depuis
  l'accueil ; observer le contenu de la page). Vérification sur le site : **passe sur le
  site** — la page « Devenir un hôte » s'ouvre et son titre « Become a Host » est visible.

Le cas est déclaré « automatisé » dans Squash.

**Traçabilité** : fichier `tests/tc-hvc-9-devenir-hote.spec.ts` · cas Squash TC-HVC-9.

## 4. Exécution de la campagne — agent exécutant

**Exécution du 25/10/2026 12:27** — toute la campagne a été jouée.

- **Tests joués** : 10 — **5 réussis, 5 échoués** (Recherche par destination et dates,
  Comparer des annonces, Recherche avancée par filtres, Filtrage par équipements, Connexion
  utilisateur).
- **Dans Squash** (itération « Recette v1 », 9 cas au plan) : 5 réussis, 4 échoués.

**Résultat des cas de cette story** :
- ✅ TC-HVC-9 — Devenir hôte : réussi

**Verdict de la story** : **réussie** (son unique cas a réussi).

**À signaler** : l'envoi des résultats vers Squash n'a été que partiel. Le résultat de
TC-HVC-9 est bien arrivé, mais 4 résultats n'ont pas été rattachés :
- TC-HVC-10 (Comparer des annonces) : ce cas n'est pas au plan de l'itération.
- TC-HVC-6, TC-HVC-7, TC-HVC-8 : Squash connaît désormais ces cas sous les références
  TC-HVC-6-1, TC-HVC-7-1, TC-HVC-8-1, avec un nombre d'étapes différent de celui des tests
  automatisés.

**Traçabilité** : itération Squash 1 · import des résultats HTTP 207 (partiel) · exécution
Squash de TC-HVC-9 : n° 91.

## 5. Anomalies — agent gestionnaire d'anomalies

**Analyse du 25/10/2026 12:28**

**Anomalies liées à cette story** : aucune anomalie. Le cas TC-HVC-9 — Devenir hôte a
réussi.

**Autres stories de la campagne** : 4 anomalies traitées. 1 était déjà connue et s'est
reproduite ([HVC-11](https://testacademy.atlassian.net/browse/HVC-11), recherche sans
destination). 3 sont nouvelles :
[HVC-12](https://testacademy.atlassian.net/browse/HVC-12) (recherche avancée),
[HVC-13](https://testacademy.atlassian.net/browse/HVC-13) (filtres par équipements) et
[HVC-14](https://testacademy.atlassian.net/browse/HVC-14) (connexion).

**À signaler** : dans Squash, le rapport avec capture d'écran et le lien cliquable vers
Jira ont été posés uniquement pour la connexion (HVC-14). Pour HVC-11, HVC-12 et HVC-13,
aucune capture n'a été enregistrée au moment de l'échec (le test a dépassé son temps
d'attente). Le lien n'existe donc que dans un sens : depuis Jira vers Squash. Aucune
capture n'a été inventée. Ces liens pourront être posés lors de la prochaine exécution.

**Traçabilité** : itération Squash 1 · exécutions n° 90 (TC-HVC-1), 95 (TC-HVC-2),
92 (TC-HVC-3), 94 (TC-HVC-7-1, rapport PDF joint) · bugs étiquetés avec la référence du cas,
liés aux stories HVC-2, HVC-3 et HVC-7, rattachés au sprint actif.

## 6. Comptes rendus publiés — agent rapporteur

_En attente._
