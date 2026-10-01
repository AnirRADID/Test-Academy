# Module 04 — Copier les exigences dans Squash (plan détaillé, à finaliser)

[← Retour au sommaire](../README.md)

> Ce module n'est pas encore rédigé sous sa forme finale (prose + prompt prêt à
> copier-coller). Voici le plan détaillé qui servira à le rédiger.

## Objectif

Créer, dans Squash TM, un projet et une exigence miroir pour chaque story Jira du Sprint 1
créée au module 03 — c'est le début de la chaîne de traçabilité Jira ⇄ Squash.

## Prompt-cadre (à affiner)

Demander à Claude de :
1. Se connecter à Squash avec le jeton enregistré au module 01 (`.squash-token`).
2. Créer un projet Squash (nom/label dérivés de `{NOM_DU_PROJET}`), ou réutiliser celui qui
   existe déjà s'il a été créé lors d'un essai précédent.
3. Pour chaque story du Sprint 1 (relue directement depuis Jira, pas resaisie à la main),
   créer une exigence Squash dont la référence est la clé Jira (`{CLE_PROJET}-N`) et dont la
   description reprend le texte validé.

## Points d'attention à intégrer dans la rédaction finale

- Ordre des champs à la création d'une exigence : `current_version` doit être donné
  **avant** `name` dans le corps de la requête, sinon Squash répond une erreur générique
  sans explication utile.
- Le parent d'une exigence est le **projet**, jamais la bibliothèque d'exigences.
- Piège du "premier projet par défaut" si plusieurs projets existent déjà dans la même
  instance Squash (utile seulement si l'apprenant refait l'exercice plusieurs fois sur la
  même instance) : toujours confirmer explicitement le nom du projet visé avant de créer
  quoi que ce soit.
- Rappeler que l'étiquette "squash-mirror" posée sur les tickets Jira au module 03 peut
  servir de filtre pour s'assurer qu'aucune story n'est oubliée.

## Vérification prévue

Ouvrir Squash et confirmer qu'il y a autant d'exigences que de tickets Jira du Sprint 1, et
que chaque référence correspond bien à une clé Jira existante.
