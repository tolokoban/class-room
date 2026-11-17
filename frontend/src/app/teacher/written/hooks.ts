import React from "react";

import { useRouteParamAsInt } from "@/app/routes";
import { useServiceWrittenList } from "@/service/hooks/written";

export function useWrittenPage() {
  const list = useServiceWrittenList();
  /** ID of the written production given by the route `/teacher/written/[written]`, if any. */
  const initial = useRouteParamAsInt("written") || null;
  /** ID of the written production being edited, or `null` for a new one. */
  const [selected, setSelected] = React.useState<number | null>(initial);
  React.useEffect(() => setSelected(initial), [initial]);
  const item = list.data?.find((written) => written.id === selected);

  return {
    ...list,
    selected: item ? selected : null,
    item,
    select: setSelected,
    /** Changes when another written production is selected, to reset the editor. */
    editorKey: item ? `${item.id}` : "new",
  };
}
