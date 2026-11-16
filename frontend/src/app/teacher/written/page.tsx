import { TeacherOnly } from "@/components/TeacherOnly";
import { isTeacher, State } from "@/state";

import { WrittenEditor } from "./_/WrittenEditor";
import { WrittenList } from "./_/WrittenList";
import { useWrittenPage } from "./hooks";

import Styles from "./page.module.css";

/**
 * Management of the written productions of the teacher (for all the class rooms).
 */
export default function Page() {
  const user = State.user.useValue();
  const page = useWrittenPage();

  if (!isTeacher(user)) return <TeacherOnly />;

  return (
    <div className={Styles.page}>
      <WrittenList
        items={page.data}
        isLoading={page.isLoading}
        error={page.error}
        selected={page.selected}
        onSelect={page.select}
      />
      {!page.isLoading && (
        <WrittenEditor
          key={page.editorKey}
          item={page.item}
          onSaved={page.select}
          onDeleted={() => page.select(null)}
        />
      )}
    </div>
  );
}
