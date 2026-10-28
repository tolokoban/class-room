import { ViewButton, ViewSpinner } from "@tolokoban/ui";

import { HighlightedMd } from "./_/HighlightedMd";
import { useAnonymous, useLoadingMessage } from "./_/hooks";

import Styles from "./page.module.css";

export default function Page() {
  const { tr, detector, value, entities, busy, handleChange, handleAnonymize } = useAnonymous();
  const loadingMessage = useLoadingMessage(detector);
  return (
    <div className={Styles.page}>
      <header>
        <h1>{tr.title}</h1>
      </header>
      <main>
        <textarea
          value={value}
          placeholder={tr.placeholder}
          spellCheck={false}
          onChange={handleChange}
        />
        <HighlightedMd className={Styles.preview} value={value} entities={entities} />
      </main>
      <footer>
        <div>
          {loadingMessage && <ViewSpinner padding={0}>{loadingMessage}</ViewSpinner>}
          {detector.status === "error" && (
            <span className={Styles.error}>{tr.error$(detector.message)}</span>
          )}
        </div>
        <ViewButton
          color="secondary-5"
          enabled={detector.status === "ready" && !busy}
          waiting={busy}
          onClick={handleAnonymize}
        >
          {tr.anonymize}
        </ViewButton>
      </footer>
    </div>
  );
}
