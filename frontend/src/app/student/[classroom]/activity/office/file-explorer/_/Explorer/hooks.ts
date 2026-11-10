import { isSelected } from "../explorer";
import { FILES } from "../files";
import { useTranslation } from "./translation";

export function useExplorer(mask: number) {
  const tr = useTranslation();
  return {
    tr,
    selectedCount: FILES.filter((_, index) => isSelected(mask, index)).length,
  };
}
