import { IconHelp, ViewButton, ViewFloatingButton } from "@tolokoban/ui";

import { LoadingOverlay } from "../_/LoadingOverlay";
import { VectorsView } from "../_/VectorsView";
import { Conversation } from "./_/Conversation";
import { useGame } from "./_/hooks";

import Styles from "./page.module.css";

export default function Page() {
  const {
    tr,
    embedder,
    ready,
    scene,
    projection,
    probe,
    refInput,
    messages,
    input,
    setInput,
    over,
    handleKeyDown,
    handleGiveUp,
    handleNewGame,
    handleSummary,
  } = useGame();
  return (
    <div className={Styles.page}>
      <header>
        <h1>{tr.title}</h1>
      </header>
      <div className={Styles.columns}>
        <section className={Styles.chat}>
          <main>
            <p>{tr.intro}</p>
            <Conversation messages={messages} />
            {embedder.status === "error" && (
              <p className={Styles.error}>{tr.error$(embedder.message)}</p>
            )}
            <div className={Styles.ask}>
              <input
                ref={refInput}
                type="text"
                value={input}
                placeholder={tr.placeholder}
                disabled={!ready || over}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
              />
              <span title={tr.summaryButton}>
                <ViewFloatingButton size="S" icon={IconHelp} onClick={handleSummary} />
              </span>
            </div>
          </main>
          <footer>
            <ViewButton color="neutral-5" enabled={ready && !over} onClick={handleGiveUp}>
              {tr.giveUp}
            </ViewButton>
            <ViewButton color="secondary-5" onClick={handleNewGame}>
              {tr.newGame}
            </ViewButton>
          </footer>
        </section>
        <VectorsView scene={scene} projection={projection} probe={probe} />
      </div>
      {embedder.status === "loading" && (
        <LoadingOverlay
          title={tr.loadingModels}
          progress={embedder.progress}
          remaining={embedder.remaining}
        />
      )}
    </div>
  );
}
