import FR from "./translation.fr";

const EN: typeof FR = {
  caption: "After correction, the network guesses for each cell:",
  score: "$1/$2 correct cells ($3 %).",
  baseline: "A “stupid” network that always answers 💀 gets 4/7 (57 %).",
  extrapolation:
    "Dotted border: cell 7 (111) is not in the array. The network has never learned it, it must guess it from the other ones.",
};

export default EN;
