import { IconPlay, ViewButton, ViewDialog, ViewInputText, ViewPanel } from "@tolokoban/ui";

import { startDemo } from "@/service/demo/user";
import { useTeacherLogin } from "./hooks";
import { useTranslation } from "./translation";

export function TeacherLogin() {
  const tr = useTranslation();
  const login = useTeacherLogin();

  return (
    <div>
      <h1>{tr.title}</h1>
      <ViewDialog
        buttonValidate={{
          children: tr.connect,
          enabled: login.canSubmit,
          waiting: login.isPending,
          onClick: login.submit,
        }}
      >
        <ViewPanel display="flex" flexDirection="column">
          <ViewInputText label={tr.user} value={login.user} onChange={login.setUser} autofocus />
          <ViewInputText
            label={tr.password}
            type="password"
            value={login.password}
            onChange={login.setPassword}
            onEnterKeyPressed={login.submit}
          />
        </ViewPanel>
      </ViewDialog>
      <ViewButton variant="text" icon={IconPlay} onClick={startDemo}>
        {tr.demo}
      </ViewButton>
    </div>
  );
}
