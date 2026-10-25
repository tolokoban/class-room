import React from "react";
import { useEliza } from "./_/hooks";
import { ViewPanel } from "@tolokoban/ui";

import Styles from "./page.module.css";

export default function Page() {
  const eliza = useEliza();
  const [end, setEnd] = React.useState(false);
  const [lines, setLines] = React.useState<string[]>([eliza.getInitial()]);
  const [input, setInput] = React.useState("");
  const refMain = React.useRef<HTMLElement | null>(null);
  const handleEnter = () => {
    setLines([...lines, input, eliza.transform(input)]);
    setInput("");
    if (eliza.quit) {
      setEnd(true);
    }
  };
  React.useEffect(() => {
    const main = refMain.current;
    if (main) main.scrollTop = main.scrollHeight;
  }, [lines, end]);

  return (
    <ViewPanel display="grid" placeItems="center" fullsize position="absolute">
      <main ref={refMain} className={Styles.console}>
        {lines.map((line, index) => (
          <p key={index} className={index % 2 === 1 ? Styles.doctor : Styles.patient}>
            {line}
          </p>
        ))}
        {end ? (
          <button type="button" onClick={() => {
            setEnd(false)
            setLines([eliza.getInitial()])
            setInput("")
          }}>
            Prendre rendez-vous pour une nouvelle séance
          </button>
        ) : (
          <input
            type="text"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEnter();
              }
            }}
          />
        )}
      </main>
    </ViewPanel>
  );
}
