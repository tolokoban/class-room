import AtomicState from "@tolokoban/react-state"

import { Notification } from "./types"

export const State = {
    notifications: new AtomicState<Notification[]>([])
}