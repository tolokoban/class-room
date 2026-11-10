import { click, type Click, ctrlClick, ctrlShiftClick, emptyClick, shiftClick } from "./_/explorer";

export interface Exercise {
  title: Record<string, string>;
  /** Indexes (starting at 0) of the files selected at the beginning. */
  initial: number[];
  /** File from which a `Shift`-click starts. Default to the first of `initial`. */
  anchor?: number;
  /** Indexes (starting at 0) of the files to select. */
  expected: number[];
  /** One of the shortest solutions. Its length is checked by `exercises.test.ts`. */
  solution: Click[];
}

/**
 * Exercises, sorted by increasing number of clicks needed.
 * Files are identified by their index (starting at 0) in `FILES`.
 */
export const EXERCISES: Record<string, Exercise> = {
  oneFile: {
    title: {
      fr: "Un seul fichier",
      en: "A single file",
      de: "Eine einzige Datei",
      it: "Un solo file",
    },
    initial: [],
    expected: [11],
    solution: [click(11)],
  },
  thirdFile: {
    title: {
      fr: "Le troisième fichier",
      en: "The third file",
      de: "Die dritte Datei",
      it: "Il terzo file",
    },
    initial: range(0, 9),
    expected: [2],
    solution: [click(2)],
  },
  unselectAll: {
    title: {
      fr: "Tout désélectionner",
      en: "Deselect everything",
      de: "Alles abwählen",
      it: "Deselezionare tutto",
    },
    initial: range(4, 8),
    expected: [],
    solution: [emptyClick()],
  },
  extendSelection: {
    title: {
      fr: "Agrandir la sélection",
      en: "Extend the selection",
      de: "Die Auswahl erweitern",
      it: "Estendere la selezione",
    },
    initial: range(0, 4),
    expected: range(0, 11),
    solution: [shiftClick(11)],
  },
  addFile: {
    title: {
      fr: "Ajouter un fichier",
      en: "Add a file",
      de: "Eine Datei hinzufügen",
      it: "Aggiungere un file",
    },
    initial: [3],
    expected: [3, 10],
    solution: [ctrlClick(10)],
  },
  removeFile: {
    title: {
      fr: "Retirer un fichier",
      en: "Remove a file",
      de: "Eine Datei entfernen",
      it: "Togliere un file",
    },
    initial: range(0, 9),
    expected: without(range(0, 9), 5),
    solution: [ctrlClick(5)],
  },
  firstTen: {
    title: {
      fr: "Les dix premiers fichiers",
      en: "The first ten files",
      de: "Die ersten zehn Dateien",
      it: "I primi dieci file",
    },
    initial: [],
    expected: range(0, 9),
    solution: [click(0), shiftClick(9)],
  },
  twoFiles: {
    title: {
      fr: "Deux fichiers éloignés",
      en: "Two distant files",
      de: "Zwei entfernte Dateien",
      it: "Due file lontani",
    },
    initial: [],
    expected: [3, 12],
    solution: [click(3), ctrlClick(12)],
  },
  lastFiles: {
    title: {
      fr: "Les six derniers fichiers",
      en: "The last six files",
      de: "Die letzten sechs Dateien",
      it: "Gli ultimi sei file",
    },
    initial: [2],
    expected: range(14, 19),
    solution: [click(14), shiftClick(19)],
  },
  removeTwo: {
    title: {
      fr: "Tout sauf deux fichiers",
      en: "All but two files",
      de: "Alle außer zwei Dateien",
      it: "Tutti tranne due file",
    },
    initial: range(0, 19),
    expected: without(range(0, 19), 5, 12),
    solution: [ctrlClick(5), ctrlClick(12)],
  },
  pdf: {
    title: {
      fr: "Tous les PDF",
      en: "All the PDFs",
      de: "Alle PDFs",
      it: "Tutti i PDF",
    },
    initial: [],
    expected: [2, 4, 13],
    solution: [click(2), ctrlClick(4), ctrlClick(13)],
  },
  blockAndFile: {
    title: {
      fr: "Un bloc et un fichier",
      en: "A block and a file",
      de: "Ein Block und eine Datei",
      it: "Un blocco e un file",
    },
    initial: [],
    expected: [...range(0, 5), 11],
    solution: [click(0), shiftClick(5), ctrlClick(11)],
  },
  blockWithHole: {
    title: {
      fr: "Un bloc avec un trou",
      en: "A block with a hole",
      de: "Ein Block mit einer Lücke",
      it: "Un blocco con un buco",
    },
    initial: [],
    expected: without(range(4, 12), 8),
    solution: [click(4), shiftClick(12), ctrlClick(8)],
  },
  images: {
    title: {
      fr: "Toutes les images",
      en: "All the pictures",
      de: "Alle Bilder",
      it: "Tutte le immagini",
    },
    initial: [],
    expected: [7, 9, 15, 19],
    solution: [click(7), ctrlClick(9), ctrlClick(15), ctrlClick(19)],
  },
  twoBlocks: {
    title: {
      fr: "Deux blocs",
      en: "Two blocks",
      de: "Zwei Blöcke",
      it: "Due blocchi",
    },
    initial: [],
    expected: [...range(1, 4), ...range(12, 16)],
    solution: [click(1), shiftClick(4), ctrlClick(12), ctrlShiftClick(16)],
  },
  blockWithTwoHoles: {
    title: {
      fr: "Un bloc avec deux trous",
      en: "A block with two holes",
      de: "Ein Block mit zwei Lücken",
      it: "Un blocco con due buchi",
    },
    initial: [7],
    expected: without(range(2, 15), 6, 11),
    solution: [click(2), shiftClick(15), ctrlClick(6), ctrlClick(11)],
  },
  wordAndPdf: {
    title: {
      fr: "Les documents Word et PDF",
      en: "The Word and PDF documents",
      de: "Die Word- und PDF-Dokumente",
      it: "I documenti Word e PDF",
    },
    initial: [],
    expected: [...range(1, 5), 8, 12, 13],
    solution: [click(1), shiftClick(5), ctrlClick(8), ctrlClick(12), ctrlClick(13)],
  },
  allButImages: {
    title: {
      fr: "Tout sauf les images",
      en: "Everything but the pictures",
      de: "Alles außer den Bildern",
      it: "Tutto tranne le immagini",
    },
    initial: [],
    expected: without(range(0, 19), 7, 9, 15, 19),
    solution: [click(0), shiftClick(18), ctrlClick(7), ctrlClick(9), ctrlClick(15)],
  },
  word: {
    title: {
      fr: "Tous les documents Word",
      en: "All the Word documents",
      de: "Alle Word-Dokumente",
      it: "Tutti i documenti Word",
    },
    initial: range(10, 14),
    expected: [1, 3, 5, 8, 12],
    solution: [click(1), ctrlClick(3), ctrlClick(5), ctrlClick(8), ctrlClick(12)],
  },
  threeBlocks: {
    title: {
      fr: "Trois blocs",
      en: "Three blocks",
      de: "Drei Blöcke",
      it: "Tre blocchi",
    },
    initial: [],
    expected: [...range(0, 2), ...range(8, 10), ...range(16, 19)],
    solution: [
      click(0),
      shiftClick(2),
      ctrlClick(8),
      ctrlShiftClick(10),
      ctrlClick(16),
      ctrlShiftClick(19),
    ],
  },
};

/** @returns The integers from `first` to `last` (both included). */
function range(first: number, last: number): number[] {
  return Array.from({ length: last - first + 1 }, (_, index) => first + index);
}

function without(files: number[], ...removed: number[]): number[] {
  return files.filter((file) => !removed.includes(file));
}
