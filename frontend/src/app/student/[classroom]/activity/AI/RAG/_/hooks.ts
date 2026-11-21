import React from "react";

import { addProgressListener, loadModel, type Model } from "./embedder";

export type EmbedderState =
  | { status: "loading"; progress: number; remaining: number | null }
  | { status: "error"; message: string }
  | ({ status: "ready" } & Model);

/**
 * Load the model and the precomputed embeddings of the activity,
 * and follow the progress of the download.
 * @param vectorsUrl URL of the `vectors.dat` file of the activity.
 * @param loadExtra Other models needed by the activity: the state is "ready" only
 * when they are loaded too. See `loadModel()`.
 * Caveat: it must be a stable function (defined outside of any component),
 * otherwise the models are loaded again at each render.
 */
export function useEmbedder(vectorsUrl: string, loadExtra?: () => Promise<unknown>): EmbedderState {
  const [state, setState] = React.useState<EmbedderState>({
    status: "loading",
    progress: 0,
    remaining: null,
  });
  React.useEffect(() => {
    let alive = true;
    const removeListener = addProgressListener((progress, remaining) => {
      if (alive) setState({ status: "loading", progress, remaining });
    });
    loadModel(vectorsUrl, loadExtra)
      .then((model) => {
        if (alive) setState({ status: "ready", ...model });
      })
      .catch((error: unknown) => {
        if (alive)
          setState({
            status: "error",
            message: error instanceof Error ? error.message : String(error),
          });
      })
      .finally(removeListener);
    return () => {
      alive = false;
      removeListener();
    };
  }, [vectorsUrl, loadExtra]);
  return state;
}
