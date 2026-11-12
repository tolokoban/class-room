const FR = {
  sum: "Additionne les nombres d'une plage.",
  count: "Compte les cellules d'une plage qui contiennent un nombre.",
  countA: "Compte les cellules non vides d'une plage.",
  average: "Calcule la moyenne des nombres d'une plage.",
  if: "Renvoie une valeur si la condition est vraie, une autre sinon.",
  and: "Vrai si toutes les conditions sont vraies.",
  or: "Vrai si au moins une des conditions est vraie.",
  not: "Inverse une condition : vrai devient faux et faux devient vrai.",
} satisfies Record<string, string>;

export default FR;
