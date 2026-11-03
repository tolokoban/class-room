import { Theme, ViewDialog } from "@tolokoban/ui";

import { useHelp } from "./hooks";

import Styles from "./Help.module.css";

const $ = Theme.classNames;

export interface HelpProps {
  className?: string;
  onClose(): void;
}

export function Help({ className, onClose }: HelpProps) {
  const { tr, rows } = useHelp();
  return (
    <ViewDialog
      className={$.join(className, Styles.help)}
      title={tr.title}
      buttonValidate={{ children: tr.close, onClick: onClose }}
    >
      <table>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td>
                {row.labels.map((label) => (
                  <kbd key={label}>{label}</kbd>
                ))}
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ViewDialog>
  );
}
