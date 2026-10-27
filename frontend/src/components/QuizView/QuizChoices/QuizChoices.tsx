import React from "react"
import { Theme } from "@tolokoban/ui"

import Styles from "./QuizChoices.module.css"

const $ = Theme.classNames

export interface QuizChoicesProps {
    className?: string
    choices: { [id: string]: React.ReactNode }
    /** Ids of the selected choices. */
    selection: string[]
    onToggle(this: void, choiceId: string): void
}

export function QuizChoices({ className, choices, selection, onToggle }: QuizChoicesProps) {
    return (
        <div className={$.join(className, Styles.quizChoices)}>
            {Object.entries(choices).map(([id, choice]) => (
                <button
                    key={id}
                    type="button"
                    className={$.join(selection.includes(id) && Styles.selected)}
                    aria-pressed={selection.includes(id)}
                    onClick={() => onToggle(id)}
                >
                    {choice}
                </button>
            ))}
        </div>
    )
}
