import React from "react"
import { Theme } from "@tolokoban/ui"

import { ACTIVITIES, INFOS } from "../activities"
import { ActivityDescription } from "./ActivityDescription"
import { useActivityHref } from "./hooks"
import Styles from "./ActivityNode.module.css"

const $ = Theme.classNames

export interface ActivityNodeProps {
    className?: string
    activity: (typeof ACTIVITIES)[number]
    /** Names of the ancestors of this activity. */
    path: string[]
}

export function ActivityNode({ className, activity: [name, children], path }: ActivityNodeProps) {
    const fullPath = [...path, name]
    const info = INFOS[fullPath.join("/")] ?? {}
    const title = info.title ?? name
    const href = useActivityHref(fullPath)
    return (
        <li className={$.join(className, Styles.activityNode)}>
            {children ? <strong>{title}</strong> : <a href={href}>{title}</a>}
            {info.description && <ActivityDescription markdown={info.description} />}
            {children && (
                <ul>
                    {children.map((child) => (
                        <ActivityNode key={child[0]} activity={child} path={fullPath} />
                    ))}
                </ul>
            )}
        </li>
    )
}
