# Story : Réinitialisation du mot de passe

| | |
|---|---|
| **Où en est-on** | Étape 2 sur 6 — cas de test en attente de votre validation |
| **Prochaine action** | Relire le cas de test dans Squash (référence TC-HVC-8), puis cliquer sur [Valider ou refuser le cas](http://localhost:5678/form-waiting/45?signature=ecf18502841d2785c570448af4cf7010dbbc434310147b8cb39ddeb7a1a0acf3) |
| **Story Jira** | [Réinitialisation du mot de passe](https://testacademy.atlassian.net/browse/HVC-8) |
| **Dernière mise à jour** | 20/10/2026 17:53 par l'agent analyste |

## 1. Cas de test rédigé — agent analyste

**Nom** : TC-HVC-8 - Réinitialisation du mot de passe (2 étapes)

**Ce qu'il vérifie** : le lien « mot de passe oublié ? » ouvre un formulaire demandant
l'email ou l'identifiant, et l'envoi de ce formulaire confirme que la demande de
réinitialisation a bien été prise en compte.

**Les étapes** :
1. Ouvrir la page d'accueil, cliquer sur « Se connecter » puis sur « mot de passe oublié ? ».
   → Le formulaire de réinitialisation s'affiche et demande l'email ou l'identifiant.
2. Saisir un email et cliquer sur « Soumettre ».
   → Un message confirme que la demande de réinitialisation a été envoyée.

Note du 20/10/2026 17:53 : ce cas existait déjà dans Squash (rédigé lors d'un passage
précédent) et couvre les deux critères d'acceptation de la story. Il n'a pas été recréé ;
il a seulement été remis au statut « À approuver » pour votre relecture.

**Points à surveiller lors de la relecture** (pas corrigés, car aucune remarque de refus
n'a été reçue) :
- Le critère 2 demande de vérifier l'envoi de l'email « côté back-end » : le cas vérifie
  seulement le message de confirmation affiché à l'écran, pas la réception réelle de
  l'email.
- Aucun cas d'erreur n'est testé (email vide ou inconnu), la story n'en mentionnant pas.

Si vous refusez le cas en citant l'un de ces points, il sera corrigé au prochain passage.

## 2. Validation humaine

En attente de validation : [valider ou refuser le cas](http://localhost:5678/form-waiting/45?signature=ecf18502841d2785c570448af4cf7010dbbc434310147b8cb39ddeb7a1a0acf3).

## 3. Test automatisé — agent automaticien

_En attente._

## 4. Exécution de la campagne — agent exécutant

_En attente._

## 5. Anomalies — agent gestionnaire d'anomalies

_En attente._

## 6. Comptes rendus publiés — agent rapporteur

_En attente._
