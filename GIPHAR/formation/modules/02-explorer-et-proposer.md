# Module 02 — Explorer l'application et obtenir une proposition d'exigences

[← Retour au sommaire](../README.md)

## Pourquoi cette étape

Vous n'avez pas forcément de cahier des charges tout prêt pour l'application que vous
voulez faire tester. Dans ce module, vous donnez juste son adresse web (URL) à Claude, qui
va la visiter réellement — comme le ferait un testeur humain qui découvre un site — et vous
proposer une première liste de ce qu'elle semble permettre de faire. C'est une **proposition
à corriger**, pas un résultat final : c'est vous, au module suivant, qui direz ce qui est
juste, ce qui manque, et ce qu'il faut enlever.

## Ce qu'il vous faut avant de commencer

L'adresse web complète de l'application que vous voulez faire tester, par exemple
`https://exemple-monsite.com/`. Choisissez une application publique sur laquelle vous avez
le droit de faire des tests automatisés (votre propre produit, une application de
démonstration, un site de formation prévu pour ça). N'utilisez pas un site de production
tiers sans autorisation.

## Prompt à copier-coller

```
Je veux que tu explores une application web et que tu m'en déduises une première liste
d'exigences fonctionnelles. L'application est ici : {URL_DE_L_APPLICATION}

Fais ceci :

1. Mets en place un petit projet Node avec Playwright (npm init, installation de
   @playwright/test, installation des navigateurs) si ce n'est pas déjà fait dans ce
   dossier.

2. Visite réellement la page d'accueil avec un navigateur piloté par Playwright (pas un
   simple téléchargement de page : beaucoup de sites modernes chargent leur contenu en
   JavaScript, et une simple requête ne montrerait rien). Repère les liens de navigation
   principaux, les formulaires visibles (recherche, connexion, inscription, contact...),
   et les actions proposées (boutons, appels à l'action).

3. Visite ensuite 5 à 10 pages ou parcours accessibles depuis la page d'accueil (sans aller
   trop loin ni remplir de formulaires d'engagement réel comme un paiement) pour te faire
   une idée plus complète de ce que l'application permet de faire.

4. À partir de cette exploration, propose-moi une liste numérotée d'exigences
   fonctionnelles, au format suivant pour chacune :
   - un titre court, du point de vue de l'utilisateur ("En tant que [qui], je veux
     [quoi], afin de [pourquoi]")
   - un ou deux critères d'acceptation observables (ce qui permettrait de dire que ça
     marche ou que ça ne marche pas)
   - une priorité indicative (Haute / Moyenne / Basse), selon ce qui te semble central ou
     secondaire dans l'application

5. Présente cette liste comme une PROPOSITION À VALIDER, pas comme un résultat définitif —
   dis-le explicitement. Ne crée rien dans Jira ni ailleurs à ce stade : ce module ne fait
   que proposer, la validation et la création se font au module suivant.

Vise une quinzaine d'exigences au maximum pour une première passe : mieux vaut une liste
courte et pertinente qu'une liste exhaustive mais bruitée.
```

## Ce que vous avez à faire ensuite

Lisez la liste comme vous liriez un premier jet de backlog rédigé par quelqu'un d'autre :
c'est exactement le métier d'un product owner ou d'un business analyst, rien de technique
là-dedans. Posez-vous les questions habituelles :

- Est-ce que ça correspond à ce que fait vraiment l'application, ou est-ce que Claude a mal
  interprété quelque chose ?
- Est-ce qu'une fonctionnalité importante manque (Claude n'a exploré qu'une partie du
  site) ?
- Est-ce que deux exigences proposées sont en fait la même chose, à fusionner ?
- Les priorités vous semblent-elles correctes ?

Vous n'avez pas besoin de taper un prompt particulier pour ça : répondez à Claude en
français normal — « enlève la numéro 4, elle ne correspond à rien de réel », « ajoute une
exigence sur la réinitialisation de mot de passe, je l'ai vue sur la page de connexion »,
« la numéro 7 devrait être en priorité haute, pas basse ». Itérez jusqu'à avoir une liste
dont vous êtes satisfait.

## Si ça ne marche pas du premier coup

- **Claude dit que la page ne charge rien ou semble vide** : certains sites bloquent les
  navigateurs automatisés, ou nécessitent une connexion. Dites-le à Claude et essayez une
  autre application, idéalement un site de démonstration public prévu pour les tests.
- **La liste proposée est trop générique ("l'utilisateur peut naviguer sur le site")** :
  demandez à Claude d'explorer plus en profondeur des parcours précis ("va jusqu'au bout
  du formulaire de recherche", "ouvre le formulaire d'inscription et liste ses champs").

Une fois votre liste prête à être corrigée, passez au [module 03](03-valider-et-creer-le-backlog.md).
