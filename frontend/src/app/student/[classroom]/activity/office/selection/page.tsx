import { Done } from "./_/Done";
import { Editor } from "./_/Editor";
import { Header } from "./_/Header";
import { useSelectionActivity } from "./_/hooks";
import { RichText } from "./_/RichText";
import { useTranslation } from "./_/translation";

import Styles from "./page.module.css";

export default function Page() {
  const tr = useTranslation();
  const activity = useSelectionActivity();
  if (!activity.exercise) {
    return (
      <div className={Styles.page}>
        <Header
          title=""
          strokes={null}
          onRestart={activity.handleRestartAll}
          onResults={activity.handleResults}
        />
        <Done onRestart={activity.handleRestartAll} />
      </div>
    );
  }
  return (
    <div className={Styles.page}>
      <Header
        title={activity.title}
        progress={activity.progress}
        strokes={activity.strokes}
        onRestart={activity.handleRestart}
        onResults={activity.handleResults}
      />
      <main>
        <section>
          <header>{tr.yourText}</header>
          <Editor
            value={activity.editor}
            focusKey={activity.focusKey}
            onKeyStroke={activity.handleKeyStroke}
          />
        </section>
        <section>
          <header>{tr.expected}</header>
          {/* Same structure as the editor, to get exactly the same line wrapping. */}
          <div>
            <RichText value={activity.expected} />
          </div>
        </section>
      </main>
    </div>
  );
}
