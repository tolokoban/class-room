import { Theme } from "@tolokoban/ui";

import { Chips } from "./Chips";
import { useAnalysis } from "./hooks";

import Styles from "./Analysis.module.css";

const $ = Theme.classNames;

export interface AnalysisProps {
  className?: string;
  /** The question of the student, as typed. */
  question: string;
}

/**
 * Show how a question is understood grammatically: first the normalized sentence
 * with the part of speech of each word, then its word groups (subject, action…).
 * Hover a word or a group to see its name.
 */
export function Analysis({ className, question }: AnalysisProps) {
  const { tr, state, wordChips, groupChips } = useAnalysis(question);
  if (state.status === "loading")
    return <small className={$.join(className, Styles.analysis)}>{tr.analysing}</small>;

  if (state.status === "error")
    return <small className={$.join(className, Styles.analysis)}>{tr.error$(state.message)}</small>;

  return (
    <div className={$.join(className, Styles.analysis)}>
      <span>{tr.normalization}</span>
      <Chips chips={wordChips} />
      <span>{tr.groups}</span>
      <Chips chips={groupChips} />
    </div>
  );
}
