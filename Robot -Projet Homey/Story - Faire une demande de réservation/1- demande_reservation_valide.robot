*** Settings ***
Library             SeleniumLibrary
Resource    ../resources/commun.resource
Resource    ../resources/Faire une demande de réservation.resource

Test Setup          Effectuer Une Connexion Avec Un Compte Valide
Test Teardown       Effectuer Une Annulation De Réservation


*** Test Cases ***
Test De Demande De Réservation Réussie
    Vérifier Que Le Tableau De Bord Est Visible
    Retourner A L'Accueil
    Effectuer une réservation



