import React from "react";
import { Interpreter } from "./lisp/interpreter";

import MycinUrl from "../mycin.lisp";
import CoffeeUrl from "../coffee.lisp";

export type SegmentKind = "output" | "input" | "info" | "error";

export interface Segment {
  kind: SegmentKind;
  text: string;
}

interface Expert {
  url: string;
  /** Lisp expression that starts a consultation. */
  start: string;
  banner: string;
}

const EXPERTS: Record<string, Expert> = {
  mycin: {
    url: MycinUrl,
    start: "(mycin)",
    banner: "MYCIN — tapez « help » pour obtenir de l'aide.\n",
  },
  coffee: {
    url: CoffeeUrl,
    start: "(diagnostiquer-machine-cafe)",
    banner: "",
  },
};

/**
 * Fetch the Lisp program of the expert `kind` (`coffee.lisp` for "coffee",
 * `mycin.lisp` otherwise), run it in our Lisp interpreter and expose its console.
 * Returns `undefined` while the program is being fetched.
 */
export function useExpert(kind: string) {
  const expert = EXPERTS[kind] ?? EXPERTS.mycin;
  const source = useSource(expert.url);
  const [segments, setSegments] = React.useState<Segment[]>([]);
  const [waiting, setWaiting] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const refInterpreter = React.useRef<Interpreter | null>(null);
  const refResolve = React.useRef<((line: string) => void) | null>(null);
  const refAlive = React.useRef(true);

  const append = React.useCallback((kind: SegmentKind, text: string) => {
    if (!refAlive.current) return;
    setSegments((previous) => {
      const last = previous[previous.length - 1];
      if (last?.kind === kind) {
        return [...previous.slice(0, -1), { kind, text: last.text + text }];
      }
      return [...previous, { kind, text }];
    });
  }, []);

  const run = React.useCallback(
    async (...programs: string[]) => {
      const interpreter = refInterpreter.current;
      if (!interpreter) return;
      setFinished(false);
      if (expert.banner) append("info", expert.banner);
      try {
        for (const program of programs) await interpreter.run(program);
      } catch (ex) {
        const message = ex instanceof Error ? ex.message : String(ex);
        append("error", `\n*** Erreur Lisp : ${message}\n`);
      }
      if (refAlive.current) setFinished(true);
    },
    [append, expert],
  );

  React.useEffect(() => {
    if (source === undefined) return;
    refAlive.current = true;
    setSegments([]);
    setWaiting(false);
    setFinished(false);
    refInterpreter.current = new Interpreter({
      write: (text) => append("output", text),
      readLine: () =>
        new Promise<string>((resolve) => {
          refResolve.current = resolve;
          if (refAlive.current) setWaiting(true);
        }),
    });
    void run(source, expert.start);
    return () => {
      // A pending READ-LINE will never resolve: the interpreter
      // is simply garbage collected with its pending promise.
      refAlive.current = false;
      refInterpreter.current = null;
      refResolve.current = null;
    };
  }, [append, run, source, expert]);

  if (source === undefined) return undefined;

  const submit = (line: string) => {
    const resolve = refResolve.current;
    if (!resolve) return;
    refResolve.current = null;
    setWaiting(false);
    append("input", `${line}\n`);
    resolve(line);
  };

  const restart = () => {
    setSegments([]);
    void run(expert.start);
  };

  return { segments, waiting, finished, submit, restart };
}

/**
 * Fetch the text at `url`, or `undefined` while the request is in progress.
 * A failed fetch yields a Lisp program that reports the error.
 */
function useSource(url: string): string | undefined {
  const [loaded, setLoaded] = React.useState<{ url: string; source: string } | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .catch((ex) => {
        const message = ex instanceof Error ? ex.message : String(ex);
        // The message goes through "~a", so that a "~" in it is not read as a FORMAT directive.
        return `(error "~a" ${JSON.stringify(`Impossible de charger ${url} : ${message}`)})`;
      })
      .then((source) => {
        if (alive) setLoaded({ url, source });
      });
    return () => {
      alive = false;
    };
  }, [url]);

  return loaded?.url === url ? loaded.source : undefined;
}
