const FR = {
  caption: "Après correction, le réseau devine pour chaque carte :",
  score: "$1/$2 cartes justes ($3 %).",
  baseline: "Un réseau « idiot » qui répond toujours ♠️ obtient 3/7 (43 %).",
  extrapolation:
    "Encadrée en pointillés : la carte 7 (111) n'est pas dans le paquet. Le réseau ne l'a jamais apprise, il doit la deviner à partir des autres.",
} satisfies Record<string, string>;

export default FR;
