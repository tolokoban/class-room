import { useLangValue } from "@tolokoban/react-state";
import { Theme } from "@tolokoban/ui";

import { isTeacher, State } from "@/state";
import { QuizItemQCM } from "@/types";
import { MultiLang } from "@/utils/multilang";
import { useRevealedAnswer } from "./hooks";
import { QuizAnswer } from "./QuizAnswer";
import { QuizChoice } from "./QuizChoice";

import Styles from "./QuizChoices.module.css";

const $ = Theme.classNames;

export interface QuizChoicesProps {
  className?: string;
  item: QuizItemQCM;
  /** Ids of the selected choices. */
  selection: string[];
  onToggle(this: void, choiceId: string): void;
}

export function QuizChoices({ className, item, selection, onToggle }: QuizChoicesProps) {
  const lang = useLangValue();
  const teacher = isTeacher(State.user.useValue());
  const { revealedId, reveal, hide } = useRevealedAnswer(item);
  if (teacher && revealedId !== null) {
    return (
      <QuizAnswer
        className={className}
        choice={MultiLang.get(item.choices[revealedId], lang)}
        answer={MultiLang.get(item.answers[revealedId], lang)}
        onBack={hide}
      />
    );
  }
  return (
    <div className={$.join(className, Styles.quizChoices)}>
      {Object.entries(item.choices).map(([id, value]) => (
        <QuizChoice
          key={id}
          choice={MultiLang.get(value, lang)}
          selected={selection.includes(id)}
          onClick={() => onToggle(id)}
          onCheck={teacher && id in item.answers ? () => reveal(id) : undefined}
        />
      ))}
    </div>
  );
}
