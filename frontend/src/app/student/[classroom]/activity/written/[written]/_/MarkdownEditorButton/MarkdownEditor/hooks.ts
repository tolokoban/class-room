import React from "react";

import { Notif } from "@/components/Notification/manager";

import { useTranslation } from "./translation";

export function useMarkdownEditor(storageKey: string) {
  const tr = useTranslation();
  const [value, setValue] = React.useState(() => load(storageKey));
  React.useEffect(() => save(storageKey, value), [storageKey, value]);
  return {
    tr,
    value,
    setValue,
    handleCopy() {
      navigator.clipboard.writeText(value).then(
        () => Notif.info(tr.copied),
        () => Notif.error(tr.copyFailed),
      );
    },
  };
}

/**
 * Keeps the vertical scroll of the code and of the preview at the same percentage.
 * The positions are not matched line by line: 25% of the code is shown in front of 25% of the preview.
 *
 * Caveat: setting `scrollTop` fires a `scroll` event on the other element.
 * That event is ignored, otherwise both elements would keep echoing each other.
 */
export function useScrollSync() {
  const refCode = React.useRef<HTMLTextAreaElement | null>(null);
  const refPreview = React.useRef<HTMLDivElement | null>(null);
  const refIgnored = React.useRef<HTMLElement | null>(null);
  const sync = (source: HTMLElement, target: HTMLElement | null) => {
    if (refIgnored.current === source) {
      refIgnored.current = null;
      return;
    }
    if (!target) return;

    const top = Math.round(ratio(source) * (target.scrollHeight - target.clientHeight));
    // No `scroll` event is fired when the position does not change.
    if (Math.abs(top - target.scrollTop) < 1) return;

    refIgnored.current = target;
    target.scrollTop = top;
  };
  return {
    refCode,
    refPreview,
    handleCodeScroll(event: React.UIEvent<HTMLTextAreaElement>) {
      sync(event.currentTarget, refPreview.current);
    },
    handlePreviewScroll(event: React.UIEvent<HTMLDivElement>) {
      sync(event.currentTarget, refCode.current);
    },
  };
}

/** Vertical scroll position of `element` between 0 (top) and 1 (bottom). */
function ratio(element: HTMLElement): number {
  const range = element.scrollHeight - element.clientHeight;
  return range > 0 ? element.scrollTop / range : 0;
}

function load(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function save(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The draft is just not kept.
  }
}
