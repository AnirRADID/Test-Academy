---
name: squash
description: Lire et modifier Squash TM (projet Homey-Demo) par son interface REST — creer le projet complet (exigences, cas de test, couverture, campagne, iteration), decouvrir les identifiants, declarer un cas automatise, envoyer des resultats. A utiliser des qu'il est question de Squash, d'un cas CT-xx, d'une iteration, d'un plan d'execution, ou de faire remonter des resultats Playwright (leçons B3 a B7 du fil rouge Homey).
---

# Squash TM — l'acces par l'interface REST

**Squash ne fournit aucun serveur MCP.** Le lien Claude ↔ Squash passe par son interface
REST, enveloppee dans `squash.mjs` (a cote de ce fichier). C'est du Node : elle marche
sous Windows comme ailleurs, et aucun jeton ne transite par la ligne de commande.

## Utiliser

```bash
node .claude/skills/squash/squash.mjs verifier          # le jeton repond-il ?
node .claude/skills/squash/squash.mjs creer-projet      # toute la Phase A, d'un coup
node .claude/skills/squash/squash.mjs reperes           # les identifiants de CETTE instance
node .claude/skills/squash/squash.mjs tag CT-06         # declarer CT-06 automatise
node .claude/skills/squash/squash.mjs detag CT-06
```

Le jeton est lu dans `SQUASH_TOKEN`, sinon dans `squash/.token`. L'adresse dans
`SQUASH_URL`, sinon `http://127.0.0.1:8090/squash`.

> **Ne JAMAIS afficher le jeton**, ni le lire a voix haute dans une reponse, ni le
> passer en argument d'une commande.

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
