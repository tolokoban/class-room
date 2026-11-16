import React from "react";

import { project } from "../projection";
import { VectorsRenderer } from "./renderer";
import { makeScene, readPalette } from "./scene";
import type { Probe } from "./types";

export function useVectorsView(vectors: Float32Array | null, probe: Probe | null) {
  const refCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const refOverlay = React.useRef<HTMLCanvasElement | null>(null);
  const [renderer, setRenderer] = React.useState<VectorsRenderer | null>(null);
  const scene = React.useMemo(() => (vectors ? makeScene(vectors) : []), [vectors]);
  const probePoint = React.useMemo(() => (probe ? project(probe.vector) : null), [probe]);
  React.useEffect(() => {
    const canvas = refCanvas.current;
    const overlay = refOverlay.current;
    if (!canvas || !overlay) return;

    const instance = new VectorsRenderer(canvas, overlay, readPalette(canvas));
    setRenderer(instance);
    return () => {
      instance.delete();
      setRenderer(null);
    };
  }, []);
  React.useEffect(() => renderer?.setScene(scene), [renderer, scene]);
  React.useEffect(() => renderer?.setProbe(probe, probePoint), [renderer, probe, probePoint]);
  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    renderer?.setPointerInside(true);
    renderer?.hover(event.clientX - rect.left, event.clientY - rect.top);
  };
  const handlePointerLeave = () => renderer?.setPointerInside(false);
  return { refCanvas, refOverlay, handlePointerMove, handlePointerLeave };
}
