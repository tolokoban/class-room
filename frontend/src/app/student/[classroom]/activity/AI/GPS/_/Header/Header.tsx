import { Theme, ViewButton } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./Header.module.css";

const $ = Theme.classNames;

export interface HeaderProps {
  className?: string;
  onRestart(): void;
}

export function Header({ className, onRestart }: HeaderProps) {
  const tr = useTranslation();
  return (
    <header className={$.join(className, Styles.header)}>
      <h1>{tr.title}</h1>
      <ViewButton color="secondary-5" onClick={onRestart}>
        {tr.restart}
      </ViewButton>
    </header>
  );
}
