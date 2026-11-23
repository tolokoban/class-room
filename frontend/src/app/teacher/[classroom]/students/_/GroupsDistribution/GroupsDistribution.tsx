import { IconRandom, Theme, ViewButton, ViewInputNumber } from "@tolokoban/ui";

import { useGroupsDistribution } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./GroupsDistribution.module.css";

const $ = Theme.classNames;

export interface GroupsDistributionProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
}

/**
 * Randomly split the connected students into groups of a minimum size.
 */
export function GroupsDistribution({ className, classroom }: GroupsDistributionProps) {
  const tr = useTranslation();
  const distribution = useGroupsDistribution(classroom);

  return (
    <section className={$.join(className, Styles.groupsDistribution)}>
      <header>{tr.title}</header>
      <div>
        <div className={Styles.toolbar}>
          <ViewInputNumber
            label={tr.size}
            min={1}
            max={1000}
            value={distribution.size}
            onChange={distribution.setSize}
            onEnterKeyPressed={distribution.distribute}
          />
          <ViewButton
            icon={IconRandom}
            enabled={distribution.hasStudents}
            onClick={distribution.distribute}
          >
            {tr.shuffle}
          </ViewButton>
        </div>
        {!distribution.hasStudents && <em>{tr.empty}</em>}
        {distribution.hasStudents && distribution.groups.length === 0 && <em>{tr.noGroups}</em>}
        <ol>
          {distribution.groups.map((group, index) => (
            <li key={index}>
              {group.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
