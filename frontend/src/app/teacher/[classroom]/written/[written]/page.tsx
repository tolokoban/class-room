import { IconArrowLeft, ViewButton, ViewSpinner } from "@tolokoban/ui";

import { Md } from "@/components/Md";
import { TeacherOnly } from "@/components/TeacherOnly";
import { isTeacher, State } from "@/state";

import { ExpirationPanel } from "./_/ExpirationPanel";
import { StudentUploads } from "./_/StudentUploads";
import { TimerPanel } from "./_/TimerPanel";
import { useWrittenResultsPage } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./page.module.css";

/**
 * Follow-up of a written production in a class room: timer and uploaded files.
 */
export default function Page() {
  const tr = useTranslation();
  const user = State.user.useValue();
  const page = useWrittenResultsPage();
  const { data, writtenRef } = page;

  if (!isTeacher(user)) return <TeacherOnly />;

  return (
    <div className={Styles.page}>
      <nav>
        <ViewButton variant="text" icon={IconArrowLeft} onClick={page.backUrl}>
          {tr.back}
        </ViewButton>
      </nav>
      {page.isLoading && <ViewSpinner />}
      {page.error && <div className={Styles.error}>{page.error.message}</div>}
      {data && (
        <>
          <h1>{data.name}</h1>
          <TimerPanel writtenRef={writtenRef} timer={data.timer} now={data.now} />
          <ExpirationPanel
            writtenRef={writtenRef}
            timer={data.timer}
            expiration={data.expiration}
            now={data.now}
          />
          <StudentUploads writtenRef={writtenRef} uploads={data.uploads} />
          <section className={Styles.description}>
            <header>{tr.description}</header>
            <Md value={data.description} />
          </section>
        </>
      )}
    </div>
  );
}
