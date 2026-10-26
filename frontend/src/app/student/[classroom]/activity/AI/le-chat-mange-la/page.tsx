import React from "react";
import { ViewPanel } from "@tolokoban/ui";
import { applyTemperature, type Candidates, Prediction, usePredictor } from "./_/hooks";

import Styles from "./page.module.css";

const MAX_WORDS = 12;

export default function Page() {
  const predictor = usePredictor();
  const [sentence, setSentence] = React.useState("Le chat mange la");
  const [temperature, setTemperature] = React.useState(1);
  const [candidates, setCandidates] = React.useState<Candidates | null>(null);
  const [busy, setBusy] = React.useState(false);
  // The model only runs on click: moving the slider just recomputes the probabilities.
  const predictions = React.useMemo(
    () => (candidates ? applyTemperature(candidates, temperature, MAX_WORDS) : []),
    [candidates, temperature],
  );
  const ready = predictor.status === "ready";
  const handlePredict = async (text = sentence) => {
    if (predictor.status !== "ready" || text.trim().length === 0) return;
    setBusy(true);
    try {
      setCandidates(await predictor.predict(text));
    } finally {
      setBusy(false);
    }
  };

  const handleWordClick = (word: string) => {
    const start = sentence.trimEnd();
    // No space after an apostrophe: "l'" + "eau" gives "l'eau".
    const separator = /['’]$/.test(start) ? "" : " ";
    const text = `${start}${separator}${word}`;
    setSentence(text);
    void handlePredict(text);
  };

  return (
    <ViewPanel display="grid" placeItems="center" fullsize position="absolute">
      <main className={Styles.console}>
        {predictor.status !== "loading" && (
          <>
            <input
              type="text"
              autoFocus
              value={sentence}
              placeholder="Début de phrase à compléter…"
              onChange={(e) => setSentence(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handlePredict();
              }}
            />
            <label className={Styles.temperature}>
              <span>Température</span>
              <input
                type="range"
                min={0.05}
                max={10}
                step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
              />
              <span>{temperature.toFixed(2)}</span>
            </label>
            <ViewPanel display="flex" justifyContent="space-between" className={Styles.buttons}>
              <button type="button" disabled={!ready || busy} onClick={() => void handlePredict()}>
                Prédire la suite
              </button>
              <button type="button" disabled={!ready || busy} onClick={() => void setSentence("")}>
                Tout recommencer
              </button>
            </ViewPanel>
          </>
        )}
        {predictor.status === "loading" && (
          <p className={Styles.info}>Chargement du modèle… {Math.round(predictor.progress)} %</p>
        )}
        {predictor.status === "error" && (
          <p className={Styles.error}>Impossible de charger le modèle : {predictor.message}</p>
        )}
        {predictions.length > 0 && (
          <>
            <div className={Styles.bars}>
              {predictions.map(({ word, probability }) => (
                <React.Fragment key={word}>
                  <button
                    type="button"
                    className={Styles.word}
                    disabled={busy}
                    onClick={() => handleWordClick(word)}
                  >
                    {word}
                  </button>
                  <div className={Styles.bar}>
                    <div
                      style={{ width: `${(probability / predictions[0].probability) * 100}%` }}
                    />
                  </div>
                  <span className={Styles.percent}>{(probability * 100).toFixed(1)} %</span>
                </React.Fragment>
              ))}
            </div>
            <footer>
              {randomPick(predictions).map((word, index) => (
                <div key={index}>{word}</div>
              ))}
            </footer>
          </>
        )}
      </main>
    </ViewPanel>
  );
}

function randomPick(predictions: Prediction[]): string[] {
  const probabilities: Array<[word: string, probability: number]> = [];
  let currentProba = 0;
  for (const { word, probability } of predictions) {
    currentProba += probability;
    probabilities.push([word, currentProba]);
  }
  const words: string[] = [];
  for (let i = 0; i < 12; i++) {
    const rnd = Math.random() * currentProba;
    let word = "";
    for (const item of probabilities) {
      const [w, p] = item;
      word = w;
      if (p > rnd) break;
    }
    words.push(word);
  }
  words.sort();
  const counts = new Map<string, number>();
  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return Array.from(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([word, count]) => `${word} (${count})`);
}
