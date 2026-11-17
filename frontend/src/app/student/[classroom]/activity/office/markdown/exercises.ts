/**
 * Exercises, sorted in the order of introduction of their syntax.
 * The Markdown code of each exercise is in `_/content`, and its help section has the same id
 * (except for `recap` and `challenge` which introduce no new syntax).
 */
export const EXERCISES = {
  paragraphs: {
    title: { fr: "Paragraphes", en: "Paragraphs", de: "Absätze", it: "Paragrafi" },
  },
  lineBreak: {
    title: { fr: "Retours à la ligne", en: "Line breaks", de: "Zeilenumbrüche", it: "A capo" },
  },
  title: {
    title: { fr: "Titres", en: "Headings", de: "Überschriften", it: "Titoli" },
  },
  subtitles: {
    title: {
      fr: "Niveaux de titres",
      en: "Heading levels",
      de: "Überschriftenebenen",
      it: "Livelli dei titoli",
    },
  },
  bold: {
    title: { fr: "Gras", en: "Bold", de: "Fett", it: "Grassetto" },
  },
  italic: {
    title: { fr: "Italique", en: "Italic", de: "Kursiv", it: "Corsivo" },
  },
  bulletList: {
    title: {
      fr: "Listes à puces",
      en: "Bullet lists",
      de: "Aufzählungen",
      it: "Elenchi puntati",
    },
  },
  numberedList: {
    title: {
      fr: "Listes numérotées",
      en: "Numbered lists",
      de: "Nummerierte Listen",
      it: "Elenchi numerati",
    },
  },
  nestedList: {
    title: {
      fr: "Listes imbriquées",
      en: "Nested lists",
      de: "Verschachtelte Listen",
      it: "Elenchi annidati",
    },
  },
  inlineCode: {
    title: {
      fr: "Code dans le texte",
      en: "Inline code",
      de: "Code im Text",
      it: "Codice nel testo",
    },
  },
  codeBlock: {
    title: { fr: "Blocs de code", en: "Code blocks", de: "Codeblöcke", it: "Blocchi di codice" },
  },
  quote: {
    title: { fr: "Citations", en: "Quotes", de: "Zitate", it: "Citazioni" },
  },
  link: {
    title: { fr: "Liens", en: "Links", de: "Links", it: "Link" },
  },
  separator: {
    title: { fr: "Séparateurs", en: "Separators", de: "Trennlinien", it: "Separatori" },
  },
  table: {
    title: { fr: "Tableaux", en: "Tables", de: "Tabellen", it: "Tabelle" },
  },
  tableAlign: {
    title: {
      fr: "Alignement des colonnes",
      en: "Column alignment",
      de: "Spaltenausrichtung",
      it: "Allineamento delle colonne",
    },
  },
  taskList: {
    title: {
      fr: "Listes de tâches",
      en: "Task lists",
      de: "Aufgabenlisten",
      it: "Elenchi di attività",
    },
  },
  escape: {
    title: { fr: "Échappement", en: "Escaping", de: "Maskieren", it: "Escape" },
  },
  recap: {
    title: { fr: "Récapitulatif", en: "Summary", de: "Zusammenfassung", it: "Riepilogo" },
  },
  challenge: {
    title: { fr: "Défi final", en: "Final challenge", de: "Abschlussaufgabe", it: "Sfida finale" },
  },
} satisfies Record<string, { title: Record<string, string> }>;

export type ExerciseId = keyof typeof EXERCISES;

/** The ids of the exercises in the order of their declaration. */
export const EXERCISE_IDS = Object.keys(EXERCISES) as ExerciseId[];
