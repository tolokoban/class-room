import React from "react"
import { Theme } from "@tolokoban/ui"

import { ACTIVITIES } from "./activities"
import { ActivityNode } from "./ActivityNode"
import Styles from "./ActivitiesList.module.css"

const $ = Theme.classNames

export interface ActivitiesListProps {
    className?: string
}

export function ActivitiesList({ className }: ActivitiesListProps) {
    return (
        <nav className={$.join(className, Styles.activitiesList)}>
            <ul>
                {ACTIVITIES.map((activity) => (
                    <ActivityNode key={activity[0]} activity={activity} path={[]} />
                ))}
            </ul>
        </nav>
    )
}
