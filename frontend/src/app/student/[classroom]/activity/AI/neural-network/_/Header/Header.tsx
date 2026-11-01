import { Theme, ViewButton } from "@tolokoban/ui";

import { formatBinary, ICONS } from "../icons";
import type { Item } from "../model";
import { useTranslation } from "./translation";

import Styles from "./Header.module.css";

const $ = Theme.classNames;

export interface HeaderProps {
  className?: string;
  array: Item[];
  /** Number of times the coefficients have been corrected. */
  trainings: number;
  onItemClick(index: number): void;
  onRestart(): void;
}

export function Header({ className, array, trainings, onItemClick, onRestart }: HeaderProps) {
  const tr = useTranslation();
  return (
    <header className={$.join(className, Styles.header)}>
      <div>
        {array.map((item, index) => (
          <button
            key={index}
            type="button"
            title={tr.cell$(`${index}`, formatBinary(index))}
            onClick={() => onItemClick(index)}
          >
            <span>{ICONS[item]}</span>
            <small>{formatBinary(index)}</small>
          </button>
        ))}
      </div>
      <strong>{tr.trainings$(`${trainings}`)}</strong>
      <ViewButton color="secondary-5" onClick={onRestart}>
        {tr.restart}
      </ViewButton>
    </header>
  );
}
