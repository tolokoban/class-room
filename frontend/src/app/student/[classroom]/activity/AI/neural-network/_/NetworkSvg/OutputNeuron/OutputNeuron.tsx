import { Theme } from "@tolokoban/ui";

import { formatPercent, ICONS } from "../../icons";
import { ITEMS, type Weights } from "../../model";
import { CoefBox } from "../CoefBox";
import { OUTPUT_X, outputBiasBox, outputY, RADIUS } from "../layout";

import Styles from "./OutputNeuron.module.css";

const $ = Theme.classNames;

export interface OutputNeuronProps {
  className?: string;
  index: number;
  weights: Weights;
  previous: Weights | null;
  /** Confidence between 0 and 1, or `null` if the network has not run yet. */
  value: number | null;
}

export function OutputNeuron({ className, index, weights, previous, value }: OutputNeuronProps) {
  const y = outputY(index);
  return (
    <g className={$.join(className, Styles.outputNeuron)}>
      <circle cx={OUTPUT_X} cy={y} r={RADIUS} />
      <text x={OUTPUT_X} y={y}>
        {value === null ? "?" : `${formatPercent(value)}%`}
      </text>
      <text className={Styles.icon} x={OUTPUT_X + RADIUS + 8} y={y}>
        {ICONS[ITEMS[index]]}
      </text>
      <CoefBox
        position={outputBiasBox(index)}
        value={weights.outputBias[index]}
        previous={previous?.outputBias[index]}
        bias
      />
    </g>
  );
}
