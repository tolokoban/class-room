import { Theme } from "@tolokoban/ui";

import type { FableMatch } from "../search";
import { Result } from "./Result";
import { useTranslation } from "./translation";

import Styles from "./Results.module.css";

const $ = Theme.classNames;

export interface ResultsProps {
  className?: string;
  /** The student's sentence. */
  query: string;
  /** The closest fables, the closest first. */
  results: FableMatch[];
}

/** The closest fables, collapsed: only their title and confidence are shown at first. */
export function Results({ className, query, results }: ResultsProps) {
  const tr = useTranslation();
  return (
    <div className={$.join(className, Styles.results)}>
      <header>{tr.results$(query)}</header>
      {results.map((match) => (
        <Result key={`${match.fable.story}/${match.fable.author}`} match={match} />
      ))}
      <small>{tr.hint}</small>
    </div>
  );
}
