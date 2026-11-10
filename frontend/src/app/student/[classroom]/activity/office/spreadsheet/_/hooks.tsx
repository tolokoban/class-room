import { useLangValue } from "@tolokoban/react-state";
import { useModal } from "@tolokoban/ui";
import React from "react";

import { EXERCISES } from "../exercises";
import { type Exercise } from "./exercise";
import { sheetMatches } from "./match";
import { type Cells } from "./Sheet/engine/address";
import { Success } from "./Success";
import { MultiLang } from "@/utils/multilang";

/** The ids of the exercises in the order of their declaration. */
const EXERCISE_IDS = Object.keys(EXERCISES);

export function useSpreadsheetActivity() {
  const lang = useLangValue();
  const [index, setIndex] = React.useState(0);
  const exercise = EXERCISES[EXERCISE_IDS[index]] as Exercise | undefined;
  const [cells, setCells] = React.useState<Cells>(exercise?.initial ?? {});
  const showSuccess = useShowSuccess();
  const goTo = (next: number) => {
    setIndex(next);
    setCells(EXERCISES[EXERCISE_IDS[next]]?.initial ?? {});
  };
  return {
    exercise,
    title: exercise ? MultiLang.get(exercise.title, lang) : "",
    progress: { index: index + 1, count: EXERCISE_IDS.length },
    cells,
    handleChange(next: Cells) {
      setCells(next);
      if (exercise && sheetMatches(next, exercise.expected)) {
        showSuccess(() => goTo(index + 1));
      }
    },
    handleRestartAll: () => goTo(0),
  };
}

function useShowSuccess() {
  const modal = useModal();
  return (onContinue: () => void) => {
    const hide = modal.show({
      autoClosable: false,
      content: (
        <Success
          onContinue={() => {
            hide();
            onContinue();
          }}
        />
      ),
    });
  };
}
