# Module 07 — Créer la campagne et exécuter les tests (plan détaillé, à finaliser)

[← Retour au sommaire](../README.md)

> Ce module n'est pas encore rédigé sous sa forme finale. Voici le plan détaillé.

## Objectif

Regrouper tous les cas de test du Sprint 1 dans une campagne Squash, brancher
l'automatisation pour qu'elle remonte ses résultats automatiquement dans Squash à chaque
exécution, puis lancer réellement les tests.

## Prompt-cadre (à affiner)

Demander à Claude de :
1. Créer une campagne et une itération dans Squash (nommées d'après le Sprint 1), et y
   ajouter tous les cas de test créés au module 05.
2. Mettre en place le "rapporteur" qui connecte les tests Playwright à Squash — c'est un
   petit morceau de code que Claude écrit une fois, qui envoie automatiquement le résultat
   de chaque test (réussi/échoué) vers l'itération Squash correspondante, à la fin de
   chaque exécution.
3. Lancer la suite de tests complète, et confirmer que les résultats apparaissent bien dans
   Squash (pas seulement dans le terminal).

## Points d'attention à intégrer dans la rédaction finale

- Piège à répéter explicitement dans le prompt final : ne **jamais** lancer les tests avec
  une option qui précise un "rapporteur" en ligne de commande — ça désactive silencieusement
  l'envoi des résultats vers Squash. Toujours lancer la commande la plus simple possible.
- Expliquer que relancer les mêmes tests plus tard créera de **nouvelles** exécutions dans
  Squash (l'historique des exécutions précédentes reste visible, mais seule la dernière
  compte pour le triage du module suivant).
- Rassurer l'apprenant : il n'a rien à taper de technique ici, juste à confirmer que ce que
  Claude montre dans Squash correspond à ce qu'il attend (nombre de cas, statuts).

## Vérification prévue

Dans Squash, la campagne contient tous les cas de test, chacun a au moins une exécution, et
les statuts (succès/échec) sont visibles sans avoir besoin de relire le terminal.
