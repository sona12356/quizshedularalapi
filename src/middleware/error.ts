import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new createError.NotFound());
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
}
