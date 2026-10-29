# Story : Réinitialisation du mot de passe

| | |
|---|---|
| **Où en est-on** | Étape 2 sur 6 — 2 cas de test en attente de votre validation |
| **Prochaine action** | Relire les cas TC-HVC-8-1 et TC-HVC-8-2 dans Squash, puis cliquer sur [Valider ou refuser les cas](http://localhost:5678/form-waiting/125?signature=f521a26ff1de67894006ce8dacab512e5514562cfe86ef003cc2db065c2f3e02) |
| **Story Jira** | [Réinitialisation du mot de passe](https://testacademy.atlassian.net/browse/HVC-8) |
| **Dernière mise à jour** | 25/10/2026 12:23 par l'agent analyste |

## 1. Cas de test rédigés — agent analyste

**Passage du 25/10/2026 12:23** : la story Jira n'a pas changé (même titre, même description,
mêmes deux critères d'acceptation). En revanche, elle n'avait jusqu'ici **qu'un seul cas**
(TC-HVC-8) pour ses deux critères. Elle a donc été découpée en **un cas par critère** :
l'ancien cas TC-HVC-8 a été renommé TC-HVC-8-1 (son historique est conservé), et le cas
TC-HVC-8-2 a été créé. Les deux cas sont au statut « À approuver ».

### TC-HVC-8-1 — Réinitialisation du mot de passe : le lien « mot de passe oublié ? » ouvre le formulaire (critère 1)

**Ce qu'il vérifie** : critère 1 — le lien « mot de passe oublié ? » ouvre un formulaire qui
demande l'email ou l'identifiant.

**Avant de commencer** : le visiteur n'est pas connecté et se trouve sur la page d'accueil.

**Les étapes** :
1. Depuis la page d'accueil, cliquer sur « Se connecter ».
   → La fenêtre de connexion s'affiche et propose le lien « mot de passe oublié ? ».
2. Cliquer sur le lien « mot de passe oublié ? ».
   → Le formulaire de réinitialisation s'affiche : il demande l'email ou l'identifiant et
   propose un bouton pour envoyer la demande.

### TC-HVC-8-2 — Réinitialisation du mot de passe : l'envoi du formulaire déclenche l'email de réinitialisation (critère 2)

**Ce qu'il vérifie** : critère 2 — l'envoi du formulaire déclenche l'envoi d'un email de
réinitialisation.

**Avant de commencer** : un compte existe déjà sur le site avec une adresse email connue du
testeur (le site refuse la demande pour une adresse qui ne correspond à aucun compte). Le
visiteur n'est pas connecté.

**Les étapes** :
1. Depuis la page d'accueil, cliquer sur « Se connecter » puis sur « mot de passe oublié ? ».
   → Le formulaire de réinitialisation s'affiche et demande l'email ou l'identifiant.
2. Saisir l'adresse email du compte existant, puis cliquer sur le bouton d'envoi.
   → Après un court message d'attente, un message confirme qu'un email de réinitialisation a
   été envoyé (« Check your email »).

**Points à surveiller lors de la relecture** :
- Le critère 2 parle d'une vérification « côté back-end » : le cas vérifie le message de
  confirmation affiché à l'écran, pas la réception réelle de l'email dans la boîte du
  visiteur.
- Aucun cas d'erreur n'est testé (email vide ou inconnu) : les critères n'en mentionnent pas.
- Pour l'agent automaticien : le cas TC-HVC-8-1 est encore relié au test automatisé de
  l'ancien cas unique TC-HVC-8. Ce test couvre les deux critères. Il faudra le répartir entre
  TC-HVC-8-1 et TC-HVC-8-2.

### Historique des passages précédents

**Nom (ancien cas unique)** : TC-HVC-8 - Réinitialisation du mot de passe (2 étapes)

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

Note du 20/10/2026 19:30 : nouveau passage. La story Jira (titre, description, critères
d'acceptation) n'a pas changé depuis la rédaction du cas : cas inchangé depuis sa dernière
version soumise. Il n'a pas été modifié, seulement remis au statut « À approuver » pour une
nouvelle relecture humaine. Les points à surveiller ci-dessus restent valables.

Note du 25/10/2026 12:18 : nouveau passage **bloqué**. Le connecteur Atlassian de Claude
demande une nouvelle autorisation : la story n'a donc pas pu être relue dans Jira. Sans cette
lecture, impossible de vérifier si la story a changé ni de rédiger un cas par critère
d'acceptation (le cas actuel est encore un cas unique TC-HVC-8 pour deux critères). Rien n'a
été modifié dans Squash ni dans Jira. Le cas existant reste tel quel, au statut « Approuvé ».

## 2. Validation humaine

**En attente de validation** (depuis le 25/10/2026 12:23) des cas TC-HVC-8-1 et TC-HVC-8-2 :
[Valider ou refuser les cas](http://localhost:5678/form-waiting/125?signature=f521a26ff1de67894006ce8dacab512e5514562cfe86ef003cc2db065c2f3e02)

Passage précédent : cas unique TC-HVC-8 validé le 20/10/2026 19:35. Remarques du valideur : aucune.

## 3. Test automatisé — agent automaticien

**Le 20/10/2026 19:35** — le test automatisé existait déjà ; il a été repris et renforcé.

- **Nombre d'étapes** : 2, identiques aux deux étapes du cas validé, dans le même ordre.
- **Préparation** : avant la première étape, le test crée lui-même un compte neuf (nom
  unique à chaque exécution). En effet, le site refuse la demande pour une adresse qui ne
  correspond à aucun compte (« There is no user registered with that email address. ») :
  l'ancienne version du test se contentait de voir « un message », ce qui la faisait passer
  même sur ce refus.
- **Ce que vérifie maintenant l'étape 2** : après l'envoi, le test attend la fin du message
  « veuillez patienter », puis exige le message de confirmation « Check your email ».
- **Verdict de la vérification** : **passe sur le site.** Le formulaire « mot de passe
  oublié ? » s'ouvre et la demande de réinitialisation est confirmée à l'écran.
- Rappel (point déjà signalé en section 1) : le test vérifie le message affiché, pas la
  réception réelle de l'email.
- Le cas est déclaré « automatisé » dans Squash.

**Traçabilité** : test `tests/tc-hvc-8-mot-de-passe-oublie.spec.ts` · cas Squash TC-HVC-8.

## 4. Exécution de la campagne — agent exécutant

**Le 20/10/2026 19:43** — campagne complète jouée.

- **10 cas joués : 9 réussis, 1 échoué** (TC-HVC-1 « Recherche de logements par destination
  et dates »).
- **Cas de cette story (TC-HVC-8)** : ✅ **réussi** — le formulaire « mot de passe oublié ? »
  s'ouvre et la demande de réinitialisation est confirmée à l'écran (« Check your email »).
- **Remontée dans Squash** : partielle. 8 résultats enregistrés ; les résultats de TC-HVC-9
  (« Devenir hôte ») et TC-HVC-10 (« Comparer des annonces »), tous deux réussis, n'ont pas
  pu être rattachés car ces cas ne figurent pas au plan de l'itération.

**Traçabilité** : itération Squash 1 (IT-01 Recette v1) · exécution TC-HVC-8 n° 75 ·
exécution TC-HVC-1 n° 79.

## 5. Anomalies — agent gestionnaire d'anomalies

**Le 20/10/2026 19:43** — triage de la campagne terminé.

- **Anomalies liées à cette story** : aucune anomalie (le cas TC-HVC-8 a réussi).
- **Autres stories de la campagne** : 1 anomalie traitée, déjà connue —
  [HVC-11 — Recherche non refusée quand le champ Destination est vide](https://testacademy.atlassian.net/browse/HVC-11)
  (story « Recherche de logements par destination et dates »), reproduite à nouveau. Aucun
  nouveau ticket créé.

**Traçabilité** : itération Squash 1 (IT-01 Recette v1) · exécution TC-HVC-1 n° 79 · rapport
PDF et lien vers HVC-11 posés sur l'exécution.

## 6. Comptes rendus publiés — agent rapporteur

**Le 20/10/2026 19:45** — les deux comptes rendus sont publiés.

- **Verdict de la story** : ✅ réussie, sans aucune anomalie.
- **Dans la story Jira** : [compte rendu final de la recette](https://testacademy.atlassian.net/browse/HVC-8?focusedCommentId=10027)
- **Dans Squash** : bilan global de la campagne ajouté en tête de la description de
  l'itération IT-01 Recette v1 (10 cas joués : 9 réussis, 1 échoué, TC-HVC-1, anomalie
  [HVC-11](https://testacademy.atlassian.net/browse/HVC-11) déjà connue).

**Traçabilité** : itération Squash 1 · fichier du bilan
`suivi-des-stories/donnees-squash/bilan-2026-10-20-1945.html` · commentaire Jira n° 10027.
