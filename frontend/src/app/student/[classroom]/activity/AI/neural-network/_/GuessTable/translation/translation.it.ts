import FR from "./translation.fr";

const IT: typeof FR = {
  caption: "Dopo la correzione, la rete indovina per ogni casella:",
  score: "$1/$2 caselle giuste ($3 %).",
  baseline: "Una rete «stupida» che risponde sempre 💀 ottiene 4/7 (57 %).",
  extrapolation:
    "Bordo punteggiato: la casella 7 (111) non è nella tabella. La rete non l'ha mai imparata, deve indovinarla a partire dalle altre.",
};

export default IT;
