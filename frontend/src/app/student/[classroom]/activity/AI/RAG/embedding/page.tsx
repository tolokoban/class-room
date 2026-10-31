import { ViewButton } from "@tolokoban/ui";

import { Conversation } from "./_/Conversation";
import { useGame } from "./_/hooks";
import { LoadingOverlay } from "./_/LoadingOverlay";

import Styles from "./page.module.css";

export default function Page() {
  const {
    tr,
    embedder,
    ready,
    refInput,
    messages,
    input,
    setInput,
    over,
    handleKeyDown,
    handleGiveUp,
    handleNewGame,
  } = useGame();
  return (
    <div className={Styles.page}>
      <header>
        <h1>{tr.title}</h1>
      </header>
      <main>
        <p>{tr.intro}</p>
        <Conversation messages={messages} />
        {embedder.status === "error" && (
          <p className={Styles.error}>{tr.error$(embedder.message)}</p>
        )}
        <input
          ref={refInput}
          type="text"
          value={input}
          placeholder={tr.placeholder}
          disabled={!ready || over}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </main>
      <footer>
        <ViewButton color="neutral-5" enabled={ready && !over} onClick={handleGiveUp}>
          {tr.giveUp}
        </ViewButton>
        <ViewButton color="secondary-5" onClick={handleNewGame}>
          {tr.newGame}
        </ViewButton>
      </footer>
      {embedder.status === "loading" && (
        <LoadingOverlay progress={embedder.progress} remaining={embedder.remaining} />
      )}
    </div>
  );
}
