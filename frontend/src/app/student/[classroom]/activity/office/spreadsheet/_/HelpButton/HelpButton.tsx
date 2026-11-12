import { IconHelp, ViewFloatingButton } from "@tolokoban/ui";

import { type Notion } from "../NotionList";
import { useShowHelp } from "./hooks";

export interface HelpButtonProps {
  /** Notions needed to solve the current exercise. */
  notions?: Notion[];
}

/** Floating button that lists the notions needed to solve the current exercise. */
export function HelpButton({ notions }: HelpButtonProps) {
  const showHelp = useShowHelp(notions);
  return <ViewFloatingButton size="S" icon={IconHelp} onClick={showHelp} />;
}
