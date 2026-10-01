# Formation — processus de test industrialisé piloté par l'IA

## À qui s'adresse cette formation

À vous si vous travaillez dans l'IT mais que vous n'êtes **ni développeur, ni testeur
automaticien** : product owner, business analyst, chef de projet, testeur manuel. Vous
n'écrirez aucune ligne de code. Vous allez conduire Claude, un assistant IA, à travers un
processus complet de test logiciel, uniquement en lui donnant des instructions en français
— préparées à l'avance dans ce document, prêtes à copier-coller.

## Ce que vous allez construire

À la fin de cette formation, pour **n'importe quelle application web dont vous donnez
l'URL**, vous aurez fait construire par Claude, de façon autonome :

1. une liste d'exigences déduite de l'exploration réelle de l'application, que vous aurez
   validée et corrigée ;
2. ces exigences enregistrées dans Jira ;
3. un miroir de ces exigences dans un outil de gestion de tests (Squash TM) ;
4. un cas de test, écrit en langage clair, pour chacune ;
5. un test automatisé qui rejoue ce cas sur l'application réelle ;
6. une campagne de test exécutée, avec les résultats remontés automatiquement ;
7. pour chaque échec, un ticket de bug créé dans Jira — sans jamais créer de doublon si le
   même problème est retrouvé deux fois — et relié dans les deux sens à l'outil de test ;
8. un rapport de synthèse global.

C'est exactement le processus qui a été construit et exécuté, ce soir, sur un site de
location de logements nommé Homey — cette formation vous permet de refaire la même chose,
seul, sur l'application de votre choix.

## Comment utiliser ce document

- Il n'y a **rien à télécharger ni à cloner**. Vous partez d'un dossier vide sur votre
  ordinateur.
- Les modules se suivent dans l'ordre (`00` à `10`), chacun s'appuie sur le précédent.
- Chaque module contient un peu d'explication, puis un ou plusieurs blocs intitulés
  **« Prompt à copier-coller »**. Vous copiez le texte du bloc, vous le collez dans Claude,
  vous remplacez les éléments entre accolades (`{COMME_CECI}`) par votre propre information,
  et vous envoyez.
- Après chaque prompt, lisez ce que répond Claude. S'il pose une question ou signale un
  souci, répondez-lui en français normal — vous n'avez pas besoin de comprendre le détail
  technique pour juger si la réponse a du sens par rapport à ce que vous attendiez.
- Si quelque chose ne correspond pas à ce qui est décrit dans le module, dites-le à Claude
  tel quel ("ça ne correspond pas à ce que j'attendais, voici pourquoi...") plutôt que de
  continuer : le module suivant suppose que l'étape précédente a réellement abouti.

## Prérequis

- Un ordinateur avec accès à Internet.
- Un compte Claude (Claude.ai / Anthropic) donnant accès à Claude Code.

C'est tout. **Visual Studio Code, l'extension Claude Code, Docker Desktop et le connecteur
Atlassian (Jira) ne sont pas supposés déjà installés** — le module 00 vous fait passer de
zéro à un poste fonctionnel, clic par clic.

## Sommaire

| Module | Contenu |
|---|---|
| [00 — Avant de commencer](modules/00-avant-de-commencer.md) | Installer VS Code, Claude Code et Docker Desktop, de zéro |
| [01 — Environnement Squash](modules/01-environnement-squash.md) | Démarrer votre outil de gestion des tests |
| [02 — Explorer et proposer](modules/02-explorer-et-proposer.md) | Donner une URL, obtenir une proposition d'exigences |
| [03 — Valider et créer le backlog](modules/03-valider-et-creer-le-backlog.md) | Corriger la proposition, créer le projet Jira et les exigences |
| [04 — Miroir Squash](modules/04-miroir-squash.md) | Copier les exigences validées dans l'outil de test |
| [05 — Cas de test](modules/05-cas-de-test.md) | Écrire les cas de test, en langage clair, avant toute automatisation |
| [06 — Tests automatisés](modules/06-tests-automatises.md) | Faire écrire et vérifier les tests automatisés |
| [07 — Campagne et exécution](modules/07-campagne-et-execution.md) | Lancer les tests, voir les résultats remonter |
| [08 — Triage des échecs](modules/08-triage-des-echecs.md) | Créer les bugs sans doublon, traçabilité dans les deux sens |
| [09 — Rapport global](modules/09-rapport-global.md) | Obtenir une synthèse de toute la campagne |
| [10 — Vers la non-régression](modules/10-vers-la-non-regression.md) | Aperçu de la suite (exécution automatique planifiée) |

Un pense-bête avec tous les prompts réunis au même endroit est disponible dans
[`prompts/aide-memoire.md`](prompts/aide-memoire.md), pour une réutilisation rapide une fois
la formation terminée.
