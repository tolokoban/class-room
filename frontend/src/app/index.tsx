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


import Layout0 from "./layout"
import Layout2 from "./student/[classroom]/layout"
import Loading0 from "./loading"
import NotFound0 from "./404"
const Page0 = React.lazy(() => import("./page"))
const Page5 = React.lazy(() => import("./student/[classroom]/activity/AI/CRAFT/page"))
const Page6 = React.lazy(() => import("./student/[classroom]/activity/AI/GPS/page"))
const Page8 = React.lazy(() => import("./student/[classroom]/activity/AI/RAG/embedding/page"))
const Page9 = React.lazy(() => import("./student/[classroom]/activity/AI/RAG/embedding2/page"))
const Page10 = React.lazy(() => import("./student/[classroom]/activity/AI/bilan-1/page"))
const Page11 = React.lazy(() => import("./student/[classroom]/activity/AI/chess/page"))
const Page12 = React.lazy(() => import("./student/[classroom]/activity/AI/eliza/page"))
const Page13 = React.lazy(() => import("./student/[classroom]/activity/AI/le-chat-mange-la/page"))
const Page14 = React.lazy(() => import("./student/[classroom]/activity/AI/mycin/page"))
const Page15 = React.lazy(() => import("./student/[classroom]/activity/AI/neural-network/page"))
const Page16 = React.lazy(() => import("./student/[classroom]/activity/AI/perceptron/page"))
const Page17 = React.lazy(() => import("./student/[classroom]/activity/AI/types-ia-generatives/page"))
const Page18 = React.lazy(() => import("./student/[classroom]/activity/AI/usage/page"))
const Page20 = React.lazy(() => import("./student/[classroom]/activity/office/file-explorer/page"))
const Page21 = React.lazy(() => import("./student/[classroom]/activity/office/markdown/page"))
const Page22 = React.lazy(() => import("./student/[classroom]/activity/office/selection/page"))
const Page23 = React.lazy(() => import("./student/[classroom]/activity/office/spreadsheet/page"))
const Page27 = React.lazy(() => import("./student/[classroom]/activity/security/personal-data/AI-Act/page"))
const Page28 = React.lazy(() => import("./student/[classroom]/activity/security/personal-data/RGPD/page"))
const Page29 = React.lazy(() => import("./student/[classroom]/activity/security/personal-data/anonymous/page"))
const Page31 = React.lazy(() => import("./student/[classroom]/activity/written/[written]/page"))
const Page37 = React.lazy(() => import("./teacher/[classroom]/activity/office/file-explorer/page"))
const Page38 = React.lazy(() => import("./teacher/[classroom]/activity/office/markdown/page"))
const Page39 = React.lazy(() => import("./teacher/[classroom]/activity/office/selection/page"))
const Page40 = React.lazy(() => import("./teacher/[classroom]/home/page"))
const Page42 = React.lazy(() => import("./teacher/[classroom]/results/page"))
const Page45 = React.lazy(() => import("./teacher/[classroom]/student/[student]/page"))
const Page47 = React.lazy(() => import("./teacher/[classroom]/students/page"))
const Page50 = React.lazy(() => import("./teacher/[classroom]/written/[written]/page"))
const Page53 = React.lazy(() => import("./teacher/[classroom]/written/[written]/view/[upload]/page"))
const Page55 = React.lazy(() => import("./teacher/written/page"))
const Page56 = React.lazy(() => import("./teacher/written/[written]/page"))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function App({ lang }: { lang?: string }) {
    const context = useRouteContext()
    const fb0 = Loading0
    const ly0 = Layout0
    const pg0 = Page0
    const ly2 = Layout2
    const pg5 = Page5
    const pg6 = Page6
    const pg8 = Page8
    const pg9 = Page9
    const pg10 = Page10
    const pg11 = Page11
    const pg12 = Page12
    const pg13 = Page13
    const pg14 = Page14
    const pg15 = Page15
    const pg16 = Page16
    const pg17 = Page17
    const pg18 = Page18
    const pg20 = Page20
    const pg21 = Page21
    const pg22 = Page22
    const pg23 = Page23
    const pg27 = Page27
    const pg28 = Page28
    const pg29 = Page29
    const pg31 = Page31
    const pg37 = Page37
    const pg38 = Page38
    const pg39 = Page39
    const pg40 = Page40
    const pg42 = Page42
    const pg45 = Page45
    const pg47 = Page47
    const pg50 = Page50
    const pg53 = Page53
    const pg55 = Page55
    const pg56 = Page56
    return (
        <Route path="/" def={[pg0, ly0, fb0, , NotFound0]} context={context}>
            <Route path="/student" def={[, , fb0, , NotFound0]} context={context}>
                <Route path="/student/[classroom]" def={[, ly2, fb0, , NotFound0]} context={context}>
                    <Route path="/student/[classroom]/activity" def={[, , fb0, , NotFound0]} context={context}>
                        <Route path="/student/[classroom]/activity/AI" def={[, , fb0, , NotFound0]} context={context}>
                            <Route path="/student/[classroom]/activity/AI/CRAFT" def={[pg5, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/AI/GPS" def={[pg6, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/AI/RAG" def={[, , fb0, , NotFound0]} context={context}>
                                <Route path="/student/[classroom]/activity/AI/RAG/embedding" def={[pg8, , fb0, , NotFound0]} context={context}/>
                                <Route path="/student/[classroom]/activity/AI/RAG/embedding2" def={[pg9, , fb0, , NotFound0]} context={context}/>
                            </Route>
                            <Route path="/student/[classroom]/activity/AI/bilan-1" def={[pg10, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/AI/chess" def={[pg11, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/AI/eliza" def={[pg12, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/AI/le-chat-mange-la" def={[pg13, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/AI/mycin" def={[pg14, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/AI/neural-network" def={[pg15, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/AI/perceptron" def={[pg16, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/AI/types-ia-generatives" def={[pg17, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/AI/usage" def={[pg18, , fb0, , NotFound0]} context={context}/>
                        </Route>
                        <Route path="/student/[classroom]/activity/office" def={[, , fb0, , NotFound0]} context={context}>
                            <Route path="/student/[classroom]/activity/office/file-explorer" def={[pg20, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/office/markdown" def={[pg21, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/office/selection" def={[pg22, , fb0, , NotFound0]} context={context}/>
                            <Route path="/student/[classroom]/activity/office/spreadsheet" def={[pg23, , fb0, , NotFound0]} context={context}>
                                <Route path="/student/[classroom]/activity/office/spreadsheet/node_modules" def={[, , fb0, , NotFound0]} context={context}/>
                            </Route>
                        </Route>
                        <Route path="/student/[classroom]/activity/security" def={[, , fb0, , NotFound0]} context={context}>
                            <Route path="/student/[classroom]/activity/security/personal-data" def={[, , fb0, , NotFound0]} context={context}>
                                <Route path="/student/[classroom]/activity/security/personal-data/AI-Act" def={[pg27, , fb0, , NotFound0]} context={context}/>
                                <Route path="/student/[classroom]/activity/security/personal-data/RGPD" def={[pg28, , fb0, , NotFound0]} context={context}/>
                                <Route path="/student/[classroom]/activity/security/personal-data/anonymous" def={[pg29, , fb0, , NotFound0]} context={context}/>
                            </Route>
                        </Route>
                        <Route path="/student/[classroom]/activity/written" def={[, , fb0, , NotFound0]} context={context}>
                            <Route path="/student/[classroom]/activity/written/[written]" def={[pg31, , fb0, , NotFound0]} context={context}>
                                <Route path="/student/[classroom]/activity/written/[written]/translation" def={[, , fb0, , NotFound0]} context={context}/>
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Route>
            <Route path="/teacher" def={[, , fb0, , NotFound0]} context={context}>
                <Route path="/teacher/[classroom]" def={[, , fb0, , NotFound0]} context={context}>
                    <Route path="/teacher/[classroom]/activity" def={[, , fb0, , NotFound0]} context={context}>
                        <Route path="/teacher/[classroom]/activity/office" def={[, , fb0, , NotFound0]} context={context}>
                            <Route path="/teacher/[classroom]/activity/office/file-explorer" def={[pg37, , fb0, , NotFound0]} context={context}/>
                            <Route path="/teacher/[classroom]/activity/office/markdown" def={[pg38, , fb0, , NotFound0]} context={context}/>
                            <Route path="/teacher/[classroom]/activity/office/selection" def={[pg39, , fb0, , NotFound0]} context={context}/>
                        </Route>
                    </Route>
                    <Route path="/teacher/[classroom]/home" def={[pg40, , fb0, , NotFound0]} context={context}>
                        <Route path="/teacher/[classroom]/home/translation" def={[, , fb0, , NotFound0]} context={context}/>
                    </Route>
                    <Route path="/teacher/[classroom]/results" def={[pg42, , fb0, , NotFound0]} context={context}>
                        <Route path="/teacher/[classroom]/results/translation" def={[, , fb0, , NotFound0]} context={context}/>
                    </Route>
                    <Route path="/teacher/[classroom]/student" def={[, , fb0, , NotFound0]} context={context}>
                        <Route path="/teacher/[classroom]/student/[student]" def={[pg45, , fb0, , NotFound0]} context={context}>
                            <Route path="/teacher/[classroom]/student/[student]/translation" def={[, , fb0, , NotFound0]} context={context}/>
                        </Route>
                    </Route>
                    <Route path="/teacher/[classroom]/students" def={[pg47, , fb0, , NotFound0]} context={context}>
                        <Route path="/teacher/[classroom]/students/translation" def={[, , fb0, , NotFound0]} context={context}/>
                    </Route>
                    <Route path="/teacher/[classroom]/written" def={[, , fb0, , NotFound0]} context={context}>
                        <Route path="/teacher/[classroom]/written/[written]" def={[pg50, , fb0, , NotFound0]} context={context}>
                            <Route path="/teacher/[classroom]/written/[written]/translation" def={[, , fb0, , NotFound0]} context={context}/>
                            <Route path="/teacher/[classroom]/written/[written]/view" def={[, , fb0, , NotFound0]} context={context}>
                                <Route path="/teacher/[classroom]/written/[written]/view/[upload]" def={[pg53, , fb0, , NotFound0]} context={context}>
                                    <Route path="/teacher/[classroom]/written/[written]/view/[upload]/translation" def={[, , fb0, , NotFound0]} context={context}/>
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                </Route>
                <Route path="/teacher/written" def={[pg55, , fb0, , NotFound0]} context={context}>
                    <Route path="/teacher/written/[written]" def={[pg56, , fb0, , NotFound0]} context={context}/>
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
