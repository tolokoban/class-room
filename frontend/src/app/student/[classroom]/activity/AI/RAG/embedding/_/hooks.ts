import React from "react";

import { Notif } from "@/components/Notification/manager";
import type { Message } from "./Conversation";
import { addProgressListener, embed, loadModel, type Model } from "./embedder";
import { type Animal, pickAnimal, pickOne, type Reply, reply } from "./game";
import { useTranslation } from "./translation";

export type EmbedderState =
  | { status: "loading"; progress: number; remaining: number | null }
  | { status: "error"; message: string }
  | ({ status: "ready" } & Model);

export function useEmbedder(): EmbedderState {
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
    loadModel()
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
  }, []);
  return state;
}

export function useGame() {
  const tr = useTranslation();
  const embedder = useEmbedder();
  const [animal, setAnimal] = React.useState<Animal>(() => pickAnimal());
  const [over, setOver] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const refInput = React.useRef<HTMLInputElement | null>(null);
  const ready = embedder.status === "ready";
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
        const answer = reply(animal, vector, embedder.vectors);
        say(makeMessage(answer));
        if (answer.type === "guess" && answer.found) setOver(true);
      })
      .catch((error: unknown) => Notif.error(error))
      .finally(() => setBusy(false));
  };
  const handleGiveUp = () => {
    say({ from: "game", text: tr.reveal$(animal.name) });
    setOver(true);
  };
  const handleNewGame = () => {
    setAnimal(pickAnimal(animal));
    setMessages([]);
    setOver(false);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleAsk();
  };
  return {
    tr,
    embedder,
    ready,
    refInput,
    messages,
    input,
    setInput,
    over,
    handleKeyDown,
    handleGiveUp,
    handleNewGame,
  };
}
