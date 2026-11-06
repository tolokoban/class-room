import { isString } from "@tolokoban/type-guards";
import { IconHome, ViewFloatingButton } from "@tolokoban/ui";

import { Login } from "@/components/Login";
import SelectLanguage from "@/components/SelectLanguage";
import { isTeacher, State } from "@/state";
import { ActivateActivity } from "./_/ActivateActivity";
import { LogoutButton } from "./_/LogoutButton";
import { makeGoto, useRouteParamAsString } from "./routes";

import Styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = State.user.useValue();
  const userPending = State.userPending.useValue();
  const classroom = useRouteParamAsString("classroom");

  return (
    <div className={Styles.layout}>
      <header>
        <div>
          {isTeacher(user) && (
            <ViewFloatingButton size="S" icon={IconHome} onClick={makeGoto("/")} />
          )}
          <div className={Styles.light}>
            Class Room{classroom && ` (${classroom})`}
          </div>
          {isTeacher(user) && <ActivateActivity />}
        </div>
        {user && <LogoutButton name={isString(user) ? user : user.name} />}
        <SelectLanguage />
      </header>
      <main>{user === null ? !userPending && <Login /> : children}</main>
    </div>
  );
}
