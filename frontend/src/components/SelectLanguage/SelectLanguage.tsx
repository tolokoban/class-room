import { useLang } from "@tolokoban/react-state";
import { Theme, useModal, ViewButton } from "@tolokoban/ui";
import React from "react";
import Styles from "./SelectLanguage.module.css";

const $ = Theme.classNames;

export interface SelectLanguageProps {
  className?: string;
}

const TEXT: Record<string, string> = {
  fr: "Je parle français",
  en: "I speak English",
  de: "Ich spreche Deutsch",
  it: "Parlo italiano",
};

export default function SelectLanguage({ className }: SelectLanguageProps) {
  const modal = useModal();
  const [lang, setLang] = useLang();
  const handleClick = () => {
    const hide = modal.show({
      content: (
        <div className={Styles.column}>
          {["en", "fr", "de", "it"].map((flag) => (
            <ViewButton
              key={flag}
              className={Styles.modalButton}
              onClick={() => {
                setLang(flag);
                hide();
              }}
            >
              <div className={$.join(Styles.icon, Styles[flag])} />
              <div>{TEXT[flag]}</div>
            </ViewButton>
          ))}
        </div>
      ),
    });
  };
  React.useEffect(() => {
    const handler = (evt: KeyboardEvent) => {
      if (evt.ctrlKey && evt.key === "l") {
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        const LANGS = ["en", "fr", "de", "it"];
        const index = LANGS.indexOf(lang);
        if (index < 0 || index >= LANGS.length) {
          setLang(LANGS[0]);
          return;
        }
        setLang(LANGS[(index + 1) % LANGS.length]);
      }
    };
    globalThis.document.addEventListener("keydown", handler);
    return () => globalThis.document.removeEventListener("keydown", handler);
  }, [lang]);

  return (
    <div className={$.join(className, Styles.selectLanguage)}>
      <button
        key={lang}
        type="button"
        className={$.join(Styles.icon, Styles[lang])}
        onClick={handleClick}
      />
    </div>
  );
}
