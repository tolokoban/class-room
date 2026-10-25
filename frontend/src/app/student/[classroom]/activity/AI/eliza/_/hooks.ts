import React from "react";
import { ElizaBot } from "./fr";

export function useEliza() {
  const ref = React.useRef<ElizaBot | null>(null);
  if (ref.current === null) {
    ref.current = new ElizaBot();
    ref.current.memSize = 200;
  }
  return ref.current;
}
