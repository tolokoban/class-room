import { splitMimeTypes } from "./presets";
import { useTranslation } from "./translation";

/**
 * @returns A function that gives a human readable description of a list of accepted mime types.
 */
export function useMimeTypesLabel(): (mimeTypes: string[]) => string {
  const tr = useTranslation();

  return (mimeTypes: string[]) => {
    if (mimeTypes.length === 0) return tr.any;

    const { presets, others } = splitMimeTypes(mimeTypes);
    const labels = presets.map((preset) => tr[preset.key]);
    if (others.length > 0) labels.push(tr.other$(others.join(", ")));
    return labels.join(" • ");
  };
}
