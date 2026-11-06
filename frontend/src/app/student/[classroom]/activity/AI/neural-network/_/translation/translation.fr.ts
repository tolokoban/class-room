const FR = {
  explanation: `## Apprendre un tableau par cœur

Le tableau en haut de l'écran contient **7 cases** : 2 ❤️, 1 💰 et 4 💀.
Nous voulons qu'un **réseau de neurones** apprenne le contenu de chaque case, uniquement à partir de son **numéro**.

- 🟢 **Entrées** : le numéro de la case, écrit en binaire avec 3 chiffres.
- 🔵 **Couche cachée** : 4 neurones qui combinent les entrées.
- 🟡 **Sorties** : la confiance du réseau pour chaque objet. La plus grande est sa réponse.

Au départ, les coefficients sont **tirés au hasard** : le réseau répond n'importe quoi.
Après chaque essai, on **corrige un peu** les coefficients pour que la bonne réponse devienne plus probable.`,
  intro:
    "Clique sur une case du tableau : le réseau de neurones essaie de deviner ce qu'elle contient, puis ses coefficients sont corrigés. Continue jusqu'à ce qu'il devine toutes les cases !",
  addRounds: "Ajouter $1 étapes d'entrainement",
  rounds:
    "$1 étapes d'entrainement : à chaque fois, le réseau devine une case au hasard, puis ses coefficients sont corrigés.",
  correct: "Case $1 : le réseau répond $2 avec $3 % de confiance. C'est juste !",
  wrong: "Case $1 : le réseau répond $2 avec $3 % de confiance, mais c'était $4. C'est faux !",
} satisfies Record<string, string>;

export default FR;
