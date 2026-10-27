import React from "react"
import { Theme } from "@tolokoban/ui"

import { useTranslation } from "./translation"
import Styles from "./QuizChoiceFalse.module.css"

const $ = Theme.classNames

export interface QuizChoiceFalseProps {
    className ?: string
}

export function QuizChoiceFalse ({ className }: QuizChoiceFalseProps) {
    const tr = useTranslation()
    return <div className={$.join(className, Styles.quizChoiceFalse)}>
        {tr.prefix} <strong>{tr.value}</strong>
    </div >
}
