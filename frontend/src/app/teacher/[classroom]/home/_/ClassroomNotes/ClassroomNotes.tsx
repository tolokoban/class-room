import { Theme, ViewButton, ViewSpinner, ViewTab, ViewTabs } from "@tolokoban/ui";

import { Md } from "@/components/Md";
import { useClassroomNotes } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./ClassroomNotes.module.css";

const $ = Theme.classNames;

export interface ClassroomNotesProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
}

/**
 * Markdown notes of the teacher for a class room.
 * Drafts are kept in the session storage until they are saved on the server.
 */
export function ClassroomNotes({ className, classroom }: ClassroomNotesProps) {
  const tr = useTranslation();
  const notes = useClassroomNotes(classroom);

  return (
    <section className={$.join(className, Styles.classroomNotes)}>
      <header>{tr.title}</header>
      <div>
        {notes.isLoading && <ViewSpinner />}
        {notes.error && <div className={Styles.error}>{notes.error.message}</div>}
        {!notes.isLoading && (
          <ViewTabs value={notes.tab} onChange={notes.setTab}>
            <ViewTab key="edit" label={tr.edit}>
              <textarea
                ref={notes.refTextarea}
                value={notes.content}
                placeholder={tr.placeholder}
                spellCheck
                onChange={(evt) => notes.update(evt.target.value)}
              />
            </ViewTab>
            <ViewTab key="view" label={tr.view}>
              {notes.content.trim() ? <Md value={notes.content} /> : <em>{tr.empty}</em>}
            </ViewTab>
          </ViewTabs>
        )}
      </div>
      <footer>
        {notes.isModified && <em>{tr.modified}</em>}
        <ViewButton enabled={notes.isModified} waiting={notes.isPending} onClick={notes.save}>
          {tr.save}
        </ViewButton>
      </footer>
    </section>
  );
}
