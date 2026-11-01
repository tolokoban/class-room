import { Theme } from "@tolokoban/ui";

import { formatPercent, guessIcon } from "../icons";
import { isCorrect, type Item, type Run } from "../model";
import { useTranslation } from "./translation";

import Styles from "./GuessTable.module.css";

const $ = Theme.classNames;

export interface GuessTableProps {
  className?: string;
  array: Item[];
  /** One guess per cell of the array. */
  guesses: Run[];
}

export function GuessTable({ className, array, guesses }: GuessTableProps) {
  const tr = useTranslation();
  const corrects = guesses.map((guess) => isCorrect(guess, array));
  const score = corrects.filter(Boolean).length;
  const cellClass = (index: number) => (corrects[index] ? Styles.correct : Styles.wrong);
  return (
    <div className={$.join(className, Styles.guessTable)}>
      <p>{tr.caption}</p>
      <table>
        <tbody>
          <tr>
            {guesses.map((guess, index) => (
              <td key={index} className={cellClass(index)}>
                {guessIcon(guess.guess)}
              </td>
            ))}
          </tr>
          <tr>
            {guesses.map((guess, index) => (
              <td key={index} className={cellClass(index)}>
                {formatPercent(guess.outputs[guess.guess] ?? 0)} %
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p>
        <strong>
          {tr.score$(`${score}`, `${guesses.length}`, formatPercent(score / guesses.length))}
        </strong>{" "}
        {tr.baseline}
      </p>
    </div>
  );
}
