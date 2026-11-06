import FR from "./translation.fr";

const EN: typeof FR = {
  explanation: `## Learning a deck of cards by heart

The deck of cards at the top of the screen holds **7 cards**: 3 ♠️, 2 ♥️, 1 ♦️ and 1 ♣️.
We want a **neural network** to learn the suit of each card, using only its **number**.

- 🟢 **Inputs**: the number of the card, written in binary with 3 digits.
- 🔵 **Hidden layer**: 4 neurons that combine the inputs.
- 🟡 **Outputs**: the confidence of the network for each suit (♠️, ♥️, ♦️ and ♣️). The greatest one is its answer.

At the start, the coefficients are **random**: the network answers anything.
After each try, the coefficients are **slightly corrected** so that the right answer becomes more likely.`,
  intro:
    "Click a card of the deck: the neural network tries to guess its suit, then its coefficients are corrected. Keep going until it guesses every card!",
  addRounds: "Add $1 training steps",
  rounds:
    "$1 training steps: each time, the network guesses a random card, then its coefficients are corrected.",
  correct: "Card $1: the network answers $2 with $3 % confidence. Correct!",
  wrong: "Card $1: the network answers $2 with $3 % confidence, but it was $4. Wrong!",
};

export default EN;
