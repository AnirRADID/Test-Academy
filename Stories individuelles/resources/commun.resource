*** Settings ***
Library    SeleniumLibrary


*** Variables ***
${NAVIGATEUR}                                   Chrome
${SERVEUR}                                      livraison3.testacademy.fr
${HOMEY URL}                                    http://${SERVEUR}/

${LIEN SE CONNECTER}                            xpath=//a[contains(text(),'Se connecter')]
${UTILISATEUR VALIDE}                           robot
${MOT DE PASSE VALIDE}                          robot
${UTILISATEUR NON VALIDE}                       nonvalide
${MOT DE PASSE NON VALIDE}                      nonvalide
${CHAMP NOM UTILISATEUR}                        name=username
${CHAMP MOT DE PASSE}                           name=password
${BOUTON VALIDER}                               css=.homey_login_button
${TITRE TABLEAU DE BORD}                        Tableau de bord - Livraison 3
${MENU D'UTILISATEUR}                           //*[@id="homey_nav_sticky"]/div/div/div[3]/div
${LIEN SE DECONNECTER}                          //*[@id="homey_nav_sticky"]/div/div/div[3]/div/div/ul/li[8]/a
${TITRE ACCUEIL}                                Accueil - Livraison 3
${ESPACE POUR AFFICHER LES ERREURS}             css=#modal-login .error
${MESSAGE ERREUR NOM UTILISATEUR}               Invalid username or email
${MESSAGE ERREUR MOT DE PASSE}                  The password you entered for the username test is incorrect.
${LIEN ACCUEIL}                                 //*[@id="menu-item-4630"]

*** Keywords ***

Ouvrir le Navigateur Et Accéder A l'Application
    Open Browser    browser=${NAVIGATEUR}
    Go To    ${HOMEY URL}
    Maximize Browser Window

Accéder A La Page De Connexion
    Wait Until Element Is Visible    ${LIEN SE CONNECTER}
    Click Element    ${LIEN SE CONNECTER}

Entrer Le Nom D'utilisateur
    [Arguments]    ${nom_utilisateur}
    Wait Until Element Is Visible    ${CHAMP NOM UTILISATEUR}
    Click Element    ${CHAMP NOM UTILISATEUR}
    Input Text    ${CHAMP NOM UTILISATEUR}    ${nom_utilisateur}

Entrer Le Mot De Passe
    [Arguments]    ${mot_de_passe}
    Click Element    ${CHAMP MOT DE PASSE}
    Input Password    ${CHAMP MOT DE PASSE}    ${mot_de_passe}

Soumettre Le Formulaire De Connexion Et Acceder Au Tableau De Bord
    Click Button    ${BOUTON VALIDER}
    Wait Until Element Is Not Visible    ${BOUTON VALIDER}

 Soumettre Le Formulaire De Connexion
    Click Button    ${BOUTON VALIDER}   

Vérifier Que L'Accueil est Visible
    Title Should Be    ${TITRE ACCUEIL}

Vérifier Que Le Tableau De Bord Est Visible
    Wait Until Element Is Not Visible    ${CHAMP NOM UTILISATEUR}
    Title Should Be    ${TITRE TABLEAU DE BORD}

Vérifier Que Le Message D'Erreur Est Visible
    Wait Until Element Is Visible    ${ESPACE POUR AFFICHER LES ERREURS}
    Element Text Should Not Be    ${ESPACE POUR AFFICHER LES ERREURS}    ${EMPTY}

Effectuer Une Déconnexion Réussie et Fermer Le Navigateur
    Effectuer Une Déconnexion Réussie
    Fermer le Navigateur

Effectuer Une Déconnexion Réussie
    Mouse Over    ${MENU D'UTILISATEUR}
    Wait Until Element Is Visible    ${LIEN SE DECONNECTER}
    Click Element    ${LIEN SE DECONNECTER}
    Wait Until Element Is Not Visible    ${LIEN SE DECONNECTER}

Vérifier Que Le Lien De Connexion Est Visible
    Element Should Be Visible    ${LIEN SE CONNECTER}

Retourner A L'Accueil
    Wait Until Element Is Visible    ${LIEN ACCUEIL}
    Click Element    ${LIEN ACCUEIL}
    Vérifier Que L'Accueil est Visible

Fermer le Navigateur
    Close Browser

Un Message d'Erreur Doit Etre Visible Apres Une Connexion Incorrecte
    [Arguments]    ${nom_utilisateur}    ${mot_de_passe}
    Accéder A La Page De Connexion
    Entrer Le Nom D'utilisateur    ${nom_utilisateur}
    Entrer Le Mot De Passe    ${mot_de_passe}
    Soumettre Le Formulaire De Connexion
    Vérifier Que Le Message D'Erreur Est Visible
    
Se connecter 
    [Arguments]  ${nom_utilisateur}  ${mot_de_passe}
    Accéder A La Page De Connexion
    Entrer Le Nom d'Utilisateur   ${nom_utilisateur} 
    Entrer Le Mot De Passe   ${mot_de_passe}
    Soumettre Le Formulaire De Connexion Et Acceder Au Tableau De Bord
    


Ouvrir Le Navigateur Et Accéder A La Page d'Accueil
    Open Browser    browser=${NAVIGATEUR}  
    Maximize Browser Window
    Go To     ${HOMEY URL}
    
Effectuer Une Connexion Avec Un Compte Valide
    Se connecter    ${UTILISATEUR VALIDE}    ${MOT DE PASSE VALIDE}