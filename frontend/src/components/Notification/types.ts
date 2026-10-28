import { ApiError } from "@/service/calls/service";

export interface Notification {
  id: string;
  type: "info" | "error" | "warn";
  content: React.ReactNode | ApiError;
  visible: boolean;
}
