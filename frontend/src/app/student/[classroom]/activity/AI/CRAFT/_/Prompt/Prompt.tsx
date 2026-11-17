import { IconCopy, Theme, ViewButton } from "@tolokoban/ui";

import { useCopyHandler } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./Prompt.module.css";

const $ = Theme.classNames;

export interface PromptProps {
  className?: string;
  /** Raw text of the prompt, displayed as is. */
  children: string;
}

export function Prompt({ className, children }: PromptProps) {
  const tr = useTranslation();
  const handleCopy = useCopyHandler(children);
  return (
    <div className={$.join(className, Styles.prompt)}>
      <pre>{children}</pre>
      <footer>
        <ViewButton variant="text" icon={IconCopy} onClick={handleCopy}>
          {tr.copy}
        </ViewButton>
      </footer>
    </div>
  );
}
