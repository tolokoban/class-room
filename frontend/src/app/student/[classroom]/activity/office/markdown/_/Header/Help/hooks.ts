import React from "react";

import { printAsPdf } from "./print";
import { SECTIONS } from "./sections";
import { useTranslation } from "./translation";

import Styles from "./Help.module.css";

export function useHelp(section: string | undefined) {
  const tr = useTranslation();
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!section) return;

    ref.current
      ?.querySelector(`[data-section="${section}"]`)
      ?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [section]);
  const sections = SECTIONS.map((id) => ({
    id,
    title: tr[`${id}Title`],
    text: tr[`${id}Text`],
    example: tr[`${id}Example`],
  }));
  const handleDownload = () => {
    if (ref.current) void printAsPdf(tr.title, ref.current, Styles.printable);
  };
  return { tr, ref, sections, handleDownload };
}
