import { Theme } from "@tolokoban/ui";

import { formatPercent, guessIcon } from "../icons";
import { isCorrect, type Item, type Run } from "../model";
import { useTranslation } from "./translation";

import Styles from "./GuessTable.module.css";

const $ = Theme.classNames;

export interface GuessTableProps {
  className?: string;
  array: Item[];
  /** One guess per cell the inputs can encode: the last ones are not in the array. */
  guesses: Run[];
}

export function GuessTable({ className, array, guesses }: GuessTableProps) {
  const tr = useTranslation();
  const corrects = guesses.slice(0, array.length).map((guess) => isCorrect(guess, array));
  const score = corrects.filter(Boolean).length;
  const extraClass = (index: number) => (index >= array.length ? Styles.extrapolation : undefined);
  const percentClass = (index: number) => {
    if (index >= array.length) return Styles.extrapolation;
    return corrects[index] ? Styles.correct : Styles.wrong;
  };
  return (
    <div className={$.join(className, Styles.guessTable)}>
      <p>{tr.caption}</p>
      <table>
        <tbody>
          <tr>
            {guesses.map((guess, index) => (
              <td key={index} className={extraClass(index)}>
                {guessIcon(guess.guess)}
              </td>
            ))}
          </tr>
          <tr>
            {guesses.map((guess, index) => (
              <td key={index} className={percentClass(index)}>
                {formatPercent(guess.outputs[guess.guess] ?? 0)} %
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p>
        <strong>
          {tr.score$(`${score}`, `${array.length}`, formatPercent(score / array.length))}
        </strong>{" "}
        {tr.baseline}
      </p>
      <p>{tr.extrapolation}</p>
    </div>
  );
}
