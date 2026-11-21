import { Theme } from "@tolokoban/ui";

import { groupColor } from "../../../../_/VectorsView";
import type { FableMatch } from "../../search";
import type { PassageKind } from "../../types";
import { useTranslation } from "./translation";

import Styles from "./Result.module.css";

const $ = Theme.classNames;

export interface ResultProps {
  className?: string;
  match: FableMatch;
}

/**
 * A fable found by the search: its title and the confidence, and once expanded,
 * the passage that matched and a link to the full text.
 * When a rewording of a chunk matched, the chunk itself is shown, not its rewording.
 */
export function Result({ className, match }: ResultProps) {
  const tr = useTranslation();
  const { fable, passage, similarity, viaRewording, confidence } = match;
  const explanations: Record<PassageKind, (similarity: string) => string> = {
    whole: tr.passageWhole$,
    summary: tr.passageSummary$,
    chunk: tr.passageChunk$,
  };
  return (
    <details className={$.join(className, Styles.result)}>
      <summary>
        {/* Same color as the story in the 3D view. */}
        <span className={Styles.dot} style={{ background: groupColor(fable.story) }} />
        <strong>{fable.title}</strong>
        <em>{tr[fable.author]}</em>
        <span className={Styles.confidence} title={tr.confidence}>
          <span className={Styles.bar}>
            <span style={{ width: `${confidence * 100}%` }} />
          </span>
          <b>{formatPercent(confidence)}</b>
        </span>
      </summary>
      <div>
        <p>
          {viaRewording
            ? tr.passageRewording$(similarity.toFixed(3))
            : explanations[passage.kind](similarity.toFixed(3))}
        </p>
        <blockquote>{passage.text}</blockquote>
        {passage.kind === "summary" && <small>{tr.summaryNote}</small>}
        <a href={fable.url} target="_blank" rel="noreferrer">
          {tr.wikisource}
        </a>
      </div>
    </details>
  );
}

/** Rounded percentage. Below 1%, "< 1 %" instead of a misleading "0 %". */
function formatPercent(value: number): string {
  const percent = Math.round(value * 100);
  return percent < 1 ? "< 1 %" : `${percent} %`;
}
