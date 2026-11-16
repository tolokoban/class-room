import { IconAdd, Theme, ViewButton, ViewSpinner } from "@tolokoban/ui";

import { ApiError } from "@/service/calls/service";
import { WrittenItem } from "@/service/calls/written";

import { useTranslation } from "./translation";

import Styles from "./WrittenList.module.css";

const $ = Theme.classNames;

export interface WrittenListProps {
  className?: string;
  items: WrittenItem[] | undefined;
  isLoading: boolean;
  error: ApiError | null;
  /** ID of the selected written production, or `null` for a new one. */
  selected: number | null;
  onSelect(this: void, id: number | null): void;
}

/**
 * The written productions of the teacher.
 */
export function WrittenList({
  className,
  items,
  isLoading,
  error,
  selected,
  onSelect,
}: WrittenListProps) {
  const tr = useTranslation();

  return (
    <section className={$.join(className, Styles.writtenList)}>
      <header>{tr.title}</header>
      <div>
        {isLoading && <ViewSpinner />}
        {error && <div className={Styles.error}>{error.message}</div>}
        {items?.length === 0 && <em>{tr.empty}</em>}
        {items && items.length > 0 && (
          <ul>
            {items.map((item) => (
              <li key={item.id} className={$.join(item.id === selected && Styles.selected)}>
                <button type="button" onClick={() => onSelect(item.id)}>
                  <strong>{item.name}</strong>
                  <small>
                    {item.classrooms.length > 0
                      ? tr.classrooms$(item.classrooms.join(", "))
                      : tr.noClassroom}
                  </small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <footer>
        <ViewButton icon={IconAdd} enabled={selected !== null} onClick={() => onSelect(null)}>
          {tr.new}
        </ViewButton>
      </footer>
    </section>
  );
}
