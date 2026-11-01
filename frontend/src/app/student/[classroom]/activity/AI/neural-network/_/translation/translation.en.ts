import FR from "./translation.fr";

const EN: typeof FR = {
  explanation: `## Learning an array by heart

The array at the top of the screen holds **8 cells**: 2 ❤️, 1 💰 and 5 💀.
We want a **neural network** to learn the content of each cell, using only its **number**.

- 🟢 **Inputs**: the number of the cell, written in binary with 3 digits (**−1** for 0 and **+1** for 1).
- 🔵 **Hidden layer**: 4 neurons that combine the inputs.
- 🟡 **Outputs**: the confidence of the network for each object. The greatest one is its answer.

At the start, the coefficients are **random**: the network answers anything.
After each try, the coefficients are **slightly corrected** so that the right answer becomes more likely.`,
  intro:
    "Click a cell of the array: the neural network tries to guess what it contains, then its coefficients are corrected. Keep going until it guesses every cell!",
  addRounds: "Add $1 training steps",
  rounds:
    "$1 training steps: each time, the network guesses a random cell, then its coefficients are corrected.",
  correct: "Cell $1: the network answers $2 with $3 % confidence. Correct!",
  wrong: "Cell $1: the network answers $2 with $3 % confidence, but it was $4. Wrong!",
};

export default EN;
