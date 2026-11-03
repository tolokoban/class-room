import { Theme } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./Score.module.css";

const $ = Theme.classNames;

export interface ScoreProps {
  className?: string;
  /** Number of times the user told the perceptron which digit it was shown. */
  answers: number;
  /** Number of answers for which the perceptron had guessed the right digit. */
  successes: number;
}

/**
 * Accuracy of the perceptron so far.
 */
export function Score({ className, answers, successes }: ScoreProps) {
  const tr = useTranslation();
  const percent = answers > 0 ? Math.round((100 * successes) / answers) : 0;
  return (
    <div className={$.join(className, Styles.score)}>
      {tr.score$(`${successes}`, `${answers}`, `${percent}`)}
    </div>
  );
}
