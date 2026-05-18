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
// ERGÄNZUNG: POST /profile MIT EINGEBETTETEN ZEILEN-ERKLÄRUNGEN
// =======================================================================================================================

// app.post: Ein fixer Express-Befehl. Er registriert eine Route für HTTP-POST-Anfragen.
// "/profile": Der Pfad der Route. Ein frei gewählter String, der hier durch das Skript fix vorgegeben ist.
// async: Ein fixer JavaScript-Modifikator, der die Funktion asynchron macht, damit die Datenbankabfrage darin mit await blockierungsfrei warten kann.
// req, res: Frei gewählte Namen für die Parameter Request (eingehende Daten) und Response (ausgehende Antwort).
app.post("/profile", async (req, res) => {
  // try: Fixer JavaScript-Block zur Fehlerbehandlung. Verhindert, dass der Server abstürzt, falls beim Datenbankzugriff etwas schiefgeht.
  try {
    // const: Fixes Schlüsselwort für Konstanten.
    // { user_id, name, bio }: Destructuring-Syntax. Die Namen sind fix, da sie exakt mit den Schlüsseln übereinstimmen müssen, die im Postman-Beispiel definiert sind ("user_id", "name", "bio").
    // req.body: Fixes Express-Objekt, das die per JSON gesendeten Daten des Clients enthält.
    const { user_id, name, bio } = req.body;

    // await: Ein fixer Befehl, der die Ausführung pausiert, bis die Datenbank die Antwort liefert.
    // sql: Die frei gewählte Variable deiner Datenbankinstanz aus der Datei db.ts.
    // INSERT INTO talent_profiles (user_id, name, bio) VALUES (${user_id}, ${name}, ${bio});: Der SQL-Befehl. Die SQL-Schlüsselwörter sind fix. Die Tabellennamen und Variablenstrukturen sind an deine Datenbankstruktur gebunden.
    await sql`
      INSERT INTO talent_profiles (user_id, name, bio) 
      VALUES (${user_id}, ${name}, ${bio});
    `;

    // return: Fixer JavaScript-Befehl zum Beenden der Funktion.
    // res.json: Eine fixe Express-Methode, die die Antwort als JSON formatiert zurückschickt. Der Text "Profile saved successfully" ist ein frei gewählter Bestätigungstext.
    return res.json({ message: "Profile saved successfully" });

    // catch: Fixer Catch-Block. err ist der frei gewählte Name für das abgefangene Fehlerobjekt.
  } catch (err) {
    // console.log(err): Ein fixer Konsolenbefehl, um den Fehler im VS-Code Terminal sichtbar zu machen.
    console.log(err);

    // return res.status(500).json({ msg: "server error" }): Fixe Express-Fehlerantwort mit dem HTTP-Statuscode 500 (Internal Server Error), exakt im Design der anderen Routen
    return res.status(500).json({ msg: "server error" });
  }
});

// =======================================================================================================================
// ENDE DER ERGÄNZUNG
// =======================================================================================================================

app.listen(3000, () => {
  console.log("backend started on port 3000");
});
