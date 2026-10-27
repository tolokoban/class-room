import React from "react"
import { Theme } from "@tolokoban/ui"

import { useTranslation } from "./translation"
import Styles from "./QuizChoiceTrue.module.css"

const $ = Theme.classNames

export interface QuizChoiceTrueProps {
    className ?: string
}

export function QuizChoiceTrue ({ className }: QuizChoiceTrueProps) {
    const tr = useTranslation()
    return <div className={$.join(className, Styles.quizChoiceTrue)}>
        {tr.prefix} <strong>{tr.value}</strong>
    </div >
}
