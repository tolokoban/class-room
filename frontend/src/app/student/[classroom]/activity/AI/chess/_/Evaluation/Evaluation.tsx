import { Theme } from "@tolokoban/ui";

import Styles from "./Evaluation.module.css";

const $ = Theme.classNames;

export interface EvaluationProps {
  className?: string;
  value: number;
}

/** Evaluation of a board: positive is good for the whites, negative for the blacks. */
export function Evaluation({ className, value }: EvaluationProps) {
  return (
    <div
      className={$.join(
        className,
        Styles.evaluation,
        value > 0 && Styles.white,
        value < 0 && Styles.black,
      )}
    >
      {formatEvaluation(value)}
    </div>
  );
}

function formatEvaluation(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}
