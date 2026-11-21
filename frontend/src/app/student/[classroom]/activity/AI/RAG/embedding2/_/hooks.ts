import React from "react";

import { Notif } from "@/components/Notification/manager";
import { embed } from "../../_/embedder";
import { useEmbedder } from "../../_/hooks";
import type { Probe } from "../../_/VectorsView";
import { useShowFablesList } from "./FablesList";
import { PROJECTION } from "./data/projection";
import { makeScene, toNeighbour, type Labels } from "./scene";
import { type FableMatch, rankFables } from "./search";
import { useTranslation } from "./translation";

import VectorsUrl from "./data/vectors.dat";

/** Number of fables shown to the student, and linked to their sentence in the 3D view. */
const RESULTS_COUNT = 3;

/** The last search of the student. */
export interface Search {
  query: string;
  /** The `RESULTS_COUNT` closest fables, the closest first. */
  results: FableMatch[];
}

/**
 * State of the page: loading of the model, the student's sentence,
 * the last search and what the 3D view shows.
 * A new search is ignored while the previous one is still running.
 */
export function useFableSearch() {
  const tr = useTranslation();
  const showFablesList = useShowFablesList();
  const embedder = useEmbedder(VectorsUrl);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [search, setSearch] = React.useState<Search | null>(null);
  const [probe, setProbe] = React.useState<Probe | null>(null);
  const refInput = React.useRef<HTMLInputElement | null>(null);
  const ready = embedder.status === "ready";
  const vectors = ready ? embedder.vectors : null;
  // `tr` is a new object at each render, but the scene must be rebuilt only
  // when the texts change (when the language changes).
  const { esope, phedre, lafontaine, whole, summary, chunk } = tr;
  const labels: Labels = React.useMemo(
    () => ({ esope, phedre, lafontaine, whole, summary, chunk }),
    [esope, phedre, lafontaine, whole, summary, chunk],
  );
  const scene = React.useMemo(() => (vectors ? makeScene(vectors, labels) : []), [vectors, labels]);
  React.useEffect(() => {
    if (ready) refInput.current?.focus();
  }, [ready]);
  const handleSearch = () => {
    const query = input.trim();
    if (embedder.status !== "ready" || busy || query.length === 0) return;

    setBusy(true);
    embed(embedder.extractor, query)
      .then((vector) => {
        const ranking = rankFables(vector, embedder.vectors);
        const results = ranking.slice(0, RESULTS_COUNT);
        const farthest = ranking[ranking.length - 1];
        setSearch({ query, results });
        setProbe({
          text: query,
          vector,
          neighbours: results.map((match) => toNeighbour(match, labels)),
          farthest: farthest ? toNeighbour(farthest, labels) : null,
        });
      })
      .catch((error: unknown) => Notif.error(error))
      .finally(() => setBusy(false));
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch();
  };
  return {
    tr,
    embedder,
    ready,
    busy,
    scene,
    projection: PROJECTION,
    probe,
    search,
    showFablesList,
    refInput,
    input,
    setInput,
    handleSearch,
    handleKeyDown,
  };
}
