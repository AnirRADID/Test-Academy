---
name: competence-piloter-squash
description: Lire et modifier Squash TM (projet Homey-Demo) par son interface REST — creer le projet complet (exigences, cas de test, couverture, campagne, iteration), decouvrir les identifiants, declarer un cas automatise, envoyer des resultats. A utiliser des qu'il est question de Squash, d'un cas CT-xx, d'une iteration, d'un plan d'execution, ou de faire remonter des resultats Playwright (leçons B3 a B7 du fil rouge Homey).
---

# Squash TM — l'acces par l'interface REST

**Squash ne fournit aucun serveur MCP.** Le lien Claude ↔ Squash passe par son interface
REST, enveloppee dans `squash.mjs` (a cote de ce fichier). C'est du Node : elle marche
sous Windows comme ailleurs, et aucun jeton ne transite par la ligne de commande.

## Utiliser

```bash
node .claude/skills/competence-piloter-squash/squash.mjs verifier          # le jeton repond-il ?
node .claude/skills/competence-piloter-squash/squash.mjs creer-projet      # toute la Phase A, d'un coup
node .claude/skills/competence-piloter-squash/squash.mjs reperes           # les identifiants de CETTE instance
node .claude/skills/competence-piloter-squash/squash.mjs tag CT-06         # declarer CT-06 automatise
node .claude/skills/competence-piloter-squash/squash.mjs detag CT-06
```

Le jeton est lu dans `SQUASH_TOKEN`, sinon dans `squash/.token`. L'adresse dans
`SQUASH_URL`, sinon `http://127.0.0.1:8090/squash`.

> **Ne JAMAIS afficher le jeton**, ni le lire a voix haute dans une reponse, ni le
> passer en argument d'une commande.

## Le cycle par story (commandes utilisees par les agents)

```bash
node .claude/skills/competence-piloter-squash/squash.mjs ajouter-story suivi-des-stories/donnees-squash/story-inscription-d-un-nouveau-compte.json
node .claude/skills/competence-piloter-squash/squash.mjs modifier-cas  suivi-des-stories/donnees-squash/story-inscription-d-un-nouveau-compte.json
node .claude/skills/competence-piloter-squash/squash.mjs lire-cas TC-HVC-6
node .claude/skills/competence-piloter-squash/squash.mjs statut TC-HVC-6 APPROUVE      # EN_COURS | A_APPROUVER | APPROUVE
node .claude/skills/competence-piloter-squash/squash.mjs ajouter-au-plan TC-HVC-6 <iteration_id>
node .claude/skills/competence-piloter-squash/squash.mjs resultats <iteration_id>
node .claude/skills/competence-piloter-squash/squash.mjs lire-bilans <iteration_id>      # les bilans deja publies
node .claude/skills/competence-piloter-squash/squash.mjs bilan-iteration <iteration_id> <fichier.html>
```

**Plusieurs cas par story.** Une story a **un cas de test par critère d'acceptation** :
`TC-HVC-9-1`, `TC-HVC-9-2`… La référence **`TC-HVC-9`** désigne le **groupe** de tous les cas
de la story : `lire-cas`, `statut`, `ajouter-au-plan`, `tag` et `detag` s'appliquent alors à
chacun d'eux. `TC-HVC-9-2` désigne un seul cas. Les anciennes stories à cas unique
(`TC-HVC-7`) restent valables telles quelles.

Le fichier lu par `ajouter-story` et `modifier-cas` :

```json
{
  "story_jira": "HVC-9",
  "exigence": { "nom": "HVC-9 - Devenir hôte",
                "description": "En tant que ..., je veux ... Critères d'acceptation : ...", "criticite": "MAJOR" },
  "cas": [
    {
      "reference": "TC-HVC-9-1",
      "nom": "Devenir hôte : accès au formulaire (critère 1)",
      "description": "Ce que le cas verifie, en une phrase.",
      "prerequis": "Ce qui doit etre vrai avant de commencer.",
      "importance": "MEDIUM",
      "pas": [ { "action": "Ce que fait le testeur", "resultat_attendu": "Ce qu'il doit voir" } ]
    },
    { "reference": "TC-HVC-9-2", "nom": "Devenir hôte : ... (critère 2)", "pas": [ … ] }
  ],
  "iteration_id": 1
}
```

