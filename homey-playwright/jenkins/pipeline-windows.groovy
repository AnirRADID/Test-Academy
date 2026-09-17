// Pipeline Jenkins — fil rouge Homey, Partie B, sous WINDOWS.
//
// A COLLER DANS L'INTERFACE DE JENKINS (champ « Pipeline script »), pas dans le depot :
// c'est le geste enseigne dans le module Jenkins du cursus.
//
// TROIS CHOSES A ADAPTER CHEZ TOI, et elles sont signalees par « A ADAPTER ».
//
// POURQUOI `bat` ET NON `sh` : Jenkins tourne ici sous Windows. C'est la convention du
// module Jenkins du cursus, qui est entierement sous Windows.
//
// POURQUOI `dir('homey-playwright')` : le depot Test-Academy contient plusieurs projets ;
// le notre est dans ce sous-dossier.
pipeline {
  agent any

  environment {
    // A ADAPTER — seulement si Jenkins ne trouve pas Node. Pour le savoir, lance un build :
    // si la console dit « npm n'est pas reconnu », decommente la ligne et mets ton chemin.
    // PATH = "C:\\Program Files\\nodejs;${PATH}"

    HOMEY_URL = 'http://livraison3.testacademy.fr'

    // --- ce qui fait remonter les resultats dans Squash (lecon B6) ----------------
    // A ADAPTER — l'adresse de TON Squash, et le numero de TON iteration.
    // Le numero d'iteration se lit dans l'adresse quand tu ouvres l'iteration dans
    // Squash : .../iteration/2/test-plan  ->  c'est 2.
    SQUASH_URL = 'http://127.0.0.1:8090/squash'
    SQUASH_ITERATION_ID = '2'
    // Le jeton ne s'ecrit JAMAIS ici : il vient du coffre de Jenkins, et Jenkins le
    // masque dans la console du build.
    SQUASH_TOKEN = credentials('squash-pat')
  }

  stages {
    stage('Recuperer le code') {
      steps {
        // A ADAPTER — si tu travailles sur ta propre copie du depot.
        git branch: 'main', url: 'https://github.com/AnirRADID/Test-Academy.git'
      }
    }
    stage('Installer les dependances') {
      steps {
        dir('homey-playwright') {
          bat 'npm ci'
          bat 'npx playwright install chromium'
        }
      }
    }
    stage('Executer les tests Playwright') {
      steps {
        dir('homey-playwright') {
          // SURTOUT PAS `npx playwright test --reporter=html` ICI.
          // Ce drapeau REMPLACE la liste de rapporteurs de playwright.config.ts au lieu
          // de s'y ajouter : le rapporteur Squash ne s'executerait jamais, l'import
          // n'aurait pas lieu, ET AUCUN MESSAGE NE LE DIRAIT. C'est le piege de B6.
          // Le rapport HTML n'est pas perdu : il est deja dans playwright.config.ts.
          bat 'npx playwright test'
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'homey-playwright/playwright-report/**', allowEmptyArchive: true
    }
  }
}
