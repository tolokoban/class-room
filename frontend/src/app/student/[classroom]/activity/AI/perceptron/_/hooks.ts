import React from "react";

import { useConfirm } from "@/components/Confirm";
import { learnAndRevise, predict } from "./model";
import type { RetinaHandle } from "./Retina";
import { createPerceptron, PerceptronState, restoreExample, storeExample } from "./state";
import { useTranslation } from "./translation";
import { PRETRAINED_STEPS, PRETRAINED_WEIGHTS } from "./weights";

interface Attempt {
  /** The image, frozen when the user asked to recognize it. */
  image: Uint8Array;
  guess: number;
}

export function usePerceptron() {
  const tr = useTranslation();
  const confirm = useConfirm();
  const perceptron = PerceptronState.useValue();
  const { weights, steps, answers, successes, pretrained, examples } = perceptron;
  const refFrame = React.useRef<Uint8Array | null>(null);
  const [attempt, setAttempt] = React.useState<Attempt | null>(null);
  const refRetina = React.useRef<RetinaHandle | null>(null);
  const [webcam, setWebcam] = React.useState(false);
  const handleFrame = (image: Uint8Array) => {
    refFrame.current = image;
  };
  const handleErase = () => refRetina.current?.clear();
  const handleRecognize = () => {
    // The perceptron sees the drawing as it would see the webcam: framed. It updates `refFrame`.
    refRetina.current?.frame();
    const frame = refFrame.current;
    if (!frame) return;

    const image = new Uint8Array(frame);
    setAttempt({ image, guess: predict(weights, image) });
  };
  const handleAnswer = (digit: number) => {
    if (!attempt) return;

    const { image, guess } = attempt;
    const score = { answers: answers + 1, successes: successes + (guess === digit ? 1 : 0) };
    PerceptronState.value = pretrained
      ? // A pre-trained perceptron is only evaluated, it does not learn.
        { ...perceptron, ...score }
      : {
          ...perceptron,
          ...score,
          weights: learnAndRevise(weights, image, digit, examples.map(restoreExample)),
          steps: steps + 1,
          examples: [...examples, storeExample({ image, digit })],
        };
    setAttempt(null);
    refRetina.current?.clear();
  };
  const handleRestart = async () => {
    const confirmed = await confirm({ content: tr.restartConfirm, accent: true });
    if (!confirmed) return;

    PerceptronState.value = createPerceptron();
    setAttempt(null);
  };
  const handleUsePretrained = async () => {
    // Only ask for confirmation if there is some training to lose.
    if (steps > 0 && !pretrained) {
      const confirmed = await confirm({ content: tr.pretrainedConfirm, accent: true });
      if (!confirmed) return;
    }
    PerceptronState.value = {
      weights: PRETRAINED_WEIGHTS.slice(),
      steps: PRETRAINED_STEPS,
      answers: 0,
      successes: 0,
      pretrained: true,
      examples: [],
    };
    setAttempt(null);
  };
  useKeyboardShortcuts({
    onErase: webcam ? undefined : handleErase,
    onRecognize: handleRecognize,
    onDigit: attempt ? handleAnswer : undefined,
  });
  return {
    tr,
    steps,
    pretrained,
    answers,
    successes,
    attempt,
    webcam,
    setWebcam,
    refRetina,
    handleFrame,
    handleErase,
    handleRecognize,
    handleAnswer,
    handleRestart,
    handleUsePretrained,
  };
}

interface KeyboardShortcuts {
  /** Backspace or Delete. */
  onErase?(): void;
  /** Enter or Space. */
  onRecognize?(): void;
  /** Keys from 0 to 9. */
  onDigit?(digit: number): void;
}

/**
 * Listen to the keyboard as long as the component is mounted.
 * An undefined handler disables its shortcut.
 */
function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  // The listener must not be added again each time the handlers change.
  const refShortcuts = React.useRef(shortcuts);
  refShortcuts.current = shortcuts;
  React.useEffect(() => {
    const handleKeyDown = (evt: KeyboardEvent) => {
      if (evt.ctrlKey || evt.altKey || evt.metaKey || isEditable(evt.target)) return;

      const { onErase, onRecognize, onDigit } = refShortcuts.current;
      const action = getAction(evt.key, onErase, onRecognize, onDigit);
      if (!action) return;

      // Prevent Space from scrolling the page, and Enter or Space from clicking the focused button.
      evt.preventDefault();
      action();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

function getAction(
  key: string,
  onErase?: () => void,
  onRecognize?: () => void,
  onDigit?: (digit: number) => void,
): (() => void) | undefined {
  switch (key) {
    case "Backspace":
    case "Delete":
      return onErase;
    case "Enter":
    case " ":
      return onRecognize;
  }
  if (onDigit && /^[0-9]$/.test(key)) return () => onDigit(Number(key));

  return undefined;
}

function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}
