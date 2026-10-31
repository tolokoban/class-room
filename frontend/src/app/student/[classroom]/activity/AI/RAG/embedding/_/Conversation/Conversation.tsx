import React from "react";
import { Theme } from "@tolokoban/ui";

import Styles from "./Conversation.module.css";

const $ = Theme.classNames;

export interface Message {
  from: "student" | "game";
  text: string;
  /** Technical details, to understand how the answer has been chosen. */
  detail?: string;
}

export interface ConversationProps {
  className?: string;
  messages: Message[];
}

export function Conversation({ className, messages }: ConversationProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const div = ref.current;
    if (div) div.scrollTop = div.scrollHeight;
  }, [messages]);

  return (
    <div ref={ref} className={$.join(className, Styles.conversation)}>
      {messages.map(({ from, text, detail }, index) => (
        <div key={index} className={Styles[from]}>
          <p>{text}</p>
          {detail && <small>{detail}</small>}
        </div>
      ))}
    </div>
  );
}
