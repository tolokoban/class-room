import { isObject, isString } from "@tolokoban/type-guards";
import { langGet } from "@tolokoban/react-state";
import { ReactNode } from "react";
import { isReactNode } from "./types";

export class MultiLang {
  public static get(value: ReactNode | { [lang: string]: ReactNode }, lang?: string) {
    const ml = new MultiLang(value);
    return ml.get(lang) || `${langGet()}`;
  }

  private values: Record<string, ReactNode> = {};

  constructor(value: ReactNode | { [lang: string]: ReactNode }) {
    if (isMultiLang(value)) {
      this.values = value;
    } else {
      this.values = { fr: value as ReactNode };
    }
  }

  has(lang: string) {
    return isString(this.values[lang]) && this.values[lang].trim().length > 0;
  }

  get(lang?: string) {
    lang ??= langGet();
    const value = this.values[lang];
    if (value) return value;

    const [key] = Object.keys(this.values);
    if (!key) return undefined;

    return this.values[key];
  }

  set(lang: string, value: string) {
    this.values[lang] = value;
    return this.toString();
  }

  toString() {
    return JSON.stringify(this.values);
  }
}

export function isMultiLang(
  data: unknown,
): data is Record<"fr" | "en" | "de" | "it", React.ReactNode> {
  if (!isObject(data)) return false;

  let count = 0;
  for (const lang of ["fr", "en", "de", "it"]) {
    const value = data[lang];
    if (!value) continue;

    count++;
    if (!isReactNode(value)) return false;
  }
  return count > 0;
}
