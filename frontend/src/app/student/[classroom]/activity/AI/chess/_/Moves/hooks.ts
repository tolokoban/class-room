import React from "react";

import { type ChessBoard, chessBoardIsInCheck } from "../chess";
import { useTranslation } from "./translation";

export function useMovesTitle(board: ChessBoard, count: number): string {
  const tr = useTranslation();
  if (count > 0) {
    return board.turn === "white" ? tr.whiteMoves$(`${count}`) : tr.blackMoves$(`${count}`);
  }
  return chessBoardIsInCheck(board) ? tr.checkmate : tr.stalemate;
}

/** Scroll back to the top of the list when the position changes. */
export function useMovesList(board: ChessBoard) {
  const ref = React.useRef<HTMLUListElement | null>(null);
  React.useEffect(() => {
    ref.current?.scrollTo({ top: 0 });
  }, [board]);
  return ref;
}
