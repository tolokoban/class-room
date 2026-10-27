import React from "react"
import { Theme, ViewButton } from "@tolokoban/ui"

import { Quiz } from "@/types"
import { QuizChoices } from "./QuizChoices"
import { useQuizNavigation } from "./hooks"
import { useTranslation } from "./translation"
import Styles from "./QuizView.module.css"

const $ = Theme.classNames

export interface QuizViewProps {
    className?: string
    quiz: Quiz
}

export function QuizView({ className, quiz }: QuizViewProps) {
    const tr = useTranslation()
    const nav = useQuizNavigation(quiz)
    return (
        <div className={$.join(className, Styles.quizView)}>
            <header>
                <h1>{quiz.title}</h1>
                <ViewButton color="secondary-5" enabled={nav.canPrev} onClick={nav.prev}>
                    {tr.previous}
                </ViewButton>
                <ViewButton color="secondary-5" enabled={nav.canNext} onClick={nav.next}>
                    {tr.next}
                </ViewButton>
            </header>
            <div className={Styles.question}>{nav.item?.question}</div>
            <QuizChoices
                className={Styles.choices}
                choices={nav.item?.choices ?? {}}
                selection={nav.selection}
                onToggle={nav.toggle}
            />
        </div>
    )
}
