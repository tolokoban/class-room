import React from "react";

import { createRetina, type Retina } from "./retina";
import type { RetinaHandle } from "./Retina";

/**
 * Stream the webcam into the canvas as long as it is mounted.
 * When `live` is false, the last frame stays on the canvas and the webcam is released.
 * The `ref` gives access to `clear()` and `frame()`.
 */
export function useRetinaCanvas(
  live: boolean,
  ref: React.Ref<RetinaHandle> | undefined,
  onFrame?: (image: Uint8Array) => void,
) {
  const refCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const refRetina = React.useRef<Retina | null>(null);
  // The webcam must not restart each time the callback changes.
  const refOnFrame = React.useRef(onFrame);
  refOnFrame.current = onFrame;
  const refLive = React.useRef(live);
  refLive.current = live;
  React.useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const retina = createRetina(canvas, (image) => refOnFrame.current?.(image));
    retina.setLive(refLive.current);
    refRetina.current = retina;
    return () => {
      refRetina.current = null;
      retina.destroy();
    };
  }, []);
  React.useEffect(() => {
    refRetina.current?.setLive(live);
  }, [live]);
  React.useImperativeHandle(
    ref,
    () => ({
      clear: () => refRetina.current?.clear(),
      frame: () => refRetina.current?.frame(),
    }),
    [],
  );
  return refCanvas;
}
