import { State } from "@/state";

import Styles from "./layout.module.css";
import SelectLanguage from "@/components/SelectLanguage";
import { Login } from "@/components/Login";
import { isString } from "@tolokoban/type-guards";

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = State.user.useValue();

  return (
    <div className={Styles.layout}>
      <header>
        <div>Class Room</div>
        <div>{user && (isString(user) ? user : user.name)}</div>
        <SelectLanguage />
      </header>
      <main>{user === null ? <Login /> : children}</main>
    </div>
  );
}
