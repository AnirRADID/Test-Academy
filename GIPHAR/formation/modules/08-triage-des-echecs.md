# Module 08 — Trier les échecs sans créer de doublon (plan détaillé, à finaliser)

[← Retour au sommaire](../README.md)

> Ce module n'est pas encore rédigé sous sa forme finale. Voici le plan détaillé. Il
> reprend, reformulé en prompts autonomes (sans skill à importer), le processus déjà validé
> dans `.claude/skills/competence-regles-qualite-homey/` de ce dépôt.

## Objectif

Pour chaque cas de test en échec dans la campagne, créer un ticket de bug Jira — **sauf si
un ticket existe déjà pour ce même cas**, auquel cas on le complète au lieu d'en créer un
second — et relier ce ticket à l'exécution Squash dans les deux sens.

## Prompt-cadre (à affiner)

Demander à Claude de, pour chaque cas en échec :
1. Chercher dans Jira un ticket de type Bug déjà ouvert, étiqueté avec la référence de ce
   cas de test, qui ne soit pas déjà résolu.
2. S'il en trouve un : ajouter un commentaire dessus ("reproduit à nouveau le <date>"),
   sans rien créer de plus.
3. Sinon : créer un nouveau ticket de type Bug, avec une description qui raconte le
   problème comme le ferait un testeur humain (ce qu'on a fait, ce qu'on attendait, ce
   qu'on a observé — jamais de détail technique dans ce récit), relié à la story d'origine,
   rattaché au sprint en cours, étiqueté avec la référence du cas de test (c'est cette
   étiquette qui sert de clé de recherche la prochaine fois).
4. Dans tous les cas, poser côté Squash : une pièce jointe avec la capture d'écran de
   l'échec et une explication, et un lien cliquable vers le ticket Jira, directement visible
   sur l'exécution concernée.

## Points d'attention à intégrer dans la rédaction finale

- Insister sur le **pourquoi** de la déduplication pour un public non-technique : sans
  elle, relancer la même campagne plusieurs fois sur un même défaut réel créerait un
  nouveau ticket à chaque fois, et le backlog de bugs deviendrait vite inutilisable.
- Rappeler la distinction description-du-bug (parcours humain) vs section
  traçabilité-automatisée (références techniques), déjà vue en filigrane depuis le
  module 05.
- Mentionner que certains outils de gestion de tests limitent les types de fichiers
  acceptables en pièce jointe — si une capture d'écran est refusée, demander à Claude de
  la convertir en PDF plutôt que d'abandonner la pièce jointe.

## Vérification prévue

Relancer le triage une seconde fois sur le même échec ne doit produire AUCUN nouveau
ticket — seulement un commentaire sur celui qui existe déjà. C'est le test qui prouve que
la déduplication fonctionne.
