import type FR from "./translation/translation.fr";

type NotionKey = Extract<keyof typeof FR, `notion${number}`>;

/**
 * Number of a notion, like `1` for `notion1`.
 * Derived from the translation keys: adding `notion26` to `translation.fr.ts` makes `26` valid.
 */
export type Notion = {
  [K in NotionKey]: K extends `notion${infer N extends number}` ? N : never;
}[NotionKey];
