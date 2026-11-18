import { IconMail, Theme, ViewButton } from "@tolokoban/ui";

import { contactAdmin } from "./contact";
import { useTranslation } from "./translation";

import Styles from "./DemoBanner.module.css";

const $ = Theme.classNames;

export interface DemoBannerProps {
  className?: string;
}

/**
 * Shown above everything else in demo mode.
 */
export function DemoBanner({ className }: DemoBannerProps) {
  const tr = useTranslation();

  return (
    <div className={$.join(className, Styles.demoBanner)}>
      <div>
        <strong>{tr.title}</strong> {tr.message}
      </div>
      <ViewButton icon={IconMail} color="neutral-9" onClick={contactAdmin}>
        {tr.contact}
      </ViewButton>
    </div>
  );
}
