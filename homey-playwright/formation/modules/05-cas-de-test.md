# Module 05 — Écrire les cas de test, avant toute automatisation (plan détaillé, à finaliser)

[← Retour au sommaire](../README.md)

> Ce module n'est pas encore rédigé sous sa forme finale. Voici le plan détaillé.

## Objectif

Pour chaque exigence Squash créée au module 04, faire rédiger par Claude un cas de test en
**langage testeur clair** (une suite d'actions et de résultats attendus qu'un humain
pourrait suivre à la main), que l'apprenant valide avant toute automatisation. C'est le
même principe de "proposition à corriger" que le module 02, appliqué cette fois à chaque
exigence individuellement.

## Prompt-cadre (à affiner)

Demander à Claude, exigence par exigence :
1. Proposer un cas de test (nom, prérequis, liste de pas `action` / `résultat attendu`),
   écrit comme une recette qu'un testeur humain suivrait, sans aucun terme technique
   (pas de sélecteur CSS, pas d'appel HTTP, pas de code).
2. Présenter chaque proposition pour validation avant de créer quoi que ce soit.
3. Une fois validé, créer le cas dans Squash avec la couverture de l'exigence posée **dès
   la création** (champ `verified_requirements`).

## Points d'attention à intégrer dans la rédaction finale

- Rappeler fortement : la couverture d'un cas de test ne peut être posée qu'au moment de sa
  création dans Squash — une correction après coup nécessite de recréer le cas. Mieux vaut
  valider le texte AVANT de le créer plutôt que de corriger après.
- Encourager explicitement le langage "parcours utilisateur" (ce que ferait un testeur au
  clavier/souris) — c'est ce même texte qui servira de plan au test automatisé du module 06,
  et de source pour la description d'un éventuel bug au module 08.
- Un cas de test = une exigence ; éviter qu'un cas tente de couvrir plusieurs exigences à
  la fois (ça complique la traçabilité et les rapports plus tard).

## Vérification prévue

Dans Squash, vérifier que chaque exigence a bien un cas de test qui la couvre, et que les
pas décrivent une action concrète et observable (pas une phrase vague comme "vérifier que
ça marche").
