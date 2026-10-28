import { Theme } from "@tolokoban/ui";

import { useTranslation } from "./translation";

import Styles from "./Risk.module.css";

const $ = Theme.classNames;

const LEVELS = ["level1", "level2", "level3", "level4"] as const;
const USAGES = ["usage1", "usage2", "usage3", "usage4"] as const;

export interface RiskProps {
  className?: string;
  /**
   * 1: Inacceptable
   * 2. Élevé
   * 3. Limité
   * 4. Minimal
   */
  value: number;
}

export function Risk({ className, value }: RiskProps) {
  const tr = useTranslation();
  const index = Math.max(0, Math.min(3, Math.round(value) - 1));
  return (
    <div className={$.join(className, Styles.risk)}>
      <div>
        {tr.riskBefore}
        <b>{tr[LEVELS[index]]}</b>
        {tr.riskAfter}
      </div>
      <div>{tr[USAGES[index]]}</div>
    </div>
  );
}
