import { Theme } from "@tolokoban/ui";

import { Autocomplete, useAutocomplete } from "../Autocomplete";
import { type SheetController } from "../hooks";
import { handleEditorBlur, handleEditorKey } from "../keyboard";
import { useTranslation } from "../translation";

import Styles from "./FormulaBar.module.css";

const $ = Theme.classNames;

export interface FormulaBarProps {
  className?: string;
  sheet: SheetController;
}

/** Name of the active cell, followed by its content (the formula, not its value). */
export function FormulaBar({ className, sheet }: FormulaBarProps) {
  const tr = useTranslation();
  const autocomplete = useAutocomplete(sheet);
  return (
    <div className={$.join(className, Styles.formulaBar)}>
      <div>{sheet.activeKey}</div>
      <i>fx</i>
      <div className={Styles.input}>
        <input
          ref={autocomplete.ref}
          type="text"
          aria-label={tr.formula}
          spellCheck={false}
          autoComplete="off"
          readOnly={sheet.readOnly}
          value={sheet.activeText}
          onFocus={(evt) => {
            if (!sheet.edit) sheet.editActive(null, false);
            autocomplete.handleFocus(evt);
          }}
          onSelect={autocomplete.handleSelect}
          onChange={autocomplete.handleChange}
          onKeyDown={(evt) => autocomplete.handleKeyDown(evt) || handleEditorKey(evt, sheet)}
          onBlur={(evt) => {
            autocomplete.handleBlur();
            handleEditorBlur(evt, sheet);
          }}
        />
        <Autocomplete autocomplete={autocomplete} locale={sheet.locale} />
      </div>
    </div>
  );
}
