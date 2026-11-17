import type { ExerciseId } from "../../exercises";
import DE from "./content.de";
import EN from "./content.en";
import FR from "./content.fr";
import IT from "./content.it";

/** Expected Markdown code of each exercise, per language. */
export const CONTENT: Record<string, Record<ExerciseId, string>> = {
  fr: FR,
  en: EN,
  de: DE,
  it: IT,
};

/** @returns The expected Markdown code of an exercise, in French if `lang` is not supported. */
export function getContent(id: ExerciseId, lang: string): string {
  return (CONTENT[lang] ?? FR)[id];
}
