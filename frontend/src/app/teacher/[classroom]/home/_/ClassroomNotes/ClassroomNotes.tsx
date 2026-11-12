import { Theme, ViewButton, ViewSpinner, ViewTab, ViewTabs } from "@tolokoban/ui";

import { Md } from "@/components/Md";

import { SectionHeader } from "../SectionHeader";
import { useClassroomNotes } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./ClassroomNotes.module.css";

const $ = Theme.classNames;

export interface ClassroomNotesProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
  /** Is the content of the section visible? */
  expanded: boolean;
  /** Called when the user clicks the header. */
  onToggle(): void;
}

/**
 * Markdown notes of the teacher for a class room.
 * Drafts are kept in the session storage until they are saved on the server.
 */
export function ClassroomNotes({ className, classroom, expanded, onToggle }: ClassroomNotesProps) {
  const tr = useTranslation();
  const notes = useClassroomNotes(classroom, expanded);

  return (
    <section className={$.join(className, Styles.classroomNotes)}>
      <SectionHeader expanded={expanded} onToggle={onToggle}>
        {tr.title}
      </SectionHeader>
      {expanded && (
        <>
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
        </>
      )}
    </section>
  );
}
