import { useModal } from "@tolokoban/ui";

import { type Notion } from "../NotionList";
import { Help } from "./Help";

export function useShowHelp(notions?: Notion[]) {
  const modal = useModal();
  return () => {
    const hide = modal.show({
      content: <Help notions={notions} onClose={() => hide()} />,
    });
  };
}
