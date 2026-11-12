import { Theme } from "@tolokoban/ui";

import { type Notion } from "./notion";
import { useTranslation } from "./translation";
import { Md } from "@/components/Md";

import Styles from "./NotionList.module.css";

const $ = Theme.classNames;

export interface NotionListProps {
  className?: string;
  /** Notions needed to solve the exercise. Nothing is displayed if empty. */
  notions?: Notion[];
}

/** Bullet list of the notions needed to solve an exercise. */
export function NotionList({ className, notions = [] }: NotionListProps) {
  const tr = useTranslation();
  if (notions.length === 0) return null;

  const items = notions.map((notion) => `- ${tr[`notion${notion}`]}`);
  return (
    <Md
      className={$.join(className, Styles.notionList)}
      value={[tr.header, "", ...items].join("\n")}
    />
  );
}
