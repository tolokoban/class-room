import { type Exercise } from "./_/exercise";

/**
 * Exercises, in the order they are given to the students.
 *
 * Cells use english function names, a dot as decimal separator
 * and a comma between function arguments: `"=SUM(A1:A3, 2.5)"`.
 */
export const EXERCISES: Record<string, Exercise> = {
  firstFormula: {
    title: {
      fr: "Première formule",
      en: "First formula",
      de: "Erste Formel",
      it: "Prima formula",
    },
    expected: {
      A1: "7",
      A2: "=A1*2",
    },
  },
};
