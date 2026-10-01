# Module 01 — Démarrer votre outil de gestion des tests (Squash TM)

[← Retour au sommaire](../README.md)

## Pourquoi cette étape

Squash TM est l'outil où vont vivre vos exigences, vos cas de test, vos campagnes et vos
résultats d'exécution — l'équivalent d'un classeur de tests, mais structuré et connecté à
Jira. Nous l'installons sur votre propre ordinateur, gratuitement, via Docker (vu au
module 00). Personne d'autre que vous n'y aura accès.

## Prompt à copier-coller

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

## Si ça ne marche pas du premier coup

- **"Docker Desktop n'est pas lancé" ou erreur de connexion au démarrage** : dites à Claude
  « Docker Desktop ne semble pas démarré, peux-tu le lancer et attendre qu'il soit prêt ? »
- **Squash répond une erreur quand vous essayez de créer le jeton d'API** (page d'erreur
  générique, "unexpected error") : c'est très probablement le secret de l'étape 3 qui n'est
  pas un base64 valide. Dites à Claude : « La création du jeton échoue avec une erreur
  inattendue, peux-tu vérifier les journaux du conteneur Squash et régénérer le secret
  SQUASH_JWT proprement ? » Claude saura quoi chercher.
- **Vous avez attendu plus de 5 minutes et rien ne répond** : dites à Claude de vérifier
  l'état des conteneurs (`docker compose ps`) et les journaux (`docker compose logs`).

## Ce que vous devez avoir à la fin de ce module

- Squash TM accessible dans votre navigateur à l'adresse `http://127.0.0.1:8090/squash`.
- Un mot de passe administrateur que vous avez changé vous-même.
- Un jeton d'API enregistré, que Claude pourra réutiliser à chaque module suivant sans que
  vous ayez à le retaper.

Une fois ceci fait, passez au [module 02](02-explorer-et-proposer.md).
