# Charte pédagogique de la formation

Ce document est la **référence** de la formation. Toute création ou modification de module,
de prompt ou de « photo » du projet le respecte. Il évite de rappeler les fondamentaux à
chaque séance de travail : en cas de doute, c'est ce texte qui tranche.

> Statut (20/10/2026) : principes **validés** ; découpage en étapes (§ 4) **retenu comme
> base de travail**, modifiable ; environnement (§ 3) **à prototyper** ; story fil rouge des
> phases 1 et 2 : **HVC-7 « Connexion utilisateur »**.
>
> Ordre de travail décidé : d'abord terminer la solution complète (phase 3 : agents, Tour de
> contrôle), ensuite revenir sur la formation, étape par étape.

---

## 1. Le but

Amener une personne **qui n'a jamais testé** à conduire un processus de test complet,
**accéléré par l'IA** : elle ne fait que dialoguer avec Claude, en français. Claude écrit
tout le reste (fichiers, code, commandes).

Trois phases, de difficulté croissante :

| Phase | Titre | Activités de test couvertes |
|---|---|---|
| **1** | Tests manuels accélérés par l'IA | Analyse, conception |
| **2** | Tests automatisés accélérés par l'IA | Implémentation, exécution, clôture |
| **3** | Industrialiser : l'équipe de robots QA | Tout le processus, piloté par des agents, et la Tour de contrôle |

Faire tout le processus deux fois (en manuel puis en automatique) serait trop long. Le
processus est donc **découpé entre les phases 1 et 2** : la phase 1 produit les cas de test,
la phase 2 les automatise et les exécute. L'apprenant ne connaît pas Playwright et n'a pas
besoin de l'apprendre.

## 2. Les principes (non négociables)

1. **Public débutant, non technique.** Aucun prérequis en test, en code ou en outils.
   Vocabulaire simple ; tout terme technique est expliqué à sa première apparition.
2. **L'apprenant ne fait que chatter.** Il n'édite aucun fichier à la main et ne tape
   aucune commande lui-même : il copie un prompt, l'adapte, l'envoie, lit la réponse.
3. **L'humain valide.** Claude propose, l'apprenant décide : il relit et approuve (ou
   refuse) chaque production importante (conditions de test, cas de test, bug). C'est le
   cœur du métier de testeur, et ce que la formation doit apprendre.
4. **Un fil rouge unique : Homey.** Le site de location `http://livraison3.testacademy.fr`
   et ses stories `HVC-…`. Phases 1 et 2 : **la même story** du début à la fin,
   **HVC-7 « Connexion utilisateur »**. Phase 3 :
   tout le backlog, puis d'autres applications.
5. **Le vocabulaire du métier.** Les activités portent les noms standards du test logiciel
   (ISTQB) : analyse, conception, implémentation, exécution, clôture. L'apprenant repart
   avec les bons mots.
6. **Chaque étape a une photo.** À la fin de chaque étape, l'état du projet est figé dans
   Git (§ 5). Un apprenant bloqué repart de la photo de l'étape précédente ; un formateur
   compare le travail de l'apprenant avec la photo de référence.
7. **Construire d'abord, rédiger ensuite.** Une étape n'est rédigée que lorsque son
   « corrigé » a été exécuté pour de vrai, de bout en bout, sur Homey.
8. **Le même environnement pour tous.** Il fonctionne quels que soient la machine et le
   niveau de l'apprenant, et ne dépend pas des versions installées chez lui (§ 3).
9. **Chaque apprenant a ses propres outils.** Son propre Jira, son propre Squash : il est
   maître de ses données, et rien de ce qu'il fait ne gêne un autre apprenant.

## 3. L'environnement de l'apprenant

> Choix retenu, à prototyper : GitHub Codespaces (dépôt `AnirRADID/Test-Academy`).

- **VS Code dans le navigateur** (GitHub Codespaces), ouvert depuis le dépôt modèle de la
  formation. Rien n'est installé sur l'ordinateur de l'apprenant : il lui faut un
  navigateur, un compte GitHub et un compte Claude.
- L'environnement est décrit une fois pour toutes dans le dépôt (`.devcontainer/`), avec des
  **versions figées** : Node, Playwright et ses navigateurs, Claude Code, image Docker de
  Squash. Tous les apprenants ont exactement le même poste.
- **Squash** tourne dans cet environnement (Docker), démarré par un prompt.
- **Jira** : chaque apprenant crée son **site Jira Cloud gratuit**, puis y fait créer le
  projet `HVC` et ses stories par Claude, à partir du jeu de départ.
- Pour **voir le navigateur rejouer un test**, un bureau virtuel s'ouvre dans un onglet
  (ou le rapport Playwright avec vidéo et captures).

Ce qui ne peut pas être figé, et qu'il faut surveiller : Jira Cloud et claude.ai (services
en ligne, mis à jour par leurs éditeurs).

## 4. Les phases et leurs étapes

> Base de travail retenue, modifiable. Chaque étape = un module, une photo à l'arrivée.
> Notation : `E0`, `P1-E1`, `P1-E2`… ; photo Git du même nom.

### Étape 0 : Le poste de travail (une seule fois)

