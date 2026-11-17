import { CodePane } from "./_/CodePane";
import { Done } from "./_/Done";
import { Header } from "./_/Header";
import { useMarkdownActivity } from "./_/hooks";
import { Preview } from "./_/Preview";
import { useTranslation } from "./_/translation";

import Styles from "./page.module.css";

export default function Page() {
  const tr = useTranslation();
  const activity = useMarkdownActivity();
  if (!activity.exerciseId) {
    return (
      <div className={Styles.page}>
        <Header title="" onPrevious={activity.handlePrevious} onResults={activity.handleResults} />
        <Done onRestart={activity.handleRestartAll} />
      </div>
    );
  }
  return (
    <div className={Styles.page}>
      <Header
        title={activity.title}
        progress={activity.progress}
        done={activity.done}
        helpSection={activity.exerciseId}
        onPrevious={activity.handlePrevious}
        onNext={activity.handleNext}
        onResults={activity.handleResults}
      />
      <main>
        <CodePane
          // A new exercise starts with the code, not the preview.
          key={activity.exerciseId}
          value={activity.code}
          onChange={activity.handleChange}
          onReset={activity.handleReset}
          highlight={activity.difference?.student}
        />
        <section>
          <header>
            <span>{tr.expected}</span>
          </header>
          <div>
            <Preview value={activity.expected} highlight={activity.difference?.expected} />
          </div>
        </section>
      </main>
    </div>
  );
}
