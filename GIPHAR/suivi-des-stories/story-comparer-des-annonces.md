# Story : Comparer des annonces

| | |
|---|---|
| **Où en est-on** | Étape 4 sur 6 — test automatisé écrit et vérifié, en attente de l'exécution de la campagne |
| **Prochaine action** | L'agent exécutant joue la campagne et envoie les résultats dans Squash |
| **Story Jira** | [Comparer des annonces](https://testacademy.atlassian.net/browse/HVC-10) |
| **Dernière mise à jour** | 25/10/2026 12:20 par l'agent automaticien |

## 1. Cas de test rédigé — agent analyste

**Nom** : TC-HVC-10 - Comparer des annonces (5 étapes)

**Ce qu'il vérifie** : un voyageur peut sélectionner au moins deux logements et les voir
côte à côte dans une vue de comparaison qui présente leurs critères clés (prix,
équipements, capacité).

**Avant de commencer** : le site Homey est ouvert et une recherche (par exemple sur la
ville de Miami) renvoie au moins deux logements.

**Les étapes** :
1. Lancer une recherche de logements (par exemple sur la ville de Miami).
   → La page de résultats affiche plusieurs logements, chacun avec une option « Comparer ».
2. Cliquer sur « Comparer » pour le premier logement, puis pour le deuxième.
   → Le compteur de comparaison indique 2 logements sélectionnés.
3. Ouvrir le panneau de comparaison.
   → Les deux logements sélectionnés apparaissent dans le panneau.
4. Cliquer sur le bouton « Comparer » du panneau.
   → La page de comparaison s'affiche et présente les deux logements côte à côte.
5. Observer le contenu de la page de comparaison.
   → Les critères clés des deux logements sont affichés côte à côte : au minimum le prix,
   les équipements et la capacité (nombre de voyageurs ou de chambres).

Note du 20/10/2026 19:30 : un cas TC-HVC-10 existait déjà dans Squash (3 étapes, rédigé
lors de la création initiale du projet). Il ne vérifiait que le premier critère
d'acceptation (sélectionner deux logements et ouvrir la comparaison). La story Jira
contient maintenant un second critère : les critères clés (prix, équipements, capacité)
doivent être affichés côte à côte. Le cas a donc été **mis à jour** (pas recréé) : ajout
d'une étape de recherche explicite et d'une étape qui vérifie ces critères clés.
L'exigence miroir dans Squash, elle, n'a pas été modifiée (l'outil ne réécrit que le cas) :
elle ne reprend pas encore les critères d'acceptation.

Point à surveiller lors de la relecture : le critère cite « prix, équipements,
capacité… ». Le cas vérifie ces trois-là ; dites-le si d'autres critères doivent être
exigés.

## 2. Validation humaine

Cas validé le 25/10/2026 12:20. Remarques du valideur : aucune.

## 3. Test automatisé — agent automaticien

Le test automatisé existant (qui ne suivait que les 3 étapes de l'ancien cas) a été
**repris** pour suivre fidèlement le cas validé.

- **TC-HVC-10 — Comparer des annonces** : 5 étapes, une par étape du cas.
  Verdict de la vérification du 25/10/2026 12:20 : **passe sur le site**.
  Le test lance une recherche sur Miami, ajoute les deux premiers logements à la
  comparaison (le compteur affiche bien 2), ouvre le panneau (les deux logements y
  figurent), clique sur « Comparer » et vérifie que la page montre les deux logements
  côte à côte, chacun avec sa photo et son titre. Il contrôle enfin, pour chacun des deux
  logements, le prix, le nombre de chambres (la capacité) et des équipements
  (climatisation, Wi-Fi), marqués présents ou absents.

Bon à savoir : la page de comparaison n'affiche pas le nombre de voyageurs, seulement les
chambres, salles de bain et lits ; le cas validé accepte le nombre de chambres comme
mesure de la capacité.

Le cas est déclaré « automatisé » dans Squash : ses résultats y remonteront à chaque
exécution de la campagne.

## 4. Exécution de la campagne — agent exécutant

_En attente._

## 5. Anomalies — agent gestionnaire d'anomalies

_En attente._

## 6. Comptes rendus publiés — agent rapporteur

_En attente._

## Traçabilité

Fichier de données Squash : `suivi-des-stories/donnees-squash/story-comparer-des-annonces.json`
· cas Squash TC-HVC-10 · itération Squash 1
· test automatisé `tests/tc-hvc-10-comparer-annonces.spec.ts` (vérifié en 2 essais le 25/10/2026)
