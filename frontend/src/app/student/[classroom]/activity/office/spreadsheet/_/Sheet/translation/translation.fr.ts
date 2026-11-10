const FR = {
  /** Decimal separator used in numbers: "," or ".". */
  decimalSeparator: ",",
  /** Separator of the arguments of a function: ";" or ",". */
  argumentSeparator: ";",
  fnSum: "SOMME",
  fnCount: "NB",
  fnCountA: "NBVAL",
  fnAverage: "MOYENNE",
  errDiv0: "#DIV/0!",
  errName: "#NOM?",
  errRef: "#REF!",
  errValue: "#VALEUR!",
  errCirc: "#CIRC!",
  errSyntax: "#ERREUR!",
  formula: "Contenu de la cellule active",
} satisfies Record<string, string>;

export default FR;
