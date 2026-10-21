# Story : Comparer des annonces

| | |
|---|---|
| **Où en est-on** | Étape 2 sur 6 — cas de test en attente de votre validation |
| **Prochaine action** | Relire le cas de test TC-HVC-10 dans Squash, puis cliquer sur [Valider ou refuser le cas](http://localhost:5678/form-waiting/82?signature=f0bc7af52bd23e1e3f93d616fcefce725c419c9ecbc89a7bd407415476312bfd) |
| **Story Jira** | [Comparer des annonces](https://testacademy.atlassian.net/browse/HVC-10) |
| **Dernière mise à jour** | 20/10/2026 19:30 par l'agent analyste |

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

En attente de validation : relire le cas TC-HVC-10 dans Squash, puis
[valider ou refuser le cas](http://localhost:5678/form-waiting/82?signature=f0bc7af52bd23e1e3f93d616fcefce725c419c9ecbc89a7bd407415476312bfd).

## 3. Test automatisé — agent automaticien

_En attente._

## 4. Exécution de la campagne — agent exécutant

_En attente._

## 5. Anomalies — agent gestionnaire d'anomalies

_En attente._

## 6. Comptes rendus publiés — agent rapporteur

_En attente._

## Traçabilité

Fichier de données Squash : `suivi-des-stories/donnees-squash/story-comparer-des-annonces.json`
· cas Squash TC-HVC-10 · itération Squash 1
