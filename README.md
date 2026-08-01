# Test-Academy — Projet Homey

Projet Robot Framework / SeleniumLibrary pour tester **Homey**, un site de réservation fictif
(type Airbnb), utilisé comme référence pour le module B01 – Automatisation Web.

Cible : `livraison3.testacademy.fr`.

## Prérequis

- Python 3.x
- `pip install robotframework robotframework-seleniumlibrary`
- Google Chrome (les tests utilisent `browser=Chrome`)

## Lancer les tests

Depuis la racine du dépôt :

```bash
robot "Robot -Projet Homey"
```

Pour une story en particulier :

```bash
robot "Robot -Projet Homey/Story - Se connecter"
```

Pour vérifier que tout se résout sans piloter de navigateur (mots-clés, imports) :

```bash
robot --dryrun "Robot -Projet Homey"
```

## Structure

```
Robot -Projet Homey/
  resources/           # fichiers .resource partagés (mots-clés, variables, locators)
  Story - <nom>/        # une story = un dossier, un ou plusieurs .robot (cas valides / invalides)

Stories individuelles/
  # variantes de certaines stories, structurées différemment (une story par dossier,
  # ressources locales). Statut à date : en cours de nettoyage, pas garanti à jour avec
  # Robot -Projet Homey.

results/                # sorties générées par l'exécution (log.html, report.html, output.xml,
                         # captures d'écran) - non suivies par git, régénérées à chaque run.
```

## Stories couvertes

Se connecter · Devenir Hôte · Réaliser une recherche simple · Faire une demande de réservation ·
Traiter une demande de réservation.
