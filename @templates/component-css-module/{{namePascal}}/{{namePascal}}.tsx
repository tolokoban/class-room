import React from "react"
import { Theme } from "@tolokoban/ui"

import Styles from "./{{namePascal}}.module.css"

const $ = Theme.classNames

export interface {{namePascal}}Props {
    className ?: string
}

export function {{namePascal}} ({ className }: {{namePascal}}Props) {
    return <div className={$.join(className, Styles.{{nameCamel}})}>
        {{name}}
    </div >
}