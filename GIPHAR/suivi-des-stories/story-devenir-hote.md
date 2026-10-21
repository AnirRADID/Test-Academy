# Story : Devenir hôte

| | |
|---|---|
| **Où en est-on** | Étape 2 sur 6 — cas de test en attente de votre validation |
| **Prochaine action** | Relire le cas de test dans Squash (référence TC-HVC-9), puis cliquer sur [Valider ou refuser le cas](http://localhost:5678/form-waiting/96?signature=cd4c0a25f1828e4fc8f58130e252c2a01df6436560ce536f183d2ac8722db8c4) |
| **Story Jira** | [Devenir hôte](https://testacademy.atlassian.net/browse/HVC-9) |
| **Dernière mise à jour** | 20/10/2026 19:37 par l'agent analyste |

## 1. Cas de test rédigé — agent analyste

**Nom** : TC-HVC-9 - Devenir hôte (2 étapes)

**Ce qu'il vérifie** : depuis la page d'accueil, le lien « Devenir un hôte » mène à une page
dédiée qui présente le parcours pour publier une annonce.

**Les étapes** :
1. Depuis la page d'accueil, cliquer sur le lien « Devenir un hôte ».
   → La page dédiée « Devenir un hôte » s'affiche.
2. Observer le contenu de la page.
   → Le parcours ou le formulaire pour publier une annonce est présenté (titre
   « Become a Host » visible).

Note du 20/10/2026 17:53 : ce cas existait déjà dans Squash (rédigé lors d'un passage
précédent) et couvre les deux critères d'acceptation de la story. Il n'a pas été recréé ;
il a seulement été remis au statut « À approuver » pour votre relecture.

**Points à surveiller lors de la relecture** (pas corrigés, car aucune remarque de refus
n'a été reçue) :
- Le critère 2 précise que le contenu de la page est « à valider en page suivante » : le
  cas vérifie seulement que la page présente le parcours (son titre), pas le détail du
  formulaire.

Si vous refusez le cas en citant ce point, il sera corrigé au prochain passage.

Note du 20/10/2026 19:30 : nouveau lancement. La story Jira a été relue : son titre, sa
description et ses critères d'acceptation n'ont pas changé. Le cas est donc inchangé depuis
le passage précédent (cas inchangé depuis sa dernière approbation, s'il avait été approuvé) ;
il a seulement été remis au statut « À approuver », car un humain valide à chaque lancement.

**Blocage du 20/10/2026 19:32 suite aux remarques** : le valideur a refusé le cas et
demandé de « créer un cas de test pour chaque critère d'acceptation », donc deux cas
distincts pour cette story. Je n'ai rien créé ni modifié dans Squash, pour la raison
suivante : le cycle automatisé suit **un seul cas par story** (TC-HVC-9). C'est ce cas que
le formulaire fait approuver et que l'agent automaticien transforme en test. Un second cas
ne serait jamais approuvé ni automatisé et resterait en suspens dans Squash. Le cas
TC-HVC-9 reste tel qu'il était (2 étapes, une par critère d'acceptation).

Deux options pour débloquer :
- **Garder un seul cas, avec une étape par critère** : c'est déjà le découpage actuel
  (étape 1 = critère 1, étape 2 = critère 2). Relancer la story en précisant ce qu'il faut
  améliorer dans ces étapes.
- **Vraiment un cas par critère** : il faut d'abord faire évoluer le cycle (formulaire de
  validation, approbation, automatisation) pour qu'il gère plusieurs cas par story. C'est
  une décision à prendre par le formateur, pas par l'agent.

Note du 20/10/2026 19:37 : nouveau lancement, sans remarque de refus. La story Jira a été
relue : son titre, sa description et ses critères d'acceptation n'ont pas changé. Le cas
TC-HVC-9 est donc **inchangé depuis sa dernière version** (2 étapes, une par critère
d'acceptation) ; il a seulement été remis au statut « À approuver », car un humain valide à
chaque lancement. Le blocage précédent est levé : si vous souhaitez toujours un découpage
différent, refusez le cas en le précisant.

## 2. Validation humaine

Historique : cas refusé le 20/10/2026 avec la remarque « Créer un cas de test pour chaque
critère d'acceptation » (correction bloquée, voir section 1).

**20/10/2026 19:37 — En attente de validation** :
[valider ou refuser le cas](http://localhost:5678/form-waiting/96?signature=cd4c0a25f1828e4fc8f58130e252c2a01df6436560ce536f183d2ac8722db8c4).

## 3. Test automatisé — agent automaticien

_En attente._

## 4. Exécution de la campagne — agent exécutant

_En attente._

## 5. Anomalies — agent gestionnaire d'anomalies

_En attente._

## 6. Comptes rendus publiés — agent rapporteur

_En attente._
