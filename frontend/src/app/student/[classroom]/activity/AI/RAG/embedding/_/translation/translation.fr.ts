const FR = {
  title: "Devine l'animal",
  intro: "J'ai choisi un animal en secret. Pose-moi des questions pour le deviner !",
  placeholder: "Pose ta question, puis appuie sur Entrée…",
  newGame: "Nouvelle partie",
  giveUp: "Je donne ma langue au chat",
  vague1: "Soyez plus précis dans votre question.",
  vague2: "Je ne sais pas répondre à votre question.",
  found: "Bravo ! C'était bien $1 ! 🎉",
  wrong: "Non, ce n'est pas $1.",
  reveal: "C'était $1 !",
  closestQuestion: "Question la plus proche : « $1 » (similarité : $2)",
  closestAnimal: "Animal le plus proche : $1 (similarité : $2)",
  alreadyAsked: "Tu as déjà posé une question presque identique !",
  previousQuestion: "Question déjà posée : « $1 » (similarité : $2), comprise comme : « $3 »",
  notUnderstood: "pas comprise",
  loadingModels: "Chargement des modèles d'embedding et d'analyse grammaticale…",
  error: "Impossible de charger le modèle : $1",
  summary: "Récapitulatif de tes questions :",
  summaryEmpty: "Tu n'as encore posé aucune question.",
  summaryButton: "Récapitulatif des questions",
} satisfies Record<string, string>;

export default FR;
