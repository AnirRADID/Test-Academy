# Pense-bête — tous les prompts de la formation

[← Retour au sommaire](../README.md)

Tous les prompts réunis ici, dans l'ordre des modules, pour une réutilisation rapide une
fois la formation terminée une première fois. Remplacez toujours les éléments entre
accolades (`{COMME_CECI}`) par votre propre information. Pour le contexte et les
explications de chaque prompt, reportez-vous au module correspondant.

> Statut : prompts des modules 00 à 03 ci-dessous, prêts à l'emploi. Les modules 04 à 10
> sont encore au stade de plan détaillé (voir chaque fichier `modules/0X-*.md`) — leurs
> prompts définitifs viendront compléter ce pense-bête au fur et à mesure.

## [Module 00](../modules/00-avant-de-commencer.md) — Vérifications

```
Peux-tu vérifier que tu as accès à mon compte Atlassian (Jira) ? Dis-moi simplement
oui ou non, et si oui, à quelle adresse (quel site Atlassian).
```

```
Je n'ai pas encore Docker Desktop sur mon ordinateur. Peux-tu me dire, étape par étape
et en français simple, comment le télécharger et l'installer pour mon système
d'exploitation (précise que je suis sur {WINDOWS, MAC OU LINUX}) ?
```

## [Module 01](../modules/01-environnement-squash.md) — Démarrer Squash TM

```
Je veux installer Squash TM (un outil de gestion de tests) sur mon ordinateur, via Docker,
dans ce dossier. Fais tout ce qui suit, dans l'ordre, et explique-moi en français simple
ce que tu fais à chaque étape :

1. Vérifie que Docker Desktop tourne. S'il n'est pas lancé, lance-le et attends qu'il soit
   prêt avant de continuer.

2. Crée un fichier docker-compose.yml qui démarre Squash TM (image
   squashtest/squash:15.0.0) avec sa base de données PostgreSQL, en suivant exactement ce
   schéma :
   - un service "db" avec l'image postgres:17, utilisateur squashtm, base squashtm
   - un service "squash" avec l'image squashtest/squash:15.0.0, qui dépend de "db"
   - Squash doit écouter uniquement sur 127.0.0.1:8090 (pas exposé au reste du réseau)
   - trois variables d'environnement sont OBLIGATOIRES pour que Squash accepte de
     fabriquer et vérifier des jetons d'API : SQUASH_CRYPTO_SECRET,
     SQUASH_REST_API_JWT_SECRET, et SQUASH_REST_API_DISALLOW_BASIC_AUTHENTICATION=false.
     Sans elles, l'interface web marche très bien mais l'API refuse tout en silence.

3. Crée un fichier .env (à côté du docker-compose.yml) avec trois secrets aléatoires :
   POSTGRES_PASSWORD, SQUASH_CRYPTO, SQUASH_JWT. Contrainte stricte à respecter pour
   SQUASH_JWT : il doit faire au moins 86 caractères, être un base64 STANDARD valide
   (uniquement des lettres, des chiffres, + / et = — jamais de tiret ni d'underscore), et
   ne contenir AUCUN caractère invisible au milieu (pas de retour à la ligne, pas de
   retour chariot). Génère-le avec un outil fiable (par exemple
   node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"), vérifie
   le fichier obtenu octet par octet après l'avoir écrit, et recommence si tu détectes
   quoi que ce soit d'anormal.

4. Démarre les conteneurs, puis attends que Squash réponde sur http://127.0.0.1:8090/squash
   (ça peut prendre 2 à 3 minutes la première fois, le temps qu'il crée sa base).

5. Quand c'est prêt, dis-moi d'ouvrir http://127.0.0.1:8090/squash dans mon navigateur et
   de me connecter avec admin / admin, puis de changer immédiatement ce mot de passe.

6. Guide-moi ensuite pour créer un jeton d'API personnel : dans Squash, Mon compte > Jetons
   personnels d'API > Créer, avec la permission "Lecture et écriture". Une fois que je te
   donne ce jeton, enregistre-le dans un fichier nommé .squash-token dans ce dossier —
   ne l'affiche jamais dans notre conversation, ni avant ni après l'avoir enregistré.

Ne passe à l'étape suivante que si la précédente a réellement réussi.
```

## [Module 02](../modules/02-explorer-et-proposer.md) — Explorer et proposer

```
Je veux que tu explores une application web et que tu m'en déduises une première liste
d'exigences fonctionnelles. L'application est ici : {URL_DE_L_APPLICATION}

Fais ceci :

1. Mets en place un petit projet Node avec Playwright (npm init, installation de
   @playwright/test, installation des navigateurs) si ce n'est pas déjà fait dans ce
   dossier.

2. Visite réellement la page d'accueil avec un navigateur piloté par Playwright (pas un
   simple téléchargement de page : beaucoup de sites modernes chargent leur contenu en
   JavaScript, et une simple requête ne montrerait rien). Repère les liens de navigation
   principaux, les formulaires visibles (recherche, connexion, inscription, contact...),
   et les actions proposées (boutons, appels à l'action).

3. Visite ensuite 5 à 10 pages ou parcours accessibles depuis la page d'accueil (sans aller
   trop loin ni remplir de formulaires d'engagement réel comme un paiement) pour te faire
   une idée plus complète de ce que l'application permet de faire.

4. À partir de cette exploration, propose-moi une liste numérotée d'exigences
   fonctionnelles, au format suivant pour chacune :
   - un titre court, du point de vue de l'utilisateur ("En tant que [qui], je veux
     [quoi], afin de [pourquoi]")
   - un ou deux critères d'acceptation observables (ce qui permettrait de dire que ça
     marche ou que ça ne marche pas)
   - une priorité indicative (Haute / Moyenne / Basse), selon ce qui te semble central ou
     secondaire dans l'application

5. Présente cette liste comme une PROPOSITION À VALIDER, pas comme un résultat définitif —
   dis-le explicitement. Ne crée rien dans Jira ni ailleurs à ce stade : ce module ne fait
   que proposer, la validation et la création se font au module suivant.

Vise une quinzaine d'exigences au maximum pour une première passe : mieux vaut une liste
courte et pertinente qu'une liste exhaustive mais bruitée.
```

## [Module 03](../modules/03-valider-et-creer-le-backlog.md) — Créer le backlog Jira

```
Vérifie que tu as accès à mon compte Atlassian, puis au projet Jira de clé {CLE_PROJET}
(nom : {NOM_DU_PROJET}). Confirme-moi que tu le trouves avant de continuer.

Ensuite, à partir de la liste d'exigences qu'on a validée ensemble juste avant ce message,
crée un ticket de type Story dans ce projet pour chacune :
- le titre reprend le titre court de l'exigence
- la description reprend le "en tant que... je veux... afin de..." et les critères
  d'acceptation, tels qu'on les a validés
- ajoute l'étiquette "squash-mirror" sur chaque ticket créé (ça nous servira plus tard
  pour la traçabilité avec l'outil de gestion des tests)
- règle la priorité Jira sur la priorité qu'on a indiquée pour chaque exigence

Une fois tous les tickets créés, crée un sprint nommé "Sprint 1" sur le tableau de ce
projet, démarre-le, et affecte-lui tous les tickets que tu viens de créer.

Donne-moi ensuite la liste des clés de tickets créés (par exemple MONAPP-1, MONAPP-2...)
avec leur titre, pour que je vérifie que tout est bien là.
```
