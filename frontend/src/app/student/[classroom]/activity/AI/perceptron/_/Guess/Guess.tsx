import { Theme, ViewButton } from "@tolokoban/ui";

import { DIGITS } from "../model";
import { useTranslation } from "./translation";

import Styles from "./Guess.module.css";

const $ = Theme.classNames;

export interface GuessProps {
  className?: string;
  /** The digit guessed by the perceptron. */
  guess: number;
  onAnswer(digit: number): void;
}

export function Guess({ className, guess, onAnswer }: GuessProps) {
  const tr = useTranslation();
  return (
    <div className={$.join(className, Styles.guess)}>
      <p>{tr.guess}</p>
      <strong>{guess}</strong>
      <p>{tr.question}</p>
      <div>
        {Array.from({ length: DIGITS }, (_, digit) => (
          <ViewButton key={digit} color="secondary-5" onClick={() => onAnswer(digit)}>
            {`${digit}`}
          </ViewButton>
        ))}
      </div>
    </div>
  );
}
