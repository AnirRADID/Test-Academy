# Contexte du projet — fil rouge Homey, Partie B

Tu assistes un **testeur, pas un developpeur**. Il te demandera d'installer, de configurer
et de verifier des choses a sa place. Reponds en francais, en phrases courtes, et **dis
toujours ce qu'il doit voir a l'ecran** pour savoir que ca a marche.

## Ce que fait ce projet

Une chaine complete : une exigence ecrite dans **Jira** → un cas de test dans **Squash TM**
→ un test **Playwright** qui la verifie dans un vrai navigateur → **Jenkins** qui rejoue ce
test tout seul des qu'un travail arrive sur le depot → le resultat qui **revient dans
Squash** → l'**anomalie** creee dans Jira.

L'application testee est **Homey**, `http://livraison3.testacademy.fr` (en `http` seulement,
`https` ne repond pas).

## Les deux defauts sont reels

Ce ne sont pas des echecs fabriques : Homey a vraiment ces deux defauts, et les deux tests
echouent vraiment.

| Cas | Attendu | Constate |
| :-- | :-- | :-- |
| **CT-06** | La recherche est refusee si la destination est vide. | La page de resultats s'affiche quand meme — l'adresse le prouve : `?city=&...` |
| **CT-08** | Une periode inversee est refusee, ou au moins signalee. | Homey affiche tout son catalogue (138 logements contre 135) sans aucun message. |

## Les points a ne pas improviser

- **CT-06 est declare automatise dans Squash, CT-08 volontairement pas.** C'est ce qui
  fait apparaitre le message d'erreur de la leçon B6. Ne pas « reparer » CT-08.
- **Jamais `--reporter=html` sur la ligne de commande Playwright.** Ce drapeau remplace la
  liste de rapporteurs de `playwright.config.ts` : le rapporteur Squash ne s'executerait
  jamais, et rien ne le signalerait.
- **Pousser sur le depot AVANT d'armer la scrutation dans Jenkins.** Un job sans aucun build
  en lance un a la premiere scrutation, quoi qu'il y ait dans le depot.
- **Jira ne recycle jamais une cle supprimee.** Ne compter sur aucun numero de ticket precis.
- **Aucun lien anomalie ↔ cas de test dans Squash** n'est possible en edition gratuite. La
  tracabilite passe par l'etiquette `CT-06` sur l'anomalie et par sa description.

## Les secrets

Le jeton Squash vit dans `squash/.token`, le fichier `squash/.env` contient les secrets de
la base. **Les deux sont ignores par git.** Ne jamais les afficher, ni les recopier dans une
reponse, ni les passer en argument d'une commande.

## Les outils a ta disposition

- **Squash** : la competence `squash` (`.claude/skills/squash/`). Lis-la avant tout appel.
- **Jenkins** : le connecteur MCP, s'il est declare (`claude mcp list` pour verifier).
- **Jira** : le connecteur MCP Atlassian, apres `claude mcp login atlassian`.

Ces connecteurs sont attaches au dossier du projet : il faut lancer `claude` depuis ici.
