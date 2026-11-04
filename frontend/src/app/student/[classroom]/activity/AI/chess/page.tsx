import { Header } from "./_/Header";
import { useChessGame } from "./_/hooks";
import { Moves } from "./_/Moves";
import { Position } from "./_/Position";

import Styles from "./page.module.css";

export default function Page() {
  const game = useChessGame();
  return (
    <div className={Styles.page}>
      <Header
        simple={game.simple}
        onSimpleChange={game.setSimple}
        onRandomGame={game.handleRandomGame}
        onNewGame={game.handleNewGame}
      />
      <main>
        <Position board={game.board} evaluation={game.evaluation} />
        <Moves board={game.board} moves={game.moves} onSelect={game.handleSelect} />
      </main>
    </div>
  );
}
