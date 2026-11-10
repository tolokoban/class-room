import { Theme, ViewDialog } from "@tolokoban/ui";

import { ClickLabel } from "../../ClickLabel";
import { useTranslation } from "./translation";

import Styles from "./Help.module.css";

const $ = Theme.classNames;

const ROWS = [
  { key: "click", ctrl: false, shift: false },
  { key: "ctrlClick", ctrl: true, shift: false },
  { key: "shiftClick", ctrl: false, shift: true },
  { key: "ctrlShiftClick", ctrl: true, shift: true },
] as const;

export interface HelpProps {
  className?: string;
  onClose(): void;
}

export function Help({ className, onClose }: HelpProps) {
  const tr = useTranslation();
  return (
    <ViewDialog
      className={$.join(className, Styles.help)}
      title={tr.title}
      buttonValidate={{ children: tr.close, onClick: onClose }}
    >
      <p>{tr.goal}</p>
      <table>
        <tbody>
          {ROWS.map(({ key, ctrl, shift }) => (
            <tr key={key}>
              <td>
                <ClickLabel ctrl={ctrl} shift={shift} />
              </td>
              <td>{tr[key]}</td>
            </tr>
          ))}
          <tr>
            <td>
              <ClickLabel ctrl={false} shift={false} file={null} />
            </td>
            <td>{tr.emptyClick}</td>
          </tr>
        </tbody>
      </table>
    </ViewDialog>
  );
}
