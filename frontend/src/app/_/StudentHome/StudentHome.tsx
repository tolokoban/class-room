import { Theme, ViewDialog } from "@tolokoban/ui";

import { useStudentHome } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./StudentHome.module.css";

const $ = Theme.classNames;

export interface StudentHomeProps {
  className?: string;
  /** Nickname of the student. */
  user: string;
}

export function StudentHome({ className, user }: StudentHomeProps) {
  const tr = useTranslation();
  const home = useStudentHome();

  return (
    <div className={$.join(className, Styles.studentHome)}>
      <ViewDialog
        buttonCancel={{ children: tr.changeRoom, onClick: home.changeRoom }}
        buttonValidate={{ children: tr.join, waiting: home.isPending, onClick: home.join }}
      >
        <h1>{user}</h1>
        <div>
          {tr.welcome} <b>{home.classroom}</b>
        </div>
      </ViewDialog>
    </div>
  );
}
