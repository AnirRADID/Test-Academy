---
name: competence-rediger-comptes-rendus
description: Les modèles de tous les textes écrits par les agents QA — la fiche de suivi d'une story (suivi-des-stories/story-*.md), le commentaire « cas prêt à valider » et le compte rendu final dans la story Jira, le bilan global dans l'itération Squash, et la réponse finale renvoyée à n8n. A charger avant d'écrire l'un de ces textes.
---

# Compétence : rédiger les comptes rendus

Tous ces textes sont lus par des personnes **non techniques**. Règles communes :

- Langage d'utilisateur : « le visiteur clique sur S'inscrire », jamais un sélecteur, un appel
  HTTP, un code d'erreur brut ou un nom de fichier dans le récit.
- Les références techniques (fichier de test, identifiant d'exécution) vont **uniquement**
  dans une section finale « Traçabilité », pour qui en aurait besoin.
- Dates au format `06/10/2026 14:32`.
- Les liens sont des liens cliquables, jamais une adresse à recopier.

## 1. La fiche de suivi d'une story

**Emplacement** : `suivi-des-stories/story-<titre-de-la-story>.md`. Le nom vient du titre de
la story Jira, en minuscules, sans accents, mots séparés par des tirets
(« Inscription d'un nouveau compte » → `story-inscription-d-un-nouveau-compte.md`). **Jamais
de clé Jira dans le nom.**

C'est le carnet de bord partagé par les agents : chacun lit la fiche en arrivant, remplit
**sa** section, met à jour « Où en est-on » et « Prochaine action », et ne touche pas aux
sections des autres. Si la fiche existe déjà (nouveau passage), on complète, on n'efface pas.

```markdown
# Story : Inscription d'un nouveau compte

| | |
|---|---|
| **Où en est-on** | Étape 2 sur 6 — cas de test en attente de votre validation |
| **Prochaine action** | Relire le cas de test dans Squash, puis cliquer sur [Valider ou refuser le cas](lien du formulaire) |
| **Story Jira** | [Inscription d'un nouveau compte](https://testacademy.atlassian.net/browse/HVC-6) |
| **Dernière mise à jour** | 06/10/2026 10:15 par l'agent analyste |

## 1. Cas de test rédigés — agent analyste
## 2. Validation humaine
## 3. Test automatisé — agent automaticien
## 4. Exécution de la campagne — agent exécutant
## 5. Anomalies — agent gestionnaire d'anomalies
## 6. Comptes rendus publiés — agent rapporteur
```

Une story a **un cas de test par critère d'acceptation** (`TC-HVC-9-1`, `TC-HVC-9-2`…) : la
section 1 décrit chaque cas sous son propre sous-titre (`### TC-HVC-9-1 — <nom>`), et les
sections 3 à 6 donnent un résultat **par cas** avant le verdict de la story (réussie
seulement si tous ses cas ont réussi).

Les étapes, pour « Où en est-on » :
1. Rédaction du cas de test · 2. Validation humaine · 3. Écriture du test automatisé ·
4. Exécution de la campagne · 5. Analyse des anomalies · 6. Comptes rendus — **Terminé**.

Une section non encore traitée contient seulement `_En attente._`

## 2. Commentaire Jira « cas prêt à valider » (agent analyste)

```markdown
**🧪 Cas de test prêts à valider**

J'ai rédigé 3 cas de test dans Squash pour « Devenir hôte », un par critère d'acceptation :
- TC-HVC-9-1 — <nom> (4 étapes) : vérifie que <une phrase>
- TC-HVC-9-2 — <nom> (3 étapes) : vérifie que <une phrase>
- TC-HVC-9-3 — <nom> (2 étapes) : vérifie que <une phrase>

👉 **À faire** : relire ces cas (dans la Tour de contrôle ou dans Squash), puis
[valider ou refuser](<lien du formulaire>). En cas de refus, préciser quel cas corriger. Les
tests automatisés ne seront écrits qu'après votre validation.
```

## 3. Compte rendu final dans la story Jira (agent rapporteur)

Ne parle **que de cette story**.

```markdown
**✅ Recette automatisée terminée — 06/10/2026 14:32**   (ou ❌ … : 1 anomalie)

**Ce qui a été vérifié**, cas par cas :
- ✅ TC-HVC-9-1 — <ce que vérifie le cas> : réussi
- ❌ TC-HVC-9-2 — <ce que vérifie le cas> : échoué à l'étape « <nom de l'étape> »
**Verdict de la story** : réussie (tous les cas ont réussi) / échouée (1 cas sur 3 en échec)

**Anomalies** (si échec) :
- [HVC-14 — Le message d'erreur n'apparaît pas…](lien) — nouvelle anomalie créée
- [HVC-12 — …](lien) — anomalie déjà connue, reproduite à nouveau

**Traçabilité** : cas Squash TC-HVC-9-1 à TC-HVC-9-3 · tests `tests/tc-hvc-9-devenir-hote.spec.ts`
· itération Squash <nom>
```

## 4. Bilan global dans l'itération Squash (agent rapporteur)

Couvre **toute la campagne**, pas seulement la story du jour. Écrit en HTML simple (Squash
affiche la description de l'itération en HTML), dans un fichier temporaire, puis envoyé par
`squash.mjs bilan-iteration <iteration_id> <fichier.html>` : le bilan s'ajoute **en tête** et
les précédents restent dessous, comme un journal.

```html
<h3>Bilan d'exécution du 06/10/2026 14:32</h3>
<p><b>10 cas joués : 9 réussis, 1 échoué.</b> Exécution déclenchée par la story
« Inscription d'un nouveau compte ».</p>
<ul>
  <li>❌ TC-HVC-6 Inscription d'un nouveau compte — anomalie
      <a href="https://testacademy.atlassian.net/browse/HVC-14">HVC-14</a> (nouvelle)</li>
  <li>✅ TC-HVC-1 à TC-HVC-5, TC-HVC-7 à TC-HVC-10 — réussis</li>
</ul>
<p>Évolution depuis le bilan précédent : <i>TC-HVC-6 est passé de réussi à échoué.</i></p>
```

## 5. La réponse finale renvoyée à n8n (tous les agents)

n8n lit la **dernière réponse** de chaque agent pour savoir s'il peut passer à la boîte
suivante. Cette réponse est **uniquement** un objet JSON, sans texte autour :

```json
{
  "statut": "ok",
  "resume": "Cas de test « Inscription d'un nouveau compte » créé dans Squash, 6 étapes.",
  "prochaine_action": "Valider ou refuser le cas de test via le formulaire.",
  "fiche_de_suivi": "suivi-des-stories/story-inscription-d-un-nouveau-compte.md"
}
```

- `statut` : `"ok"` si le travail est fait, `"bloque"` si l'agent n'a pas pu le finir. Dans
  ce cas, `resume` explique **pourquoi** en une phrase compréhensible et `prochaine_action`
  dit ce qu'un humain doit faire. Un agent bloqué l'écrit aussi dans la fiche de suivi.
- Chaque agent peut ajouter des champs propres à son métier (listés dans sa fiche d'agent).
