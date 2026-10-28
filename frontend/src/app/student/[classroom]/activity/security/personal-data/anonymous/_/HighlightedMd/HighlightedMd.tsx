import { Theme } from "@tolokoban/ui";

import { Md } from "@/components/Md";
import type { Entity } from "../pii";
import { categoryStyle, isCategory } from "./categories";
import { remarkHighlight } from "./remark-highlight";
import { useTranslation } from "./translation";

import Styles from "./HighlightedMd.module.css";

const $ = Theme.classNames;

export interface HighlightedMdProps {
  className?: string;
  /** Markdown source. */
  value: string;
  /** Personal data to highlight, with offsets in `value`. */
  entities: Entity[];
}

export function HighlightedMd({ className, value, entities }: HighlightedMdProps) {
  const tr = useTranslation();
  const decorate = (category: string) => ({
    dataCategory: isCategory(category) ? tr[category] : category,
    style: categoryStyle(category),
  });
  return (
    <Md
      className={$.join(className, Styles.highlightedMd)}
      value={value}
      remarkPlugins={[remarkHighlight(value, entities, decorate)]}
    />
  );
}
