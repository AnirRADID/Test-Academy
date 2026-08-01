*** Settings ***
Library     SeleniumLibrary
Resource    commun.resource


*** Variables ***
${CHAMP RECHERCHE ARRIVE}                       name=arrive
${CHAMP RECHERCHE DEPART}                       name=depart
${ARRIVE VALIDE}                                //*[@id="section-body"]/section/div[2]/div[1]/form/div[2]/div[3]/div[3]/ul[2]/li[8]
${DEPART VALIDE}                                //*[@id="section-body"]/section/div[2]/div[1]/form/div[2]/div[3]/div[3]/ul[2]/li[14]
${CHAMP RECHERCHE VOYAGEURS}                    //*[@id="section-body"]/section/div[2]/div[1]/form/div[3]/input
${CHAMP RECHERCHE AJOUT ADULTE}                 //*[@id="section-body"]/section/div[2]/div[1]/form/div[3]/div/div[1]/button[1]
${CHAMP RECHERCHE AJOUT ENFANT}                 //*[@id="section-body"]/section/div[2]/div[1]/form/div[3]/div/div[2]/button[1]
${CHAMP RECHERCHE ANIMAL DE COMPAGNIE}          css=.banner-caption .control:nth-child(1) > .radio-tab-inner
${BOUTON RECHERCHE VOYAGEURS}                   xpath=(//button[@type='button'])[9]
${BOUTON RECHERCHER}                            xpath=//button[@type='submit']
${LISTE CHAMBRES A RESERVER}                    //*[@id="section-body"]/section/div[2]
${CHAMBRE RESERVATION}                          //*[@id="homey_halfmap_listings_container"]/div/div/div[1]/div/a
${CHARGEMENT CLIQUE BOUTON}                     //*[@id="homey_remove_on_mobile"]/div/div[2]/div/div[3]/div
${BOUTON RESERVATION}                           //*[@id="request_for_reservation"]
${CHAMP DE TEXTE DE VALIDATION}                 //*[@id="homey_remove_on_mobile"]/div/div[2]/div/div[1]
${TEXTE DE VALIDATION}                          Demande de réservation envoyée. Veuillez attendre la confirmation!
${TEXTE D'ERREUR}                               Vous devez vous connecter pour effectuer une réservation
${LIEN TABLEAU DE BORD}                         //*[@id="homey_nav_sticky"]/div/div/div[3]/div/div/ul/li[1]/a
${DETAIL PREMIERE RESERVATION}                  //*[@id="body-area"]/div[3]/div/div/div/div/div/div[2]/div[2]/table/tbody/tr[1]/td[11]/div/a
${POSITION MESSAGE CONFIRMATION RESERVATION}    //*[@id="body-area"]/div[3]/div/div/div/div/div/div[1]
${MESSAGE CONFIRMATION RESERVATION}             Votre demande a été soumise à l'hôte pour confirmer la disponibilité.
${BOUTON ANNULATION RESERVATION}                xpath=(//button[@id='cancel-reservation-btn'])[2]
${INPUT MESSAGE ANNULATION}                     //*[@id="reason"]
${MESSAGE ANNULATION}                           reset du test de réservation
${BOUTON SOUMETTRE ANNULATION}                  //*[@id="cancelled"]


*** Keywords ***


Rechercher Une Chambre A Réserver
    Click Element    ${CHAMP RECHERCHE ARRIVE}
    Click Element    ${CHAMP RECHERCHE ARRIVE}
    CLick Element    ${ARRIVE VALIDE}
    Click Element    ${CHAMP RECHERCHE DEPART}
    CLick Element    ${DEPART VALIDE}
    Input Text    ${CHAMP RECHERCHE VOYAGEURS}    1
    Click Button    ${BOUTON RECHERCHER}

Choisir La Chambre A Réserver
    Element Should Be Visible    ${LISTE CHAMBRES A RESERVER}
    Wait Until Element Is Visible    ${CHAMBRE RESERVATION}    timeout=10
    Click Element    ${CHAMBRE RESERVATION}
    Wait Until Element Is Not Visible    ${CHAMBRE RESERVATION}

Réserver La Chambre En Etant Connecté
    Wait Until Element Is Visible    ${BOUTON RESERVATION}
    Wait Until Element Is Not Visible    ${CHARGEMENT CLIQUE BOUTON}
    Click Element    ${BOUTON RESERVATION}
    Wait Until Element Contains    ${CHAMP DE TEXTE DE VALIDATION}    ${TEXTE DE VALIDATION}
    Element Text Should Be    ${CHAMP DE TEXTE DE VALIDATION}    ${TEXTE DE VALIDATION}

Réserver La Chambre Sans Etre Connecté
    Wait Until Element Is Visible    ${BOUTON RESERVATION}
    Wait Until Element Is Not Visible    ${CHARGEMENT CLIQUE BOUTON}
    Click Element    ${BOUTON RESERVATION}
    Wait Until Element Contains    ${CHAMP DE TEXTE DE VALIDATION}    ${TEXTE D'ERREUR}
    Element Text Should Be    ${CHAMP DE TEXTE DE VALIDATION}    ${TEXTE D'ERREUR}

Aller Au Tableau De Bord
    Mouse Over    ${MENU D'UTILISATEUR}
    Wait Until Element Is Visible    ${LIEN TABLEAU DE BORD}
    Click Element    ${LIEN TABLEAU DE BORD}
    Title Should Be    ${TITRE TABLEAU DE BORD}

Vérifier Message De Réservation
    Wait Until Element Is Visible    ${DETAIL PREMIERE RESERVATION}
    Click Element    ${DETAIL PREMIERE RESERVATION}
    Element Text Should Be    ${POSITION MESSAGE CONFIRMATION RESERVATION}    ${MESSAGE CONFIRMATION RESERVATION}

Annuler Réservation
    Wait Until Element is Visible    ${BOUTON ANNULATION RESERVATION}
    Click Button    ${BOUTON ANNULATION RESERVATION}
    Wait Until Element Is Visible    ${BOUTON SOUMETTRE ANNULATION}
    Input Text    ${INPUT MESSAGE ANNULATION}    ${MESSAGE ANNULATION}
    Click Button    ${BOUTON SOUMETTRE ANNULATION}

Effectuer Une Réservation
    Rechercher Une Chambre A Réserver
    Choisir La Chambre A Réserver
    Réserver La Chambre En Etant Connecté

Effectuer Une Annulation De Réservation
    Aller Au Tableau De Bord
    Vérifier Message De Réservation
    Annuler Réservation
    Fermer le Navigateur

Effectuer Une Réservation Invalide
    Rechercher Une Chambre A Réserver
    Choisir La Chambre A Réserver
    Réserver La Chambre Sans Etre Connecté
