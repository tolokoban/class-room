import React from "react";
import { isType } from "@tolokoban/type-guards";

import { useServiceActivityResultAll } from "@/service/hooks/activity";
import { Quiz } from "@/types";

/** Delay (in msec) between two reloads of the students' results. */
const REFRESH_INTERVAL = 3000;

/**
 * Manage the navigation between the items of `quiz`.
 */
export function useItemNavigation(quiz: Quiz) {
  const itemIds = Object.keys(quiz.items);
  const [index, setIndex] = React.useState(0);
  const itemId = itemIds[index];

  return {
    itemId,
    item: quiz.items[itemId],
    index,
    count: itemIds.length,
    canPrev: index > 0,
    canNext: index < itemIds.length - 1,
    prev: () => setIndex(Math.max(0, index - 1)),
    next: () => setIndex(Math.min(itemIds.length - 1, index + 1)),
  };
}

/**
 * Statistics of the students' answers to the item `itemId`.
 * Only the students that selected at least one choice of this item are taken into account.
 * The results are reloaded every `REFRESH_INTERVAL` msec.
 */
export function useItemStats(classroom: string, activityCode: string, itemId: string) {
  const results = useServiceActivityResultAll(classroom, activityCode);
  usePolling(results.refresh);
  const counts: Record<string, number> = {};
  let respondents = 0;
  for (const result of Object.values(results.data ?? {})) {
    const selection = parseResult(result)[itemId] ?? [];
    if (selection.length === 0) continue;

    respondents++;
    for (const choiceId of selection) counts[choiceId] = (counts[choiceId] ?? 0) + 1;
  }

  return {
    respondents,
    /** Percentage (nearest integer) of the respondents that selected `choiceId`. */
    percent: (choiceId: string) =>
      respondents > 0 ? Math.round((100 * (counts[choiceId] ?? 0)) / respondents) : 0,
  };
}

function usePolling(refresh: () => void) {
  const ref = React.useRef(refresh);
  ref.current = refresh;
  React.useEffect(() => {
    const id = window.setInterval(() => ref.current(), REFRESH_INTERVAL);
    return () => window.clearInterval(id);
  }, []);
}

/**
 * @returns The choices ids selected by a student, per item id.
 */
function parseResult(result: string): Record<string, string[]> {
  try {
    const data: unknown = JSON.parse(result);
    if (isType(data, ["map", ["array", "string"]])) return data;
  } catch (error) {
    console.error("Invalid result:", result, error);
  }
  return {};
}
