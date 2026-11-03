import { Theme, ViewButton, ViewSpinner } from "@tolokoban/ui";

import { useSelectionResults } from "./hooks";
import { ScoreCell } from "./ScoreCell";
import { useTranslation } from "./translation";

import Styles from "./SelectionResults.module.css";

const $ = Theme.classNames;

export interface SelectionResultsProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
}

export function SelectionResults({ className, classroom }: SelectionResultsProps) {
  const tr = useTranslation();
  const { isLoading, error, exercises, students, averages, handleBack } =
    useSelectionResults(classroom);
  return (
    <div className={$.join(className, Styles.selectionResults)}>
      <header>
        <h1>{tr.title}</h1>
        <ViewButton color="secondary-5" onClick={handleBack}>
          {tr.back}
        </ViewButton>
      </header>
      <main>
        {isLoading && <ViewSpinner />}
        {error && <p className={Styles.error}>{error.message}</p>}
        {!isLoading && students.length === 0 && <p>{tr.none}</p>}
        {students.length > 0 && (
          <table>
            <thead>
              <tr>
                <th />
                {students.map(({ nickname }) => (
                  <th key={nickname} title={nickname}>
                    <div>{nickname}</div>
                  </th>
                ))}
                <th title={tr.average}>
                  <div>{tr.average}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {exercises.map(({ id, title }, index) => (
                <tr key={id}>
                  <th>{title}</th>
                  {students.map(({ nickname, scores }) => (
                    <ScoreCell key={nickname} score={scores[id]} />
                  ))}
                  <ScoreCell score={averages[index]} />
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>{tr.average}</th>
                {students.map(({ nickname, average }) => (
                  <ScoreCell key={nickname} score={average} />
                ))}
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </main>
    </div>
  );
}
