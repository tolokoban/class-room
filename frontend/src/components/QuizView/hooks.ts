import React from "react"

import { Quiz } from "@/types"

/**
 * Manage the navigation between the items of `quiz`
 * and the choices selected by the user for each of them.
 */
export function useQuizNavigation(quiz: Quiz) {
    const itemIds = Object.keys(quiz.items)
    const [index, setIndex] = React.useState(0)
    const [status, setStatus] = React.useState<{
        [itemId: string]: string[] // The choices ids that have been selected by the user.
    }>({})
    const itemId = itemIds[index]
    const selection = status[itemId] ?? []
    const toggle = (choiceId: string) =>
        setStatus({
            ...status,
            [itemId]: selection.includes(choiceId)
                ? selection.filter((id) => id !== choiceId)
                : [...selection, choiceId],
        })
    return {
        item: quiz.items[itemId],
        index,
        count: itemIds.length,
        selection,
        toggle,
        canPrev: index > 0,
        isLast: index === itemIds.length - 1,
        canFinish: selection.length > 0,
        canNext: index < itemIds.length - 1 && selection.length > 0,
        prev: () => setIndex(Math.max(0, index - 1)),
        next: () => setIndex(Math.min(itemIds.length - 1, index + 1)),
    }
}
