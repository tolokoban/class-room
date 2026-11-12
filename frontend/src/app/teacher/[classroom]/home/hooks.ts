import React from "react";

export type SectionName = "activities" | "files" | "notes";

/**
 * Only one section can be expanded at a time. All are collapsed by default.
 */
export function useExpandedSection() {
  const [expanded, setExpanded] = React.useState<SectionName | null>(null);
  const toggle = (name: SectionName) => setExpanded((current) => (current === name ? null : name));
  return {
    isExpanded: (name: SectionName) => expanded === name,
    toggle,
  };
}
