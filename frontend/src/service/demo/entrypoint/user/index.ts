import { DemoHandler } from "../../context";
import login from "./login";
import logout from "./logout";

export const USER: Record<string, DemoHandler> = {
  login,
  logout,
};
