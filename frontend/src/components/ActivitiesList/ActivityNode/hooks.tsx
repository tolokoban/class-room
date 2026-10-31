import { useModal } from "@tolokoban/ui";
import React from "react";

import { useRouteParamAsString } from "@/app/routes";

import { ActivityMenu } from "./ActivityMenu";

/**
 * @returns The hash URL of the activity page at `path`,
 * for the classroom of the current route.
 */
export function useActivityHref(path: string[]): string {
  const classroom = useRouteParamAsString("classroom", "0");
  return `#/student/${classroom}/activity/${path.join("/")}`;
}

/**
 * @returns A click handler that opens a modal letting the teacher
 * open the activity, set it as the current one, or see the results.
 */
export function useActivityMenu(path: string[], title: string) {
  const modal = useModal();
  const classroom = useRouteParamAsString("classroom", "0");

  return (evt: React.MouseEvent) => {
    evt.preventDefault();
    const hide = modal.show({
      content: (
        <ActivityMenu
          classroom={classroom}
          activity={path.join("/")}
          title={title}
          onClose={() => hide()}
        />
      ),
    });
  };
}
