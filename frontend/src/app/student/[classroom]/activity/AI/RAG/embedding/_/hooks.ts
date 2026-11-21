import React from "react";

import { Notif } from "@/components/Notification/manager";
import { embed } from "../../_/embedder";
import { useEmbedder } from "../../_/hooks";
import type { Probe } from "../../_/VectorsView";
import type { Exchange, Message } from "./Conversation";
import { PROJECTION } from "./data/projection";
import {
  type Animal,
  farthestQuestion,
  findRepeat,
  isUnderstoodDifferently,
  nearestQuestions,
  pickAnimal,
  pickOne,
  type PreviousQuestion,
  type Reply,
  reply,
  understandingOf,
} from "./game";
import { makeScene } from "./scene";
import { loadTagger } from "./syntax/tagger";
import { useTranslation } from "./translation";

import VectorsUrl from "./data/vectors.dat";

/** Number of questions linked to the student's sentence in the 3D view. */
const NEIGHBOURS_COUNT = 3;

export function useGame() {
  const tr = useTranslation();
  // The game starts only when the part-of-speech model is loaded too.
  const embedder = useEmbedder(VectorsUrl, loadTagger);
  const [animal, setAnimal] = React.useState<Animal>(() => pickAnimal());
  const [over, setOver] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [probe, setProbe] = React.useState<Probe | null>(null);
  const refInput = React.useRef<HTMLInputElement | null>(null);
  /** The student's sentences of the current game, with what they have been understood as. */
  const refHistory = React.useRef<PreviousQuestion[]>([]);
  /** The questions of the current game that got an answer or were guesses, with their replies. */
  const refExchanges = React.useRef<Exchange[]>([]);
  const ready = embedder.status === "ready";
  const vectors = ready ? embedder.vectors : null;
  const scene = React.useMemo(() => (vectors ? makeScene(vectors) : []), [vectors]);
  React.useEffect(() => {
    if (ready && !over) refInput.current?.focus();
  }, [ready, over]);
  const say = (...items: Message[]) => setMessages((list) => [...list, ...items]);
  const makeMessage = (answer: Reply): Message => {
    const similarity = answer.similarity.toFixed(3);
    switch (answer.type) {
      case "answer":
        return {
          from: "game",
          text: answer.answer,
          detail: tr.closestQuestion$(answer.question, similarity),
        };
      case "guess":
        return {
          from: "game",
          text: answer.found ? tr.found$(answer.name) : tr.wrong$(answer.name),
          detail: tr.closestAnimal$(answer.matched, similarity),
        };
      case "vague":
        return {
          from: "game",
          text: pickOne([tr.vague1, tr.vague2]),
          detail: tr.closestQuestion$(answer.question, similarity),
        };
    }
  };
  const handleAsk = () => {
    const text = input.trim();
    if (embedder.status !== "ready" || busy || over || text.length === 0) return;

    setInput("");
    say({ from: "student", text });
    setBusy(true);
    embed(embedder.extractor, text)
      .then((vector) => {
        setProbe({
          text,
          vector,
          neighbours: nearestQuestions(vector, embedder.vectors, NEIGHBOURS_COUNT),
          farthest: farthestQuestion(vector, embedder.vectors),
        });
        const answer = reply(animal, vector, embedder.vectors);
        const message = makeMessage(answer);
        const understanding = understandingOf(answer);
        // Almost the same sentence as before, but understood differently:
        // we draw the attention of the student on it.
        const previous = findRepeat(vector, refHistory.current);
        if (previous && isUnderstoodDifferently(previous.understanding, understanding)) {
          say(message, {
            from: "game",
            repeat: true,
            text: tr.alreadyAsked,
            detail: tr.previousQuestion$(
              previous.text,
              previous.similarity.toFixed(3),
              previous.understanding?.label ?? tr.notUnderstood,
            ),
          });
        } else {
          say(message);
        }
        refHistory.current.push({ text, vector, understanding });
        if (answer.type !== "vague")
          refExchanges.current.push({ question: text, answer: message.text });
        if (answer.type === "guess" && answer.found) setOver(true);
      })
      .catch((error: unknown) => Notif.error(error))
      .finally(() => setBusy(false));
  };
  const handleGiveUp = () => {
    say({ from: "game", text: tr.reveal$(animal.name) });
    setOver(true);
  };
  const handleSummary = () => {
    const summary = [...refExchanges.current];
    say({ from: "game", text: summary.length > 0 ? tr.summary : tr.summaryEmpty, summary });
  };
  const handleNewGame = () => {
    setAnimal(pickAnimal(animal));
    setMessages([]);
    refHistory.current = [];
    refExchanges.current = [];
    setProbe(null);
    setOver(false);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleAsk();
  };
  return {
    tr,
    embedder,
    ready,
    scene,
    projection: PROJECTION,
    probe,
    refInput,
    messages,
    input,
    setInput,
    over,
    handleKeyDown,
    handleGiveUp,
    handleNewGame,
    handleSummary,
  };
}
