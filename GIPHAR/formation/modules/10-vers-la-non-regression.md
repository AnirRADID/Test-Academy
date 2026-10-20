# Module 10 — Vers la non-régression automatisée (aperçu)

[← Retour au sommaire](../README.md)

Ce module ne contient pas de prompt : il situe ce qui n'est **pas** couvert par cette
formation, pour que vous sachiez ce qui existe au-delà.

## Ce que vous avez construit jusqu'ici

Un processus que vous déclenchez vous-même, module par module, à chaque fois que vous le
décidez : explorer une application, proposer et valider des exigences, écrire des cas de
test, les automatiser, exécuter une campagne, trier les échecs, obtenir un rapport.

## Ce qu'apporterait une intégration à un outil d'intégration continue (par exemple Jenkins)

- **Exécution planifiée** : les mêmes tests relancés automatiquement selon une fréquence
  choisie (chaque nuit, à chaque mise à jour de l'application), sans qu'un humain ait à
  déclencher quoi que ce soit.
- **Mise à jour automatique des outils selon les résultats** : Squash déjà mis à jour à
  chaque exécution (ce que fait le rapporteur vu au module 07) ; Jira qui recevrait des
  mises à jour automatiques similaires (commenter un bug qui se reproduit, le signaler
  comme non reproduit après plusieurs exécutions vertes consécutives — jamais le fermer sur
  un seul succès, pour éviter de clore trop vite un défaut réellement présent mais
  intermittent).
- **Rapports réguliers de non-régression** : la même synthèse qu'au module 09, générée et
  distribuée automatiquement à chaque exécution planifiée, sans action manuelle.

## Pourquoi ce n'est pas dans cette formation

Cette partie nécessite une pièce technique supplémentaire que cette formation n'a
volontairement pas abordée : un identifiant d'accès à Jira qui fonctionne **sans Claude
dans la boucle** (puisqu'un outil planifié comme Jenkins s'exécute seul, de nuit, sans
personne pour relire ce qu'il fait). C'est un sujet à part entière, qui mérite sa propre
formation — ce module se contente de vous dire qu'il existe et à quoi il ressemblerait.

---

Vous êtes arrivé au bout de la formation. Le [pense-bête](../prompts/aide-memoire.md)
rassemble tous les prompts utilisés, pour une réutilisation rapide la prochaine fois que
vous voudrez faire tester une application.
