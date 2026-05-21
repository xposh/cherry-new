import "dotenv/config";
import express from "express";
import cors from "cors";
import sql from "./util/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { requireAuth } from "./authMiddleware";

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
        expiresIn: "2h",
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
        expiresIn: "2h",
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

app.get("/profile", requireAuth, async (req, res) => {
  try {
    console.log("logged in user:");
    console.log(req.auth?.userId);
    console.log(req.auth?.email);
    console.log(req.auth?.role);

    return res.json({ userId: req.auth!.userId });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "server error" });
  }
});

// =======================================================================================================================
// 2. Die sauberste Lösung: Das flexible JSONB-Konzept

// Wenn du jede einzelne UI-Komponente (wie Awards, Recognition, Work Model, etc.) als eigene Spalte in pgAdmin anlegen willst, musst du deine SQL-Tabelle ständig ändern. Das ist hochkompliziert, fehleranfällig und treibt jeden Anfänger in den Wahnsinn.
// Der "Industry Standard" für flexible Formulare:
// Wir speichern die Kerndaten (wie die ID) in einer festen Spalte. Den gesamten Rest des Formulars (egal wie viele Schritte oder Felder du noch hinzufügst oder umbenennst) speichern wir in einer einzigen, extrem mächtigen Spalte vom Typ JSONB. Das ist eine native PostgreSQL-Spalte, die komplette JavaScript-Objekte eins zu eins schluckt.

// Dein Vorteil:

// Du musst in pgAdmin nie wieder eine Spalte anfügen, wenn du im Frontend ein Feld änderst.
//Wenn du später entscheidest, name in first_name und last_name aufzuteilen, machst du das nur im Frontend. Das Backend und pgAdmin bleiben davon komplett unberührt! Das ist maximale architektonische Freiheit.
// =======================================================================================================================

// app.post: Registriert die Route für das Absenden des Profil-Formulars.
// async (req, res): Erlaubt asynchrone Datenbankzugriffe ohne den Hauptthread zu blockieren.
app.post("/profile", async (req, res) => {
  try {
    // Wir extrahieren NUR die user_id. Der gesamte Rest des Formulars (egal welche Felder)
    // wandert automatisch als kompaktes Objekt in die Variable "formData".
    const { user_id, ...formData } = req.body;

    if (!user_id) {
      return res
        .status(400)
        .json({ message: "Fehler: user_id wird zwingend benötigt." });
    }

    // Wir senden die Daten an die Tabelle talent_profiles.
    // JSON.stringify(formData) packt alle Felder aus deinem Video automatisch in ein JSON-Paket.
    // ON CONFLICT (user_id) DO UPDATE erlaubt unbegrenztes Überschreiben und Testen.
    await sql`
      INSERT INTO talent_profiles (user_id, profile_data) 
      VALUES (${user_id}, ${JSON.stringify(formData)})
      ON CONFLICT (user_id) 
      DO UPDATE SET profile_data = talent_profiles.profile_data || EXCLUDED.profile_data;
    `;

    return res.json({ message: "Profil-Setup erfolgreich gespeichert!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: "Serverfehler beim Speichern des Profils." });
  }
});

// =======================================================================================================================
// ENDE DER ERGÄNZUNG
// =======================================================================================================================

app.listen(3000, () => {
  console.log("backend started on port 3000");
});
