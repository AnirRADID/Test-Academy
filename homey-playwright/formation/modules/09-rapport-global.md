# Module 09 — Générer un rapport global (plan détaillé, à finaliser)

[← Retour au sommaire](../README.md)

> Ce module n'est pas encore rédigé sous sa forme finale. Voici le plan détaillé.

## Objectif

Obtenir une synthèse lisible de toute la campagne : combien de cas, combien de succès,
combien d'échecs, quels bugs ont été ouverts, avec les liens utiles — un document que
l'apprenant peut partager tel quel (par exemple à son équipe ou à son manager).

## Prompt-cadre (à affiner)

Demander à Claude de :
1. Relire l'état actuel de la campagne dans Squash (statut de chaque cas) et la liste des
   bugs Jira créés pendant le triage.
2. Produire une synthèse avec : le nombre total de cas exécutés, le taux de réussite, le
   détail par exigence, et la liste des anomalies ouvertes avec leurs liens.
3. Présenter cette synthèse sous une forme facilement partageable (page unique, lisible
   sans contexte supplémentaire).

## Points d'attention à intégrer dans la rédaction finale

- Le rapport doit être factuel (des chiffres et des statuts vérifiables dans Squash/Jira),
  pas une reformulation optimiste des résultats.
- Prévoir que ce module peut être relancé à tout moment, pas seulement une fois en fin de
  formation — c'est un prompt réutilisable après chaque nouvelle campagne.

## Vérification prévue

Chaque chiffre annoncé dans le rapport (nombre de cas, de succès, d'échecs, de bugs) doit
pouvoir être retrouvé tel quel dans Squash ou Jira.
