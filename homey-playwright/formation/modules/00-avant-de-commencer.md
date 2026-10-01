# Module 00 — Avant de commencer : installer votre poste de zéro

[← Retour au sommaire](../README.md)

Ce module part du principe que vous n'avez **rien** d'installé — juste un compte Claude et
un ordinateur. À la fin, vous aurez le même outil de travail que celui utilisé pour
construire tout ce processus : Visual Studio Code, avec Claude Code dedans, prêt à recevoir
des instructions. Aucun prompt ici ne s'adresse à Claude : tant que Claude Code n'est pas
installé, il n'y a personne à qui parler. Ce sont des manipulations à faire vous-même, une
fois, avec votre souris.

## Ce que vous avez déjà

Un compte Claude (Claude.ai / Anthropic), qui vous donne accès à Claude Code. C'est le seul
prérequis que cette formation suppose acquis.

## Étape 1 — Installer Visual Studio Code

Visual Studio Code (souvent abrégé "VS Code") est un éditeur de texte gratuit, utilisé par
des millions de développeurs. C'est le programme dans lequel tout va se passer — pas besoin
de l'utiliser comme un développeur, il sert ici principalement de fenêtre pour discuter avec
Claude.

1. Rendez-vous sur le site officiel de Visual Studio Code : **code.visualstudio.com**
2. Téléchargez la version correspondant à votre système d'exploitation (Windows, Mac ou
   Linux) — le site le détecte généralement tout seul et vous propose le bon bouton.
3. Lancez le fichier téléchargé et suivez l'installateur : les réglages par défaut
   conviennent, vous pouvez cliquer "Suivant" jusqu'au bout.
4. Ouvrez Visual Studio Code une fois l'installation terminée — vous devriez voir un écran
   d'accueil avec un fond sombre ou clair selon votre système, et une barre d'icônes sur le
   côté gauche.

## Étape 2 — Installer Claude Code dans Visual Studio Code

Claude Code est disponible comme une **extension** de Visual Studio Code — un module qu'on
ajoute à l'éditeur, comme une application qu'on installerait sur son téléphone.

1. Dans la barre d'icônes verticale sur le côté gauche de VS Code, cliquez sur l'icône qui
   ressemble à des petits carrés empilés (l'icône "Extensions"). Un panneau s'ouvre avec une
   barre de recherche en haut.
2. Tapez **Claude Code** dans cette barre de recherche.
3. Dans les résultats, repérez l'extension officielle — vérifiez bien que l'éditeur affiché
   est **Anthropic** (c'est l'éditeur officiel) avant d'installer : il peut exister des
   extensions tierces portant un nom proche, qui ne sont pas celle-ci.
4. Cliquez sur **Installer**. Ça prend quelques secondes.
5. Une fois installée, une nouvelle icône apparaît dans la barre de gauche (ou un nouveau
   panneau s'ouvre automatiquement) pour Claude Code. Cliquez dessus.
6. Il va vous être demandé de vous connecter. Suivez le parcours proposé (ça ouvre
   généralement votre navigateur pour vous authentifier avec votre compte Claude), puis
   revenez dans VS Code une fois connecté.

## Étape 3 — Créer votre dossier de travail

1. Sur votre Bureau (ou où vous préférez), créez un nouveau dossier **vide**, par exemple
   nommé `mes-tests-ia`. Pas besoin d'y mettre quoi que ce soit dedans.
2. Dans VS Code, allez dans le menu **Fichier > Ouvrir un dossier...** (ou "Open Folder..."
   si votre VS Code est en anglais), et sélectionnez ce dossier.
3. VS Code se recharge avec ce dossier comme espace de travail. C'est ici que tout ce que
   Claude va créer pour vous, au fil de la formation, sera rangé.

## Étape 4 — Vérifier que tout fonctionne

Ouvrez le panneau Claude Code (l'icône ajoutée à l'étape 2) et tapez simplement :

```
Bonjour, confirme-moi que tu fonctionnes et que tu vois bien le dossier dans lequel on
travaille.
```

Claude doit vous répondre, en confirmant le nom de votre dossier de travail (`mes-tests-ia`
ou le nom que vous avez choisi). Si c'est le cas : votre poste est prêt, passez à la suite.

**Vous n'aurez jamais besoin d'ouvrir vous-même un terminal ou une ligne de commande.** Tout
le reste de cette formation consiste à copier des messages à Claude, qui exécute lui-même
les actions techniques nécessaires (y compris lancer des commandes) à votre place.

## Ensuite — ce qui sera vérifié une fois que Claude répond

Une fois l'étape 4 validée, deux choses restent à vérifier avant d'attaquer le module 01 —
cette fois, via des prompts à Claude.

### Le connecteur Atlassian (Jira) est-il actif ?

C'est ce qui permet à Claude de lire et d'écrire dans Jira à votre place, plus tard dans la
formation.

**Prompt à copier-coller**
```
Peux-tu vérifier que tu as accès à mon compte Atlassian (Jira) ? Dis-moi simplement
oui ou non, et si oui, à quelle adresse (quel site Atlassian).
```

- Si Claude confirme un accès : parfait, passez à la suite.
- Si Claude dit qu'il n'a pas accès : il faut activer le connecteur Atlassian dans les
  réglages de Claude Code avant de continuer. C'est un réglage qui se fait une seule fois.
  Si vous ne trouvez pas où l'activer, demandez à Claude : « Comment est-ce que j'active le
  connecteur Atlassian dans Claude Code ? » — il peut vous guider dans l'interface.

### Docker Desktop

C'est le logiciel qui va faire tourner, sur votre propre ordinateur, l'outil de gestion des
tests (Squash TM) utilisé au module 01. Si vous ne l'avez pas encore :

**Prompt à copier-coller**
```
Je n'ai pas encore Docker Desktop sur mon ordinateur. Peux-tu me dire, étape par étape
et en français simple, comment le télécharger et l'installer pour mon système
d'exploitation (précise que je suis sur {WINDOWS, MAC OU LINUX}) ?
```

### Un compte Atlassian gratuit

Si vous n'en avez pas encore, vous le créerez au module 03, au moment d'avoir besoin d'un
projet Jira — inutile de le faire maintenant.

## Ce que vous n'avez PAS besoin de faire

- Rien à cloner, rien à télécharger depuis un dépôt de code.
- Rien à configurer "à la main" en dehors des quatre étapes ci-dessus : chaque étape
  technique suivante (créer des fichiers de configuration, démarrer des outils, écrire du
  code) sera faite par Claude, à votre demande, au fil des modules.
- Pas besoin de savoir programmer, ni de connaître VS Code, Jira ou Squash TM à l'avance.

## Comment cette formation va se comporter si quelque chose ne marche pas du premier coup

C'est normal, et prévu. Chaque module suivant explique, dans un encadré « Si ça ne marche
pas du premier coup », les soucis les plus probables et comment les formuler à Claude pour
qu'il corrige. Vous n'avez jamais besoin de comprendre la cause technique — juste de décrire
ce que vous observez.

Une fois les quatre étapes d'installation et les deux vérifications ci-dessus faites,
passez au [module 01](01-environnement-squash.md).
