# Homey — Partie B : la chaine complete

Tests automatises et outillage du fil rouge Homey, Partie B du module « Tester avec l'IA ».

D'une exigence Jira jusqu'a l'anomalie Jira, en passant par Squash TM, Playwright et
Jenkins — sans que personne ne ressaisisse quoi que ce soit entre deux outils.

## Ce qu'il y a dans ce dossier

| Dossier | Contenu |
| :-- | :-- |
| `tests/` | Les deux tests Playwright : **CT-06** (recherche sans destination) et **CT-08** (periode inversee). |
| `reporters/` | Le rapporteur qui renvoie les resultats dans Squash a la fin de chaque execution. |
| `squash/` | De quoi installer Squash sur sa machine, et le contenu du projet Homey (10 exigences, 10 cas, 26 pas). |
| `jenkins/` | Le pipeline a coller dans Jenkins, version Windows. |
| `.claude/` | Ce que Claude Code doit savoir pour t'aider : le contexte et la competence Squash. |

## Par ou commencer

Lis le guide **« Homey — Partie B : monter la chaine chez toi »**, qui accompagne ce dossier.
Il se suit du debut a la fin, et chaque etape se demande a Claude Code.

En deux lignes, pour les presses :

```bash
npm ci
npx playwright install chromium
npx playwright test          # les deux tests echouent : c'est normal, Homey a ces deux defauts
```

## Les deux defauts sont reels

Homey lance vraiment sa recherche sans destination, et accepte vraiment une periode
inversee en affichant tout son catalogue. Les tests ne sont pas truques : ils constatent.
