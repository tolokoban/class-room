import { Theme, ViewDialog } from "@tolokoban/ui";

import { ClickLabel } from "../ClickLabel";
import { type Click } from "../explorer";
import { useResult } from "./hooks";

import Styles from "./Result.module.css";

const $ = Theme.classNames;

export interface ResultProps {
  className?: string;
  /** Number of clicks of the student. */
  clicks: number;
  /** One of the shortest solutions. */
  solution: Click[];
  onRestart(): void;
  onContinue(): void;
}

export function Result({ className, clicks, solution, onRestart, onContinue }: ResultProps) {
  const { tr, score, canContinue, steps } = useResult(clicks, solution);
  return (
    <ViewDialog
      className={$.join(className, Styles.result)}
      title={tr.title}
      buttonCancel={{ children: tr.restart, onClick: onRestart }}
      buttonValidate={{ children: tr.continue, enabled: canContinue, onClick: onContinue }}
    >
      <p>{tr.summary$(`${clicks}`, `${solution.length}`)}</p>
      <p className={Styles.score}>{tr.score$(`${score}`)}</p>
      {!canContinue && <p>{tr.tryAgain}</p>}
      {steps && (
        <div className={Styles.solution}>
          <div>{tr.solution}</div>
          <ol>
            {steps.map((step, index) => (
              <li key={index}>
                <ClickLabel ctrl={step.ctrl} shift={step.shift} file={step.name} />
              </li>
            ))}
          </ol>
        </div>
      )}
    </ViewDialog>
  );
}
