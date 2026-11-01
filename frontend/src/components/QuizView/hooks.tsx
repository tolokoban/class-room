import { useModal } from "@tolokoban/ui"
import React from "react"

import { useRouteContext } from "@/app/routes"
import { Notif } from "@/components/Notification"
import { QuizMenu } from "./QuizMenu"
import { useServiceActivityResultSet } from "@/service/hooks/activity"
import { useApiErrorTranslator } from "@/service/hooks/apiError"
import { State } from "@/state"
import { Quiz } from "@/types"

const ACTIVITY_ROUTE_PREFIX = "/student/[classroom]/activity/"

/** The choices ids that have been selected by the user, per item id. */
export type QuizStatus = { [itemId: string]: string[] }

/**
 * Manage the navigation between the items of `quiz`
 * and the choices selected by the user for each of them.
 * A teacher can always go to the next item, even without any selection.
 * `onChange` is called each time the user toggles a choice.
 */
export function useQuizNavigation(
    quiz: Quiz,
    teacher: boolean,
    onChange?: (status: QuizStatus) => void,
) {
    const itemIds = Object.keys(quiz.items)
    const [index, setIndex] = React.useState(0)
    const [status, setStatus] = React.useState<QuizStatus>({})
    const itemId = itemIds[index]
    const selection = status[itemId] ?? []
    const toggle = (choiceId: string) => {
        const newStatus = {
            ...status,
            [itemId]: selection.includes(choiceId)
                ? selection.filter((id) => id !== choiceId)
                : [...selection, choiceId],
        }
        setStatus(newStatus)
        onChange?.(newStatus)
    }
    return {
        item: quiz.items[itemId],
        index,
        count: itemIds.length,
        selection,
        toggle,
        canPrev: index > 0,
        isLast: index === itemIds.length - 1,
        canFinish: selection.length > 0,
        canNext: index < itemIds.length - 1 && (teacher || selection.length > 0),
        prev: () => setIndex(Math.max(0, index - 1)),
        next: () => setIndex(Math.min(itemIds.length - 1, index + 1)),
    }
}

/**
 * @returns A function that stores the current status of a student
 * with entrypoint `activity/result-set`, or `undefined` if the user
 * is not a student. The activity code is taken from the current route.
 */
export function useQuizResultSaver(): ((status: QuizStatus) => void) | undefined {
    const user = State.user.useValue()
    const computer = State.computer.useValue()
    const activity = useActivityRoute()
    const service = useServiceActivityResultSet()
    const translateError = useApiErrorTranslator()
    if (typeof user !== "string" || !activity) return undefined

    const { classroomCode, activityCode } = activity
    return (status: QuizStatus) => {
        service
            .mutate({
                classroomCode,
                activityCode,
                computer,
                nickname: user,
                result: JSON.stringify(status),
            })
            .catch((error: unknown) => Notif.error(translateError(error)))
    }
}

/**
 * @returns A click handler that opens the teacher's menu of the quiz,
 * or `undefined` if we are not on an activity route.
 */
export function useQuizMenu(title: string): (() => void) | undefined {
    const modal = useModal()
    const activity = useActivityRoute()
    if (!activity) return undefined

    return () => {
        const hide = modal.show({
            content: (
                <QuizMenu
                    classroom={activity.classroomCode}
                    activity={activity.activityCode}
                    title={title}
                    onClose={() => hide()}
                />
            ),
        })
    }
}

/**
 * @returns The codes of the class room and of the activity of the current route,
 * or `undefined` if we are not on an activity route.
 */
function useActivityRoute(): { classroomCode: string; activityCode: string } | undefined {
    const context = useRouteContext()
    if (!context) return undefined

    const { route, params } = context
    const classroomCode = params.classroom
    if (!route.startsWith(ACTIVITY_ROUTE_PREFIX) || !classroomCode) return undefined

    return { classroomCode, activityCode: route.substring(ACTIVITY_ROUTE_PREFIX.length) }
}
