import { Theme, ViewSpinner } from "@tolokoban/ui";

import { useServiceClassList } from "@/service/hooks/class";

import { useTranslation } from "../translation";

import Styles from "./ClassList.module.css";

const $ = Theme.classNames;

export interface ClassListProps {
  className?: string;
}

export function ClassList({ className }: ClassListProps) {
  const tr = useTranslation();
  const { data, isLoading, error } = useServiceClassList();

  return (
    <div className={$.join(className, Styles.classList)}>
      {isLoading && <ViewSpinner />}
      {error && <div className={Styles.error}>{error.message}</div>}
      {data?.length === 0 && <em>{tr.empty}</em>}
      {data && data.length > 0 && (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              <a href={`#/teacher/${item.code}`}>{item.name}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
