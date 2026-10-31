import { useLangValue } from "@tolokoban/react-state";
import { Theme } from "@tolokoban/ui";

import { QuizItemQCM } from "@/types";
import { MultiLang } from "@/utils/multilang";
import { useRevealedAnswer } from "./hooks";
import { ResultsRow } from "./ResultsRow";

import Styles from "./ResultsGrid.module.css";

const $ = Theme.classNames;

export interface ResultsGridProps {
  className?: string;
  item: QuizItemQCM;
  /** Percentage of the students that selected `choiceId`. */
  percent(this: void, choiceId: string): number;
}

export function ResultsGrid({ className, item, percent }: ResultsGridProps) {
  const lang = useLangValue();
  const { revealedId, toggle } = useRevealedAnswer(item);

  return (
    <div className={$.join(className, Styles.resultsGrid)}>
      {Object.entries(item.choices).map(([id, value]) => (
        <ResultsRow
          key={id}
          choice={MultiLang.get(value, lang)}
          answer={id in item.answers ? MultiLang.get(item.answers[id], lang) : undefined}
          percent={percent(id)}
          revealed={revealedId === id}
          onCheck={() => toggle(id)}
        />
      ))}
    </div>
  );
}
