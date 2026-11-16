import React from "react";

import { useConfirm } from "@/components/Confirm";
import { Notif } from "@/components/Notification";
import { WrittenItem } from "@/service/calls/written";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import {
  useServiceWrittenAdd,
  useServiceWrittenDelete,
  useServiceWrittenUpdate,
} from "@/service/hooks/written";

import {
  countDeletedUploads,
  Draft,
  DraftError,
  DraftFile,
  draftToDefinition,
  itemToDraft,
  makeDraftFile,
  validateDraft,
} from "./draft";
import { useTranslation } from "./translation";

export function useWrittenEditor(
  item: WrittenItem | undefined,
  onSaved: (id: number) => void,
  onDeleted: () => void,
) {
  const [draft, setDraft] = React.useState<Draft>(() => itemToDraft(item));
  const [tab, setTab] = React.useState<string | undefined>("edit");
  const update = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }));
  const updateFile = (key: string, patch: Partial<DraftFile>) =>
    setDraft((current) => ({
      ...current,
      files: current.files.map((file) => (file.key === key ? { ...file, ...patch } : file)),
    }));

  return {
    draft,
    tab,
    setTab,
    update,
    updateFile,
    addFile: () => update({ files: [...draft.files, makeDraftFile()] }),
    removeFile: (key: string) => update({ files: draft.files.filter((file) => file.key !== key) }),
    ...useSave(item, draft, onSaved),
    ...useDelete(item, onDeleted),
  };
}

function useSave(item: WrittenItem | undefined, draft: Draft, onSaved: (id: number) => void) {
  const tr = useTranslation();
  const confirm = useConfirm();
  const translateError = useApiErrorTranslator();
  const adding = useServiceWrittenAdd();
  const updating = useServiceWrittenUpdate();

  const save = async () => {
    const error = validateDraft(draft);
    if (error) {
      Notif.error(getErrorMessage(error, tr));
      return;
    }
    const deleted = countDeletedUploads(item, draft);
    if (
      deleted > 0 &&
      !(await confirm({ content: tr.filesChangedConfirm$(String(deleted)), accent: true }))
    ) {
      return;
    }
    const definition = draftToDefinition(draft);
    try {
      const id = item ? item.id : await adding.mutate(definition);
      if (item) await updating.mutate({ ...definition, id });
      Notif.info(tr.saved$(definition.name));
      onSaved(id);
    } catch (ex) {
      Notif.error(translateError(ex));
    }
  };

  return { isSaving: adding.isPending || updating.isPending, save: () => void save() };
}

function getErrorMessage(error: DraftError, tr: ReturnType<typeof useTranslation>): string {
  switch (error.key) {
    case "errorFileName":
      return tr.errorFileName$(error.name);
    case "errorFileDuplicate":
      return tr.errorFileDuplicate$(error.name);
    default:
      return tr[error.key];
  }
}

function useDelete(item: WrittenItem | undefined, onDeleted: () => void) {
  const tr = useTranslation();
  const translateError = useApiErrorTranslator();
  const deleting = useServiceWrittenDelete();

  const remove = () => {
    if (!item) return;

    deleting
      .mutate({ id: item.id })
      .then(() => {
        Notif.info(tr.deleted$(item.name));
        onDeleted();
      })
      .catch((error: unknown) => Notif.error(translateError(error)));
  };

  return { isDeleting: deleting.isPending, remove };
}
