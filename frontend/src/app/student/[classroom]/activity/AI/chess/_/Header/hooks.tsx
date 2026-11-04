import { useModal } from "@tolokoban/ui";

import { RestartDialog } from "./RestartDialog";

/** Ask the user what kind of game to restart with. */
export function useRestart(onRandomGame: () => void, onNewGame: () => void) {
  const modal = useModal();
  return () => {
    const choose = (action: () => void) => () => {
      hide();
      action();
    };
    const hide = modal.show({
      content: (
        <RestartDialog
          onRandomGame={choose(onRandomGame)}
          onNewGame={choose(onNewGame)}
          onCancel={() => hide()}
        />
      ),
    });
  };
}
