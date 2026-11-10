import { Theme, ViewButton, ViewSpinner } from "@tolokoban/ui";

import { useExerciseScores } from "./hooks";
import { ScoreCell } from "./ScoreCell";
import { useTranslation } from "./translation";

import Styles from "./ExerciseScores.module.css";

const $ = Theme.classNames;

export interface ExerciseScoresProps {
  className?: string;
  title: React.ReactNode;
  /** Code of the class room. */
  classroom: string;
  /** Code under which the results of the activity are stored. */
  activityCode: string;
  /** Exercises of the activity, in display order. */
  exercises: Record<string, { title: Record<string, string> }>;
  onBack(): void;
}

/**
 * Table of the best scores (percentage) of the students, per exercise.
 */
export function ExerciseScores({
  className,
  title,
  classroom,
  activityCode,
  exercises: definition,
  onBack,
}: ExerciseScoresProps) {
  const tr = useTranslation();
  const { isLoading, error, exercises, students, averages } = useExerciseScores(
    classroom,
    activityCode,
    definition,
  );
  return (
    <div className={$.join(className, Styles.exerciseScores)}>
      <header>
        <h1>{title}</h1>
        <ViewButton color="secondary-5" onClick={onBack}>
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
