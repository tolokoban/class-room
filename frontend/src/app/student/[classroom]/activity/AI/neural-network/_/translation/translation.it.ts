import FR from "./translation.fr";

const IT: typeof FR = {
  explanation: `## Imparare una tabella a memoria

La tabella in alto sullo schermo contiene **8 caselle**: 2 ❤️, 1 💰 e 5 💀.
Vogliamo che una **rete neurale** impari il contenuto di ogni casella, solo a partire dal suo **numero**.

- 🟢 **Ingressi**: il numero della casella, scritto in binario con 3 cifre (**−1** per 0 e **+1** per 1).
- 🔵 **Strato nascosto**: 4 neuroni che combinano gli ingressi.
- 🟡 **Uscite**: la fiducia della rete per ogni oggetto. La più grande è la sua risposta.

All'inizio, i coefficienti sono **casuali**: la rete risponde a caso.
Dopo ogni tentativo, i coefficienti vengono **corretti un po'** affinché la risposta giusta diventi più probabile.`,
  intro:
    "Clicca su una casella della tabella: la rete neurale cerca di indovinare cosa contiene, poi i suoi coefficienti vengono corretti. Continua finché non indovina tutte le caselle!",
  addRounds: "Aggiungi $1 passi di addestramento",
  rounds:
    "$1 passi di addestramento: ogni volta, la rete indovina una casella a caso, poi i suoi coefficienti vengono corretti.",
  correct: "Casella $1: la rete risponde $2 con il $3 % di fiducia. Giusto!",
  wrong: "Casella $1: la rete risponde $2 con il $3 % di fiducia, ma era $4. Sbagliato!",
};

export default IT;
