import { IconHome, ViewFloatingButton } from "@tolokoban/ui";
import { isString } from "@tolokoban/type-guards";

import { isTeacher, State } from "@/state";
import SelectLanguage from "@/components/SelectLanguage";
import { Login } from "@/components/Login";

import Styles from "./layout.module.css";
import { makeGoto } from "./routes";

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = State.user.useValue();

  return (
    <div className={Styles.layout}>
      <header>
        <div>
          {isTeacher(user) && (
            <ViewFloatingButton size="S" icon={IconHome} onClick={makeGoto("/")} />
          )}
          <div className={Styles.light}>Class Room</div>
        </div>
        <div>{user && (isString(user) ? user : user.name)}</div>
        <SelectLanguage />
      </header>
      <main>{user === null ? <Login /> : children}</main>
    </div>
  );
}
