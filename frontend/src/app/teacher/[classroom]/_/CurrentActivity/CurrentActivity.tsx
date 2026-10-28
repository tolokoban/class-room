import { Theme, ViewButton, ViewSpinner } from "@tolokoban/ui";

import { useCurrentActivity } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./CurrentActivity.module.css";

const $ = Theme.classNames;

export interface CurrentActivityProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
}

export function CurrentActivity({ className, classroom }: CurrentActivityProps) {
  const tr = useTranslation();
  const current = useCurrentActivity(classroom);

  return (
    <header className={$.join(className, Styles.currentActivity)}>
      <div>
        {current.isLoading && <ViewSpinner padding={0} />}
        {current.error && <span className={Styles.error}>{current.error.message}</span>}
        {current.code === null && <em>{tr.none}</em>}
        {current.code && (
          <>
            <span>{tr.current}</span> <code>{current.code}</code>
            {current.name && <strong>{current.name}</strong>}
          </>
        )}
      </div>
      {current.code && (
        <ViewButton color="secondary-5" waiting={current.isPending} onClick={current.clear}>
          {tr.clear}
        </ViewButton>
      )}
    </header>
  );
}
