import React from "react";
import { Theme } from "@tolokoban/ui";

import { Analysis } from "./Analysis";

import Styles from "./Conversation.module.css";

const $ = Theme.classNames;

/** A question of the student, with the answer of the game. */
export interface Exchange {
  question: string;
  answer: string;
}

export interface Message {
  from: "student" | "game";
  text: string;
  /** Technical details, to understand how the answer has been chosen. */
  detail?: string;
  /** The student has already asked almost the same question: it has not been answered. */
  repeat?: boolean;
  /** Condensed list of the questions already asked, with their answers. */
  summary?: Exchange[];
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
      {messages.map(({ from, text, detail, repeat, summary }, index) => (
        <div key={index} className={$.join(Styles[from], repeat && Styles.repeat)}>
          <p>{text}</p>
          {from === "student" && <Analysis question={text} />}
          {summary && summary.length > 0 && (
            <ul>
              {summary.map(({ question, answer }, line) => (
                <li key={line}>
                  <b>{question}</b> → {answer}
                </li>
              ))}
            </ul>
          )}
          {detail && <small>{detail}</small>}
        </div>
      ))}
    </div>
  );
}
