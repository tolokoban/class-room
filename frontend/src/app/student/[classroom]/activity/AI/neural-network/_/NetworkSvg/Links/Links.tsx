import { Theme } from "@tolokoban/ui";

import { HIDDEN_COUNT, INPUT_COUNT, OUTPUT_COUNT } from "../../model";
import {
  BOX_HEIGHT,
  BOX_WIDTH,
  HIDDEN_X,
  hiddenInBox,
  hiddenOutBox,
  hiddenY,
  INPUT_X,
  inputY,
  OUTPUT_X,
  outputBiasBox,
  outputY,
  type Point,
  RADIUS,
} from "../layout";

import Styles from "./Links.module.css";

const $ = Theme.classNames;

export interface LinksProps {
  className?: string;
}

/**
 * All the lines between the neurons and their coefficient boxes.
 */
export function Links({ className }: LinksProps) {
  return (
    <g className={$.join(className, Styles.links)}>
      {computeLines().map(([a, b], index) => (
        <line key={index} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
      ))}
    </g>
  );
}

function computeLines(): Array<[Point, Point]> {
  const lines: Array<[Point, Point]> = [];
  for (let k = 0; k < HIDDEN_COUNT; k++) {
    const y = hiddenY(k);
    // Inputs → input coefficients → hidden neuron (the last box is the bias).
    for (let j = 0; j <= INPUT_COUNT; j++) {
      const box = hiddenInBox(k, j);
      const middle = box.y + BOX_HEIGHT / 2;
      if (j < INPUT_COUNT)
        lines.push([
          { x: INPUT_X + RADIUS, y: inputY(j) },
          { x: box.x, y: middle },
        ]);
      lines.push([
        { x: box.x + BOX_WIDTH, y: middle },
        { x: HIDDEN_X - RADIUS, y },
      ]);
    }
    // Hidden neuron → output coefficients → outputs.
    for (let c = 0; c < OUTPUT_COUNT; c++) {
      const box = hiddenOutBox(k, c);
      const middle = box.y + BOX_HEIGHT / 2;
      lines.push([
        { x: HIDDEN_X + RADIUS, y },
        { x: box.x, y: middle },
      ]);
      lines.push([
        { x: box.x + BOX_WIDTH, y: middle },
        { x: OUTPUT_X - RADIUS, y: outputY(c) },
      ]);
    }
  }
  for (let c = 0; c < OUTPUT_COUNT; c++) {
    lines.push([
      { x: OUTPUT_X, y: outputY(c) + RADIUS },
      { x: OUTPUT_X, y: outputBiasBox(c).y },
    ]);
  }
  return lines;
}
