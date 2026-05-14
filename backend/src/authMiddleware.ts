import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  console.error("Denk dran! JWT_SECRET must be configured in .env");
  process.exit();
}
const JWT_SECRET = process.env.JWT_SECRET;

interface AuthTokenPayload extends JwtPayload {
  email?: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string | undefined;
        email: string | undefined;
        role: string | undefined;
      };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.log("Middleware has been called");
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).json({ msg: "Access denied" });
  }
  const [_prefix, accessToken] = authorization.split(" ");
  const decodedToken = jwt.verify(accessToken, JWT_SECRET) as AuthTokenPayload;
  console.log(decodedToken);
  req.auth = {
    userId: typeof decodedToken.sub === "string" ? decodedToken.sub : undefined,
    email: decodedToken.email,
    role: decodedToken.role,
  };
  next();
}
