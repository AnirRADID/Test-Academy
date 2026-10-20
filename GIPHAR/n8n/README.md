# L'équipe d'agents QA dans n8n

Ce dossier contient tout ce qu'il faut pour piloter l'équipe d'agents QA depuis **n8n**, un
outil gratuit qui affiche le travail sous forme de boîtes reliées entre elles.

| Fichier | Rôle |
|---|---|
| `demarrer-n8n.cmd` | Démarre n8n avec les bons réglages (double-clic) |
| `flux/1-lancer-des-stories.json` | Le flux « lancement » : reçoit de Claude la liste des stories à tester |
| `flux/2-cycle-d-une-story.json` | Le flux « cycle » : fait travailler les 5 agents sur une story |
| `outils/lancer-agent.mjs` | Lance un agent pour n8n et raconte au journal chacune de ses actions |
| `outils/ecrire-au-journal.mjs` | Ajoute une ligne au journal (utilisé par les boîtes 📓 de n8n) |

Vérifié avec n8n 2.42 : import des deux flux, puis exécution complète à blanc (agents et
Jira remplacés par des doublures), y compris un refus suivi d'une correction, un blocage en
cours de route, et deux stories demandées en même temps (les agents passent un par un).

---

## Comment ça marche, en une image

```
VOUS (dans la conversation)  n8n (le chef d'équipe)                        Claude (les agents)
───────────────────────────  ──────────────────────                        ───────────────────
« Teste HVC-8 et HVC-9 »
  └─► Claude vérifie, puis ──► Lancement : une story à la fois
      envoie la liste          └─► Cycle de la story :
                                 🤖 ─────────────────────────────────────►  agent-analyste
                                 ⏸  attend votre validation  ◄── VOUS cliquez Approuver / Refuser
                                 🤖 ─────────────────────────────────────►  agent-automaticien
                                 🤖 ─────────────────────────────────────►  agent-executant
                                 🤖 ─────────────────────────────────────►  agent-gestionnaire-anomalies
                                 🤖 ─────────────────────────────────────►  agent-rapporteur
                                 ✅ étiquette « qa-termine »
```

Chaque boîte 🤖 lance Claude Code en mode « sans fenêtre » (`claude -p`) avec **un seul
agent**, décrit dans `.claude/agents/`. L'agent fait son travail, écrit dans la fiche de
suivi de la story (`suivi-des-stories/`), puis répond à n8n « c'est fait » ou « je suis
bloqué ». n8n passe alors à la boîte suivante, ou signale le blocage.

## Les étiquettes Jira : où en est chaque story

Vous n'en posez **aucune** : n8n les pose et les change tout seul. Elles servent seulement à
voir, dans Jira, où en est chaque story.

| Étiquette | Signification | Qui la pose |
|---|---|---|
| `qa-en-cours` | Un agent travaille dessus (ou attend son tour) | n8n |
| `qa-a-valider` | Le cas de test **attend votre validation** | n8n |
| `qa-termine` | Cycle fini, comptes rendus publiés | n8n |
| `qa-bloque` | Un agent n'a pas pu finir : lire le commentaire de la story | n8n |

**Où les voir dans Jira ?** Ouvrir la story. Dans le panneau de droite, rubrique
**Détails**, le champ **Étiquettes** (*Labels*).

**Voir toutes les stories en cours** : dans la recherche Jira, le filtre
`project = HVC AND labels in (qa-en-cours, qa-a-valider, qa-bloque)`. Enregistrez-le comme
filtre favori : c'est votre tableau de bord.

---

## Installation (une seule fois, ~15 minutes)

### 1. Installer n8n

Dans le terminal de VS Code (menu *Terminal > Nouveau terminal*) :

```
npm install -g n8n
```

L'installation prend plusieurs minutes. n8n est gratuit dans cette version installée sur
votre machine.

### 2. Faire confiance au projet (une seule fois)

Les agents n'ont le droit d'agir sans vous demander la permission que si Claude Code a
reçu votre accord pour ce projet. Dans le terminal, depuis le dossier `GIPHAR` :

```
claude
```

Répondre **oui** à la question « Do you trust the files in this folder? », puis taper
`/exit`. Sans cette étape, les agents lancés par n8n se voient refuser leurs actions et
finissent « bloqués ».

### 3. Importer les deux flux

Toujours dans le terminal, depuis le dossier `GIPHAR` :

```
n8n import:workflow --separate --input=n8n/flux
```

