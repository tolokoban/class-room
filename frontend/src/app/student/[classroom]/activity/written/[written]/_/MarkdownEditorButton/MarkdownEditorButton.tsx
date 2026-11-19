import { IconLanguageMarkdown, Theme, ViewButton } from "@tolokoban/ui";

import { useShowMarkdownEditor } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./MarkdownEditorButton.module.css";

const $ = Theme.classNames;

export interface MarkdownEditorButtonProps {
  className?: string;
  /** Used to keep a separate draft for each written production. */
  writtenId: number;
}

/**
 * Opens a full screen Markdown editor with a live preview.
 */
export function MarkdownEditorButton({ className, writtenId }: MarkdownEditorButtonProps) {
  const tr = useTranslation();
  const showEditor = useShowMarkdownEditor(writtenId);
  return (
    <div className={$.join(className, Styles.markdownEditorButton)}>
      <ViewButton color="secondary-5" icon={IconLanguageMarkdown} onClick={showEditor}>
        {tr.label}
      </ViewButton>
    </div>
  );
}
