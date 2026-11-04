import { ActivateButton } from "./ActivateButton";
import { useActivityCode } from "./hooks";

export interface ActivateActivityProps {
  className?: string;
}

/**
 * On an activity page, let the teacher make this activity the current one
 * of the class room, or tell them it already is.
 */
export function ActivateActivity({ className }: ActivateActivityProps) {
  const activity = useActivityCode();
  if (!activity) return null;

  return <ActivateButton className={className} activity={activity} />;
}
