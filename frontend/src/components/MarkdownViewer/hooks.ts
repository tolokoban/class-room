import React from "react";

export type MarkdownViewerTab = "preview" | "code";

/** The current tab ("preview" by default) and its setter, compatible with `ViewTabs`. */
export function useMarkdownViewerTab(): [tab: string, setTab: (tab?: string) => void] {
  const [tab, setTab] = React.useState<string>("preview" satisfies MarkdownViewerTab);
  return [tab, (value?: string) => setTab(value ?? "preview")];
}
