import { Theme, ViewInputNumber, ViewInputText, ViewOptionsMultiple } from "@tolokoban/ui";

import { MIME_PRESETS, MimePresetKey } from "@/components/MimePresets";
import { useTranslation as usePresetsTranslation } from "@/components/MimePresets/translation";
import { UiActionDelete } from "@/components/UiActionDelete";

import { DraftFile } from "../draft";
import { useTranslation } from "./translation";

import Styles from "./ExpectedFileEditor.module.css";

const $ = Theme.classNames;

export interface ExpectedFileEditorProps {
  className?: string;
  file: DraftFile;
  /** Number of files already uploaded by the students for this expected file. */
  uploads: number;
  onChange(this: void, patch: Partial<DraftFile>): void;
  onRemove(this: void): void;
}

/**
 * Name, accepted types and max size of a file expected from the students.
 */
export function ExpectedFileEditor({
  className,
  file,
  uploads,
  onChange,
  onRemove,
}: ExpectedFileEditorProps) {
  const tr = useTranslation();
  const trPresets = usePresetsTranslation();

  return (
    <div className={$.join(className, Styles.expectedFileEditor)}>
      <div className={Styles.row}>
        <ViewInputText label={tr.name} value={file.name} onChange={(name) => onChange({ name })} />
        <ViewInputNumber
          label={tr.maxSize}
          min={1}
          max={1024}
          value={file.maxSizeMB}
          onChange={(maxSizeMB) => onChange({ maxSizeMB })}
        />
        <UiActionDelete confirm={tr.removeConfirm$(file.name)} onDelete={onRemove} />
      </div>
      <ViewOptionsMultiple<MimePresetKey>
        label={tr.types}
        value={file.presets}
        onChange={(presets) => onChange({ presets })}
      >
        {MIME_PRESETS.map((preset) => (
          <div key={preset.key}>{trPresets[preset.key]}</div>
        ))}
      </ViewOptionsMultiple>
      {uploads > 0 && <small>{tr.uploads$(String(uploads))}</small>}
    </div>
  );
}
