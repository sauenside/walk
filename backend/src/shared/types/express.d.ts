import "express-serve-static-core";
import type { AccessTokenPayload } from "../auth/access-token-payload";

declare module "express-serve-static-core" {
  interface Request {
    id: string;
    auth?: AccessTokenPayload;
  }
}
