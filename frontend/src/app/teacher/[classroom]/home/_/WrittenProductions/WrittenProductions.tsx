import { IconDelete, IconEdit, Theme, ViewButton, ViewSpinner } from "@tolokoban/ui";

import { useConfirm } from "@/components/Confirm";
import { getWrittenActivityCode } from "@/service/calls/written";

import { SectionHeader } from "../SectionHeader";
import { AssignWritten } from "./AssignWritten";
import { useWrittenProductions } from "./hooks";
import { useTranslation } from "./translation";
import { WrittenRow } from "./WrittenRow";

import Styles from "./WrittenProductions.module.css";

const $ = Theme.classNames;

export interface WrittenProductionsProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
  /** Is the content of the section visible? */
  expanded: boolean;
  /** Called when the user clicks the header. */
  onToggle(): void;
}

/**
 * The written productions assigned to a class room.
 */
export function WrittenProductions({
  className,
  classroom,
  expanded,
  onToggle,
}: WrittenProductionsProps) {
  const tr = useTranslation();
  const confirm = useConfirm();
  const section = useWrittenProductions(classroom, expanded);
  const handleDeleteAll = () =>
    void confirm({ content: tr.deleteAllConfirm, accent: true }).then(
      (ok) => ok && section.deleteAll(),
    );

  return (
    <section className={$.join(className, Styles.writtenProductions)}>
      <SectionHeader expanded={expanded} onToggle={onToggle}>
        {tr.title}
      </SectionHeader>
      {expanded && (
        <>
          <div>
            {section.isLoading && <ViewSpinner />}
            {section.error && <div className={Styles.error}>{section.error.message}</div>}
            {section.data && section.items.length === 0 && <em>{tr.empty}</em>}
            {section.items.length > 0 && (
              <ul>
                {section.items.map((item) => (
                  <WrittenRow
                    key={item.id}
                    classroom={classroom}
                    item={item}
                    now={section.data?.now ?? 0}
                    active={section.currentActivity === getWrittenActivityCode(item.id)}
                  />
                ))}
              </ul>
            )}
            {section.items.length > 0 && <div className={Styles.total}>{section.total}</div>}
          </div>
          <AssignWritten classroom={classroom} assigned={section.items.map((item) => item.id)} />
          <footer>
            <ViewButton variant="text" icon={IconEdit} onClick={section.manage}>
              {tr.manage}
            </ViewButton>
            <ViewButton
              variant="text"
              color="error"
              icon={IconDelete}
              enabled={section.hasFiles}
              waiting={section.isDeleting}
              onClick={handleDeleteAll}
            >
              {tr.deleteAll}
            </ViewButton>
          </footer>
        </>
      )}
    </section>
  );
}
