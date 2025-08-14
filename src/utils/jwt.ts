
import jwt, { SignOptions, JwtPayload, Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "change_me";

export function signJWT(
  payload: Record<string, unknown>,
  // use the library's own type, with a numeric default (7 days in seconds)
  expiresIn: SignOptions["expiresIn"] = 7 * 24 * 60 * 60
): string {
  const options: SignOptions = {
    algorithm: "HS256",
  };
  // only set if provided, and it’s already the right type
  if (expiresIn !== undefined) options.expiresIn = expiresIn;

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJWT<T = JwtPayload>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
