import {
  IconAdd,
  IconEdit,
  Theme,
  ViewButton,
  ViewFloatingButton,
  ViewInputNumber,
  ViewInputText,
} from "@tolokoban/ui";

import { ClassList } from "./ClassList";
import { useTeacherHome } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./TeacherHome.module.css";

const $ = Theme.classNames;

export interface TeacherHomeProps {
  className?: string;
}

export function TeacherHome({ className }: TeacherHomeProps) {
  const tr = useTranslation();
  const home = useTeacherHome();

  return (
    <div className={$.join(className, Styles.teacherHome)}>
      <section>
        <header>{tr.title}</header>
        <ClassList />
        <footer>
          <ViewInputText
            ref={home.refName}
            label={tr.newClass}
            value={home.name}
            onChange={home.setName}
            onEnterKeyPressed={home.add}
          />
          <ViewInputNumber
            label={tr.maxStudents}
            min={1}
            max={1000}
            value={home.maxStudents}
            onChange={home.setMaxStudents}
            onEnterKeyPressed={home.add}
          />
          <ViewFloatingButton icon={IconAdd} enabled={!home.isPending} onClick={home.add} />
        </footer>
      </section>
      <ViewButton variant="text" icon={IconEdit} onClick="#/teacher/written">
        {tr.written}
      </ViewButton>
    </div>
  );
}
