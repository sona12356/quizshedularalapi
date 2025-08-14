import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { verifyJWT } from "../utils/jwt.js";

export function auth(required = true): any {
  return (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      if (required) return next(new createError.Unauthorized("Missing Authorization header"));
      return next();
    }
    const token = header.replace(/^Bearer\s+/i, "");
    try {
      const decoded = verifyJWT<{ id: string; role: "admin" | "user" }>(token);
      req.user = { id: decoded.id, role: decoded.role };
      return next();
    } catch {
      if (required) return next(new createError.Unauthorized("Invalid token"));
      return next();
    }
  };
}

export function requireRole(role: "admin" | "user") {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new createError.Unauthorized());
    if (req.user.role !== role) return next(new createError.Forbidden("Insufficient role"));
    return next();
  };
}
