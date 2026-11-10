import { type Cells } from "../Sheet/engine/address";
import { exerciseCode } from "../exercise-code";
import { useTranslation } from "./translation";
import { Notif } from "@/components/Notification";
import { isTeacher, State } from "@/state";

export function useCopyButton(cells: Cells) {
  const tr = useTranslation();
  const user = State.user.useValue();
  return {
    tr,
    visible: isTeacher(user),
    handleCopy() {
      navigator.clipboard
        .writeText(exerciseCode(cells))
        .then(() => Notif.info(tr.copied))
        .catch(() => Notif.error(tr.copyFailed));
    },
  };
}
