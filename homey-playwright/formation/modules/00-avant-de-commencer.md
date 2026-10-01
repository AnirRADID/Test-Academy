# Module 00 — Avant de commencer

[← Retour au sommaire](../README.md)

Ce module ne contient aucun prompt. Il vérifie que vous avez tout ce qu'il faut pour que
les modules suivants se passent sans accroc technique.

## Ce qu'il vous faut

1. **Un ordinateur avec accès à Internet.** Windows, Mac ou Linux, peu importe.

2. **Claude Code, installé et fonctionnel.** C'est l'outil dans lequel vous allez coller
   les prompts de cette formation. Si vous suivez cette formation dans le cadre d'un cours
   ou d'une entreprise, la personne qui vous l'a transmise vous aura indiqué comment
   l'installer. Une fois installé, ouvrez un dossier **vide** — n'importe où sur votre
   disque, par exemple `mes-tests-ia` sur votre Bureau — et lancez Claude Code dedans.

3. **Le connecteur Atlassian (Jira) activé dans Claude.** C'est ce qui permet à Claude de
   lire et d'écrire dans Jira à votre place. Pour vérifier qu'il est actif, collez ce
   message à Claude :

   **Prompt à copier-coller**
   ```
   Peux-tu vérifier que tu as accès à mon compte Atlassian (Jira) ? Dis-moi simplement
   oui ou non, et si oui, à quelle adresse (quel site Atlassian).
   ```

   - Si Claude confirme un accès : parfait, passez à la suite.
   - Si Claude dit qu'il n'a pas accès : il vous faut activer le connecteur Atlassian dans
     les réglages de votre outil Claude avant de continuer. C'est un réglage qui se fait
     une seule fois, en dehors de cette formation — demandez à la personne qui vous
     l'a transmise si vous ne trouvez pas où l'activer.

4. **Docker Desktop, installé et démarré.** C'est le logiciel qui va faire tourner, sur
   votre propre ordinateur, l'outil de gestion des tests (Squash TM) que nous allons
   utiliser. Si vous ne l'avez pas :

   **Prompt à copier-coller**
   ```
   Je n'ai pas encore Docker Desktop sur mon ordinateur. Peux-tu me dire, étape par étape
   et en français simple, comment le télécharger et l'installer pour mon système
   d'exploitation (précise que je suis sur {WINDOWS, MAC OU LINUX}) ?
   ```

5. **Un compte Atlassian gratuit.** Si vous n'en avez pas encore, vous le créerez au
   module 03, au moment d'avoir besoin d'un projet Jira — inutile de le faire maintenant.

## Ce que vous n'avez PAS besoin de faire

- Rien à cloner, rien à télécharger depuis un dépôt de code.
- Rien à configurer "à la main" en dehors de ce qui est listé ci-dessus : chaque étape
  technique (créer des fichiers de configuration, démarrer des outils, écrire du code) sera
  faite par Claude, à votre demande, au fil des modules.
- Pas besoin de savoir programmer, ni de connaître Jira ou Squash TM à l'avance.

## Comment cette formation va se comporter si quelque chose ne marche pas du premier coup

C'est normal, et prévu. Chaque module suivant explique, dans un encadré « Si ça ne marche
pas du premier coup », les soucis les plus probables et comment les formuler à Claude pour
qu'il corrige. Vous n'avez jamais besoin de comprendre la cause technique — juste de décrire
ce que vous observez.

Une fois les quatre points ci-dessus vérifiés, passez au [module 01](01-environnement-squash.md).
