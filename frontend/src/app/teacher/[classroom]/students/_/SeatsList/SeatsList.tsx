import { IconLogout, Theme, ViewButton, ViewSpinner } from "@tolokoban/ui";

import { SectionHeader } from "@/components/SectionHeader";

import { useSeatsList } from "./hooks";
import { useTranslation } from "./translation";

import Styles from "./SeatsList.module.css";

const $ = Theme.classNames;

export interface SeatsListProps {
  className?: string;
  /** Code of the class room. */
  classroom: string;
}

/**
 * The students connected to a class room, with buttons to disconnect them.
 */
export function SeatsList({ className, classroom }: SeatsListProps) {
  const tr = useTranslation();
  const list = useSeatsList(classroom);

  return (
    <section className={$.join(className, Styles.seatsList)}>
      <SectionHeader expanded={list.expanded} onToggle={list.toggle}>
        {tr.title}
        {list.data && (
          <small>
            {" "}
            ({tr.count$(String(list.data.seats.length), String(list.data.maxStudents))})
          </small>
        )}
      </SectionHeader>
      {list.expanded && (
        <>
          <div>
            {list.isLoading && <ViewSpinner />}
            {list.error && <div className={Styles.error}>{list.error.message}</div>}
            {list.data?.seats.length === 0 && <em>{tr.empty}</em>}
            <ul>
              {list.data?.seats.map((seat) => (
                <li key={seat.nickname}>
                  <strong>{seat.nickname}</strong>
                  <small>{tr.lastSeen$(list.formatTime(seat.time))}</small>
                  {seat.uploads > 0 && <small>{tr.uploads$(String(seat.uploads))}</small>}
                  <ViewButton
                    variant="text"
                    icon={IconLogout}
                    waiting={list.isKicking}
                    onClick={() =>
                      list.kickAfterConfirm(tr.kickConfirm$(seat.nickname), seat.nickname)
                    }
                  >
                    {tr.kick}
                  </ViewButton>
                </li>
              ))}
            </ul>
          </div>
          <footer>
            <ViewButton
              color="error"
              icon={IconLogout}
              enabled={(list.data?.seats.length ?? 0) > 0}
              waiting={list.isKicking}
              onClick={() => list.kickAfterConfirm(tr.kickAllConfirm)}
            >
              {tr.kickAll}
            </ViewButton>
          </footer>
        </>
      )}
    </section>
  );
}
