# Module 03 — Valider la liste et créer le backlog dans Jira

[← Retour au sommaire](../README.md)

## Pourquoi cette étape

Au module précédent, vous avez corrigé la proposition de Claude jusqu'à obtenir une liste
d'exigences dont vous êtes satisfait. Dans ce module, cette liste devient réellement des
tickets dans Jira — c'est la première chose qui "existe" durablement dans le processus.

## Étape 1 — Créer un projet Jira vide

Cette partie se fait dans votre navigateur, pas par un prompt : la création d'un tout
nouveau projet Jira est une action qui vous appartient, pas à Claude. Vous avez déjà votre
compte Atlassian (créé au module 00) — connectez-vous-y.

1. Dans Jira, créez un nouveau projet, modèle **Scrum** (c'est ce modèle qui nous donne des
   sprints, dont on se servira au module 07).
2. Donnez-lui un nom clair, par exemple le nom de l'application que vous testez. Jira vous
   proposera automatiquement une **clé de projet** courte (par exemple `MONAPP`) — notez-la,
   vous en aurez besoin dans le prompt ci-dessous.

## Étape 2 — Créer les exigences validées

**Prompt à copier-coller**
```
Vérifie que tu as accès à mon compte Atlassian, puis au projet Jira de clé {CLE_PROJET}
(nom : {NOM_DU_PROJET}). Confirme-moi que tu le trouves avant de continuer.

Ensuite, à partir de la liste d'exigences qu'on a validée ensemble juste avant ce message,
crée un ticket de type Story dans ce projet pour chacune :
- le titre reprend le titre court de l'exigence
- la description reprend le "en tant que... je veux... afin de..." et les critères
  d'acceptation, tels qu'on les a validés
- ajoute l'étiquette "squash-mirror" sur chaque ticket créé (ça nous servira plus tard
  pour la traçabilité avec l'outil de gestion des tests)
- règle la priorité Jira sur la priorité qu'on a indiquée pour chaque exigence

Une fois tous les tickets créés, crée un sprint nommé "Sprint 1" sur le tableau de ce
projet, démarre-le, et affecte-lui tous les tickets que tu viens de créer.

Donne-moi ensuite la liste des clés de tickets créés (par exemple MONAPP-1, MONAPP-2...)
avec leur titre, pour que je vérifie que tout est bien là.
```

## Vérifiez avant de continuer

Ouvrez votre projet Jira dans le navigateur et vérifiez que :
- chaque exigence validée est bien devenue un ticket,
- le contenu (titre, description) correspond à ce que vous avez validé — pas à la
  proposition brute du module 02,
- le Sprint 1 est actif et contient bien tous les tickets.

Si quelque chose manque ou diffère, dites-le à Claude en français normal plutôt que de
continuer — c'est cette liste de tickets qui sert de référence à tous les modules suivants.

## Si ça ne marche pas du premier coup

- **"Je n'ai pas accès à ce projet Jira"** : vérifiez que la clé de projet est correcte, et
  que le compte Atlassian connecté à Claude (vérifié au module 00) est bien membre de ce
  projet.
- **Les tickets créés ne correspondent pas à la liste validée** : c'est probablement que
  Claude a travaillé à partir d'une version de la liste antérieure à vos dernières
  corrections. Redonnez-lui la liste finale explicitement dans votre message plutôt que de
  supposer qu'il s'en souvient exactement.

Une fois votre backlog Jira vérifié, passez au [module 04](04-miroir-squash.md).
