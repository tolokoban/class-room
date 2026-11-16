import {
  IconAdd,
  IconPause,
  IconPlay,
  IconReset,
  Theme,
  ViewButton,
  ViewInputNumber,
} from "@tolokoban/ui";

import { WrittenTimer } from "@/components/WrittenTimer";
import { WrittenRef, WrittenTimer as WrittenTimerData } from "@/service/calls/written";

import { useTimerPanel } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./TimerPanel.module.css";

const $ = Theme.classNames;

export interface TimerPanelProps {
  className?: string;
  writtenRef: WrittenRef;
  timer: WrittenTimerData;
  /** UNIX timestamp (seconds) of the server when `timer` has been fetched. */
  now: number;
}

/**
 * The timer of a written production, with the buttons to control it.
 */
export function TimerPanel({ className, writtenRef, timer, now }: TimerPanelProps) {
  const tr = useTranslation();
  const panel = useTimerPanel(writtenRef);
  const { state } = timer;

  return (
    <section className={$.join(className, Styles.timerPanel)}>
      <WrittenTimer timer={timer} now={now} />
      <footer>
        {state === "idle" && (
          <ViewButton icon={IconPlay} waiting={panel.isPending} onClick={panel.start}>
            {tr.start}
          </ViewButton>
        )}
        {state === "running" && (
          <ViewButton icon={IconPause} waiting={panel.isPending} onClick={panel.pause}>
            {tr.pause}
          </ViewButton>
        )}
        {state === "paused" && (
          <ViewButton icon={IconPlay} waiting={panel.isPending} onClick={panel.resume}>
            {tr.resume}
          </ViewButton>
        )}
        {state !== "idle" && (
          <div>
            <ViewInputNumber
              label={tr.minutes}
              min={1}
              max={600}
              value={panel.minutes}
              onChange={panel.setMinutes}
            />
            <ViewButton icon={IconAdd} waiting={panel.isPending} onClick={panel.add}>
              {tr.add}
            </ViewButton>
          </div>
        )}
        {state !== "idle" && (
          <ViewButton
            variant="text"
            color="error"
            icon={IconReset}
            waiting={panel.isPending}
            onClick={panel.reset}
          >
            {tr.reset}
          </ViewButton>
        )}
      </footer>
    </section>
  );
}
