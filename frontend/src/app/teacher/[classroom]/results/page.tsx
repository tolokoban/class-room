import { ViewSpinner } from "@tolokoban/ui";

import { useRouteParamAsString } from "@/app/routes";
import { ResultsView } from "./_/ResultsView";
import { useCurrentQuiz } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./page.module.css";

/**
 * Statistics of the answers of the students
 * to the quiz of the current activity of a class room.
 */
export default function Page() {
  const tr = useTranslation();
  const classroom = useRouteParamAsString("classroom");
  const { isLoading, error, code, quiz } = useCurrentQuiz(classroom);

  return (
    <div className={Styles.page}>
      {isLoading && <ViewSpinner />}
      {error && <p className={Styles.error}>{error.message}</p>}
      {code === null && <p>{tr.none}</p>}
      {code && quiz === null && <p>{tr.notQuiz}</p>}
      {code && quiz && (
        <ResultsView key={code} classroom={classroom} activityCode={code} quiz={quiz} />
      )}
    </div>
  );
}
