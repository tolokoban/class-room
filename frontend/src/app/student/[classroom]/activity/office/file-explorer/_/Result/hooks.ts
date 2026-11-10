import { useLangValue } from "@tolokoban/react-state";

import { type Click } from "../explorer";
import { FILES } from "../files";
import { computeScore, MIN_SCORE } from "../scores";
import { useTranslation } from "./translation";
import { isTeacher, State } from "@/state";
import { MultiLang } from "@/utils/multilang";

export function useResult(clicks: number, solution: Click[]) {
  const tr = useTranslation();
  const lang = useLangValue();
  const user = State.user.useValue();
  const score = computeScore(clicks, solution.length);
  return {
    tr,
    score,
    canContinue: score > MIN_SCORE,
    /** The best solution is only revealed to the teachers. */
    steps: isTeacher(user)
      ? solution.map(({ file, ctrl, shift }) => ({
          ctrl,
          shift,
          name: file === null ? null : fileName(file, lang),
        }))
      : null,
  };
}

function fileName(index: number, lang: string): string {
  const { name, extension } = FILES[index];
  return `${MultiLang.get(name, lang)}.${extension}`;
}
