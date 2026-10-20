@echo off
rem Demarre n8n avec les reglages dont l'equipe d'agents QA a besoin.
rem Double-cliquer sur ce fichier : n8n (http://localhost:5678) et l'ecran de supervision
rem (http://localhost:5680) demarrent.
rem Laisser cette fenetre ouverte : la fermer arrete n8n (plus aucun test ne peut etre lance).

rem La boite "Execute Command" (qui lance les agents) est desactivee par defaut
rem dans n8n, par securite. Cette ligne la reactive.
set NODES_EXCLUDE=[]

rem Une seule execution a la fois. (En plus, n8n/outils/lancer-agent.mjs ne laisse
rem travailler qu un agent a la fois : les autres attendent leur tour.)
set N8N_CONCURRENCY_PRODUCTION_LIMIT=1

rem n8n n'ecoute que ce PC : personne d'autre sur le reseau ne peut lui envoyer
rem des stories a tester ni ouvrir les formulaires de validation.
set N8N_LISTEN_ADDRESS=127.0.0.1

rem Heures du journal, des validations et des comptes rendus : heure de Paris.
set GENERIC_TIMEZONE=Europe/Paris
set TZ=Europe/Paris

rem L'ecran de supervision des agents (http://localhost:5680) : il demarre dans sa
rem propre petite fenetre (reduite), puis s'ouvre dans le navigateur.
start "Supervision GIPHAR" /min node "%~dp0..\supervision\serveur-supervision.mjs"
start "" http://localhost:5680

n8n start
