import React from "react";

import { Notif } from "@/components/Notification";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { useServiceFileNotes, useServiceFileNotesSet } from "@/service/hooks/file";

import { useTranslation } from "./translation";

export function useClassroomNotes(classroom: string) {
  const tr = useTranslation();
  const server = useServiceFileNotes(classroom);
  const service = useServiceFileNotesSet();
  const translateError = useApiErrorTranslator();
  const storageKey = `classroom-notes/${classroom}`;
  /** Not saved on the server yet (`null` if there is no draft). */
  const [draft, setDraft] = React.useState<string | null>(() => readSessionStorage(storageKey));
  const [tab, setTab] = React.useState<string | undefined>("view");
  const content = draft ?? server.data ?? "";
  const refTextarea = useAutoResize(content, tab);

  const update = (value: string) => {
    setDraft(value);
    writeSessionStorage(storageKey, value);
  };
  const save = () => {
    service
      .mutate({ classroomCode: classroom, content })
      .then(() => {
        setDraft(null);
        writeSessionStorage(storageKey, null);
        Notif.info(tr.saved);
      })
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return {
    isLoading: server.isLoading,
    error: server.error,
    isPending: service.isPending,
    isModified: draft !== null && draft !== server.data,
    content,
    tab,
    setTab,
    refTextarea,
    update,
    save,
  };
}

/**
 * Make the textarea as high as its content, so that the section grows with it.
 */
function useAutoResize(content: string, tab: string | undefined) {
  const ref = React.useRef<HTMLTextAreaElement | null>(null);
  React.useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  }, [content, tab]);
  return ref;
}

function readSessionStorage(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSessionStorage(key: string, value: string | null) {
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, value);
  } catch (ex) {
    console.error(`Unable to store "${key}" in the session storage:`, ex);
  }
}
