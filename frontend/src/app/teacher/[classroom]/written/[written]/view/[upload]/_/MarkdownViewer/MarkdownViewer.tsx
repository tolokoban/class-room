import { Theme, ViewTab, ViewTabs } from "@tolokoban/ui";

import { Md } from "@/components/Md";

import { useMarkdownViewerTab } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./MarkdownViewer.module.css";

const $ = Theme.classNames;

export interface MarkdownViewerProps {
  className?: string;
  /** Markdown source. */
  value: string;
}

/**
 * Two tabs: the rendered Markdown ("Preview", the default) and its source ("Code").
 */
export function MarkdownViewer({ className, value }: MarkdownViewerProps) {
  const tr = useTranslation();
  const [tab, setTab] = useMarkdownViewerTab();

  return (
    <div className={$.join(className, Styles.markdownViewer)}>
      <ViewTabs value={tab} onChange={setTab}>
        <ViewTab key="preview" label={tr.preview}>
          <Md value={value} />
        </ViewTab>
        <ViewTab key="code" label={tr.code}>
          <pre>{value}</pre>
        </ViewTab>
      </ViewTabs>
    </div>
  );
}
