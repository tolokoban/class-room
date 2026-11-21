import { ViewButton } from "@tolokoban/ui";

import { LoadingOverlay } from "../_/LoadingOverlay";
import { VectorsView } from "../_/VectorsView";
import { useFableSearch } from "./_/hooks";
import { Results } from "./_/Results";

import Styles from "./page.module.css";

export default function Page() {
  const { tr, embedder, ready, busy, scene, projection, probe, search, showFablesList, ...form } =
    useFableSearch();
  return (
    <div className={Styles.page}>
      <header>
        <h1>{tr.title}</h1>
        <ViewButton color="primary-7" onClick={showFablesList}>
          {tr.showList}
        </ViewButton>
      </header>
      <div className={Styles.columns}>
        <section className={Styles.search}>
          <p>{tr.intro}</p>
          <label htmlFor="fable-query">{tr.question}</label>
          <div className={Styles.ask}>
            <input
              id="fable-query"
              ref={form.refInput}
              type="text"
              value={form.input}
              placeholder={tr.placeholder}
              disabled={!ready}
              onChange={(event) => form.setInput(event.target.value)}
              onKeyDown={form.handleKeyDown}
            />
            <ViewButton color="secondary-5" enabled={ready && !busy} onClick={form.handleSearch}>
              {tr.search}
            </ViewButton>
          </div>
          {embedder.status === "error" && (
            <p className={Styles.error}>{tr.error$(embedder.message)}</p>
          )}
          {search && (
            <Results className={Styles.results} query={search.query} results={search.results} />
          )}
        </section>
        <VectorsView scene={scene} projection={projection} probe={probe} />
      </div>
      {embedder.status === "loading" && (
        <LoadingOverlay progress={embedder.progress} remaining={embedder.remaining} />
      )}
    </div>
  );
}
