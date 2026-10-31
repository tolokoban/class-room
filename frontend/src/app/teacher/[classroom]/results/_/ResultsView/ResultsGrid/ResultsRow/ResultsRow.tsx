import React from "react";
import { IconCheck, Theme, ViewFloatingButton } from "@tolokoban/ui";

import { Md } from "@/components/Md";

import Styles from "./ResultsRow.module.css";

const $ = Theme.classNames;

export interface ResultsRowProps {
  className?: string;
  choice: React.ReactNode;
  /** Explanation of why this choice is correct, or `undefined` if it is not. */
  answer?: React.ReactNode;
  /** Percentage of the students that selected this choice. */
  percent: number;
  /** If `true`, the `answer` is displayed below the choice. */
  revealed: boolean;
  onCheck(this: void): void;
}

export function ResultsRow({
  className,
  choice,
  answer,
  percent,
  revealed,
  onCheck,
}: ResultsRowProps) {
  return (
    <div className={$.join(className, Styles.resultsRow)}>
      <div className={Styles.check}>
        {answer !== undefined && (
          <ViewFloatingButton
            icon={IconCheck}
            size="S"
            color={revealed ? "secondary-7" : "secondary-5"}
            colorHover="secondary-6"
            onClick={onCheck}
          />
        )}
      </div>
      <div>{typeof choice === "string" ? <Md value={choice} /> : choice}</div>
      <strong>{percent}%</strong>
      {revealed && (
        <div className={Styles.answer}>
          {typeof answer === "string" ? <Md value={answer} /> : answer}
        </div>
      )}
    </div>
  );
}
