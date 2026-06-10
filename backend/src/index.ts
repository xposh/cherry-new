import "dotenv/config";
import express from "express";
import cors from "cors";
import sql from "./util/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { requireAuth } from "./authMiddleware";
import analyticsRoutes from "./routes/analytics";
import { startCronJobs } from "./services/cronJobs";
import discoverRoutes from "./routes/discover";

if (!process.env.JWT_SECRET) {
  console.error("Denk dran! JWT_SECRET must be configured in .env");
  process.exit();
}
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Hallo Welt" });
});

app.post("/signup", async (req, res) => {
  console.log("/signup");
  try {
    const { email, password, role } = req.body;
    const users = await sql`
  SELECT * FROM users WHERE email=${email};
  `;
    if (users.length > 0) {
      return res.status(400).json({ message: "User already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await sql`INSERT INTO users (email, hashed_password, role)
  VALUES (${email}, ${hashedPassword}, ${role}) RETURNING *;
  `;

    const accessToken = jwt.sign(
      { sub: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      {
        expiresIn: "7d", // was set to 2h for testing, but 7d is more user-friendly for development
      },
    );

    return res.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "server error" });
  }
});

app.get("/is-profile-complete", requireAuth, async (req, res) => {
  const { role } = req.auth!;
  try {
    const result =
      role === "talent"
        ? await sql`
    SELECT * FROM talent_profiles
    WHERE user_id = ${req.auth?.userId!}
  `
        : await sql`
    SELECT * FROM company_profiles
    WHERE user_id = ${req.auth?.userId!}
  `;
    const userProfile = result[0];
    return res.json({
      id: req.auth?.userId!,
      hasProfile: !!userProfile,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const [user] = await sql`
  SELECT * FROM users WHERE email=${email};
  `;
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const doesPasswordMatch = await bcrypt.compare(
      password,
      user.hashed_password,
    );
    if (!doesPasswordMatch) {
      return res.status(400).json({ message: "Password does not match" });
    }
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "7d", // was set to 2h for testing, but 7d is more user-friendly for development
      },
    );

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "server error" });
  }
});

app.post("/cherry-picks", requireAuth, async (req, res) => {
  const { pickId } = req.body;
  try {
    await sql`INSERT INTO cherry_picks (user_id, pick_id) VALUES(${req.auth!.userId!}, ${pickId})`;
    return res.json({ msg: "Success" });
  } catch (err) {
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

app.post("/profile", requireAuth, async (req, res) => {
  try {
    // userId kommt jetzt sicher aus dem Token (von requireAuth Middleware)
    const userId = req.auth!.userId!;
    const userRole = req.auth!.role!;

    // Alle Formular-Daten kommen aus dem Body (OHNE user_id!)
    const formData = req.body;

    console.log(`Speichere Profil für User ${userId} mit Role ${userRole}`);

    // Role-Check: Speichere in der richtigen Tabelle
    if (userRole === "talent") {
      await sql`
        INSERT INTO talent_profiles (user_id, profile_data)
        VALUES (${userId}, ${JSON.stringify(formData)})
        ON CONFLICT (user_id)
        DO UPDATE SET profile_data = talent_profiles.profile_data || EXCLUDED.profile_data;
      `;
      return res.json({ message: "Talent-Profil erfolgreich gespeichert!" });
    } else if (userRole === "company") {
      await sql`
        INSERT INTO company_profiles (user_id, profile_data)
        VALUES (${userId}, ${JSON.stringify(formData)})
        ON CONFLICT (user_id)
        DO UPDATE SET profile_data = company_profiles.profile_data || EXCLUDED.profile_data;
      `;
      return res.json({ message: "Company-Profil erfolgreich gespeichert!" });
    } else {
      return res.status(403).json({
        message: "Ungültige Rolle. Nur 'talent' oder 'company' erlaubt.",
      });
    }
  } catch (err) {
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
app.get("/profile", requireAuth, async (req, res) => {
  try {
    const userId = req.auth!.userId!;
    const userRole = req.auth!.role!;

    // Hole User Basis-Daten
    const [user] = await sql`
      SELECT id, email, role FROM users WHERE id = ${userId}
    `;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hole Profil-Daten basierend auf Role
    let profileData = null;
    if (userRole === "talent") {
      const [talentProfile] = await sql`
        SELECT profile_data FROM talent_profiles WHERE user_id = ${userId}
      `;
      profileData = talentProfile?.profile_data || null;
    } else if (userRole === "company") {
      const [companyProfile] = await sql`
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

app.use("/analytics", analyticsRoutes);

app.use("/discover", discoverRoutes);

app.listen(3000, () => {
  console.log("backend started on port 3000");
  startCronJobs();
});
