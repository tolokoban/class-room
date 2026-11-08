import { useRouteParamAsString } from "@/app/routes";
import { useSelectCurrentActivity } from "@/components/SelectCurrentActivity";
import { useServiceActivityCurrent } from "@/service/hooks/activity";

export function useActivateButton(activity: string) {
  const classroom = useRouteParamAsString("classroom");
  const current = useServiceActivityCurrent(classroom);
  const selector = useSelectCurrentActivity();
  const activate = () => void selector.select(classroom, activity);

  return {
    isLoading: current.isLoading,
    isCurrent: current.data === activity,
    isPending: selector.isPending,
    activate,
  };
}
