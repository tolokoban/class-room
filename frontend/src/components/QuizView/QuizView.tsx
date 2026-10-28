import React from "react";
import { useLangValue } from "@tolokoban/react-state";
import { Theme, useModal, ViewButton, ViewDialog, ViewPanel } from "@tolokoban/ui";

import { Quiz } from "@/types";
import { Md } from "@/components/Md";
import { QuizChoices } from "./QuizChoices";
import { useQuizNavigation } from "./hooks";
import { useTranslation } from "./translation";
import Styles from "./QuizView.module.css";
import { MultiLang } from "@/utils/multilang";

const $ = Theme.classNames;

export interface QuizViewProps {
  className?: string;
  quiz: Quiz;
}

export function QuizView({ className, quiz }: QuizViewProps) {
  const tr = useTranslation();
  const lang = useLangValue();
  const nav = useQuizNavigation(quiz);
  const question = MultiLang.get(nav.item?.question, lang);
  const modal = useModal();
  const handleDone = () => {
    const hide = modal.show({
      content: (
        <ViewDialog buttonValidate={{ children: tr.close, onClick: () => hide() }}>
          {tr.congratulations}
        </ViewDialog>
      ),
    });
  };
  return (
    <div className={$.join(className, Styles.quizView)}>
      <header>
        <h1>{MultiLang.get(quiz.title, lang)}</h1>
        <div>
          <b>{nav.index + 1}</b> / {nav.count}
        </div>
        <ViewPanel display="flex" gap="S" alignItems="center">
          <ViewButton color="secondary-5" enabled={nav.canPrev} onClick={nav.prev}>
            {tr.previous}
          </ViewButton>
          {nav.isLast ? (
            <ViewButton color="secondary-5" enabled={nav.canFinish} onClick={handleDone}>
              {tr.done}
            </ViewButton>
          ) : (
            <ViewButton color="secondary-5" enabled={nav.canNext} onClick={nav.next}>
              {tr.next}
            </ViewButton>
          )}
        </ViewPanel>
      </header>
      <div className={Styles.question}>
        {typeof question === "string" ? <Md value={question} /> : question}
      </div>
      <QuizChoices
        className={Styles.choices}
        choices={nav.item?.choices ?? {}}
        selection={nav.selection}
        onToggle={nav.toggle}
      />
    </div>
  );
}
