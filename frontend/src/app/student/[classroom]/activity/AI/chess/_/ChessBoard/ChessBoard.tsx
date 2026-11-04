import { Theme } from "@tolokoban/ui";

import type { ChessBoard as ChessBoardValue } from "../chess";
import { ChessPiece } from "./ChessPiece";
import { SQUARES, useChessBoard } from "./hooks";

import Styles from "./ChessBoard.module.css";

const $ = Theme.classNames;

export interface ChessBoardProps {
  className?: string;
  value: ChessBoardValue;
}

export function ChessBoard({ className, value }: ChessBoardProps) {
  const { pieces, highlighted } = useChessBoard(value);
  return (
    <svg className={$.join(className, Styles.chessBoard)} viewBox="0 0 8 8">
      {SQUARES.map(({ square, x, y, light }) => (
        <rect
          key={square}
          x={x}
          y={y}
          width={1}
          height={1}
          className={light ? Styles.light : Styles.dark}
        />
      ))}
      {highlighted.map(({ square, x, y }) => (
        <rect key={square} x={x} y={y} width={1} height={1} className={Styles.highlight} />
      ))}
      {pieces.map(({ color, type, square }) => (
        <ChessPiece key={square} color={color} type={type} square={square} />
      ))}
    </svg>
  );
}
