*** Settings ***
Library         SeleniumLibrary
Resource        ../resources/Faire une demande de réservation.resource

Test Setup        Ouvrir le Navigateur Et Accéder A l'Application
Test Teardown     Fermer le Navigateur


*** Test Cases ***
Test De Demande De Réservation Invalide
    Vérifier Que L'Accueil est Visible
    Effectuer une réservation Invalide
