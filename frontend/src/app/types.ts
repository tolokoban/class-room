/**
 * build-react-routes
 *
 * WARNING! this file has been generated automatically.
 * Please do not edit it because it will probably be overwritten.
 *
 * If you find a bug or if you need an improvement, please fill an issue:
 * https://github.com/tolokoban/build-react-routes/issues
 */
export type RoutePath =
    | "/"
    | "/student"
    | "/student/[classroom]"
    | "/student/[classroom]/activity"
    | "/student/[classroom]/activity/AI"
    | "/student/[classroom]/activity/AI/eliza"

export function isRoutePath(path: string): path is RoutePath {
    return ["/","/student","/student/[classroom]","/student/[classroom]/activity","/student/[classroom]/activity/AI","/student/[classroom]/activity/AI/eliza"].includes(path)
}

export interface RouteMatch {
    path: string
    route: RoutePath
    params: Record<string, string>
    /**
     * Does it match the full path?
     */
    full: boolean
    /**
     * Number of params in the route
     */
    paramsCount: number
}
