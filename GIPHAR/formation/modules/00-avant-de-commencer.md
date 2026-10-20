# Module 00 — Installer votre poste, de zéro

[← Retour au sommaire](../README.md)

Ce module part du principe que vous n'avez strictement rien : pas de compte Jira, pas de
Visual Studio Code, pas de Claude Code, pas de Docker, aucun connecteur activé. Vous avez
seulement un compte Claude et un ordinateur. Suivez les étapes dans l'ordre, sans en sauter
aucune — chacune prépare la suivante.

## Ce qu'on va faire dans ce module

Installer, dans l'ordre : un compte Jira, Visual Studio Code, l'extension Claude Code, un
dossier de travail, la connexion de Claude à votre compte Jira, et Docker Desktop. À la fin
de ce module, votre poste sera prêt exactement comme celui qui a servi à construire cette
formation — plus aucune installation ne sera nécessaire pour le reste du parcours.

## Ce que vous saurez faire à la fin de toute la formation

En suivant les modules 00 à 10, vous serez capable, seul, pour n'importe quelle application
web dont vous donnez l'adresse, de : faire explorer cette application par Claude et obtenir
une proposition d'exigences ; valider et faire créer ces exigences dans Jira ; faire écrire
des cas de test en langage clair ; faire automatiser ces cas de test ; faire exécuter une
campagne de test complète ; faire créer automatiquement, sans doublon, un ticket de bug pour
chaque anomalie trouvée, relié dans les deux sens à l'outil de test ; et obtenir un rapport
global de synthèse. Vous n'écrirez vous-même aucune ligne de code à aucun moment.

## Étape 1 — Créer votre compte Atlassian (Jira)

1. Rendez-vous sur le site officiel d'Atlassian : **atlassian.com**
2. Créez un compte gratuit, puis créez un nouveau site Jira lorsque c'est proposé.
3. Gardez cette fenêtre de côté — vous vous en reservirez à l'étape 7 de ce module.

## Étape 2 — Installer Visual Studio Code

1. Rendez-vous sur le site officiel : **code.visualstudio.com**
2. Téléchargez la version correspondant à votre système d'exploitation — le site détecte
   tout seul et vous propose le bon bouton de téléchargement.
3. Lancez le fichier téléchargé et suivez l'installateur jusqu'au bout : les réglages par
   défaut conviennent, cliquez "Suivant" à chaque écran.
4. Ouvrez Visual Studio Code une fois l'installation terminée.

## Étape 3 — Installer l'extension Claude Code et vous connecter

1. Dans la barre d'icônes verticale sur le côté gauche de VS Code, cliquez sur l'icône qui
   ressemble à des petits carrés empilés (l'icône "Extensions").
2. Tapez **Claude Code** dans la barre de recherche qui s'affiche en haut du panneau.
3. Dans les résultats, repérez l'extension dont l'éditeur affiché est exactement
   **Anthropic** — c'est l'extension officielle.
4. Cliquez sur **Installer**.
5. Une fois installée, cliquez sur la nouvelle icône Claude Code apparue dans la barre de
   gauche.
6. Suivez le parcours de connexion proposé (il ouvre votre navigateur pour vous authentifier
   avec votre compte Claude), puis revenez dans VS Code une fois connecté.

## Étape 4 — Créer votre dossier de travail

1. Ouvrez l'explorateur de fichiers de votre ordinateur (l'Explorateur de fichiers sous
   Windows, le Finder sous Mac).
2. Allez directement dans votre dossier personnel — celui qui s'ouvre par défaut (contenant
   déjà des dossiers comme "Documents", "Bureau", "Téléchargements").
3. Créez à cet endroit précis un nouveau dossier nommé exactement : **formation-tests-ia**

## Étape 5 — Ouvrir ce dossier dans VS Code

1. Dans VS Code, menu **Fichier > Ouvrir un dossier...**
2. Sélectionnez le dossier `formation-tests-ia` créé à l'étape 4.
3. VS Code se recharge avec ce dossier comme espace de travail. C'est ici que tout ce que
   Claude va créer pour vous, au fil de la formation, sera rangé.

## Étape 6 — Vérifier que Claude répond

Ouvrez le panneau Claude Code (l'icône ajoutée à l'étape 3) et collez ce message :

**Prompt à copier-coller**
```
Bonjour, confirme-moi que tu fonctionnes et que tu vois bien le dossier formation-tests-ia
dans lequel on travaille.
```

Claude doit répondre en confirmant le nom de ce dossier.

## Étape 7 — Connecter Claude à votre compte Jira

**Prompt à copier-coller**
```
Je veux que tu puisses lire et créer des tickets dans mon compte Atlassian (Jira), que je
viens de créer. Dis-moi précisément comment activer ce connecteur dans Claude Code, puis
une fois que c'est fait, vérifie que tu y as bien accès et donne-moi l'adresse du site
Atlassian que tu vois.
```

## Étape 8 — Installer Docker Desktop

C'est le logiciel qui va faire tourner, sur votre propre ordinateur, l'outil de gestion des
tests (Squash TM) utilisé dès le module 01.

**Prompt à copier-coller**
```
Je n'ai pas encore Docker Desktop sur mon ordinateur. Détecte mon système d'exploitation et
dis-moi, étape par étape et en français simple, comment le télécharger et l'installer.
```

## Vous n'aurez jamais besoin de :

- ouvrir vous-même un terminal ou une ligne de commande — Claude exécute les actions
  techniques à votre place ;
- cloner un dépôt de code ou télécharger un fichier de configuration ;
- savoir programmer, ni connaître VS Code, Jira ou Squash TM à l'avance.

## Si ça ne marche pas du premier coup

- **L'extension installée ne répond pas "Anthropic" comme éditeur** : désinstallez-la et
  recherchez à nouveau — plusieurs extensions peuvent porter un nom proche.
- **Claude ne voit pas le bon dossier à l'étape 6** : vérifiez dans VS Code que le dossier
  ouvert (visible en haut de l'explorateur de fichiers à gauche) est bien
  `formation-tests-ia`, pas un autre.
- **Le connecteur Atlassian ne s'active pas à l'étape 7** : dites-le à Claude tel quel
  ("ça ne fonctionne pas, voici ce que je vois à l'écran : ...") — il peut vous guider
  précisément dans l'interface de réglages.
- **Docker Desktop demande un redémarrage de l'ordinateur** : redémarrez, rouvrez VS Code et
  le dossier `formation-tests-ia`, puis redites à Claude de vérifier que Docker tourne.

Une fois les huit étapes faites, passez au [module 01](01-environnement-squash.md).
