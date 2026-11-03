const FR = {
  intro:
    "Le perceptron regarde le monde à travers une grille de 20×20 cases. Chaque case est soit claire, soit sombre.",
  hint: "Montre un chiffre à la caméra, puis clique sur « Reconnaître ».",
  hintDraw: "Dessine un chiffre à la souris sur l'écran du Perceptron.",
  recognize: "Reconnaître",
  webcam: "Webcam",
  restartConfirm:
    "Toutes les connaissances du perceptron vont être effacées. Veux-tu vraiment recommencer ?",
  pretrained: "Utiliser un Perceptron déjà entraîné",
  pretrainedConfirm:
    "Tout ce que ton perceptron a appris sera remplacé par un perceptron déjà entraîné. Veux-tu continuer ?",
} satisfies Record<string, string>;

export default FR;
