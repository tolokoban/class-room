import { Theme } from "@tolokoban/ui";

import { StudentLogin } from "./StudentLogin";
import { TeacherLogin } from "./TeacherLogin";
import Styles from "./Login.module.css";

const $ = Theme.classNames;

export interface LoginProps {
  className?: string;
}

export function Login({ className }: LoginProps) {
  return (
    <div className={$.join(className, Styles.login)}>
      <TeacherLogin />
      <StudentLogin />
    </div>
  );
}
