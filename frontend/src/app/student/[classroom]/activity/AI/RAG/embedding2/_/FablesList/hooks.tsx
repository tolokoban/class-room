import { useModal } from "@tolokoban/ui";

import { FABLES } from "../data/fables";
import type { Author, Fable } from "../types";
import { FablesList } from "./FablesList";

/**
 * Returns a function that opens a modal with the titles of the fables,
 * in two columns: the ancient authors (Ésope and Phèdre) and La Fontaine.
 */
export function useShowFablesList() {
  const modal = useModal();
  return () => {
    const hide = modal.show({
      content: <FablesList onClose={() => hide()} />,
    });
  };
}

/**
 * The fables of some authors, sorted alphabetically by title (French collation).
 */
export function getFables(authors: Author[]): Fable[] {
  return FABLES.filter((fable) => authors.includes(fable.author)).sort((a, b) =>
    a.title.localeCompare(b.title, "fr"),
  );
}
