import React from "react"
import { Theme } from "@tolokoban/ui"
import Markdown, { type Components, type Options } from "react-markdown"
import remarkGfm from "remark-gfm"

import { isAbsoluteUrl } from "@/utils/url"

import Styles from "./Md.module.css"

const $ = Theme.classNames

export interface MdProps {
    className?: string
    /** Markdown source to display. */
    value: string
    /** Extra remark plugins, applied after GFM. */
    remarkPlugins?: Options["remarkPlugins"]
}

/** Absolute links open in a new tab, relative ones stay in the application. */
const COMPONENTS: Components = {
    a: ({ node: _node, ...props }) =>
        isAbsoluteUrl(props.href) ? (
            <a {...props} target="_blank" rel="noopener noreferrer" />
        ) : (
            <a {...props} />
        ),
}

export function Md({ className, value, remarkPlugins }: MdProps) {
    return (
        <div className={$.join(className, Styles.md)}>
            <Markdown components={COMPONENTS} remarkPlugins={[remarkGfm, ...(remarkPlugins ?? [])]}>
                {value}
            </Markdown>
        </div>
    )
}
