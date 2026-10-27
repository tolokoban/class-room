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

import { matchRoute, useRouteContext } from "./routes"
import { RouteMatch } from "./types"

export * from "./routes"
export * from "./types"


import Loading0 from "./loading"
import NotFound0 from "./404"
const Page0 = React.lazy(() => import("./page"))
const Page5 = React.lazy(() => import("./student/[classroom]/activity/AI/eliza/page"))
const Page6 = React.lazy(() => import("./student/[classroom]/activity/AI/le-chat-mange-la/page"))
const Page7 = React.lazy(() => import("./student/[classroom]/activity/AI/mycin/page"))
const Page10 = React.lazy(() => import("./student/[classroom]/activity/security/personal-data/RGPD/page"))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function App({ lang }: { lang?: string }) {
    const context = useRouteContext()
    const fb0 = Loading0
    const pg0 = Page0
    const pg5 = Page5
    const pg6 = Page6
    const pg7 = Page7
    const pg10 = Page10
    return (
        <Route path="/" def={[pg0, , fb0, , NotFound0]} context={context}>
            <Route path="/student" def={[, , fb0, , NotFound0]} context={context}>
                <Route path="/student/[classroom]" def={[, , fb0, , NotFound0]} context={context}>
                    <Route path="/student/[classroom]/activity" def={[, , fb0, , NotFound0]} context={context}>
                        <Route path="/student/[classroom]/activity/AI" def={[, , fb0, , NotFound0]} context={context}>
                            <Route path="/student/[classroom]/activity/AI/eliza" def={[pg5, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/AI/le-chat-mange-la" def={[pg6, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/AI/mycin" def={[pg7, , fb0, , NotFound0]} context={context}/>
                        </Route>
                        <Route path="/student/[classroom]/activity/security" def={[, , fb0, , NotFound0]} context={context}>
                            <Route path="/student/[classroom]/activity/security/personal-data" def={[, , fb0, , NotFound0]} context={context}>
                                <Route path="/student/[classroom]/activity/security/personal-data/RGPD" def={[pg10, , fb0, , NotFound0]} context={context}/>
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Route>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function intl<T extends PageComponent | ContainerComponent | React.ReactNode>(
    page: T,
    translations: Record<string, T>,
    lang = ""
): T {
    const candidate1 = translations[lang]
    if (candidate1) return candidate1

    const [prefix] = lang.split("-")
    const candidate2 = translations[prefix]
    if (candidate2) return candidate2

    return page
}

type PageComponent = React.FC<{ params: Record<string, string> }>;
type ContainerComponent = React.FC<{
  children: React.ReactNode;
  params: Record<string, string>;
}>;

interface RouteProps {
  path: string;
  def: [
    Page?: PageComponent,
    Layout?: ContainerComponent,
    Loading?: React.FC,
    Access?: React.FC<{ children: React.ReactNode }>,
    NotFound?: React.FC,
  ];
  children?: RouteChild | RouteChild[];
  context: RouteMatch | null;
}

type RouteChild = React.ReactElement<{
  path: string;
  def: [
    Page?: PageComponent,
    Layout?: ContainerComponent,
    Loading?: React.FC,
    Access?: React.FC<{ children: React.ReactNode }>,
    NotFound?: React.FC,
  ];
}>;

/**
 * If we reach this component, that means that the component's "path"
 * already matches the beginning of the browser path.
 * We have now to check if any child matches the next part of the path.
 * If not, we display the "NotFound".
 */
function Route(props: RouteProps) {
  const { def, children, context } = props;
  if (!context) return null;

  const [Page, Layout, Loading, Access, NotFound] = def;
  const notFound = NotFound ? <NotFound /> : null;
  if (context.path === "/") {
    // Special case of root path
    if (!Page) return notFound;

    let root = <Page params={{}} />;
    if (Loading) root = <React.Suspense fallback={<Loading />}>{root}</React.Suspense>;
    if (Layout) root = <Layout params={{}}>{root}</Layout>;
    if (Access) root = <Access>{root}</Access>;
    return root;
  }
  const array = ensureArray(children)
    .map((r) => [matchRoute(r.props.path, [context.route]), r])
    .filter(([match]) => match !== null) as Array<[RouteMatch, RouteChild]>;
  const [best] = array.sort(sortRouteMatchArray);

  if (!best) return notFound;

  const [match, routeChild] = best;
  if (!match.full) {
    let full = routeChild
    if (Layout) full = <Layout params={match.params}>{full}</Layout>
    return full;
  }

  if (!routeChild) return notFound;
    
  const [PageChild, LayoutChild, LoadingChild, AccessChild] = routeChild.props.def;
  if (!PageChild) return notFound;

  let element = <PageChild params={match.params} />;
  if (LoadingChild) element = <React.Suspense fallback={<LoadingChild />}>{element}</React.Suspense>;
  if (LayoutChild) element = <LayoutChild params={match.params}>{element}</LayoutChild>;
  if (AccessChild) element = <AccessChild>{element}</AccessChild>;
  if (Layout) element = <Layout params={match.params}>{element}</Layout>;
  return element;
}

function ensureArray<T>(children: T | T[] | undefined): T[] {
  if (!children) return [];
  if (Array.isArray(children)) return children;
  return [children];
}

/**
 * The fist element of the array will be the one
 * that matches the best.
 */
function sortRouteMatchArray([a]: [RouteMatch, RouteChild], [b]: [RouteMatch, RouteChild]): number {
  const scoreA = (a.full ? 1000 : 0) - a.paramsCount;
  const scoreB = (b.full ? 1000 : 0) - b.paramsCount;
  return scoreB - scoreA;
}
