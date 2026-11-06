import { Theme } from "@tolokoban/ui";

import { HIDDEN_COUNT, ITEMS, type Run, type Weights } from "../model";
import { HiddenNeuron } from "./HiddenNeuron";
import { HEIGHT, INPUT_X, inputY, RADIUS, WIDTH } from "./layout";
import { Links } from "./Links";
import { OutputNeuron } from "./OutputNeuron";
import { useTranslation } from "./translation";

import Styles from "./NetworkSvg.module.css";

const $ = Theme.classNames;

export interface NetworkSvgProps {
  className?: string;
  weights: Weights;
  /** Weights before the last correction, to highlight what changed. */
  previous: Weights | null;
  /** Values of the neurons, or `null` if the network has not run yet. */
  run: Run | null;
}

export function NetworkSvg({ className, weights, previous, run }: NetworkSvgProps) {
  const tr = useTranslation();
  const inputs = run?.inputs ?? [null, null, null];
  return (
    <div className={$.join(className, Styles.networkSvg)}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <Links />
        {inputs.map((value, j) => (
          <g key={j} className={Styles.input}>
            <circle cx={INPUT_X} cy={inputY(j)} r={RADIUS} />
            <text x={INPUT_X} y={inputY(j)}>
              {/* Displayed as a binary digit, but computed with -1 for 0. */}
              {value === null ? "?" : value > 0 ? "+1" : "0"}
            </text>
          </g>
        ))}
        {Array.from({ length: HIDDEN_COUNT }, (_, k) => (
          <HiddenNeuron
            key={k}
            index={k}
            weights={weights}
            previous={previous}
            value={run?.hidden[k] ?? null}
          />
        ))}
        {ITEMS.map((item, c) => (
          <OutputNeuron key={item} index={c} value={run?.outputs[c] ?? null} />
        ))}
      </svg>
      {previous && <p>{tr.changes}</p>}
    </div>
  );
}
