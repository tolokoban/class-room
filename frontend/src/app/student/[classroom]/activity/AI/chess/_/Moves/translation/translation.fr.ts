const FR = {
  whiteMoves:
    "Les blancs peuvent jouer $1 coups. Les mieux évalués sont en couleur. Clique sur un échiquier pour jouer ce coup.",
  blackMoves:
    "Les noirs peuvent jouer $1 coups. Les mieux évalués sont en couleur. Clique sur un échiquier pour jouer ce coup.",
  checkmate: "Échec et mat : plus aucun coup possible !",
  stalemate: "Pat : plus aucun coup possible, la partie est nulle.",
} satisfies Record<string, string>;

export default FR;
