import { IconClose, IconCopy, Theme, ViewButton } from "@tolokoban/ui";

import { CodeEditor } from "@/components/CodeEditor";
import { Md } from "@/components/Md";

import { useMarkdownEditor, useScrollSync } from "./hooks";

import Styles from "./MarkdownEditor.module.css";

const $ = Theme.classNames;

export interface MarkdownEditorProps {
  className?: string;
  /** Key of the local storage where the draft is kept between two openings. */
  storageKey: string;
  onClose(): void;
}

/**
 * Full screen editor: the Markdown code on the left, its live rendering on the right.
 */
export function MarkdownEditor({ className, storageKey, onClose }: MarkdownEditorProps) {
  const { tr, value, setValue, handleCopy } = useMarkdownEditor(storageKey);
  const { refCode, refPreview, handleCodeScroll, handlePreviewScroll } = useScrollSync();
  return (
    <div className={$.join(className, Styles.markdownEditor)}>
      <header>
        <h1>{tr.title}</h1>
        <ViewButton variant="text" icon={IconClose} onClick={onClose}>
          {tr.close}
        </ViewButton>
      </header>
      <main>
        <section>
          <header>
            <span>{tr.code}</span>
            <ViewButton variant="text" icon={IconCopy} onClick={handleCopy}>
              {tr.copy}
            </ViewButton>
          </header>
          <div>
            <CodeEditor
              ref={refCode}
              value={value}
              onChange={setValue}
              onScroll={handleCodeScroll}
            />
          </div>
        </section>
        <section>
          <header>
            <span>{tr.result}</span>
          </header>
          <div ref={refPreview} onScroll={handlePreviewScroll}>
            <Md value={value} />
          </div>
        </section>
      </main>
    </div>
  );
}
