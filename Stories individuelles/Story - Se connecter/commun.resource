*** Settings ***
Library    SeleniumLibrary


*** Variables ***
${NAVIGATEUR}                                   Chrome
${DELAI MAX}                                    20s
${SERVEUR}                                      livraison3.testacademy.fr
${HOMEY URL}                                    http://${SERVEUR}/
# Taille d'écran fixe : identique sur le PC de l'apprenant et sur Jenkins (sans écran)
${OPTIONS NAVIGATEUR}                           add_argument("--window-size=1920,1080");add_argument("--no-sandbox");add_argument("--disable-dev-shm-usage")

${LIEN SE CONNECTER}                            css=#homey_nav_sticky .login-register a[data-target="#modal-login"]
${UTILISATEUR VALIDE}                           robot
${MOT DE PASSE VALIDE}                          robot
${UTILISATEUR NON VALIDE}                       nonvalide
${MOT DE PASSE NON VALIDE}                      nonvalide
${CHAMP NOM UTILISATEUR}                        css=#modal-login input[name="username"]
${CHAMP MOT DE PASSE}                           css=#modal-login input[name="password"]
${BOUTON VALIDER}                               css=#modal-login .homey_login_button
${TITRE TABLEAU DE BORD}                        Tableau de bord - Livraison 3
${MENU D'UTILISATEUR}                           css=#homey_nav_sticky .account-loggedin
${LIEN SE DECONNECTER}                          css=#homey_nav_sticky .account-loggedin a[href*="action=logout"]
${TITRE ACCUEIL}                                Accueil - Livraison 3
${ESPACE POUR AFFICHER LES ERREURS}             css=#modal-login .error
${MESSAGE ERREUR NOM UTILISATEUR}               Invalid username or email
${MESSAGE ERREUR MOT DE PASSE}                  The password you entered for the username test is incorrect.
${LIEN ACCUEIL}                                 css=#menu-item-4630 > a

*** Keywords ***

Ouvrir le Navigateur Et Accéder A l'Application
    Open Browser    ${HOMEY URL}    ${NAVIGATEUR}    options=${OPTIONS NAVIGATEUR}
    Set Selenium Timeout    ${DELAI MAX}
    Attendre La Fin Du Chargement De La Page

Attendre La Fin Du Chargement De La Page
    Wait For Condition    return document.readyState == "complete"

Accéder A La Page De Connexion
    Attendre La Fin Du Chargement De La Page
    Wait Until Element Is Visible    ${LIEN SE CONNECTER}
    Click Element    ${LIEN SE CONNECTER}
    Wait Until Element Is Visible    ${BOUTON VALIDER}

Entrer Le Nom D'utilisateur
    [Arguments]    ${nom_utilisateur}
    Wait Until Keyword Succeeds    ${DELAI MAX}    1s    Saisir Et Vérifier    ${CHAMP NOM UTILISATEUR}    ${nom_utilisateur}

Entrer Le Mot De Passe
    [Arguments]    ${mot_de_passe}
    Wait Until Keyword Succeeds    ${DELAI MAX}    1s    Saisir Et Vérifier    ${CHAMP MOT DE PASSE}    ${mot_de_passe}    secret=${True}

Saisir Et Vérifier
    [Documentation]    Tape la valeur puis contrôle qu'elle est bien restée dans le champ
    ...    (la fenêtre de connexion s'ouvre avec une animation qui peut effacer la saisie).
    [Arguments]    ${champ}    ${valeur}    ${secret}=${False}
    Wait Until Element Is Visible    ${champ}
    IF    ${secret}
        Input Password    ${champ}    ${valeur}
    ELSE
        Input Text    ${champ}    ${valeur}
    END
    Textfield Value Should Be    ${champ}    ${valeur}

Soumettre Le Formulaire De Connexion Et Acceder Au Tableau De Bord
    Click Button    ${BOUTON VALIDER}
    Wait Until Element Is Not Visible    ${BOUTON VALIDER}

Soumettre Le Formulaire De Connexion
    Wait Until Element Is Enabled    ${BOUTON VALIDER}
    Click Button    ${BOUTON VALIDER}

Vérifier Que L'Accueil est Visible
    Wait Until Keyword Succeeds    ${DELAI MAX}    1s    Title Should Be    ${TITRE ACCUEIL}

Vérifier Que Le Tableau De Bord Est Visible
    Wait Until Element Is Not Visible    ${CHAMP NOM UTILISATEUR}
    Wait Until Keyword Succeeds    ${DELAI MAX}    1s    Title Should Be    ${TITRE TABLEAU DE BORD}

Vérifier Que Le Message D'Erreur Est Visible
    Wait Until Element Is Visible    ${ESPACE POUR AFFICHER LES ERREURS}
    Wait Until Keyword Succeeds    ${DELAI MAX}    1s    Element Text Should Not Be    ${ESPACE POUR AFFICHER LES ERREURS}    ${EMPTY}

Effectuer Une Déconnexion Réussie et Fermer Le Navigateur
    Effectuer Une Déconnexion Réussie
    Fermer le Navigateur

Effectuer Une Déconnexion Réussie
    # Le menu s'ouvre au survol avec une animation : un clic trop tôt peut être ignoré, on réessaie
    Wait Until Keyword Succeeds    3x    2s    Cliquer Sur Se Déconnecter
    Vérifier Que Le Lien De Connexion Est Visible

Cliquer Sur Se Déconnecter
    ${deja_deconnecte}=    Run Keyword And Return Status    Element Should Be Visible    ${LIEN SE CONNECTER}
    IF    ${deja_deconnecte}    RETURN
    Wait Until Element Is Visible    ${MENU D'UTILISATEUR}
    Mouse Over    ${MENU D'UTILISATEUR}
    Wait Until Element Is Visible    ${LIEN SE DECONNECTER}
    Click Element    ${LIEN SE DECONNECTER}
    Wait Until Element Is Visible    ${LIEN SE CONNECTER}    timeout=10s

Vérifier Que Le Lien De Connexion Est Visible
    Wait Until Element Is Visible    ${LIEN SE CONNECTER}

Retourner A L'Accueil
    Wait Until Element Is Visible    ${LIEN ACCUEIL}
    Click Element    ${LIEN ACCUEIL}
    Vérifier Que L'Accueil est Visible

Fermer le Navigateur
    Close All Browsers

Un Message d'Erreur Doit Etre Visible Apres Une Connexion Incorrecte
    [Arguments]    ${nom_utilisateur}    ${mot_de_passe}
    Accéder A La Page De Connexion
    Entrer Le Nom D'utilisateur    ${nom_utilisateur}
    Entrer Le Mot De Passe    ${mot_de_passe}
    Soumettre Le Formulaire De Connexion
    Vérifier Que Le Message D'Erreur Est Visible

Se connecter
    [Arguments]    ${nom_utilisateur}    ${mot_de_passe}
    Accéder A La Page De Connexion
    Entrer Le Nom D'utilisateur    ${nom_utilisateur}
    Entrer Le Mot De Passe    ${mot_de_passe}
    Soumettre Le Formulaire De Connexion Et Acceder Au Tableau De Bord

Ouvrir Le Navigateur Et Accéder A La Page d'Accueil
    Ouvrir le Navigateur Et Accéder A l'Application

Effectuer Une Connexion Avec Un Compte Valide
    Se connecter    ${UTILISATEUR VALIDE}    ${MOT DE PASSE VALIDE}
