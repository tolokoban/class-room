import { Theme } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./ScoreCell.module.css";

const $ = Theme.classNames;

/** Below or equal to this score, the student could not go to the next exercise. */
const MIN_SCORE = 80;

export interface ScoreCellProps {
  className?: string;
  /** Percentage, or `undefined` if the exercise has not been done. */
  score: number | undefined;
}

export function ScoreCell({ className, score }: ScoreCellProps) {
  const tr = useTranslation();
  return (
    <td
      className={$.join(className, Styles.scoreCell)}
      data-low={score !== undefined && score <= MIN_SCORE}
    >
      {score === undefined ? "—" : tr.score$(`${score}`)}
    </td>
  );
}
