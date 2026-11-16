import { useLangValue } from "@tolokoban/react-state";

import { useTranslation } from "./translation";

const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;

/**
 * @returns A function that formats a size in bytes, KB, MB or GB,
 * depending on its magnitude (with the units of the current language).
 */
export function useHumanSize(): (bytes: number) => string {
  const tr = useTranslation();
  const lang = useLangValue();
  const format = (value: number) =>
    new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }).format(value);

  return (bytes: number) => {
    if (bytes < KB) return tr.sizeB$(format(bytes));
    if (bytes < MB) return tr.sizeKB$(format(bytes / KB));
    if (bytes < GB) return tr.sizeMB$(format(bytes / MB));
    return tr.sizeGB$(format(bytes / GB));
  };
}
