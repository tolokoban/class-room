import React from "react";

import { QuizItemQCM } from "@/types";

/**
 * Id of the correct choice whose answer is revealed.
 * It is reset as soon as `item` changes.
 */
export function useRevealedAnswer(item: QuizItemQCM) {
  const [revealed, setRevealed] = React.useState<{ item: QuizItemQCM; id: string } | null>(null);
  const revealedId = revealed?.item === item ? revealed.id : null;

  return {
    revealedId,
    toggle: (id: string) => setRevealed(id === revealedId ? null : { item, id }),
  };
}
