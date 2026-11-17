import React from "react";

import { SECTIONS } from "./sections";
import { useTranslation } from "./translation";

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
  return { tr, ref, sections };
}
