import AtomicState from "@tolokoban/react-state";

/**
 * Delay after which we consider that no other tab will answer.
 */
const TIMEOUT_MS = 300;

type Message<T> = { type: "request" } | { type: "answer"; value: T };

/**
 * The session storage is not shared between tabs. So, if `state` has no
 * valid value yet, ask the other tabs of the same origin for theirs.
 * `pending` is `true` while we are waiting for an answer.
 * This tab will also answer the requests of the tabs opened later.
 */
export function shareWithOtherTabs<T>(
  state: AtomicState<T>,
  pending: AtomicState<boolean>,
  id: string,
  guard: (data: unknown) => data is T,
) {
  if (typeof BroadcastChannel === "undefined") return;

  const channel = new BroadcastChannel(`AtomicState/tabs/${id}`);
  channel.addEventListener("message", (event: MessageEvent<Message<unknown>>) => {
    const message = event.data;
    if (message.type === "request") {
      if (guard(state.value)) channel.postMessage({ type: "answer", value: state.value });
    } else if (message.type === "answer" && pending.value && guard(message.value)) {
      state.value = message.value;
      pending.value = false;
    }
  });
  if (guard(state.value)) return;

  pending.value = true;
  channel.postMessage({ type: "request" });
  window.setTimeout(() => {
    pending.value = false;
  }, TIMEOUT_MS);
}
