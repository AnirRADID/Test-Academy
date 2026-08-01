*** Settings ***
Library    SeleniumLibrary
Resource    ../resources/Traiter_gerer_reservation.resource


Test Teardown     Nettoyer

*** Test Cases ***
Nouvelle Demande Annulée Par Le Voyageur
    Ouvrir Le Navigateur Et Accéder A La Page d'Accueil
    Se Connecter En Tant Que Voyageur
    Le voyegeur Crée Une Réservation Sur Un Logement
    Annuler Une Réservation En Tant Que Voyageur    À L'ÉTUDE
    Vérifier statut réservation sur la page de la réservation    ANNULÉ
    Retourner Sur La Page Des Voyages
    Verifier Le Statut De La Réservation    ANNULÉ
    Effectuer Une Déconnexion Réussie
    Se Connecter En Tant Que HOTE
    Accéder Aux Réservations
    Verifier Le Statut De La Réservation    ANNULÉ
    Effectuer Une Déconnexion Réussie


Nouvelle Demande Refusée Par L'Hote
    Ouvrir Le Navigateur Et Accéder A La Page d'Accueil
    Se Connecter En Tant Que Voyageur
    Le voyegeur Crée Une Réservation Sur Un Logement
    Effectuer Une Déconnexion Réussie
    Se Connecter En Tant Que HOTE   
    L'Hote Refuse Une Nouvelle Réservation
    Accéder Aux Réservations
    Vérifier statut réservation sur la page de la réservation    REFUSÉ
    Effectuer Une Déconnexion Réussie
    Se Connecter En Tant Que Voyageur
    Accéder Au Voyages
    Vérifier statut réservation sur la page de la réservation    REFUSÉ
    Effectuer Une Déconnexion Réussie

Demande Confirmée Par L'Hote Puis Annulée Par Le Voyageur
    Ouvrir Le Navigateur Et Accéder A La Page d'Accueil
    Se Connecter En Tant Que Voyageur
    Le voyegeur Crée Une Réservation Sur Un Logement
    Effectuer Une Déconnexion Réussie
    Se Connecter En Tant Que HOTE  
    L'Hote Confirme Une Réservation
    Verifier Le Statut De La Réservation    PAIEMENT EN ATTENTE
    Effectuer Une Déconnexion Réussie
    Se Connecter En Tant Que Voyageur
    Accéder Au Voyages
    Verifier Le Statut De La Réservation    DISPONIBLE
    Effectuer Une Déconnexion Réussie
    Se Connecter En Tant Que Voyageur
    Annuler Une Réservation En Tant Que Voyageur    DISPONIBLE
    Effectuer Une Déconnexion Réussie

Demande Confirmée Par L'Hote Puis Refusée Par L'Hote
    Ouvrir Le Navigateur Et Accéder A La Page d'Accueil
    Se Connecter En Tant Que Voyageur
    Le voyegeur Crée Une Réservation Sur Un Logement
    Effectuer Une Déconnexion Réussie
    Se Connecter En Tant Que HOTE  
    L'Hote Confirme Une Réservation
    L'Hote Refuse Une Réservation En Attente de Paiement
    Vérifier statut réservation sur la page de la réservation    REFUSÉ
    Accéder Aux Réservations
    Verifier Le Statut De La Réservation    REFUSÉ
    Effectuer Une Déconnexion Réussie
    Se Connecter En Tant Que Voyageur
    Accéder Au Voyages
    Verifier Le Statut De La Réservation    REFUSÉ
    Effectuer Une Déconnexion Réussie
    
Demande Confirmée Par L'Hote Puis Payée Par Le Voyageur Puis Annulée Par Le Voyageur
    Ouvrir Le Navigateur Et Accéder A La Page d'Accueil
    Se Connecter En Tant Que Voyageur
    Le voyegeur Crée Une Réservation Sur Un Logement
    Effectuer Une Déconnexion Réussie
    Se Connecter En Tant Que HOTE
    L'Hote Confirme Une Réservation
    Effectuer Une Déconnexion Réussie
    Se Connecter En Tant Que Voyageur
    Marquer Comme Payé Une Réservation
    Vérifier statut réservation sur la page de la réservation    RÉSERVÉ
    Retourner Sur La Page Des Voyages
    Verifier Le Statut De La Réservation    RÉSERVÉ
    Effectuer Une Déconnexion Réussie
    Se Connecter En Tant Que HOTE
    Accéder Aux Réservations
    Verifier Le Statut De La Réservation   RÉSERVÉ
    Effectuer Une Déconnexion Réussie  
    Se Connecter En Tant Que Voyageur
    Annuler Une Réservation En Tant Que Voyageur    RÉSERVÉ

Demande Confirmée Par L'Hote Puis Payée Par Le Voyageur
    Ouvrir Le Navigateur Et Accéder A La Page d'Accueil
    Se Connecter En Tant Que Voyageur
    Le voyegeur Crée Une Réservation Sur Un Logement
    Effectuer Une Déconnexion Réussie
    Se Connecter En Tant Que HOTE
    L'Hote Confirme Une Réservation
    Effectuer Une Déconnexion Réussie
    Se Connecter En Tant Que Voyageur
    Marquer Comme Payé Une Réservation
     Vérifier statut réservation sur la page de la réservation    RÉSERVÉ
    Retourner Sur La Page Des Voyages
    Verifier Le Statut De La Réservation    RÉSERVÉ



*** Keywords ***



Nettoyer
    Run Keyword If Test Failed    Nettoyer La Page Réservations
    Close All Browsers

Nettoyer La Page Réservations
    Ouvrir Le Navigateur Et Accéder A La Page d'Accueil
    Se Connecter En Tant Que Voyageur
    En Tant Que Voyageur Annuler Une Réservation

