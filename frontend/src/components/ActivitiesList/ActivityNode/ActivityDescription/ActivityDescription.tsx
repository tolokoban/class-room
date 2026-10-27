import React from "react"
import { Theme } from "@tolokoban/ui"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { useTranslation } from "./translation"
import Styles from "./ActivityDescription.module.css"

const $ = Theme.classNames

export interface ActivityDescriptionProps {
    className?: string
    markdown: string
}

export function ActivityDescription({ className, markdown }: ActivityDescriptionProps) {
    const tr = useTranslation()
    return (
        <details className={$.join(className, Styles.activityDescription)}>
            <summary>{tr.summary}</summary>
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </details>
    )
}
