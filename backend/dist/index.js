"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./util/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("./authMiddleware");
const analytics_1 = __importDefault(require("./routes/analytics"));
const cronJobs_1 = require("./services/cronJobs");
const discover_1 = __importDefault(require("./routes/discover"));
const conversations_1 = __importDefault(require("./routes/conversations")); // Ich importiere conversations hier, damit der Router registriert wird
const featuredOpportunities_1 = __importDefault(require("./routes/featuredOpportunities"));
const scoreCalculation_1 = require("./services/scoreCalculation"); // Ich berechne den Score direkt nach dem Speichern
if (!process.env.JWT_SECRET) {
    console.error("Denk dran! JWT_SECRET must be configured in .env");
    process.exit();
}
const JWT_SECRET = process.env.JWT_SECRET;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}
function mergeProfileData(current, incoming) {
    const merged = { ...current };
    for (const [key, incomingValue] of Object.entries(incoming)) {
        const currentValue = merged[key];
        if (incomingValue === undefined || incomingValue === null) {
            continue;
        }
        if (typeof incomingValue === "string") {
            if (incomingValue.trim() === "" && typeof currentValue === "string" && currentValue.trim() !== "") {
                continue;
            }
            merged[key] = incomingValue;
            continue;
        }
        if (Array.isArray(incomingValue)) {
            if (incomingValue.length === 0 &&
                Array.isArray(currentValue) &&
                currentValue.length > 0) {
                continue;
            }
            merged[key] = incomingValue;
            continue;
        }
        if (isPlainObject(incomingValue)) {
            if (typeof currentValue === "string" && currentValue.trim() !== "") {
                continue;
            }
            if (Object.keys(incomingValue).length === 0 &&
                isPlainObject(currentValue) &&
                Object.keys(currentValue).length > 0) {
                continue;
            }
            merged[key] = isPlainObject(currentValue)
                ? mergeProfileData(currentValue, incomingValue)
                : incomingValue;
            continue;
        }
        merged[key] = incomingValue;
    }
    return merged;
}
app.get("/", (req, res) => {
    return res.json({ message: "Hallo Welt" });
});
app.post("/signup", async (req, res) => {
    console.log("/signup");
    try {
        const { email, password, role } = req.body;
        const users = await (0, db_1.default) `
  SELECT * FROM users WHERE email=${email};
  `;
        if (users.length > 0) {
            return res.status(400).json({ message: "User already registered" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        const [newUser] = await (0, db_1.default) `INSERT INTO users (email, hashed_password, role)
  VALUES (${email}, ${hashedPassword}, ${role}) RETURNING *;
  `;
        const accessToken = jsonwebtoken_1.default.sign({ sub: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
            expiresIn: "7d", // was set to 2h for testing, but 7d is more user-friendly for development
        });
        return res.json({
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
            },
            accessToken,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "server error" });
    }
});
app.get("/is-profile-complete", authMiddleware_1.requireAuth, async (req, res) => {
    const { role } = req.auth;
    try {
        const result = role === "talent"
            ? await (0, db_1.default) `
    SELECT * FROM talent_profiles
    WHERE user_id = ${req.auth?.userId}
  `
            : await (0, db_1.default) `
    SELECT * FROM company_profiles
    WHERE user_id = ${req.auth?.userId}
  `;
        const userProfile = result[0];
        return res.json({
            id: req.auth?.userId,
            hasProfile: !!userProfile,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
});
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        const [user] = await (0, db_1.default) `
  SELECT * FROM users WHERE email=${email};
  `;
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const doesPasswordMatch = await bcrypt_1.default.compare(password, user.hashed_password);
        if (!doesPasswordMatch) {
            return res.status(400).json({ message: "Password does not match" });
        }
        const accessToken = jsonwebtoken_1.default.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: "7d", // was set to 2h for testing, but 7d is more user-friendly for development
        });
        return res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "server error" });
    }
});
app.post("/cherry-picks", authMiddleware_1.requireAuth, async (req, res) => {
    const { pickId } = req.body;
    try {
        await (0, db_1.default) `INSERT INTO cherry_picks (user_id, pick_id) VALUES(${req.auth.userId}, ${pickId})`;
        return res.json({ msg: "Success" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "server error" });
    }
});
// =======================================================================================================================
// ✅ SICHERER PROFIL-ENDPOINT MIT AUTHENTICATION UND ROLE-BASED ROUTING
// =======================================================================================================================
// ✅ FIX 1: requireAuth Middleware hinzugefügt
// ✅ FIX 2: userId kommt aus req.auth (vom Token), NICHT aus dem Body
// ✅ FIX 3: Role-Check: talent → talent_profiles, company → company_profiles
app.post("/profile", authMiddleware_1.requireAuth, async (req, res) => {
    try {
        // userId kommt jetzt sicher aus dem Token (von requireAuth Middleware)
        const userId = req.auth.userId;
        const userRole = req.auth.role;
        // Alle Formular-Daten kommen aus dem Body (OHNE user_id!)
        const formData = req.body && typeof req.body === "object" && !Array.isArray(req.body)
            ? req.body
            : {};
        console.log(`Speichere Profil für User ${userId} mit Role ${userRole}`);
        // Role-Check: Speichere in der richtigen Tabelle
        if (userRole === "talent") {
            const [existing] = await (0, db_1.default) `
        SELECT profile_data FROM talent_profiles WHERE user_id = ${userId}
      `;
            if (existing) {
                const current = typeof existing.profile_data === "object" &&
                    !Array.isArray(existing.profile_data)
                    ? existing.profile_data
                    : {};
                const merged = mergeProfileData(current, formData);
                await (0, db_1.default) `
          UPDATE talent_profiles
          SET profile_data = ${db_1.default.json(merged)}
          WHERE user_id = ${userId}
        `;
            }
            else {
                await (0, db_1.default) `
          INSERT INTO talent_profiles (user_id, profile_data)
          VALUES (${userId}, ${db_1.default.json(formData)})
        `;
            }
            // 🆕 ZUSATZ: Score sofort neu berechnen, statt auf den nächsten
            // stündlichen Cron-Job zu warten. Löst das Problem, dass die Analytics
            // gefühlt "nie" reagieren, wenn man gerade ein Profil ausgefüllt hat.
            try {
                await (0, scoreCalculation_1.calculateMatchReadinessScore)(userId, userRole);
            }
            catch (scoreErr) {
                console.error("Konnte Match Readiness Score nicht sofort aktualisieren:", scoreErr);
            }
            return res.json({ message: "Talent-Profil erfolgreich gespeichert!" });
        }
        else if (userRole === "company") {
            const [existing] = await (0, db_1.default) `
        SELECT profile_data FROM company_profiles WHERE user_id = ${userId}
      `;
            if (existing) {
                const current = typeof existing.profile_data === "object" &&
                    !Array.isArray(existing.profile_data)
                    ? existing.profile_data
                    : {};
                const merged = mergeProfileData(current, formData);
                await (0, db_1.default) `
          UPDATE company_profiles
          SET profile_data = ${db_1.default.json(merged)}
          WHERE user_id = ${userId}
        `;
            }
            else {
                await (0, db_1.default) `
          INSERT INTO company_profiles (user_id, profile_data)
          VALUES (${userId}, ${db_1.default.json(formData)})
        `;
            }
            // 🆕 ZUSATZ: gleiche sofortige Neuberechnung wie beim Talent-Branch oben.
            try {
                await (0, scoreCalculation_1.calculateMatchReadinessScore)(userId, userRole);
            }
            catch (scoreErr) {
                console.error("Konnte Match Readiness Score nicht sofort aktualisieren:", scoreErr);
            }
            return res.json({ message: "Company-Profil erfolgreich gespeichert!" });
        }
        else {
            return res.status(403).json({
                message: "Ungültige Rolle. Nur 'talent' oder 'company' erlaubt.",
            });
        }
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ msg: "Serverfehler beim Speichern des Profils." });
    }
});
// =======================================================================================================================
// ENDE DER ERGÄNZUNG
// =======================================================================================================================
// ✅ GET /profile - Hole User-Profil-Daten
app.get("/profile", authMiddleware_1.requireAuth, async (req, res) => {
    try {
        const userId = req.auth.userId;
        const userRole = req.auth.role;
        // Hole User Basis-Daten
        const [user] = await (0, db_1.default) `
      SELECT id, email, role FROM users WHERE id = ${userId}
    `;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Hole Profil-Daten basierend auf Role
        let profileData = null;
        if (userRole === "talent") {
            const [talentProfile] = await (0, db_1.default) `
        SELECT profile_data FROM talent_profiles WHERE user_id = ${userId}
      `;
            profileData = talentProfile?.profile_data || null;
        }
        else if (userRole === "company") {
            const [companyProfile] = await (0, db_1.default) `
        SELECT profile_data FROM company_profiles WHERE user_id = ${userId}
      `;
            profileData = companyProfile?.profile_data || null;
        }
        return res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            profile: profileData,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
});
app.use("/analytics", analytics_1.default);
app.use("/discover", discover_1.default);
app.use("/conversations", conversations_1.default); // Ich registriere conversations AUSSERHALB von app.listen() — drinnen würde die Route nie greifen
app.use("/featured-opportunities", featuredOpportunities_1.default);
app.listen(3000, () => {
    console.log("backend started on port 3000");
    (0, cronJobs_1.startCronJobs)();
});
