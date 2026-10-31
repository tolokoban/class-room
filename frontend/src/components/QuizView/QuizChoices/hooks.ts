import React from "react";

import { QuizItemQCM } from "@/types";

/**
 * Id of the correct choice the teacher clicked on to see its answer.
 * It is reset as soon as `item` changes.
 */
export function useRevealedAnswer(item: QuizItemQCM) {
  const [revealed, setRevealed] = React.useState<{ item: QuizItemQCM; id: string } | null>(null);
  return {
    revealedId: revealed?.item === item ? revealed.id : null,
    reveal: (id: string) => setRevealed({ item, id }),
    hide: () => setRevealed(null),
  };
}
