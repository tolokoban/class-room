import React from "react";

import { goto } from "@/app/routes";
import { useHumanSize } from "@/components/HumanSize";
import { Notif } from "@/components/Notification";
import { useServiceActivityCurrent } from "@/service/hooks/activity";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import {
  useServiceWrittenClassroom,
  useServiceWrittenFilesDelete,
  useServiceWrittenReorder,
} from "@/service/hooks/written";

import { useTranslation } from "./translation";
import { DragHandleEvents } from "./WrittenRow";

export function useWrittenProductions(classroom: string, expanded: boolean) {
  const tr = useTranslation();
  const formatSize = useHumanSize();
  const translateError = useApiErrorTranslator();
  // Only refreshed regularly while the section is visible.
  const query = useServiceWrittenClassroom(classroom, expanded ? 10000 : false);
  const current = useServiceActivityCurrent(classroom);
  const deleting = useServiceWrittenFilesDelete();
  const reordering = useServiceWrittenReorder();
  const items = query.data?.items ?? [];
  const drag = useDragReorder(
    items.map((item) => item.id),
    (writtenIds) =>
      void reordering
        .mutate({ classroomCode: classroom, writtenIds })
        .catch((error: unknown) => Notif.error(translateError(error))),
  );
  const count = items.reduce((total, item) => total + item.count, 0);
  const size = items.reduce((total, item) => total + item.size, 0);

  const deleteAll = () => {
    deleting
      .mutate({ classroomCode: classroom })
      .then((deleted) => Notif.info(tr.deletedAll$(String(deleted))))
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    ...query,
    items: drag.order.flatMap((id) => items.find((item) => item.id === id) ?? []),
    drag,
    currentActivity: current.data,
    total: tr.total$(String(count), formatSize(size)),
    hasFiles: count > 0,
    isDeleting: deleting.isPending,
    deleteAll,
    manage: () => goto("/teacher/written"),
  };
}

/**
 * Reorder a list of IDs by dragging the handles of its items (pointer events,
 * to work with a mouse as well as on a touch screen), or with the arrow keys.
 * @param ids Current order.
 * @param commit Called with the new order when the user drops an item.
 */
function useDragReorder(ids: number[], commit: (ids: number[]) => void) {
  const listRef = React.useRef<HTMLUListElement>(null);
  const [drag, setDrag] = React.useState<{ id: number; order: number[] } | null>(null);
  const order = drag?.order ?? ids;

  const drop = () => {
    if (drag && !isSameOrder(drag.order, ids)) commit(drag.order);
    setDrag(null);
  };

  const handle = (id: number): DragHandleEvents => ({
    onPointerDown(event) {
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setDrag({ id, order: ids });
    },
    onPointerMove(event) {
      const list = listRef.current;
      if (drag?.id !== id || !list) return;
      const next = computeOrder(list, order, id, event.clientY);
      if (!isSameOrder(next, order)) setDrag({ id, order: next });
    },
    onPointerUp: drop,
    onPointerCancel: () => setDrag(null),
    onKeyDown(event) {
      const delta = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
      const target = ids.indexOf(id) + delta;
      if (delta === 0 || target < 0 || target >= ids.length) return;
      event.preventDefault();
      commit(moveTo(ids, id, target));
    },
  });

  return { listRef, order, draggedId: drag?.id ?? null, handle };
}

/**
 * The dragged item goes after all the other items whose middle is above the pointer.
 * The children of `list` are rendered in the same order as `order`.
 */
function computeOrder(list: HTMLElement, order: number[], id: number, y: number): number[] {
  let index = 0;
  Array.from(list.children).forEach((child, i) => {
    if (order[i] === id) return;
    const rect = child.getBoundingClientRect();
    if (y > rect.top + rect.height / 2) index++;
  });
  return moveTo(order, id, index);
}

function moveTo(ids: number[], id: number, index: number): number[] {
  const others = ids.filter((other) => other !== id);
  return [...others.slice(0, index), id, ...others.slice(index)];
}

function isSameOrder(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index]);
}
