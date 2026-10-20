---
name: competence-lancer-des-stories
description: Lancer le cycle QA automatisé (les 5 agents, via n8n) sur des user stories Jira HVC à la demande de l'utilisateur dans la conversation, puis en suivre l'avancement. A utiliser dès que l'utilisateur dit « teste HVC-8 », « teste HVC-8 et HVC-9 », « teste les stories du sprint 2 », « relance HVC-7 », ou demande « où en est HVC-8 ? », « qu'est-ce que font les agents ? ».
---

# Compétence : lancer des stories et suivre leur avancement

L'utilisateur ne pose **jamais** d'étiquette Jira. Il dit ici quelles stories tester, et c'est
Claude qui transmet la demande à n8n. n8n pose ensuite lui-même les étiquettes d'état
(`qa-en-cours`, `qa-a-valider`, `qa-termine`, `qa-bloque`) et fait travailler les agents.

**Ne jamais lancer un agent soi-même** (`claude -p --agent …`) pour traiter une story :
toujours passer par n8n, sinon rien n'apparaît dans n8n ni dans le journal, et le verrou
« un agent à la fois » est contourné.

## Lancer

1. **Établir la liste des stories.**
   - Clés données explicitement (« teste HVC-8 et HVC-9 ») → les prendre telles quelles.
   - Liste à déduire (« le sprint 2 », « toutes les stories pas encore testées ») → la
     chercher dans Jira (connecteur Atlassian, site `https://testacademy.atlassian.net`, le
     cloudId dont l'url correspond), par exemple
     `project = HVC AND issuetype = Story AND sprint in openSprints()`, puis **montrer la liste
     (clé + titre) et la faire confirmer** avant de lancer.
2. **Vérifier que chaque story existe** (`getJiraIssue`) et annoncer son titre. Une clé
   introuvable : le dire et ne pas l'envoyer.
3. **Vérifier que les outils sont allumés :**
   - n8n : `curl -s -m 5 -o /dev/null -w "%{http_code}" http://127.0.0.1:5678/healthz` → `200`.
     Sinon : demander de double-cliquer sur `n8n/demarrer-n8n.cmd`.
   - Squash : `node .claude/skills/competence-piloter-squash/squash.mjs verifier`. En échec :
     demander de démarrer Docker Desktop et d'attendre 2 minutes.
4. **Envoyer la demande à n8n** (toutes les stories en une fois) :
   ```bash
   curl -s -m 20 -X POST http://127.0.0.1:5678/webhook/qa-homey-lancer-des-stories \
        -H "Content-Type: application/json" -d '{"stories":["HVC-8","HVC-9"]}'
   ```
   Réponse attendue : `{"message":"Workflow was started"}`.
   - `404` / « not registered » : le flux « 1. Lancer des stories » n'est pas publié, ou n8n
     vient de redémarrer et n'a pas fini de s'initialiser → attendre 30 s et réessayer une
     fois ; sinon demander de cliquer **Publish** sur ce flux.
5. **Confirmer à l'utilisateur** : stories envoyées, et ce qui va se passer (l'analyste rédige
   chaque cas ; les agents travaillent **un par un**, les autres attendent leur tour).

## Suivre

- **Le journal** `suivi-des-stories/journal-des-taches.md` : tout, au fil de l'eau, toutes
  stories confondues. Lire la fin du fichier (`tail -n 40`) et filtrer sur la clé de la
  story.
- **La fiche de suivi** `suivi-des-stories/story-<titre>.md` : « Où en est-on » et
  « Prochaine action » en tête, le détail de chaque étape dessous.
- **Validation attendue** (ligne de journal « attend votre validation ») : donner à
  l'utilisateur **le lien du formulaire**, qui figure dans « Prochaine action » de la fiche,
  et résumer le cas à relire (section 1 de la fiche, y compris les « points à surveiller »
  relevés par l'analyste). Rappeler : Approuver lance l'automatisation, Refuser renvoie le
  cas à l'analyste avec les remarques.
- **Blocage** (ligne 🛑 ou ⚠) : expliquer en langage simple ce qui a bloqué (dernières lignes
  de la story dans le journal + commentaire de blocage), proposer la correction, puis, une fois
  réglé, relancer la story par l'étape 4.

## Relancer une story

Même chose qu'un premier lancement : l'envoyer à nouveau à n8n. n8n retire les anciennes
étiquettes d'état et les agents reprennent ce qui existe déjà (cas Squash, test, fiche) sans
doublon.
