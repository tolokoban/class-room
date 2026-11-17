import { Theme } from "@tolokoban/ui";

import { Preview } from "../../../Preview";

import Styles from "./Section.module.css";

const $ = Theme.classNames;

export interface SectionProps {
  className?: string;
  id: string;
  title: string;
  text: string;
  /** Markdown code of the example. */
  example: string;
  /** This is the section of the current exercise. */
  current: boolean;
  labelCode: string;
  labelResult: string;
}

export function Section(props: SectionProps) {
  const { className, id, title, text, example, current, labelCode, labelResult } = props;
  return (
    <section className={$.join(className, Styles.section)} data-section={id} data-current={current}>
      <header>{title}</header>
      <p>{text}</p>
      <div>
        <div>
          <small>{labelCode}</small>
          <pre>{example}</pre>
        </div>
        <div>
          <small>{labelResult}</small>
          <Preview value={example} />
        </div>
      </div>
    </section>
  );
}
