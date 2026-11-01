import { useActivityWatcher } from "./hooks";

export interface ActivityWatcherProps {
  /** Code of the class room to watch. */
  classroom: string;
}

/**
 * Every 10 seconds, check the current activity of the class room.
 * If the student is not in it, a notification invites them to join it.
 */
export function ActivityWatcher({ classroom }: ActivityWatcherProps) {
  useActivityWatcher(classroom);

  return null;
}
