import React from "react";
import { ViewOptions, ViewPanel } from "@tolokoban/ui";
import { Segment, useExpert } from "./_/hooks";

import Styles from "./page.module.css";

export default function Page() {
  const [kind, setKind] = React.useState<"mycin" | "coffee">("mycin");
  const expert = useExpert(kind);
  const [input, setInput] = React.useState("");
  const refMain = React.useRef<HTMLElement | null>(null);
  const lines = React.useMemo(() => splitLines(expert?.segments ?? []), [expert?.segments]);
  React.useEffect(() => {
    const main = refMain.current;
    if (main) main.scrollTop = main.scrollHeight;
  }, [lines, expert?.waiting, expert?.finished]);

  if (!expert) {
    return (
      <ViewPanel display="grid" placeItems="center" fullsize position="absolute">
        <main className={Styles.console}>Chargement…</main>
      </ViewPanel>
    );
  }

  return (
    <ViewPanel display="grid" placeItems="center" fullsize position="absolute">
      <ViewOptions value={kind} onChange={setKind}>
        <div key="mycin">MYCIN</div>
        <div key="coffee">Machine à café</div>
      </ViewOptions>
      <main ref={refMain} className={Styles.console}>
        {lines.map((line, index) => {
          const isLast = index === lines.length - 1;
          return (
            <div key={index} className={Styles.line}>
              {line.map((segment, key) => (
                <span key={key} className={Styles[segment.kind]}>
                  {segment.text}
                </span>
              ))}
              {isLast && expert.waiting && (
                <input
                  type="text"
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      expert.submit(input);
                      setInput("");
                    }
                  }}
                />
              )}
            </div>
          );
        })}
        {expert.finished && (
          <button
            type="button"
            onClick={() => {
              setInput("");
              expert.restart();
            }}
          >
            Nouveau diagnostic
          </button>
        )}
      </main>
    </ViewPanel>
  );
}

/**
 * Cut the segments on newlines, so that the input
 * can be displayed right after the last prompt.
 */
function splitLines(segments: Segment[]): Segment[][] {
  const lines: Segment[][] = [[]];
  for (const segment of segments) {
    segment.text.split("\n").forEach((text, index) => {
      if (index > 0) lines.push([]);
      if (text.length > 0) lines[lines.length - 1].push({ kind: segment.kind, text });
    });
  }
  return lines;
}
