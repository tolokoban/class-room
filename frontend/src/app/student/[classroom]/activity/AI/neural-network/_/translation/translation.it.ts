import FR from "./translation.fr";

const IT: typeof FR = {
  explanation: `## Imparare un mazzo di carte a memoria

Il mazzo di carte in alto sullo schermo contiene **7 carte**: 3 ♠️, 2 ♥️, 1 ♦️ e 1 ♣️.
Vogliamo che una **rete neurale** impari il seme di ogni carta, solo a partire dal suo **numero**.

- 🟢 **Ingressi**: il numero della carta, scritto in binario con 3 cifre.
- 🔵 **Strato nascosto**: 4 neuroni che combinano gli ingressi.
- 🟡 **Uscite**: la fiducia della rete per ogni seme (♠️, ♥️, ♦️ e ♣️). La più grande è la sua risposta.

All'inizio, i coefficienti sono **casuali**: la rete risponde a caso.
Dopo ogni tentativo, i coefficienti vengono **corretti un po'** affinché la risposta giusta diventi più probabile.`,
  intro:
    "Clicca su una carta del mazzo: la rete neurale cerca di indovinarne il seme, poi i suoi coefficienti vengono corretti. Continua finché non indovina tutte le carte!",
  addRounds: "Aggiungi $1 passi di addestramento",
  rounds:
    "$1 passi di addestramento: ogni volta, la rete indovina una carta a caso, poi i suoi coefficienti vengono corretti.",
  correct: "Carta $1: la rete risponde $2 con il $3 % di fiducia. Giusto!",
  wrong: "Carta $1: la rete risponde $2 con il $3 % di fiducia, ma era $4. Sbagliato!",
};

export default IT;