Les deux flux arrivent avec des identifiants fixes : le flux « lancement » sait déjà où trouver
le flux « cycle ».

### 4. Démarrer n8n

Double-cliquer sur `n8n/demarrer-n8n.cmd`. Une fenêtre noire s'ouvre : **laissez-la ouverte**
(la fermer arrête n8n). Ouvrir ensuite <http://localhost:5678> dans le navigateur.

À la première ouverture, n8n demande de créer un compte : il est **local** (il reste sur
votre machine), mettez l'adresse et le mot de passe de votre choix.

> Pourquoi ce fichier plutôt que la commande `n8n` toute seule ? Il active la boîte
> « Execute Command », éteinte par défaut dans n8n par sécurité. C'est elle qui lance les
> agents. Il fait aussi en sorte que n8n n'écoute que votre PC : personne d'autre sur le
> réseau ne peut lui demander de tester une story.

### 5. Donner à n8n l'accès à Jira

n8n lit et modifie les étiquettes Jira lui-même (sans Claude, donc sans coût).

1. Créer un jeton Jira : <https://id.atlassian.com/manage-profile/security/api-tokens>
   > *Create API token* > nommer « n8n » > copier le jeton.
2. Dans n8n : menu de gauche **Credentials** (*Identifiants*) > **Add credential** > chercher
   **Jira SW Cloud API**. Remplir : votre email Atlassian, le jeton, et le domaine
   `https://testacademy.atlassian.net`. Enregistrer.
3. Ouvrir chaque flux. Sur chaque boîte dont le nom commence par **« Jira : »**, vérifier
   que cet identifiant est bien sélectionné (sinon le choisir dans la liste).

### 6. Vérifier les réglages

Dans le flux **1. Lancer des stories**, ouvrir la boîte **Réglages** :

- `iterationSquash` : le numéro de l'itération du sprint. Pour le connaître, lancer
  `node .claude/skills/competence-piloter-squash/squash.mjs reperes` (ligne
  `SQUASH_ITERATION_ID = …`).
- `dossierProjet` : l'emplacement du projet sur votre disque.

Faire de même dans la boîte **Story de test** du flux **2. Cycle d'une story**.

### 7. Publier les deux flux

Ouvrir chaque flux et cliquer sur le bouton **Publish** (*Publier*), en haut à droite.
**Commencer par le flux 2**, puis le flux 1. Un flux non publié ne peut pas recevoir de
demande : n8n répondrait « Workflow is not active ». Après toute modification d'un flux,
cliquer de nouveau sur **Publish**, sinon n8n continue d'utiliser l'ancienne version.

Docker Desktop (pour Squash) doit aussi être démarré.

---

## Au quotidien

### Lancer le test d'une ou plusieurs stories

Le dire à Claude, dans la conversation de VS Code :

> « Teste HVC-8 et HVC-9 » · « Teste les stories du sprint 2 » · « Relance HVC-7 »

Claude vérifie que les stories existent et que n8n et Squash sont allumés, puis envoie la
liste à n8n (compétence `competence-lancer-des-stories`). Une liste déduite d'un sprint vous
est d'abord montrée pour confirmation. Ensuite, demandez simplement « où en est HVC-8 ? » :
Claude lit le journal et la fiche de suivi, et vous donne le lien de validation quand c'est
votre tour.

Les stories avancent **en parallèle**, mais les agents travaillent **un par un** : un agent
qui arrive pendant qu'un autre travaille attend son tour (le journal l'indique).

### Le journal des tâches : tout ce qui se passe, en direct

Ouvrir `suivi-des-stories/journal-des-taches.md` dans VS Code : **toutes** les stories,
**tous** les agents et n8n, dans l'ordre où les choses se passent (les plus récentes en
bas, heure de Paris). Le fichier se met à jour pendant que vous le regardez.

```
## Mardi 20/10/2026

- 12:32 · Connexion utilisateur (HVC-7) · n8n · cas TC-HVC-7 APPROUVÉ par le valideur. Remarques : aucune
- 12:32 · Connexion utilisateur (HVC-7) · agent-automaticien · démarre
- 12:33 · Connexion utilisateur (HVC-7) · agent-automaticien · lit le cas de test TC-HVC-7 dans Squash
- 12:34 · Connexion utilisateur (HVC-7) · agent-automaticien · lance le test tests/tc-hvc-7-connexion-utilisateur.spec.ts sur le vrai site (essai 1)
- 12:36 · Connexion utilisateur (HVC-7) · agent-automaticien · ✅ terminé en 4 min, 1.20 $ : …
```

