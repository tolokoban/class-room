/**
 * build-react-routes
 *
 * WARNING! this file has been generated automatically.
 * Please do not edit it because it will probably be overwritten.
 *
 * If you find a bug or if you need an improvement, please fill an issue:
 * https://github.com/tolokoban/build-react-routes/issues
 */

import React from "react"

import { RoutePath, RouteMatch } from "./types"


export const ROUTES: RoutePath[] = [
    "/",
]

/**
 * Using this function prevents dangling routes from being
 * discovered at runtime. If you try to reach a route that
 * does not exist anymore, you will get a compilation error.
 * @param route Canonic name of the target route.
 * @param params If the canonical name has `[name]` parts,
 * they will be hydrated by the `params`.
 * For instance, `goto("/article/[id]/detail", 27)` will lead
 * to `"/article/27/detail"`.
 * @returns `false` if we already are on this page (with the same params).
 */
export function goto(route: RoutePath, ...params: (string | number)[]) {
    const path = hydrateRoute(route, params)
    if (path === getRouteContext().value?.path) return false

    window.location.hash = path
    return true
}

/**
 * Syntaxic sugar to return `() => { goto(...) }`.
 */
export function makeGoto(route: RoutePath, ...params: (string | number)[]) {
    return () => { goto(route, ...params) }
}

export function isRouteEqualTo(route: RoutePath, ...params: (string | number)[]) {
    return getRouteContext().value?.path === hydrateRoute(route, params)
}

export function matchRoute(path: string, routes: RoutePath[] = ROUTES): RouteMatch | null {
  const matches: RouteMatch[] = [];
  const pathParts = splitPath(path);
  for (const route of routes) {
    const routeParts = splitPath(route);
    if (routeParts.length < pathParts.length) continue;

    const params: Record<string, string> = {};
    let failure = false;
    for (let i = 0; i < pathParts.length; i++) {
      const pathItem = pathParts[i];
      const routeItem = routeParts[i];
      if (routeItem.charAt(0) === "[") {
        params[routeItem.slice(1, routeItem.length - 1)] = pathItem;
        continue;
      }

      if (pathItem !== routeItem) {
        failure = true;
        break;
      }
    }
    if (failure) continue;

    matches.push({
      full: pathParts.length === routeParts.length,
      params,
      paramsCount: Object.keys(params).length,
      path,
      route,
    });
  }
  if (matches.length === 0) return null;

  let bestIndex = 0;
  let bestScore = computeRouteMatchScore(matches[bestIndex]);
  for (let i = 1; i < matches.length; i++) {
    const score = computeRouteMatchScore(matches[i]);
    if (score > bestScore) {
      bestIndex = i;
      bestScore = score;
    }
  }
  return matches[bestIndex];
}

function computeRouteMatchScore(match: RouteMatch) {
  return (match.full ? 1000 : 0) - match.paramsCount;
}

function splitPath(path: string): string[] {
  const text = path.startsWith("/") ? path.slice(1) : path;
  return text.split("/").filter(item => item.length > 0);
}

function hydrateRoute(route: RoutePath, params: (string | number)[]) {
    const items = splitPath(route)
    let i = 0
    return "/" + items
        .map(item => (item.charAt(0) === "[" ? (params[i++] ?? item) : item))
        .join("/")
}

class RouteContext {
    private readonly listeners = new Set<(context: RouteMatch | null) => void>()
    private _value: RouteMatch | null = null

    constructor() {
        const hash = this.extractHash(window.location.href)
        this.setHash(hash).then(() =>
            window.addEventListener("hashchange", this.handleHashChange)
        ).catch(ex => {
            console.error(`Unable to set hash to "${hash}":`, ex)
        })
    }

    addListener(listener: (value: RouteMatch | null) => void) {
        this.listeners.add(listener)
    }

    removeListener(listener: (value: RouteMatch | null) => void) {
        this.listeners.delete(listener)
    }

    get value() {
        return this._value
    }

    private async setHash(hash: string) {
        let value = matchRoute(hash);
        if (this._value?.path === value?.path) return;

        this._value = value;
        this.listeners.forEach((listener) => listener(value));
    }

    private readonly handleHashChange = (event: HashChangeEvent) => {
        const oldHash = this.extractHash(event.oldURL)
        const newHash = this.extractHash(event.newURL)
        const absHash = this.ensureAbsoluteHash(newHash, oldHash)
        if (absHash !== newHash) {
            globalThis.history.replaceState({}, "", `#${absHash}`)
        }
        void this.setHash(absHash)
    }

    private extractHash(url: string) {
        const hash = new URL(url).hash
        if (!hash) return "/"

        return hash.startsWith("#") ? hash.substring(1) : hash
    }

    private ensureAbsoluteHash(newHash: string, oldHash: string) {
        if (newHash.startsWith("/")) return newHash

        let hash = newHash
        while (hash.startsWith("./")) {
            hash = hash.substring("./".length)
        }
        const path = oldHash.split("/").filter(this.nonEmpty)
        for (const item of newHash.split("/")) {
            if (item === "..") {
                if (path.length > 0) path.pop()
            } else {
                path.push(item)
            }
        }
        return `/${path.filter(this.nonEmpty).join("/")}`
    }

    private readonly nonEmpty = (s: unknown): s is string => {
        return typeof s === "string" && s.trim().length > 0
    }
}

export function useRouteContext(): RouteMatch | null {
    const [params, setParams] = React.useState(getRouteContext().value)
    React.useEffect(() => {
        const update = (value: RouteMatch | null) => {
            setParams(value)
        }
        getRouteContext().addListener(update)
        return () => getRouteContext().removeListener(update)
    }, [])
    return params
}

export function useRouteParams<T extends string>(
    ...names: T[]
): Partial<Record<T, string>> {
    const context = useRouteContext()
    const params: Partial<Record<T, string>> = {}
    if (context) {
        for (const name of names) {
            const value = context.params[name]
            if (typeof value === "string") params[name] = value
        }
    }
    return params
}

export function useRouteParamAsString(name: string, defaultValue = ""): string {
    const params = useRouteParams(name)
    return params[name] ?? defaultValue
}

export function useRouteParamAsInt(name: string, defaultValue = 0): number {
    const params = useRouteParams(name)
    const value = parseInt(params[name] ?? "", 10)
    return Number.isNaN(value) ? defaultValue : value
}

export function useRouteParamAsFloat(name: string, defaultValue = 0): number {
    const params = useRouteParams(name)
    const value = parseFloat(params[name] ?? "")
    return Number.isNaN(value) ? defaultValue : value
}

/**
 * Parse param as JSON strings.
 */
export function useRouteParam<T>(
    name: string,
    defaultValue: T,
    typeGuard: (data: unknown) => data is T
): T {
    const params = useRouteParams(name)
    try {
        const text = decodeURIComponent(params[name] ?? "")
        const value: unknown = JSON.parse(text)
        return typeGuard(value) ? value : defaultValue
    } catch (ex) {
        return defaultValue
    }
}

let currentRouteContext: null | RouteContext = null

function getRouteContext() {
    if (!currentRouteContext) currentRouteContext = new RouteContext()
    return currentRouteContext
}