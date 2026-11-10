import { useTanslatorGeneric } from "@tolokoban/react-state";

import FR from "./translation.fr";

export function useTranslation() {
  return useTanslatorGeneric(FR, {
    en: () => import("./translation.en"),
    de: () => import("./translation.de"),
    it: () => import("./translation.it"),
  });
}
