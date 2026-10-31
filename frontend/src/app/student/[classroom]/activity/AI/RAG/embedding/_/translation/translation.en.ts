import FR from "./translation.fr";

const EN: typeof FR = {
  title: "Guess the animal",
  intro: "I secretly chose an animal. Ask me questions to guess it! (the game speaks French)",
  placeholder: "Ask your question, then press Enter…",
  newGame: "New game",
  giveUp: "I give up",
  vague1: "Please be more specific in your question.",
  vague2: "Your question is a bit vague.",
  found: "Well done! It was $1! 🎉",
  wrong: "No, it is not $1.",
  reveal: "It was $1!",
  closestQuestion: "Closest question: “$1” (similarity: $2)",
  closestAnimal: "Closest animal: $1 (similarity: $2)",
  error: "Unable to load the model: $1",
};

export default EN;
