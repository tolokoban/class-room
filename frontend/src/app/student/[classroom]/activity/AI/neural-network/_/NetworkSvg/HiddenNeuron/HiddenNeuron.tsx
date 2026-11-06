import { Theme } from "@tolokoban/ui";

import type { Weights } from "../../model";
import { CoefBox } from "../CoefBox";
import { HIDDEN_X, hiddenInBox, hiddenOutBox, hiddenY, RADIUS } from "../layout";

import Styles from "./HiddenNeuron.module.css";

const $ = Theme.classNames;

export interface HiddenNeuronProps {
  className?: string;
  index: number;
  weights: Weights;
  previous: Weights | null;
  /** Output of the neuron, or `null` if the network has not run yet. */
  value: number | null;
}

export function HiddenNeuron({ className, index, weights, previous, value }: HiddenNeuronProps) {
  const y = hiddenY(index);
  return (
    <g className={$.join(className, Styles.hiddenNeuron)}>
      {weights.hidden[index].map((coef, j) => (
        <CoefBox
          key={`in${j}`}
          position={hiddenInBox(index, j)}
          value={coef}
          previous={previous?.hidden[index][j]}
        />
      ))}
      <circle cx={HIDDEN_X} cy={y} r={RADIUS} />
      <text x={HIDDEN_X} y={y}>
        {value === null ? "?" : value.toFixed(2)}
      </text>
      {weights.output.map((row, c) => (
        <CoefBox
          key={`out${c}`}
          position={hiddenOutBox(index, c)}
          value={row[index]}
          previous={previous?.output[c][index]}
        />
      ))}
    </g>
  );
}
