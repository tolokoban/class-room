import { ViewButton } from "@tolokoban/ui";

import { CopyButton } from "./_/CopyButton";
import { Done } from "./_/Done";
import { HelpButton } from "./_/HelpButton";
import { useSpreadsheetActivity } from "./_/hooks";
import { Navigation } from "./_/Navigation";
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
        {exercise && <HelpButton notions={exercise.notions} />}
        {exercise && <Navigation {...activity.navigation} />}
      </header>
      {exercise ? (
        <main>
          <section>
            <header>
              {tr.yourSheet}
              <CopyButton cells={activity.cells} />
            </header>
            <Sheet
              key={progress.index}
              cells={activity.cells}
              wrongCells={activity.wrongCells}
              onChange={activity.handleChange}
            />
          </section>
          <section>
            <header>
              {tr.expected}
              <ViewButton color="secondary-5" onClick={activity.handleCheck}>
                {tr.check}
              </ViewButton>
            </header>
            <Sheet
              key={progress.index}
              cells={exercise.expected}
              readOnly
              copyValuesOnly
              noCopy={exercise.nocopy}
              formulaHints
              hideFormulas
            />
          </section>
        </main>
      ) : (
        <Done onRestart={activity.handleRestartAll} />
      )}
    </div>
  );
}
