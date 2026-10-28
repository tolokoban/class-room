import FR from "./translation/translation.fr";

export function isCategory(category: string): category is keyof typeof FR {
  return Object.prototype.hasOwnProperty.call(FR, category);
}

/**
 * Categories are grouped in families sharing the same theme palette.
 * Inside a family, each category gets its own shade.
 */
const FAMILIES: Record<string, string[]> = {
  // Who is the person?
  primary: [
    "PRENOM_PERSONNE",
    "NOM_PERSONNE",
    "DOB",
    "AGE",
    "GENDER",
    "HEIGHT",
    "EYECOLOR",
    "VEHICLEVIN",
    "VEHICLEVRM",
  ],
  // Where does the person live?
  secondary: [
    "NUMERO_VOIE",
    "NOM_VOIE",
    "CODE_POSTAL",
    "VILLE",
    "SECONDARYADDRESS",
    "STATE",
    "COUNTRY",
    "REF_CADASTRALE",
  ],
  // How to reach the person?
  tertiary: ["EMAIL", "TELEPHONE", "USERNAME", "URL", "IP", "MAC", "USERAGENT"],
  // Money, secrets and official numbers: the most dangerous ones.
  error: [
    "IBAN",
    "CREDITCARD",
    "ACCOUNTNUMBER",
    "BITCOINADDRESS",
    "ETHEREUMADDRESS",
    "PASSWORD",
    "NUM_SECURITE_SOCIALE",
    "AMOUNT",
    "CURRENCY",
  ],
  // Work and context.
  neutral: ["NOM_SOCIETE", "JOBTITLE", "JOBAREA", "JOBTYPE", "NUM_DOSSIER", "DATE", "TIME"],
};

const SHADES = [7, 5, 8, 4, 9, 6, 3, 2, 1];

const COLORS = new Map<string, string>();
for (const [palette, categories] of Object.entries(FAMILIES)) {
  categories.forEach((category, index) => {
    COLORS.set(category, `${palette}-${SHADES[index % SHADES.length]}`);
  });
}

/**
 * Inline style for the background of a category, with the matching text color.
 */
export function categoryStyle(category: string): string {
  const color = COLORS.get(category) ?? "neutral-7";
  return `background:var(--theme-color-${color});color:var(--theme-color-on-${color})`;
}
