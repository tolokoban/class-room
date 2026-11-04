import { Theme, ViewButton } from "@tolokoban/ui";

import { useActivateButton } from "./hooks";
import { useTranslation } from "./translation";

const $ = Theme.classNames;

export interface ActivateButtonProps {
  className?: string;
  /** Code of the activity, `"AI/chess"` for instance. */
  activity: string;
}

export function ActivateButton({ className, activity }: ActivateButtonProps) {
  const tr = useTranslation();
  const state = useActivateButton(activity);
  if (state.isLoading) return null;

  if (state.isCurrent) return <strong className={$.join(className)}>{tr.current}</strong>;

  return (
    <ViewButton className={$.join(className)} waiting={state.isPending} onClick={state.activate}>
      {tr.activate}
    </ViewButton>
  );
}
