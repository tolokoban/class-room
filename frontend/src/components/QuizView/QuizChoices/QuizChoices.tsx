import React from "react";
import { useLangValue } from "@tolokoban/react-state";
import { Theme } from "@tolokoban/ui";

import { Md } from "@/components/Md";

import Styles from "./QuizChoices.module.css";
import { MultiLang } from "@/utils/multilang";

const $ = Theme.classNames;

export interface QuizChoicesProps {
  className?: string;
  choices: { [id: string]: React.ReactNode | { [lang: string]: string } };
  /** Ids of the selected choices. */
  selection: string[];
  onToggle(this: void, choiceId: string): void;
}

export function QuizChoices({ className, choices, selection, onToggle }: QuizChoicesProps) {
  const lang = useLangValue();
  return (
    <div className={$.join(className, Styles.quizChoices)}>
      {Object.entries(choices)
        .map(([id, value]) => [id, MultiLang.get(value, lang)] as const)
        .map(([id, choice]) => (
          <button
            key={id}
            type="button"
            className={$.join(selection.includes(id) && Styles.selected)}
            aria-pressed={selection.includes(id)}
            onClick={() => onToggle(id)}
          >
            {typeof choice === "string" ? <Md value={choice} /> : choice}
          </button>
        ))}
    </div>
  );
}
