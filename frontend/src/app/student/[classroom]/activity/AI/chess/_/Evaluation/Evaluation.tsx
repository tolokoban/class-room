import { Theme } from "@tolokoban/ui";

import type { ChessBoard } from "../chess";
import { MissingPieces } from "./MissingPieces";

import Styles from "./Evaluation.module.css";

const $ = Theme.classNames;

export interface EvaluationProps {
  className?: string;
  board: ChessBoard;
  value: number;
}

/**
 * Evaluation of a board (positive is good for the whites, negative for the blacks),
 * with the pieces each player has lost.
 */
export function Evaluation({ className, board, value }: EvaluationProps) {
  return (
    <div className={$.join(className, Styles.evaluation)}>
      <div className={$.join(value > 0 && Styles.white, value < 0 && Styles.black)}>
        {formatEvaluation(value)}
      </div>
      <MissingPieces board={board} />
    </div>
  );
}

function formatEvaluation(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}
