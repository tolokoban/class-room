import { Theme } from "@tolokoban/ui";
import type React from "react";

import { useRetinaCanvas } from "./hooks";

import Styles from "./Retina.module.css";

const $ = Theme.classNames;

export interface RetinaProps {
  className?: string;
  /**
   * If `false`, the webcam is not read anymore, and the last frame stays on the canvas.
   * The user can then draw on it with the pointer.
   * Default to `false`.
   */
  live?: boolean;
  ref?: React.Ref<RetinaHandle>;
  /**
   * Called at each frame with the cells, row by row from the top: 1 for dark, 0 for light.
   * The same array is reused from one frame to the next.
   */
  onFrame?(image: Uint8Array): void;
}

export interface RetinaHandle {
  /** Turn all the cells into background, as if the webcam saw a blank sheet. */
  clear(): void;
  /** Frame the drawing like the webcam image (cropped, scaled and centered), and display it. */
  frame(): void;
}

/**
 * The webcam, as seen by the perceptron: a grid of 20×20 light or dark cells.
 * When the webcam is off, the user can draw on this grid.
 */
export function Retina({ className, live = false, ref, onFrame }: RetinaProps) {
  const refCanvas = useRetinaCanvas(live, ref, onFrame);
  return (
    <canvas ref={refCanvas} className={$.join(className, Styles.retina, !live && Styles.draw)} />
  );
}
