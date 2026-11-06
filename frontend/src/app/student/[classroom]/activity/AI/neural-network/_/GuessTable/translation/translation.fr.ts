const FR = {
  caption: "Après correction, le réseau devine pour chaque case :",
  score: "$1/$2 cases justes ($3 %).",
  baseline: "Un réseau « idiot » qui répond toujours 💀 obtient 4/7 (57 %).",
  extrapolation:
    "Encadrée en pointillés : la case 7 (111) n'est pas dans le tableau. Le réseau ne l'a jamais apprise, il doit la deviner à partir des autres.",
} satisfies Record<string, string>;

export default FR;
