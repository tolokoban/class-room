import { Header } from "./_/Header";
import { useGame } from "./_/hooks";
import { Maze } from "./_/Maze";
import { Panel } from "./_/Panel";

import Styles from "./page.module.css";

export default function Page() {
  const game = useGame();
  return (
    <div className={Styles.page}>
      <Header onRestart={game.handleRestart} />
      <main>
        <Maze
          maze={game.maze}
          astar={game.astar}
          previous={game.previous}
          onAnimationEnd={game.handleAnimationEnd}
        />
        <Panel
          maze={game.maze}
          astar={game.astar}
          animating={game.animating}
          found={game.found}
          steps={game.steps}
          onNextStep={game.handleNextStep}
          onAddSteps={game.handleAddSteps}
        />
      </main>
    </div>
  );
}
