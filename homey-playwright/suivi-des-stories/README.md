# Suivi des stories

Une fiche par story Jira traitée par l'équipe d'agents QA, nommée d'après le **titre** de la
story : `story-inscription-d-un-nouveau-compte.md`, `story-connexion-d-un-utilisateur.md`…

Chaque fiche dit, en haut, **où en est la story** et **ce qu'il reste à faire**. Chaque agent
y remplit sa propre section, dans l'ordre :

| Section | Remplie par |
|---|---|
| 1. Cas de test rédigé | agent-analyste |
| 2. Validation humaine | vous, via le formulaire n8n (recopié par agent-automaticien) |
| 3. Test automatisé | agent-automaticien |
| 4. Exécution de la campagne | agent-executant |
| 5. Anomalies | agent-gestionnaire-anomalies |
| 6. Comptes rendus publiés | agent-rapporteur |

**`journal-des-taches.md`** (créé au premier passage) est le journal commun : tout ce que
font n8n et les agents, toutes stories confondues, au fil de l'eau. C'est le fichier à
ouvrir pour savoir **ce qui se passe en ce moment**.

Le sous-dossier `donnees-squash/` contient les fichiers techniques envoyés à Squash (le cas
de test au format machine, les bilans HTML). Il n'est pas nécessaire de les ouvrir.
