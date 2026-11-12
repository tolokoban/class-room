import { Theme } from "@tolokoban/ui";

import { type FunctionName, type Locale } from "../engine/locale";
import { type AutocompleteController } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./Autocomplete.module.css";

const $ = Theme.classNames;

export interface AutocompleteProps {
  className?: string;
  autocomplete: AutocompleteController;
  locale: Locale;
}

/** List of the functions that can complete the word being typed. */
export function Autocomplete({ className, autocomplete, locale }: AutocompleteProps) {
  const tr = useTranslation();
  const { completion, index, accept } = autocomplete;
  if (!completion) return null;

  const descriptions: Record<FunctionName, string> = {
    SUM: tr.sum,
    COUNT: tr.count,
    COUNTA: tr.countA,
    AVERAGE: tr.average,
    IF: tr.if,
    AND: tr.and,
    OR: tr.or,
    NOT: tr.not,
  };
  return (
    <ul
      className={$.join(className, Styles.autocomplete)}
      // Keep the focus in the input.
      onPointerDown={(evt) => evt.preventDefault()}
    >
      {completion.functions.map((fn, i) => (
        <li key={fn} data-highlighted={i === index} onClick={() => accept(fn)}>
          <b>{locale.functions[fn]}</b>
          <span>{descriptions[fn]}</span>
        </li>
      ))}
    </ul>
  );
}
