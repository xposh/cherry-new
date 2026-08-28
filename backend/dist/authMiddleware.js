"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Prüft, ob der Secret-Key in der Systemumgebung existiert
if (!process.env.JWT_SECRET) {
    console.error("Denk dran! JWT_SECRET must be configured in .env");
    process.exit();
}
const JWT_SECRET = process.env.JWT_SECRET;
// Hauptfunktion der Middleware zur Absicherung von Routen
function requireAuth(req, res, next) {
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
        const decodedToken = jsonwebtoken_1.default.verify(accessToken, JWT_SECRET);
        console.log(decodedToken);
        // Speichert User-Informationen aus dem Token in das Request-Objekt
        req.auth = {
            userId: typeof decodedToken.sub === "string" ? decodedToken.sub : undefined,
            email: decodedToken.email,
            role: decodedToken.role,
        };
        // Führt die nächste Funktion im Express-Router aus
        next();
    }
    catch (error) {
        // Fehlerbehandlung: Fängt abgelaufene Tokens (jwt expired) oder ungültige Signaturen ab
        console.error("❌ Token verification failed:", error.message);
        return res.status(401).json({ msg: "Token expired or invalid" });
    }
}
