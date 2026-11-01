import { IconLogout, Theme, ViewButton } from "@tolokoban/ui";

import { useLogoutButton } from "./hooks";

const $ = Theme.classNames;

export interface LogoutButtonProps {
  className?: string;
  /** Name of the connected user, used as caption. */
  name: string;
}

export function LogoutButton({ className, name }: LogoutButtonProps) {
  const logout = useLogoutButton();

  return (
    <ViewButton
      className={$.join(className)}
      icon={IconLogout}
      waiting={logout.isPending}
      onClick={logout.submit}
    >
      {name}
    </ViewButton>
  );
}