- La reference de l'exigence est **la cle de la story Jira** ; celle de chaque cas est
  `TC-` + cette cle + `-` + son numero (1, 2, 3… dans l'ordre des criteres). C'est cette
  reference que le rapporteur Playwright relit dans le titre de chaque test.
- `ajouter-story` cree l'exigence (si besoin) et tous les cas ; il refuse un cas qui existe
  deja : passer alors par `modifier-cas`, qui reecrit chaque cas du fichier (pas remplaces,
  statut « A approuver ») et **cree** ceux qui n'existent pas encore. Passage d'un cas unique
  a plusieurs : l'ancien `TC-HVC-9` est renomme `TC-HVC-9-1` (son historique est garde).
  Un cas present dans Squash mais absent du fichier est signale (a retirer a la main).
- `criticite` : `MINOR`, `MAJOR`, `CRITICAL`. `importance` : `LOW`, `MEDIUM`, `HIGH`, `VERY_HIGH`.
- Verifie en reel le 20/10/2026 (cycle complet HVC-7, cas unique) : `status` d'un cas,
  `ajouter-au-plan`, `resultats`, `bilan-iteration`. **Pas encore verifie en reel** : la
  creation de plusieurs cas, le renommage `TC-HVC-9` -> `TC-HVC-9-1` et `modifier-cas` —
  au premier echec, lire le message, corriger ici.

## Ne jamais deviner un identifiant

Les identifiants internes **ne suivent pas l'ordre des references** : sur l'instance qui a
servi a construire ce module, CT-06 portait l'id 55 et CT-02 l'id 64. Ils seront differents
chez toi. **Toujours** passer par `reperes`, ou par la recherche sur la reference que fait
`squash.mjs`. Un identifiant ecrit en dur est un bug qui attend son tour.

`reperes` donne aussi le **numero d'iteration**, qui est ce que Jenkins doit connaitre
(`SQUASH_ITERATION_ID`).

## Cinq pieges verifies sur une instance neuve (17/09/2026)

1. **A la creation d'une exigence, `current_version` doit figurer AVANT `name`** dans le
   JSON. L'ordre des champs compte : `name` est delegue a la version courante, qui doit
   donc exister deja. Sinon Squash repond `Invalid JSON`, sans autre explication — le vrai
   message n'apparait que dans ses journaux internes.

2. **Le parent d'une exigence est le PROJET**, pas la bibliotheque. Types acceptes :
   `project`, `requirement-folder`, `requirement`, `high-level-requirement`.

3. **La couverture ne se pose QU'A LA CREATION du cas de test**, par le champ
   `verified_requirements`. Un `PATCH` la refuse et renvoie vers
   `/test-cases/{id}/coverages` — **qui n'existe pas dans cette version**. Le message
   d'erreur du produit est trompeur.

4. **L'import de resultats apparie sur `automated_test_reference`**, pas sur la reference
   du cas. Tant que ce champ est vide, l'import repond :
   `Test with reference CT-08 and an empty dataset not found in iteration IT-01…`
   C'est le ressort de la leçon B6 : CT-06 est declare, CT-08 volontairement pas.

5. **Un `PATCH` a `null` est ignore**, et `""` ecrit une chaine vide, jamais un vrai NULL.

## Le contrat de l'import de resultats

`POST /api/rest/latest/import/results/{iteration_id}` — **gratuit en auto-heberge**, et
desactive sur le Cloud Premium de l'editeur (le garde-fou du produit s'appelle
`denyFeatureForCloudPremium`). Le corps n'a que **deux cles** : `automated_test_suite` et
`tests`. Les champs `infos` et `metadata` des vieux exemples sont acceptes puis **ignores**.

- `failure_details` est reserve aux editions payantes → le detail d'un echec ne peut
  arriver que par une **piece jointe** sur l'execution (`txt`, `html`, `xml`, `log`, 2 Mo).
- Statuts valides, pour un test comme pour un pas :
  `BLOCKED, CANCELLED, SUCCESS, RUNNING, SKIPPED, FAILURE, READY`. **`NOT_RUN` est refuse.**
- Il faut **autant d'entrees `test_steps` que le cas compte de pas**, sinon
  « Expected 2 but got 0 ».
- Reponses : **204** si tout est apparie, **207** sinon — et le corps ne liste que les
  tests en erreur.

C'est le rapporteur `reporters/squash-reporter.ts` qui fait cet appel, a la fin de chaque
execution Playwright. **Rien a lancer a la main.**

## Ne pas faire

- Ne pas passer par la base de donnees pour *modifier* : la voie enseignee est l'interface
  REST.
- Ne pas promettre un lien entre une anomalie et un cas de test dans Squash : la table
  `issue` exige un outil de suivi declare, et declarer Jira comme tel demande le connecteur
  payant. La tracabilite passe par l'anomalie elle-meme — etiquette `CT-06`, cas et build
  cites dans la description.