- Les lignes **n8n** sont écrites par les boîtes 📓 des flux : demande reçue de Claude,
  attente de validation, votre décision, changement de statut Squash, fin ou blocage.
- Les lignes **agent-…** sont écrites pendant le travail de l'agent : chaque lecture,
  écriture, test lancé, ticket Jira créé ou commenté. Une ligne **⚠** signale une action
  qui a échoué ou qui a été refusée : c'est la première chose à regarder en cas de blocage.
- La dernière ligne d'un agent donne sa durée et son **coût**.

### Superviser dans n8n

Dans n8n, menu de gauche **Executions** (*Exécutions*). Chaque ligne du flux « 2. Cycle
d'une story » est **une story** :

| Statut affiché | Signification |
|---|---|
| *Running* (en cours) | Un agent travaille. |
| *Waiting* (en attente) | **Le cas de test attend votre validation.** |
| *Success* (réussi) | Cycle terminé. |
| *Error* (erreur) | Une étape est bloquée. La story Jira porte un commentaire qui explique pourquoi. |

En cliquant sur une ligne, on voit le flux : les boîtes **vertes** sont faites, la boîte
**rouge** a échoué. Un clic sur une boîte 🤖 puis sur la boîte « Réponse … » qui la suit
montre ce que l'agent a répondu : son résumé et la prochaine action.

### Valider un cas de test

Quand une story passe à `qa-a-valider`, Claude vous donne dans la conversation **le lien
du formulaire de validation** (si vous le lui demandez, ou s'il suit l'avancement). Le même
lien est dans le commentaire Jira de la story et dans sa fiche de suivi.

1. Ouvrir Squash et relire le cas de test indiqué (statut « À approuver »).
2. Ouvrir le lien du formulaire, choisir **Approuver**, ou **Refuser** en écrivant ce qu'il
   faut corriger.
   - **Approuver** : le cas passe « Approuvé » dans Squash et les agents suivants démarrent.
   - **Refuser** : l'agent analyste corrige le cas selon vos remarques, puis vous redemande
     une validation. Le lien du formulaire reste le même.

### Une story est bloquée (`qa-bloque`)

Lire le commentaire laissé dans la story Jira : il dit quelle étape a bloqué, pourquoi, et
quoi faire (ou demander à Claude « pourquoi HVC-8 est bloquée ? »). Une fois le problème
réglé, dire à Claude **« relance HVC-8 »** : n8n retire lui-même les anciennes étiquettes et
le cycle repart du début. Les agents reprennent ce qui existe déjà, sans doublon.

### Tester le cycle sur une story précise

Dans le flux 2, modifier la clé dans **Story de test**, puis cliquer **Tester avec une
story précise**. Pratique en formation, sans passer par Claude.

---

## En cas de problème

| Symptôme | Cause probable | Solution |
|---|---|---|
| La boîte « Execute Command » est introuvable ou en erreur « unrecognized node » | n8n démarré sans `demarrer-n8n.cmd` | Fermer n8n, relancer par le `.cmd` |
| Toutes les boîtes 🤖 bloquent avec « 'claude' n'est pas reconnu » | Claude Code introuvable depuis n8n | Vérifier que `claude --version` marche dans un terminal, puis relancer le `.cmd` |
| Les boîtes « Jira : » sont rouges (401) | Jeton Jira absent ou expiré | Refaire l'étape 5 |
| L'agent exécutant bloque sur Squash | Docker Desktop éteint | Démarrer Docker Desktop, attendre 2 min, puis « relance HVC-x » |
| Claude dit que n8n refuse la demande (« not registered ») | Flux 1 non publié, ou n8n vient de démarrer | Attendre 30 s ; sinon étape 7 |
| Le lien du formulaire ne s'ouvre pas | n8n arrêté | Relancer `demarrer-n8n.cmd` : l'exécution en attente est conservée |

## Coût

Claude n'est sollicité que lorsque vous demandez de tester une story, soit cinq agents par story (six si un cas est refusé une
fois). Pour repère : un agent qui ne fait que répondre coûte environ 0,10 $. Un agent qui
travaille vraiment (écrire et vérifier un test, trier des échecs) coûte nettement plus. Le
coût exact de chaque agent figure dans la sortie de sa boîte 🤖, champ `total_cost_usd`.
