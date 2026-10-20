# Conventions et pièges — projet HVC

Tout ce qui a été découvert en construisant le cycle Jira -> Squash -> Playwright sur ce
projet. A lire avant d'écrire un sélecteur, un test ou un ticket. Organisé par outil.

## Squash TM

- **Jeton/secret JWT (`squash/.env`, `SQUASH_JWT`)** : doit être du base64 **standard**
  valide (alphabet `A-Za-z0-9+/=`, jamais `-`/`_`), d'au moins 86 caractères, et **sans
  caractère de contrôle au milieu** (un `\r` égaré dans un fichier copié-collé suffit à
  faire échouer `RestApiJwtSecretKeyManager` avec `Illegal base64 character` côté serveur
  — et à empêcher Squash de fabriquer *ou* de vérifier un jeton, en silence). Vérifier avec
  `xxd` après écriture si le fichier a été construit par un outil externe.
- **Fallback projet** (`squash.mjs` / scripts de `competence-regles-qualite-homey`) : les scripts cherchent un projet nommé
  exactement, puis retombent sur le premier projet de l'instance. Ne marche que s'il n'y a
  qu'un seul projet — explicite sinon.
- **Couverture d'un cas de test** : ne se pose **qu'à la création** du cas
  (`verified_requirements` dans le `POST /test-cases`). Un `PATCH` ultérieur est refusé et
  redirige vers `/test-cases/{id}/coverages`, qui n'existe pas dans cette version.
- **Import de résultats** (`POST /import/results/{iteration_id}`) : l'appariement se fait
  sur `automated_test_reference` du cas, **pas** sur sa référence. Le poser à la création
  du test Playwright (ou via un `PATCH` dédié), sinon l'import répond
  « Test with reference X and an empty dataset not found ».
- **Pièces jointes d'exécution** : extensions acceptées **sur cette instance** limitées à
  `.txt` et `.pdf` (png/jpg/html/xml/log/csv tous refusés avec `file type not supported`,
  même le champ `files` générique). Pour une capture d'écran, générer un PDF qui l'embarque
  (Playwright sait le faire : `page.setContent(html_avec_image_base64)` puis `page.pdf()`).
- **Champ `comment` d'une exécution ou d'un pas** : c'est du HTML riche. Un texte brut
  contenant une URL peut être auto-linkifié par Squash, mais ce n'est pas garanti sur tous
  les textes — envoyer explicitement `<a href="...">texte</a>` pour un lien cliquable fiable.
- **Un nouvel `execution id` à chaque ré-exécution** d'un même cas dans la même itération
  (l'ancien devient historique, l'UI affiche le dernier). Toute référence externe (lien
  Jira, script de triage) doit viser le dernier id, pas celui de la première exécution.
- **URL de l'UI pour une exécution** : `{base}/execution/{id}/content?anchor=information`
  (onglet infos) et `{base}/execution/{id}/scenario?anchor=scenario` (pas détaillés).
  Attention : `curl` sur n'importe quel chemin sous `/squash/...` répond HTTP 200 en servant
  la coquille Angular — ça ne prouve jamais qu'une URL de ce genre est correcte. Ne confirmer
  une URL d'exécution qu'en la voyant dans la barre d'adresse d'une session connectée.
- **Lien natif "issue" sur une exécution** (`POST /executions/{id}/issues`) : répond
  `412 No Bug-Tracker is bound to this Project` sans connecteur payant. Ne jamais le
  promettre ; passer par pièces jointes + commentaire HTML (voir ci-dessus).

## Playwright / rapporteur Squash

- **Jamais `npx playwright test --reporter=...` en ligne de commande** : ce drapeau
  **remplace** la liste de `playwright.config.ts` au lieu de s'y ajouter. Le rapporteur
  Squash ne s'exécute plus, l'import n'a pas lieu, et rien ne le signale.
- `screenshot: 'only-on-failure'` dans `playwright.config.ts` pour toujours avoir une
  capture exploitable en cas d'échec (nécessaire pour le triage).
- Le rapporteur apparie un test sur sa référence Squash lue dans le **titre** du test
  (`TC-XXX: ...`), pas sur un tag — garder cette convention de nommage dans tous les
  fichiers `tests/*.spec.ts`.

## Jira

- **Gabarit de description de bug** : un parcours humain dans l'application (ce qu'un
  testeur ferait au clavier/souris, en langage utilisateur), résultat attendu vs observé,
  puis une section séparée « Traçabilité automatisée » en bas avec le fichier de test et
  les références Squash. Jamais d'URL technique ni d'appel HTTP dans le récit du bug.
- `createJiraIssueLink` prend `linkType`/`inwardIssue`/`outwardIssue` en **chaînes**, pas
  en objets `{key: ...}` — erreur `Expected string, received object` sinon.
- `createJiraIssueRemoteIssueLink` n'a pas d'opération de suppression/mise à jour
  disponible dans l'outillage actuel : un lien web erroné reste présent, il faut en ajouter
  un bon à côté plutôt que corriger l'existant.
- La déduplication des bugs se fait par étiquette (`labels: ["TC-XXX"]`) + JQL
  `statusCategory != Done` — toujours étiqueter un bug créé par le triage avec la
  référence du cas de test, c'est la seule clé de recherche fiable.

## Explorer une application inconnue (site cible quelconque)

Pas une règle figée mais la méthode qui a marché ce soir sur Homey, à reproduire :

- Un site moderne charge souvent son contenu dynamique en JavaScript : `curl` seul peut
  renvoyer une coquille vide. Toujours vérifier avec un vrai navigateur (Playwright) avant
  de conclure qu'un élément n'existe pas.
- Les contrôles personnalisés (case à cocher, bouton radio stylés) masquent souvent
  l'`<input>` natif (`opacity:0`, taille nulle) derrière un `<label>` ou un `<span>`
  visuel : cliquer l'élément visuel/le label, pas l'input brut si le clic normal échoue
  avec « element is not visible ».
- Un élément à boîte de taille nulle même après un hover ou un clic forcé (icône purement
  décorative gérée par un gestionnaire d'événement générique) se débloque avec
  `locator.dispatchEvent('click')`, qui contourne entièrement la vérification de visibilité
  de Playwright sans changer le comportement réel de l'application.
- Un panneau "avancé" ou un menu peut vivre dans un overlay plein écran déclenché par un
  geste tactile (`touchstart`) plutôt qu'un clic — dans ce cas, utiliser un contexte avec
  `hasTouch: true` et `.tap()` plutôt que `.click()`.
- Deux formulaires similaires (connexion / inscription) partagent souvent des noms de
  champs identiques (`input[name="username"]`) — toujours scoper le sélecteur à la modale
  ou au conteneur concerné pour éviter une violation de mode strict Playwright.
- Les messages d'erreur affichés peuvent être dans une langue différente de l'interface
  (ex. UI en français, messages systèmes en anglais) — vérifier le texte réel affiché avant
  d'écrire une assertion, ne jamais le deviner.
