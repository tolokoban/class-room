import { useConfirm } from "@/components/Confirm";

export function useActionDelete(content: React.ReactNode, onDelete: () => void) {
  const confirm = useConfirm();

  return () => {
    void confirm({ content, accent: true }).then((confirmed) => {
      if (confirmed) onDelete();
    });
  };
}
