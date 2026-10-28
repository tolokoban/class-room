import { ViewDialog, ViewInputText, ViewPanel } from "@tolokoban/ui";

import { useStudentLogin } from "./hooks";
import { useTranslation } from "./translation";
import { State } from "@/state";

export function StudentLogin() {
  const tr = useTranslation();
  const login = useStudentLogin();
  const computer = State.computer.useValue();

  return (
    <div>
      <h1 title={computer}>{tr.title}</h1>
      <ViewDialog
        buttonValidate={{
          children: tr.connect,
          enabled: !login.isPending,
          onClick: login.submit,
        }}
      >
        <ViewPanel display="flex" flexDirection="column">
          <ViewInputText
            ref={login.refNickname}
            label={tr.nickname}
            value={login.nickname}
            onChange={login.setNickname}
            onEnterKeyPressed={login.submit}
          />
          <ViewInputText
            ref={login.refClassroom}
            label={tr.classroom}
            value={login.classroom}
            onChange={login.setClassroom}
            onEnterKeyPressed={login.submit}
          />
        </ViewPanel>
      </ViewDialog>
    </div>
  );
}
