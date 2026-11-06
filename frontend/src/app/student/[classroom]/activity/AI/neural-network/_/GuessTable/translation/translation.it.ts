import FR from "./translation.fr";

const IT: typeof FR = {
  caption: "Dopo la correzione, la rete indovina per ogni carta:",
  score: "$1/$2 carte giuste ($3 %).",
  baseline: "Una rete «stupida» che risponde sempre ♠️ ottiene 3/7 (43 %).",
  extrapolation:
    "Bordo punteggiato: la carta 7 (111) non è nel mazzo. La rete non l'ha mai imparata, deve indovinarla a partire dalle altre.",
};

export default IT;
