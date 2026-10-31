import React from "react";
import { Theme, ViewButton } from "@tolokoban/ui";

import { Md } from "@/components/Md";
import { QuizChoice } from "../QuizChoice";
import { useTranslation } from "./translation";

import Styles from "./QuizAnswer.module.css";

const $ = Theme.classNames;

export interface QuizAnswerProps {
  className?: string;
  choice: React.ReactNode;
  /** Explanation of why this choice is correct. */
  answer: React.ReactNode;
  onBack(this: void): void;
}

export function QuizAnswer({ className, choice, answer, onBack }: QuizAnswerProps) {
  const tr = useTranslation();
  return (
    <div className={$.join(className, Styles.quizAnswer)}>
      <QuizChoice choice={choice} />
      <div>{typeof answer === "string" ? <Md value={answer} /> : answer}</div>
      <ViewButton color="secondary-5" onClick={onBack}>
        {tr.back}
      </ViewButton>
    </div>
  );
}
