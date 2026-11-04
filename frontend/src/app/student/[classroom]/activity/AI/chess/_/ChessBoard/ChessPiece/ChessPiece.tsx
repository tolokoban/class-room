import { Theme } from "@tolokoban/ui";

import type { ChessColor, ChessPieceType, ChessSquare } from "../../chess";

import Styles from "./ChessPiece.module.css";

const $ = Theme.classNames;

/**
 * We always use the "black" (filled) glyphs and paint them in white or black.
 * The U+FE0E selector prevents the browser from displaying them as emojis.
 */
const GLYPHS: Record<ChessPieceType, string> = {
  king: "♚︎",
  queen: "♛︎",
  rook: "♜︎",
  bishop: "♝︎",
  knight: "♞︎",
  pawn: "♟︎",
};

export interface ChessPieceProps {
  className?: string;
  color: ChessColor;
  type: ChessPieceType;
  square: ChessSquare;
}

export function ChessPiece({ className, color, type, square }: ChessPieceProps) {
  const x = "abcdefgh".indexOf(square.charAt(0)) + 0.5;
  const y = 8 - Number(square.charAt(1)) + 0.55;
  return (
    <text
      className={$.join(className, Styles.chessPiece, Styles[color])}
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {GLYPHS[type]}
    </text>
  );
}
