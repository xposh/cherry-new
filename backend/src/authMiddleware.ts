import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

// Prüft, ob der Secret-Key in der Systemumgebung existiert
if (!process.env.JWT_SECRET) {
  console.error("Denk dran! JWT_SECRET must be configured in .env");
  process.exit();
}
const JWT_SECRET = process.env.JWT_SECRET;

// Interface definiert die Struktur des JWT-Payloads (Nutzlast des Tokens)
interface AuthTokenPayload extends JwtPayload {
  email?: string;
  role?: string;
}

// Erweiterung des Express-Request-Objekts, um 'auth' global verfügbar zu machen
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

// Hauptfunktion der Middleware zur Absicherung von Routen
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.log("Middleware has been called");

  // Extrahiert den Authorization-Header (Bearer Token)
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).json({ msg: "Access denied" });
  }

  try {
    // Teilt "Bearer [TOKEN]" und nimmt nur den Token-Teil
    const [_prefix, accessToken] = authorization.split(" ");

    // Validiert das Token mit dem Secret-Key
    const decodedToken = jwt.verify(
      accessToken,
      JWT_SECRET,
    ) as AuthTokenPayload;

    console.log(decodedToken);

    // Speichert User-Informationen aus dem Token in das Request-Objekt
    req.auth = {
      userId:
        typeof decodedToken.sub === "string" ? decodedToken.sub : undefined,
      email: decodedToken.email,
      role: decodedToken.role,
    };

    // Führt die nächste Funktion im Express-Router aus
    next();
  } catch (error) {
    // Fehlerbehandlung: Fängt abgelaufene Tokens (jwt expired) oder ungültige Signaturen ab
    console.error("❌ Token verification failed:", (error as Error).message);
    return res.status(401).json({ msg: "Token expired or invalid" });
  }
}
