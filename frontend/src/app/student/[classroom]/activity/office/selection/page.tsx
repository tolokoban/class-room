import React from "react";

import { Done } from "./_/Done";
import { Editor } from "./_/Editor";
import { Header } from "./_/Header";
import { useSelectionActivity } from "./_/hooks";
import { InvisiblesToggle } from "./_/InvisiblesToggle";
import { RichText } from "./_/RichText";
import { useTranslation } from "./_/translation";

import Styles from "./page.module.css";

export default function Page() {
  const tr = useTranslation();
  const activity = useSelectionActivity();
  const [showInvisibles, setShowInvisibles] = React.useState(false);
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
          <header>
            <span>{tr.yourText}</span>
            <InvisiblesToggle value={showInvisibles} onChange={setShowInvisibles} />
          </header>
          <Editor
            value={activity.editor}
            focusKey={activity.focusKey}
            onKeyStroke={activity.handleKeyStroke}
            showInvisibles={showInvisibles}
          />
        </section>
        <section>
          <header>
            <span>{tr.expected}</span>
            <InvisiblesToggle value={showInvisibles} onChange={setShowInvisibles} />
          </header>
          {/* Same structure as the editor, to get exactly the same line wrapping. */}
          <div>
            <RichText value={activity.expected} showInvisibles={showInvisibles} />
          </div>
        </section>
      </main>
    </div>
  );
}
