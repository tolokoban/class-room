import { Theme } from "@tolokoban/ui";

import type { ChessBoard as ChessBoardValue } from "../chess";
import { ChessBoard } from "../ChessBoard";
import { Evaluation } from "../Evaluation";
import { useTranslation } from "./translation";

import Styles from "./Position.module.css";

const $ = Theme.classNames;

export interface PositionProps {
  className?: string;
  board: ChessBoardValue;
  evaluation: number;
}

/** The current position, with its evaluation. */
export function Position({ className, board, evaluation }: PositionProps) {
  const tr = useTranslation();
  return (
    <section className={$.join(className, Styles.position)}>
      <ChessBoard value={board} />
      <Evaluation board={board} value={evaluation} />
      <p>{board.turn === "white" ? tr.whiteToPlay : tr.blackToPlay}</p>
    </section>
  );
}
