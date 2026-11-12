const FR = {
  /** Decimal separator used in numbers: "," or ".". */
  decimalSeparator: ",",
  /** Separator of the arguments of a function: ";" or ",". */
  argumentSeparator: ";",
  fnSum: "SOMME",
  fnCount: "NB",
  fnCountA: "NBVAL",
  fnCountIf: "NB.SI",
  fnCountIfs: "NB.SI.ENS",
  fnAverage: "MOYENNE",
  fnIf: "SI",
  fnAnd: "ET",
  fnOr: "OU",
  fnNot: "NON",
  true: "VRAI",
  false: "FAUX",
  errDiv0: "#DIV/0!",
  errName: "#NOM?",
  errRef: "#REF!",
  errValue: "#VALEUR!",
  errCirc: "#CIRC!",
  errSyntax: "#ERREUR!",
  formula: "Contenu de la cellule active",
  guessFormula: "Il faut deviner cette formule...",
  copy: "Copier",
  paste: "Coller",
} satisfies Record<string, string>;

export default FR;
