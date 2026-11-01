import { ActivityWatcher } from "./_/ActivityWatcher";
import { useRouteParamAsString } from "@/app/routes";
import { useRoomEnter } from "./hooks";

export default function Layout({ children }: { children: React.ReactNode }) {
  const classroom = useRouteParamAsString("classroom");
  useRoomEnter(classroom);

  return (
    <>
      <ActivityWatcher classroom={classroom} />
      {children}
    </>
  );
}
