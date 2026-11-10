import { CopyButton } from "./_/CopyButton";
import { Done } from "./_/Done";
import { useSpreadsheetActivity } from "./_/hooks";
import { Sheet } from "./_/Sheet";
import { useTranslation } from "./_/translation";

import Styles from "./page.module.css";

export default function Page() {
  const tr = useTranslation();
  const activity = useSpreadsheetActivity();
  const { exercise, progress } = activity;
  return (
    <div className={Styles.page}>
      <header>
        <h1>
          {exercise && (
            <span>
              <b>{progress.index}</b> / {progress.count}
            </span>
          )}
          {tr.title}
          {exercise && ` — ${activity.title}`}
        </h1>
      </header>
      {exercise ? (
        <main>
          <section>
            <header>
              {tr.yourSheet}
              <CopyButton cells={activity.cells} />
            </header>
            <Sheet key={progress.index} cells={activity.cells} onChange={activity.handleChange} />
          </section>
          <section>
            <header>{tr.expected}</header>
            <Sheet key={progress.index} cells={exercise.expected} readOnly formulaHints />
          </section>
        </main>
      ) : (
        <Done onRestart={activity.handleRestartAll} />
      )}
    </div>
  );
}
