const FR = {
  explanation: `## Apprendre un paquet de cartes par cœur

Le paquet de cartes en haut de l'écran contient **7 cartes** : 3 ♠️, 2 ♥️, 1 ♦️ et 1 ♣️.
Nous voulons qu'un **réseau de neurones** apprenne la couleur de chaque carte, uniquement à partir de son **numéro**.

- 🟢 **Entrées** : le numéro de la carte, écrit en binaire avec 3 chiffres.
- 🔵 **Couche cachée** : 4 neurones qui combinent les entrées.
- 🟡 **Sorties** : la confiance du réseau pour chaque couleur (♠️, ♥️, ♦️ et ♣️). La plus grande est sa réponse.

Au départ, les coefficients sont **tirés au hasard** : le réseau répond n'importe quoi.
Après chaque essai, on **corrige un peu** les coefficients pour que la bonne réponse devienne plus probable.`,
  intro:
    "Clique sur une carte du paquet : le réseau de neurones essaie de deviner sa couleur, puis ses coefficients sont corrigés. Continue jusqu'à ce qu'il devine toutes les cartes !",
  addRounds: "Ajouter $1 étapes d'entrainement",
  rounds:
    "$1 étapes d'entrainement : à chaque fois, le réseau devine une carte au hasard, puis ses coefficients sont corrigés.",
  correct: "Carte $1 : le réseau répond $2 avec $3 % de confiance. C'est juste !",
  wrong: "Carte $1 : le réseau répond $2 avec $3 % de confiance, mais c'était $4. C'est faux !",
} satisfies Record<string, string>;

export default FR;
