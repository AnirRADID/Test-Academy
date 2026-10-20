---
name: competence-regles-qualite-homey
description: Les règles du cycle qualité Homey (projet Jira HVC) — exigence miroir, cas de test Squash avant automatisation, test Playwright, campagne, exécution, triage des échecs sans doublon Jira. A charger dès qu'il est question d'ajouter une exigence ou un cas de test HVC, de lancer une campagne ou de trier des échecs.
---

# Compétence : les règles du cycle qualité Homey (Jira -> Squash -> Playwright -> triage)

Capitalise le cycle complet construit sur le projet Homey (HVC) : exigence miroir, cas de
test Squash **avant** son automatisation, test Playwright, campagne, exécution, puis
**triage des échecs sans doublon**. S'appuie sur la compétence `competence-piloter-squash` (appels REST bruts) et
sur le connecteur Atlassian MCP déjà disponible dans la session — ne les réinvente pas.

Charger ce skill dès qu'il est question : d'ajouter une exigence/un cas de test au projet
HVC, de lancer ou relancer une campagne, ou de trier les échecs d'une itération.

## Le cycle, dans l'ordre

1. **Exigence** — miroir d'une story/bug Jira dans Squash (`current_version` avant `name`,
   parent = le projet). Voir la compétence `competence-piloter-squash`.
2. **Cas de test AVANT le test automatisé** — écrire le cas dans Squash (`action` /
   `expected_result` en langage testeur, pas en appels techniques), couverture posée à la
   création (`verified_requirements`). C'est ce texte qui sert ensuite de plan au test
   Playwright, et de récit aux tickets de bug (voir plus bas).
3. **Test Playwright** — un fichier par cas, référence en commentaire d'en-tête
   (`// Référence Squash : TC-XXX`), un `test.step()` par pas Squash. **Toujours vérifié
   contre l'application réelle avant d'être considéré fini** — lire `reference/conventions.md`
   avant d'écrire un sélecteur, la plupart des surprises y sont déjà documentées.
4. **Campagne / itération** — un plan d'exécution qui ne contient que les cas du sprint
   courant. Reconstruire le plan quand le contenu du sprint change (cf. `competence-piloter-squash`).
5. **Exécution** — `npx playwright test` SANS `--reporter=` en ligne de commande (voir
   conventions). `reporters/squash-reporter.ts` importe les résultats automatiquement,
   **à condition** que `SQUASH_TOKEN` soit défini : pour une exécution qui doit remonter
   dans Squash, passer par `node .claude/skills/competence-regles-qualite-homey/scripts/lancer-campagne.mjs <iteration_id>`.
6. **Triage** — décrit ci-dessous.

## Triage des échecs (avec déduplication)

```
node .claude/skills/competence-regles-qualite-homey/scripts/lister-echecs.mjs <iteration_id>
```

Liste chaque cas `FAILURE` de l'itération : référence, exigence(s) couverte(s), id de la
dernière exécution. C'est la base factuelle du triage — ne jamais improviser ces
identifiants.

Pour chaque échec listé :

1. **Chercher un doublon dans Jira avant de créer quoi que ce soit** :
   ```
   project = HVC AND issuetype = Bug AND labels = "TC-XXX" AND statusCategory != Done
   ```
   (via `searchJiraIssuesUsingJql`, cloudId déjà connu dans la session). Si un résultat
   existe : ajouter un commentaire du type « Reproduit à nouveau le <date>, build/exécution
   <id> » sur CE ticket — **ne jamais en créer un second**.
2. **Sinon, créer le bug** : `issuetype = Bug`, projet HVC, description au gabarit établi —
   un parcours humain dans l'application (ce qu'un testeur ferait au clavier/souris),
   résultat attendu vs observé en langage utilisateur, puis une section séparée
   « Traçabilité automatisée » avec le fichier de test, la référence Squash et l'id
   d'exécution. **Jamais d'appel HTTP ni de sélecteur CSS dans le récit du bug.** Lier à
   la story d'origine (`createJiraIssueLink`, type `Relates`), rattacher au sprint actif
   (`transitionJiraIssue` avec `sprintId`), étiqueter avec la référence du cas
   (`labels: ["TC-XXX", ...]` — c'est cette étiquette que la déduplication relit).
3. **Dans tous les cas**, poser la liaison côté Squash :
   ```
   node .claude/skills/competence-regles-qualite-homey/scripts/squash-side.mjs <execution_id> <JIRA-KEY> <chemin_capture.png> "<explication courte>"
   ```
   Génère un PDF (capture + explication — les pièces jointes d'exécution n'acceptent que
   `.txt`/`.pdf` sur cette instance, voir conventions), l'attache à l'exécution, et pose un
   commentaire HTML **réellement cliquable** (`<a href="...">`) sur l'exécution et sur le
   pas en échec. Ajoute aussi un lien web Jira (`createJiraIssueRemoteIssueLink`) vers
   l'exécution Squash correspondante, pour la navigation dans l'autre sens.

## A ne pas faire

- Ne pas créer de bug sans avoir cherché un doublon d'abord.
- Ne pas écrire un sélecteur Playwright sans l'avoir vérifié contre le site réel.
- Ne pas lancer `playwright test --reporter=...` : ça désactive l'import Squash sans message.
- Ne pas promettre le lien natif "issue" de Squash sur une exécution sans connecteur
  bug-tracker payant (HTTP 412 garanti sur cette instance) — passer par les pièces jointes
  et les commentaires HTML comme décrit ci-dessus.
