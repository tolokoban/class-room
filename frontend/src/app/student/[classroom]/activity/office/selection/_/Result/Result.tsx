import { Theme, ViewDialog } from "@tolokoban/ui";

import { type KeyStroke } from "../keyboard";
import { useResult } from "./hooks";

import Styles from "./Result.module.css";

const $ = Theme.classNames;

export interface ResultProps {
  className?: string;
  /** Keystrokes of the student. */
  strokes: KeyStroke[];
  /** Best solution, or `null` if it could not be computed. */
  solution: KeyStroke[] | null;
  onRestart(): void;
  onContinue(): void;
}

export function Result({ className, strokes, solution, onRestart, onContinue }: ResultProps) {
  const { tr, rows, score, canContinue, solutionLabels } = useResult(strokes, solution);
  return (
    <ViewDialog
      className={$.join(className, Styles.result)}
      title={tr.title}
      buttonCancel={{ children: tr.restart, onClick: onRestart }}
      buttonValidate={{ children: tr.continue, enabled: canContinue, onClick: onContinue }}
    >
      <table>
        <thead>
          <tr>
            <th>{tr.key}</th>
            <th>{tr.count}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td>{row.label}</td>
              <td>{row.count}</td>
              <td>{row.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {solution ? (
        <>
          <p>{tr.summary$(`${strokes.length}`, `${solution.length}`)}</p>
          <p className={Styles.score}>{tr.score$(`${score}`)}</p>
        </>
      ) : (
        <p>{tr.unavailable}</p>
      )}
      {solutionLabels && (
        <div className={Styles.solution}>
          <div>{tr.solution}</div>
          <ol>
            {solutionLabels.map((label, index) => (
              <li key={index}>{label}</li>
            ))}
          </ol>
        </div>
      )}
    </ViewDialog>
  );
}
