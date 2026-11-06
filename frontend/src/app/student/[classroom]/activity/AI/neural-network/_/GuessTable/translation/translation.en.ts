import FR from "./translation.fr";

const EN: typeof FR = {
  caption: "After correction, the network guesses for each card:",
  score: "$1/$2 correct cards ($3 %).",
  baseline: "A “stupid” network that always answers ♠️ gets 3/7 (43 %).",
  extrapolation:
    "Dotted border: card 7 (111) is not in the deck. The network has never learned it, it must guess it from the other ones.",
};

export default EN;
