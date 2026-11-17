import {
  IconAdd,
  IconOk,
  Theme,
  ViewButton,
  ViewInputNumber,
  ViewInputText,
  ViewTab,
  ViewTabs,
} from "@tolokoban/ui";

import { Md } from "@/components/Md";
import { UiActionDelete } from "@/components/UiActionDelete";
import { WrittenItem } from "@/service/calls/written";

import { AttachmentsEditor } from "./AttachmentsEditor";
import { ExpectedFileEditor } from "./ExpectedFileEditor";
import { useWrittenEditor } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./WrittenEditor.module.css";

const $ = Theme.classNames;

export interface WrittenEditorProps {
  className?: string;
  /** The written production to edit, or `undefined` to create a new one. */
  item?: WrittenItem;
  onSaved(this: void, id: number): void;
  onDeleted(this: void): void;
}

/**
 * Form to create or edit a written production.
 */
export function WrittenEditor({ className, item, onSaved, onDeleted }: WrittenEditorProps) {
  const tr = useTranslation();
  const editor = useWrittenEditor(item, onSaved, onDeleted);
  const { draft } = editor;

  return (
    <section className={$.join(className, Styles.writtenEditor)}>
      <header>{item ? tr.titleEdit$(item.name) : tr.titleNew}</header>
      <div>
        <ViewInputText
          label={tr.name}
          value={draft.name}
          onChange={(name) => editor.update({ name })}
        />
        <div className={Styles.numbers}>
          <ViewInputNumber
            label={tr.duration}
            min={1}
            max={1440}
            value={draft.duration}
            onChange={(duration) => editor.update({ duration })}
          />
          <ViewInputNumber
            label={tr.expiration}
            min={1}
            max={8760}
            value={draft.expiration}
            onChange={(expiration) => editor.update({ expiration })}
          />
        </div>
        <ViewTabs value={editor.tab} onChange={editor.setTab}>
          <ViewTab key="edit" label={tr.edit}>
            <textarea
              value={draft.description}
              placeholder={tr.placeholder}
              spellCheck
              onChange={(evt) => editor.update({ description: evt.target.value })}
            />
          </ViewTab>
          <ViewTab key="view" label={tr.view}>
            <Md value={draft.description} resolveUrl={editor.resolveUrl} />
          </ViewTab>
        </ViewTabs>
        <AttachmentsEditor writtenId={item?.id} attachments={item?.attachments ?? []} />
        <h2>{tr.files}</h2>
        <p>{tr.filesHint}</p>
        {draft.files.map((file) => (
          <ExpectedFileEditor
            key={file.key}
            file={file}
            uploads={item?.uploads[file.name] ?? 0}
            onChange={(patch) => editor.updateFile(file.key, patch)}
            onRemove={() => editor.removeFile(file.key)}
          />
        ))}
        <ViewButton variant="text" icon={IconAdd} onClick={editor.addFile}>
          {tr.addFile}
        </ViewButton>
      </div>
      <footer>
        {item && (
          <UiActionDelete
            confirm={tr.deleteConfirm$(item.name)}
            waiting={editor.isDeleting}
            onDelete={editor.remove}
          />
        )}
        <ViewButton icon={IconOk} waiting={editor.isSaving} onClick={editor.save}>
          {tr.save}
        </ViewButton>
      </footer>
    </section>
  );
}
