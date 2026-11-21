import { Theme, ViewDialog } from "@tolokoban/ui";

import { getFables } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./FablesList.module.css";

const $ = Theme.classNames;

export interface FablesListProps {
  className?: string;
  onClose(): void;
}

/**
 * Titles of the fables stored in the database: the ancient authors on the left
 * (Ésope, and Phèdre when Ésope has no version of the story), La Fontaine on the right.
 */
export function FablesList({ className, onClose }: FablesListProps) {
  const tr = useTranslation();
  return (
    <ViewDialog
      className={$.join(className, Styles.fablesList)}
      title={tr.title}
      buttonValidate={{ children: tr.close, onClick: onClose }}
    >
      <div>
        <section>
          <h2>{tr.ancient}</h2>
          <ul>
            {getFables(["esope", "phedre"]).map(({ title, author }) => (
              <li key={title}>
                {title} {author === "phedre" && <em>({tr.phedre})</em>}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{tr.lafontaine}</h2>
          <ul>
            {getFables(["lafontaine"]).map(({ title }) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
        </section>
      </div>
    </ViewDialog>
  );
}
