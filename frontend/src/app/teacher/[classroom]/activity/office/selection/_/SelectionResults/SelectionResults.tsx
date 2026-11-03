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
                <th>{tr.student}</th>
                {exercises.map(({ id, title }) => (
                  <th key={id}>{title}</th>
                ))}
                <th>{tr.average}</th>
              </tr>
            </thead>
            <tbody>
              {students.map(({ nickname, scores, average }) => (
                <tr key={nickname}>
                  <th>{nickname}</th>
                  {exercises.map(({ id }) => (
                    <ScoreCell key={id} score={scores[id]} />
                  ))}
                  <ScoreCell score={average} />
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>{tr.average}</th>
                {exercises.map(({ id }, index) => (
                  <ScoreCell key={id} score={averages[index]} />
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
