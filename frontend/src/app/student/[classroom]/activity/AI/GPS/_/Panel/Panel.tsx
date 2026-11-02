import { Theme, ViewButton } from "@tolokoban/ui";

import type { AStar } from "../astar";
import type { Maze } from "../maze";
import { CandidatesTable } from "./CandidatesTable";
import { formatDistance, formatDuration } from "./format";
import { useTranslation } from "./translation";

import Styles from "./Panel.module.css";

const $ = Theme.classNames;

export interface PanelProps {
  className?: string;
  maze: Maze;
  astar: AStar;
  /** True while the new paths are growing. */
  animating: boolean;
  /** Number of cells and cost of the shortest path, once it has been found. */
  found: { cells: number; cost: number } | null;
  /** Number of steps played by the "add steps" button. */
  steps: number;
  onNextStep(): void;
  onAddSteps(): void;
}

export function Panel({
  className,
  maze,
  astar,
  animating,
  found,
  steps,
  onNextStep,
  onAddSteps,
}: PanelProps) {
  const tr = useTranslation();
  const enabled = !astar.done && !animating;
  return (
    <section className={$.join(className, Styles.panel)}>
      <div>
        <ViewButton color="secondary-5" enabled={enabled} onClick={onNextStep}>
          {tr.nextStep}
        </ViewButton>
        <ViewButton color="secondary-5" enabled={enabled} onClick={onAddSteps}>
          {tr.addSteps$(`${steps}`)}
        </ViewButton>
      </div>
      <p className={Styles.counters}>
        <span>{tr.steps$(`${astar.steps}`)}</span>
        <span>{tr.routes$(`${astar.routes}`)}</span>
      </p>
      {found !== null && (
        <p>{tr.found$(formatDistance(found.cells), formatDuration(found.cost))}</p>
      )}
      <CandidatesTable maze={maze} astar={astar} />
    </section>
  );
}
