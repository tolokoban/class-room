import { Theme, ViewButton } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./Done.module.css";

const $ = Theme.classNames;

export interface DoneProps {
  className?: string;
  onRestart(): void;
}

export function Done({ className, onRestart }: DoneProps) {
  const tr = useTranslation();
  return (
    <div className={$.join(className, Styles.done)}>
      <p>{tr.congratulations}</p>
      <ViewButton color="secondary-5" onClick={onRestart}>
        {tr.restart}
      </ViewButton>
    </div>
  );
}
