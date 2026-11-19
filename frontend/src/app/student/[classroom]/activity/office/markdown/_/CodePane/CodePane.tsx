import { IconReset, Theme, ViewButton, ViewSwitch } from "@tolokoban/ui";
import React from "react";

import { CodeEditor } from "@/components/CodeEditor";

import { type NodePath } from "../markdown";
import { Preview } from "../Preview";
import { useTranslation } from "./translation";

import Styles from "./CodePane.module.css";

const $ = Theme.classNames;

export interface CodePaneProps {
  className?: string;
  /** Markdown code of the student. */
  value: string;
  onChange(value: string): void;
  /** Restore the initial code of the exercise. */
  onReset(): void;
  /** Path of the node to highlight in the preview. */
  highlight?: NodePath;
}

/**
 * The code of the student, that can be switched to its preview.
 */
export function CodePane({ className, value, onChange, onReset, highlight }: CodePaneProps) {
  const tr = useTranslation();
  const [preview, setPreview] = React.useState(false);
  return (
    <section className={$.join(className, Styles.codePane)}>
      <header>
        <span>{tr.yourCode}</span>
        <ViewSwitch value={preview} onChange={setPreview}>
          {tr.preview}
        </ViewSwitch>
        <ViewButton variant="text" icon={IconReset} onClick={onReset}>
          {tr.reset}
        </ViewButton>
      </header>
      <div>
        {preview ? (
          <Preview value={value} highlight={highlight} />
        ) : (
          <CodeEditor value={value} onChange={onChange} />
        )}
      </div>
    </section>
  );
}
