import { Theme, ViewButton } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./Header.module.css";

const $ = Theme.classNames;

export interface HeaderProps {
  className?: string;
  /** Number of images the perceptron has learnt from. */
  steps: number;
  onRestart(): void;
}

export function Header({ className, steps, onRestart }: HeaderProps) {
  const tr = useTranslation();
  return (
    <header className={$.join(className, Styles.header)}>
      <h1>{tr.title}</h1>
      <div>
        <strong>{tr.steps$(`${steps}`)}</strong>
        <ViewButton color="secondary-5" onClick={onRestart}>
          {tr.restart}
        </ViewButton>
      </div>
    </header>
  );
}
