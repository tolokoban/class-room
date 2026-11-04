import { Theme, ViewButton, ViewDialog } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./RestartDialog.module.css";

const $ = Theme.classNames;

export interface RestartDialogProps {
  className?: string;
  onRandomGame(): void;
  onNewGame(): void;
  onCancel(): void;
}

export function RestartDialog({
  className,
  onRandomGame,
  onNewGame,
  onCancel,
}: RestartDialogProps) {
  const tr = useTranslation();
  return (
    <ViewDialog
      className={$.join(className, Styles.restartDialog)}
      title={tr.title}
      buttonCancel={{ children: tr.cancel, onClick: onCancel }}
    >
      <ViewButton color="primary-5" onClick={onRandomGame}>
        {tr.randomGame}
      </ViewButton>
      <p>{tr.randomGameHint}</p>
      <ViewButton color="primary-5" onClick={onNewGame}>
        {tr.newGame}
      </ViewButton>
      <p>{tr.newGameHint}</p>
    </ViewDialog>
  );
}
