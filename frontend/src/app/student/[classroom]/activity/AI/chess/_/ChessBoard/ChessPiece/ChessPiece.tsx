import { Theme } from "@tolokoban/ui";

import { CHESS_GLYPHS, type ChessColor, type ChessPieceType, type ChessSquare } from "../../chess";

import Styles from "./ChessPiece.module.css";

const $ = Theme.classNames;

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
      {CHESS_GLYPHS[type]}
    </text>
  );
}
