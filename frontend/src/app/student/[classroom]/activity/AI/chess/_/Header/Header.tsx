import { Theme, ViewButton, ViewSwitch } from "@tolokoban/ui";

import { useRestart } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./Header.module.css";

const $ = Theme.classNames;

export interface HeaderProps {
  className?: string;
  /** Is the "simple evaluation" (points of the pieces only) switched on? */
  simple: boolean;
  onSimpleChange(simple: boolean): void;
  /** Start from a random position taken from a master game. */
  onRandomGame(): void;
  /** Start a fresh game, from the initial position. */
  onNewGame(): void;
}

export function Header({
  className,
  simple,
  onSimpleChange,
  onRandomGame,
  onNewGame,
}: HeaderProps) {
  const tr = useTranslation();
  const handleRestart = useRestart(onRandomGame, onNewGame);
  return (
    <header className={$.join(className, Styles.header)}>
      <h1>{tr.title}</h1>
      <div>
        <ViewSwitch value={simple} onChange={onSimpleChange}>
          {tr.simple}
        </ViewSwitch>
        <ViewButton color="secondary-5" onClick={handleRestart}>
          {tr.restart}
        </ViewButton>
      </div>
    </header>
  );
}
