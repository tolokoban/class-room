import { Theme } from "@tolokoban/ui";

import { useVectorsView } from "./hooks";
import { useTranslation } from "./translation";
import type { Probe } from "./types";

import Styles from "./VectorsView.module.css";

const $ = Theme.classNames;

export interface VectorsViewProps {
  className?: string;
  /** Precomputed embeddings, or `null` while loading. */
  vectors: Float32Array | null;
  /** Last sentence of the student, if any. */
  probe: Probe | null;
}

/**
 * The wordings of the questions in 3D (Fisher LDA, see `../lda.ts`),
 * one color per question, and the student's last sentence linked to its closest questions.
 */
export function VectorsView({ className, vectors, probe }: VectorsViewProps) {
  const tr = useTranslation();
  const { refCanvas, refOverlay, handlePointerMove, handlePointerLeave } = useVectorsView(
    vectors,
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
