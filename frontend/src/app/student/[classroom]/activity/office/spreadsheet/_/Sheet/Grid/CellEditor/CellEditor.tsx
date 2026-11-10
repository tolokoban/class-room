import { Theme } from "@tolokoban/ui";

import { Autocomplete, useAutocomplete } from "../../Autocomplete";
import { type CellPos } from "../../engine/address";
import { type SheetController } from "../../hooks";
import { handleEditorBlur, handleEditorKey } from "../../keyboard";
import { areaStyle } from "../area";
import { useCaretAtEnd } from "./hooks";

import Styles from "./CellEditor.module.css";

const $ = Theme.classNames;

export interface CellEditorProps {
  className?: string;
  sheet: SheetController;
  pos: CellPos;
}

/** Input displayed over the active cell when editing it directly. */
export function CellEditor({ className, sheet, pos }: CellEditorProps) {
  const autocomplete = useAutocomplete(sheet);
  useCaretAtEnd(autocomplete.ref);
  return (
    <div
      className={$.join(className, Styles.cellEditor)}
      style={areaStyle({ top: pos.row, left: pos.col, bottom: pos.row, right: pos.col })}
    >
      <input
        ref={autocomplete.ref}
        type="text"
        spellCheck={false}
        autoComplete="off"
        value={sheet.edit?.text ?? ""}
        onFocus={autocomplete.handleFocus}
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
  );
}
