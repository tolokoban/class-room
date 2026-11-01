import React from "react";
import { useLangValue } from "@tolokoban/react-state";
import {
  IconMenu,
  Theme,
  useModal,
  ViewButton,
  ViewDialog,
  ViewFloatingButton,
  ViewPanel,
} from "@tolokoban/ui";

import { Quiz } from "@/types";
import { Md } from "@/components/Md";
import { QuizChoices } from "./QuizChoices";
import { useQuizMenu, useQuizNavigation, useQuizResultSaver } from "./hooks";
import { useTranslation } from "./translation";
import Styles from "./QuizView.module.css";
import { MultiLang } from "@/utils/multilang";
import { isTeacher, State } from "@/state";

const $ = Theme.classNames;

export interface QuizViewProps {
  className?: string;
  quiz: Quiz;
}

export function QuizView({ className, quiz }: QuizViewProps) {
  const tr = useTranslation();
  const lang = useLangValue();
  const user = State.user.useValue();
  const nav = useQuizNavigation(quiz, isTeacher(user), useQuizResultSaver());
  const question = MultiLang.get(nav.item?.question, lang);
  const title = MultiLang.get(quiz.title, lang);
  const handleMenu = useQuizMenu(typeof title === "string" ? title : "");
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
        <h1>
          {isTeacher(user) && handleMenu && (
            <ViewFloatingButton icon={IconMenu} size="S" onClick={handleMenu} />
          )}
          <div>{title}</div>
        </h1>
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
      {nav.item && (
        <QuizChoices
          className={Styles.choices}
          item={nav.item}
          selection={nav.selection}
          onToggle={nav.toggle}
        />
      )}
    </div>
  );
}
