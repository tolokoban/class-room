import React from "react";
import { IconCheck, Theme, ViewFloatingButton } from "@tolokoban/ui";

import { Md } from "@/components/Md";

import Styles from "./QuizChoice.module.css";

const $ = Theme.classNames;

export interface QuizChoiceProps {
  className?: string;
  choice: React.ReactNode;
  selected?: boolean;
  onClick?(this: void): void;
  /** If defined, a check button is displayed on the top right corner. */
  onCheck?(this: void): void;
}

export function QuizChoice({ className, choice, selected = false, onClick, onCheck }: QuizChoiceProps) {
  return (
    <div className={$.join(className, Styles.quizChoice, selected && Styles.selected)}>
      <button type="button" className={Styles.choice} aria-pressed={selected} onClick={onClick}>
        {typeof choice === "string" ? <Md value={choice} /> : choice}
      </button>
      {onCheck && (
        <div className={Styles.check}>
          <ViewFloatingButton
            icon={IconCheck}
            size="S"
            color="secondary-5"
            colorHover="secondary-6"
            onClick={onCheck}
          />
        </div>
      )}
    </div>
  );
}
