# Module 06 — Automatiser les cas de test (plan détaillé, à finaliser)

[← Retour au sommaire](../README.md)

> Ce module n'est pas encore rédigé sous sa forme finale. Voici le plan détaillé.

## Objectif

Faire écrire, par Claude, un test automatisé Playwright pour chaque cas de test Squash
validé au module 05 — et surtout, faire en sorte que ce test soit **réellement vérifié
contre l'application**, pas seulement écrit puis supposé correct.

## Prompt-cadre (à affiner)

Demander à Claude de, cas par cas :
1. Écrire un fichier de test qui reproduit exactement les pas validés dans Squash (un
   `test.step()` par pas), avec le nom du cas en en-tête du test (convention de référence
   déjà posée dans les modules précédents).
2. **Exécuter réellement ce test contre l'application**, observer le résultat, et corriger
   le test si le comportement réel de l'application diffère de ce qui était supposé —
   jamais déclarer un test "prêt" sans l'avoir vu passer (ou échouer pour une bonne raison)
   au moins une fois.
3. Résumer à l'apprenant, en langage clair, ce que le test fait concrètement et ce qu'il a
   fallu ajuster, sans entrer dans le détail technique sauf si l'apprenant le demande.

## Points d'attention à intégrer dans la rédaction finale — c'est le module le plus
important pour transmettre la discipline "écrire → exécuter → observer → adapter"

Présenter, comme illustrations (pas comme règles universelles — chaque site est différent) :
- des sites modernes chargent du contenu en JavaScript : il faut un vrai navigateur, pas un
  simple téléchargement de page, pour voir ce qui s'affiche réellement ;
- des contrôles visuels (cases à cocher stylées, boutons) peuvent cacher l'élément technique
  sous-jacent — un clic "normal" échoue alors qu'un humain cliquerait sans problème ;
- un même nom de champ peut apparaître deux fois sur une page (ex. un formulaire de
  connexion et un formulaire d'inscription tous deux présents, même masqués) — il faut
  préciser lequel des deux on vise ;
- les messages affichés par l'application peuvent être dans une langue différente de son
  interface générale.

Message clé pour l'apprenant : vous n'avez pas besoin de comprendre CES détails techniques
précis sur votre application — c'est le travail de Claude de les découvrir en testant
réellement. Votre rôle est de vérifier que le RÉSULTAT (le test réussit à faire ce que le
cas de test décrit) correspond à ce que vous attendiez.

## Vérification prévue

Pour chaque cas de test, un fichier de test existe, a été exécuté au moins une fois contre
l'application réelle, et son comportement (succès ou échec) a été expliqué en langage clair
à l'apprenant.
