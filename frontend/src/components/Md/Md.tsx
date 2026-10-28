import React from "react"
import { Theme } from "@tolokoban/ui"
import Markdown, { type Options } from "react-markdown"
import remarkGfm from "remark-gfm"

import Styles from "./Md.module.css"

const $ = Theme.classNames

export interface MdProps {
    className?: string
    /** Markdown source to display. */
    value: string
    /** Extra remark plugins, applied after GFM. */
    remarkPlugins?: Options["remarkPlugins"]
}

export function Md({ className, value, remarkPlugins }: MdProps) {
    return (
        <div className={$.join(className, Styles.md)}>
            <Markdown remarkPlugins={[remarkGfm, ...(remarkPlugins ?? [])]}>
                {value}
            </Markdown>
        </div>
    )
}
