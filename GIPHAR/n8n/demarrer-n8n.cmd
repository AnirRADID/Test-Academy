@echo off
rem Demarre n8n avec les reglages dont l'equipe d'agents QA a besoin.
rem Double-cliquer sur ce fichier : n8n (http://localhost:5678) et la Tour de controle
rem (http://localhost:5680) demarrent.
rem Laisser cette fenetre ouverte : la fermer arrete n8n (plus aucun test ne peut etre lance).

rem La boite "Execute Command" (qui lance les agents) est desactivee par defaut
rem dans n8n, par securite. Cette ligne la reactive.
set NODES_EXCLUDE=[]

rem Une seule demande de lancement traitee a la fois (les cycles des stories, eux, avancent
rem en parallele). n8n/outils/lancer-agent.mjs limite le nombre d'agents au travail en meme
rem temps (reglage « Agents en parallele » de la Tour de controle).
set N8N_CONCURRENCY_PRODUCTION_LIMIT=1

rem n8n n'ecoute que ce PC : personne d'autre sur le reseau ne peut lui envoyer
rem des stories a tester ni ouvrir les formulaires de validation.
set N8N_LISTEN_ADDRESS=127.0.0.1

rem Heures du journal, des validations et des comptes rendus : heure de Paris.
set GENERIC_TIMEZONE=Europe/Paris
set TZ=Europe/Paris

rem La Tour de controle des agents (http://localhost:5680) : elle demarre dans sa
rem propre petite fenetre (reduite), puis s'ouvre dans le navigateur.
start "Tour de controle GIPHAR" /min node "%~dp0..\supervision\serveur-supervision.mjs"
start "" http://localhost:5680

n8n start
