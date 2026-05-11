import "dotenv/config";
import express from "express";
import cors from "cors";
import sql from "./util/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./authMiddleware";

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
  try {
    const { email, password, role } = req.body;
    const users = await sql`
  SELECT * FROM users WHERE email=${email};
  `;
    // => existiert User schon?
    // wenn ja => Fehler
    if (users.length > 0) {
      return res.status(400).json({ message: "User already registered" });
    }
    // Wenn nein => Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 12);

    // Daten in Usertabelle schreiben
    const [newUser] = await sql`INSERT INTO users (email, hashed_password, role)
  VALUES (${email}, ${hashedPassword}, ${role}) RETURNING *;
  `;

    // VORLÄUFIG:
    // Token für User erzeugen
    const accessToken = jwt.sign(
      { sub: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );
    // Token sowie Userdatensatz zurückschicken

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
    // Token sowie Userdatensatz zurückschicken

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

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    return res.json({ userId: req.auth!.userId });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "server error" });
  }
});

app.listen(3000, () => {
  console.log("backend started on port 3000");
});
