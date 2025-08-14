import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import createError from "http-errors";
import { User } from "../models/User.js";
import { signJWT } from "../utils/jwt.js";
import { loginSchema, registerSchema } from "../validators/authSchemas.js";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await User.findOne({ email: data.email });
    if (existing) throw new createError.Conflict("Email already exists");

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      email: data.email,
      passwordHash,
      role: data.role ?? "user"
    });

    const token = signJWT({ id: user._id.toString(), role: user.role });
    res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err: any) {
    if (err?.name === "ZodError") return next(new createError.BadRequest(err.errors?.map((e:any)=>e.message).join("; ")));
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email });
    if (!user) throw new createError.Unauthorized("Invalid credentials");

    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) throw new createError.Unauthorized("Invalid credentials");

    const token = signJWT({ id: user._id.toString(), role: user.role });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err: any) {
    if (err?.name === "ZodError") return next(new createError.BadRequest(err.errors?.map((e:any)=>e.message).join("; ")));
    next(err);
  }
}
