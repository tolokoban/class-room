import { DemoContext, field } from "../../context";

/**
 * Translation of `backend/www/api/entrypoint/user/login/index.php`.
 * In demo mode, any credentials open a session for the "Demo Teacher".
 */
export default async function userLogin(input: unknown, ctx: DemoContext): Promise<unknown> {
  const login = field(input, "login");
  const password = field(input, "password");
  if (
    typeof login !== "string" ||
    typeof password !== "string" ||
    login === "" ||
    password === ""
  ) {
    return -10101;
  }

  return ctx.user;
}
