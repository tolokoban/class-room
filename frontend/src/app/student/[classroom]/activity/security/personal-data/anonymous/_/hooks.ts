import React from "react";

import { Notif } from "@/components/Notification/manager";
import { addProgressListener, detect, type Entity, loadModel } from "./pii";
import { useTranslation } from "./translation";

export type DetectorState =
  | { status: "loading"; progress: number; remaining: number | null }
  | { status: "error"; message: string }
  | { status: "ready"; detect: (text: string) => Promise<Entity[]> };

export function useDetector(): DetectorState {
  const [state, setState] = React.useState<DetectorState>({ status: "loading", progress: 0, remaining: null });
  React.useEffect(() => {
    let alive = true;
    const removeListener = addProgressListener((progress, remaining) => {
      if (alive) setState({ status: "loading", progress, remaining });
    });
    loadModel()
      .then((ner) => {
        if (alive) setState({ status: "ready", detect: (text) => detect(ner, text) });
      })
      .catch((error: unknown) => {
        if (alive) setState({ status: "error", message: error instanceof Error ? error.message : String(error) });
      })
      .finally(removeListener);
    return () => {
      alive = false;
      removeListener();
    };
  }, []);
  return state;
}

/**
 * "Chargement du modèle d'IA… 42 % (encore environ 1 min 05 s)"
 */
export function useLoadingMessage(detector: DetectorState): string | null {
  const tr = useTranslation();
  if (detector.status !== "loading") return null;

  const progress = `${Math.round(detector.progress)}`;
  return detector.remaining === null
    ? tr.loading$(progress)
    : tr.loadingRemaining$(progress, formatDuration(detector.remaining));
}

function formatDuration(seconds: number): string {
  const total = Math.ceil(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  if (minutes === 0) return `${rest} s`;

  return `${minutes} min ${`${rest}`.padStart(2, "0")} s`;
}

export function useAnonymous() {
  const tr = useTranslation();
  const detector = useDetector();
  // `null` means "not edited yet": we show the example of the current language.
  const [text, setText] = React.useState<string | null>(null);
  const [entities, setEntities] = React.useState<Entity[]>([]);
  const [busy, setBusy] = React.useState(false);
  const value = text ?? tr.example;
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    // The offsets of the entities are meaningless for the new text.
    setEntities([]);
  };
  const handleAnonymize = () => {
    if (detector.status !== "ready") return;

    setBusy(true);
    detector
      .detect(value)
      .then(setEntities)
      .catch((error: unknown) => Notif.error(error))
      .finally(() => setBusy(false));
  };
  return { tr, detector, value, entities, busy, handleChange, handleAnonymize };
}
