import React from "react";

import type { ChessBoard, ChessColor, ChessPieceType, ChessSquare } from "../chess";

const FILES = "abcdefgh";

export interface SquareItem {
  square: ChessSquare;
  x: number;
  y: number;
  light: boolean;
}

/** The 64 squares, "a8" being on the top left corner. */
export const SQUARES: SquareItem[] = Array.from({ length: 64 }, (_, index) => {
  const x = index % 8;
  const y = Math.floor(index / 8);
  return {
    square: `${FILES.charAt(x)}${8 - y}` as ChessSquare,
    x,
    y,
    light: (x + y) % 2 === 0,
  };
});

export interface PieceItem {
  color: ChessColor;
  type: ChessPieceType;
  square: ChessSquare;
}

export function useChessBoard(value: ChessBoard) {
  return React.useMemo(() => {
    const pieces: PieceItem[] = (["white", "black"] as ChessColor[]).flatMap((color) =>
      Object.entries(value.pieces[color]).map(([square, type]) => ({
        color,
        type,
        square: square as ChessSquare,
      })),
    );
    const { lastMove } = value;
    const highlighted = SQUARES.filter(
      ({ square }) => square === lastMove?.from || square === lastMove?.to,
    );
    return { pieces, highlighted };
  }, [value]);
}
