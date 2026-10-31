import { useLangValue } from "@tolokoban/react-state";
import { Theme, ViewButton, ViewPanel } from "@tolokoban/ui";

import { Md } from "@/components/Md";
import { Quiz } from "@/types";
import { MultiLang } from "@/utils/multilang";
import { useItemNavigation, useItemStats } from "./hooks";
import { ResultsGrid } from "./ResultsGrid";
import { useTranslation } from "./translation";

import Styles from "./ResultsView.module.css";

const $ = Theme.classNames;

export interface ResultsViewProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
  activityCode: string;
  quiz: Quiz;
}

export function ResultsView({ className, classroom, activityCode, quiz }: ResultsViewProps) {
  const tr = useTranslation();
  const lang = useLangValue();
  const nav = useItemNavigation(quiz);
  const stats = useItemStats(classroom, activityCode, nav.itemId);
  const question = MultiLang.get(nav.item?.question, lang);

  return (
    <div className={$.join(className, Styles.resultsView)}>
      <header>
        <h1>{MultiLang.get(quiz.title, lang)}</h1>
        <div>
          <b>{nav.index + 1}</b> / {nav.count}
        </div>
        <div>{tr.respondents$(`${stats.respondents}`)}</div>
        <ViewPanel display="flex" gap="S" alignItems="center">
          <ViewButton color="secondary-5" enabled={nav.canPrev} onClick={nav.prev}>
            {tr.previous}
          </ViewButton>
          <ViewButton color="secondary-5" enabled={nav.canNext} onClick={nav.next}>
            {tr.next}
          </ViewButton>
        </ViewPanel>
      </header>
      <main>
        <div className={Styles.question}>
          {typeof question === "string" ? <Md value={question} /> : question}
        </div>
        {nav.item && <ResultsGrid item={nav.item} percent={stats.percent} />}
      </main>
    </div>
  );
}
