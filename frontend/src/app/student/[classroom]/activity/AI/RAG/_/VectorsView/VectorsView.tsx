import { Theme } from "@tolokoban/ui";

import type { Projection } from "../projection";
import { useVectorsView } from "./hooks";
import { useTranslation } from "./translation";
import type { Probe, ScenePoint } from "./types";

import Styles from "./VectorsView.module.css";

const $ = Theme.classNames;

export interface VectorsViewProps {
  className?: string;
  /**
   * The precomputed embeddings, placed in 3D with `project()`.
   * Empty while loading. Keep the same array between renders (`React.useMemo`):
   * the scene is rebuilt each time it changes.
   */
  scene: ScenePoint[];
  /** To place the student's sentence in the same 3D space as the scene. */
  projection: Projection;
  /** Last sentence of the student, if any. */
  probe: Probe | null;
}

/**
 * Embeddings in 3D (Fisher LDA, see `../lda.ts`), one color per group,
 * and the student's last sentence linked to its closest points.
 */
export function VectorsView({ className, scene, projection, probe }: VectorsViewProps) {
  const tr = useTranslation();
  const { refCanvas, refOverlay, handlePointerMove, handlePointerLeave } = useVectorsView(
    scene,
    projection,
    probe,
  );
  return (
    <div className={$.join(className, Styles.vectorsView)}>
      <canvas
        ref={refCanvas}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      />
      <canvas ref={refOverlay} />
      <small>{tr.hint}</small>
    </div>
  );
}
