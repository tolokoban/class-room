import { useLangValue } from "@tolokoban/react-state";
import React from "react";

import { EXERCISE_IDS, EXERCISES, type ExerciseId } from "../exercises";
import { getContent } from "./content";
import { type Difference, findDifference, stripMarkdown } from "./markdown";
import { ACTIVITY_CODE, parseDone, readSessionDone, writeSessionDone } from "./progress";
import { useTranslation } from "./translation";
import { gotoTarget, useRouteParamAsString } from "@/app/routes";
import { useConfirm } from "@/components/Confirm";
import { Notif } from "@/components/Notification";
import { useServiceActivityResultGet, useServiceActivityResultSet } from "@/service/hooks/activity";
import { useApiErrorTranslator } from "@/service/hooks/apiError";
import { isTeacher, State } from "@/state";
import { MultiLang } from "@/utils/multilang";

export function useMarkdownActivity() {
  const tr = useTranslation();
  const confirm = useConfirm();
  const lang = useLangValue();
  const [index, setIndex] = React.useState(0);
  /** Code of the student, per language and exercise. */
  const [codes, setCodes] = React.useState<Record<string, string>>({});
  const [difference, setDifference] = React.useState<Difference | null>(null);
  const { done, saveDone } = useDoneSaver();
  const id: ExerciseId | undefined = EXERCISE_IDS[index];
  const expected = id ? getContent(id, lang) : "";
  const title = id ? `${MultiLang.get(EXERCISES[id].title, lang)}` : "";
  const key = `${lang}/${id}`;
  const code = codes[key] ?? stripMarkdown(expected);
  const goTo = (next: number) => {
    setIndex(next);
    setDifference(null);
  };
  const handleNext = async () => {
    if (!id) return;

    // An exercise already done can be skipped, to get back where the student stopped.
    if (done.includes(id)) {
      const skip = await confirm({
        content: tr.alreadyDone$(title),
        labelOK: tr.skipCheck,
        labelCancel: tr.checkAnyway,
        accent: true,
      });
      if (skip) {
        goTo(index + 1);
        return;
      }
    }
    const found = findDifference(expected, code);
    setDifference(found);
    if (found) {
      Notif.warn(tr.notYet);
      return;
    }
    saveDone(id);
    Notif.info(tr.success$(title));
    goTo(index + 1);
  };
  return {
    exerciseId: id,
    title,
    done: id ? done.includes(id) : false,
    progress: { index: index + 1, count: EXERCISE_IDS.length },
    code,
    expected,
    difference,
    handleChange: (value: string) => {
      setCodes({ ...codes, [key]: value });
      setDifference(null);
    },
    handleReset: () => {
      const { [key]: _, ...others } = codes;
      setCodes(others);
      setDifference(null);
    },
    handlePrevious: index > 0 ? () => goTo(index - 1) : undefined,
    handleNext,
    handleRestartAll: () => goTo(0),
    handleResults: useResultsHandler(),
  };
}

/**
 * @returns A handler to open the results page, or `undefined` if the user is not a teacher.
 */
function useResultsHandler(): (() => void) | undefined {
  const user = State.user.useValue();
  const classroom = useRouteParamAsString("classroom");
  if (!isTeacher(user)) return undefined;

  return () => gotoTarget(null, "/teacher/[classroom]/activity/office/markdown", classroom);
}

/**
 * Remember the exercises done right, and store their list
 * with entrypoint `activity/result-set`. Teachers' results are not stored:
 * they are considered to have done all the exercises.
 * The list stored previously is loaded with entrypoint `activity/result-get`,
 * and merged with the one kept in the session storage, so that the progress
 * is not lost when the page is refreshed (even for teachers).
 */
function useDoneSaver() {
  const user = State.user.useValue();
  const computer = State.computer.useValue();
  const classroomCode = useRouteParamAsString("classroom");
  const service = useServiceActivityResultSet();
  const translateError = useApiErrorTranslator();
  const [done, setDone] = React.useState<ExerciseId[]>(() => readSessionDone(classroomCode));
  const stored = useServiceActivityResultGet(
    typeof user === "string"
      ? { classroomCode, activityCode: ACTIVITY_CODE, computer, nickname: user }
      : null,
  );
  React.useEffect(() => {
    if (!stored.data) return;

    const loaded = parseDone(stored.data);
    setDone((current) => {
      const merged = EXERCISE_IDS.filter((id) => loaded.includes(id) || current.includes(id));
      writeSessionDone(classroomCode, merged);
      return merged;
    });
  }, [stored.data, classroomCode]);
  const saveDone = (id: ExerciseId) => {
    if (done.includes(id)) return;

    const next = EXERCISE_IDS.filter((item) => item === id || done.includes(item));
    setDone(next);
    writeSessionDone(classroomCode, next);
    if (typeof user !== "string") return;

    service
      .mutate({
        classroomCode,
        activityCode: ACTIVITY_CODE,
        computer,
        nickname: user,
        result: JSON.stringify(next),
      })
      .catch((error: unknown) => Notif.error(translateError(error)));
  };
  // A teacher can browse all the exercises freely, as if they had done them all.
  return { done: isTeacher(user) ? EXERCISE_IDS : done, saveDone };
}
