import { Theme, ViewDialog } from "@tolokoban/ui";

import { useHelp } from "./hooks";
import { Section } from "./Section";

import Styles from "./Help.module.css";

const $ = Theme.classNames;

export interface HelpProps {
  className?: string;
  /** Id of the section to scroll to, and to highlight. */
  section?: string;
  onClose(): void;
}

/**
 * Every Markdown syntax (Github flavored), with an example.
 */
export function Help({ className, section, onClose }: HelpProps) {
  const { tr, ref, sections } = useHelp(section);
  return (
    <ViewDialog
      className={$.join(className, Styles.help)}
      title={tr.title}
      buttonValidate={{ children: tr.close, onClick: onClose }}
    >
      <div ref={ref}>
        {sections.map((item) => (
          <Section
            key={item.id}
            id={item.id}
            title={item.title}
            text={item.text}
            example={item.example}
            current={item.id === section}
            labelCode={tr.code}
            labelResult={tr.result}
          />
        ))}
      </div>
    </ViewDialog>
  );
}