| Étape | Objectif | Résultat vérifiable |
|---|---|---|
| E0.1 | Créer les comptes : GitHub, Claude, Atlassian (site Jira gratuit) | Les 3 connexions fonctionnent |
| E0.2 | Ouvrir l'environnement prêt à l'emploi | VS Code s'affiche, Claude répond dans le chat |
| E0.3 | Connecter Claude à Jira | Claude lit le site Jira de l'apprenant |
| E0.4 | Démarrer Squash | Squash s'ouvre, Claude y accède |
| E0.5 | Charger le fil rouge Homey : projet `HVC` et stories dans Jira, projet dans Squash | Les stories sont visibles dans Jira |

### Phase 1 : Tests manuels accélérés par l'IA, sur une story

| Étape | Activité | Objectif | Résultat vérifiable |
|---|---|---|---|
| P1-E1 | Découverte | Lire la story, explorer la fonctionnalité sur le site avec Claude | L'apprenant sait dire ce que fait la fonctionnalité |
| P1-E2 | Analyse | Repérer les critères d'acceptation, les zones floues ; formuler les questions au PO | Liste des questions, réponses notées |
| P1-E3 | Analyse | Déduire les conditions de test (quoi vérifier) et les prioriser | Conditions validées par l'apprenant |
| P1-E4 | Analyse | Enregistrer l'exigence dans Squash, reliée à la story Jira | Exigence visible dans Squash |
| P1-E5 | Conception | Choisir les techniques (cas nominal, cas d'erreur, valeurs limites) et la liste des cas | Liste des cas validée |
| P1-E6 | Conception | Écrire chaque cas pas à pas (action, résultat attendu) et ses données de test, dans Squash | Cas « À approuver » dans Squash |
| P1-E7 | Revue | Relire et approuver les cas | Cas « Approuvé » dans Squash |

### Phase 2 : Tests automatisés accélérés par l'IA, sur la même story

| Étape | Activité | Objectif | Résultat vérifiable |
|---|---|---|---|
| P2-E1 | Implémentation | Préparer les données et le compte de test | Le compte de test fonctionne |
| P2-E2 | Implémentation | Faire écrire le test Playwright à partir du cas approuvé ; le regarder rejouer | Le test passe sur le site |
| P2-E3 | Implémentation | Comprendre un échec : problème du test ou de l'application ? | L'apprenant sait trancher |
| P2-E4 | Implémentation | Relier le test au cas Squash (« automatisé ») | Cas marqué automatisé |
| P2-E5 | Exécution | Préparer la campagne et l'itération dans Squash | Le cas est au plan |
| P2-E6 | Exécution | Lancer la campagne : les résultats remontent seuls dans Squash | Résultat visible dans Squash |
| P2-E7 | Exécution | Échec → bug Jira sans doublon, relié dans les deux sens | Bug créé et relié |
| P2-E8 | Clôture | Rapport : compte rendu dans Jira, bilan dans Squash | Les deux rapports publiés |

### Phase 3 : Industrialiser, l'équipe de robots QA

| Étape | Objectif | Corrigé dans le projet |
|---|---|---|
| P3-E1 | Connecter Claude à Jira (MCP) et à Squash (API), sur Homey | existe |
| P3-E2 | Écrire les compétences (skills) : règles qualité, pilotage de Squash, comptes rendus | existe |
| P3-E3 | Créer les 5 agents et les lancer un par un | existe |
| P3-E4 | Enchaîner les agents avec n8n, avec un journal | existe |
| P3-E5 | Tour de contrôle v1 : observer les robots (Kanban, journal) | existe |
| P3-E6 | Installer et démarrer la Tour en un double-clic | existe |
| P3-E7 | Tour v2 : valider depuis la Tour, niveau de qualité, analyse de Claude | existe |
| P3-E8 | Tour v3 : plusieurs applications, création des projets Jira et Squash, nouvelle URL et robot Explorateur | **à construire** |
| P3-E9 | Bonus : discuter avec Claude depuis la Tour | **à construire** |

## 5. Les photos du projet

- Une photo = un **tag Git** sur le dépôt modèle, nommé comme l'étape : `E0`, `P1-E3`,
  `P2-E6`, `P3-E7`…
- Chaque module indique sa **photo de départ** et sa **photo d'arrivée**.
- Repartir d'une photo = ouvrir un nouvel environnement depuis ce tag : l'apprenant
  retrouve un projet propre et qui fonctionne.
- Les données propres à l'apprenant (son Jira, son Squash) ne sont pas dans la photo :
  chaque module de départ fournit le prompt qui les remet dans l'état attendu.

## 6. La forme d'un module

Chaque module suit le même plan :

1. **Objectif** de l'étape, en une phrase.
2. **Ce qu'il faut savoir** : la notion de test, expliquée simplement (5 à 10 lignes).
3. **Photo de départ.**
4. **Prompt(s) à copier-coller**, avec les `{PARTIES_A_REMPLACER}` signalées.
5. **Ce que vous devez obtenir** : le résultat, et comment le vérifier soi-même.
6. **Votre décision** : ce que l'apprenant doit relire et valider.
7. **Si ça ne marche pas** : les 2 ou 3 incidents connus et quoi dire à Claude.
8. **Photo d'arrivée.**
