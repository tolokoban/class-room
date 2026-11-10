import { Done } from "./_/Done";
import { Explorer } from "./_/Explorer";
import { Header } from "./_/Header";
import { useFileExplorerActivity } from "./_/hooks";
import { useTranslation } from "./_/translation";

import Styles from "./page.module.css";

export default function Page() {
  const tr = useTranslation();
  const activity = useFileExplorerActivity();
  if (!activity.exercise) {
    return (
      <div className={Styles.page}>
        <Header
          title=""
          clicks={null}
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
        clicks={activity.clicks}
        onRestart={activity.handleRestart}
        onResults={activity.handleResults}
      />
      <main>
        <section>
          <header>{tr.yourSelection}</header>
          <Explorer
            mask={activity.state.mask}
            anchor={activity.state.anchor}
            onClick={activity.handleClick}
          />
        </section>
        <section>
          <header>{tr.expected}</header>
          <Explorer mask={activity.expectedMask} anchor={null} />
        </section>
      </main>
    </div>
  );
}
