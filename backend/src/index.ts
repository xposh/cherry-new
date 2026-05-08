import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Hallo Welt" });
});

app.post("/signup", (req, res) => {
  const { email, password, role } = req.body;
  // => existiert User schon?
  // wenn ja => Fehler
  // Wenn nein => Passwort hashen
  // Daten in Usertabelle schreiben
  // VORLÄUFIG:
  // Token für User erzeugen
  // Token sowie Userdatensatz zurückschicken

  return res.json({ message: "Not implemented" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  return res.json({ message: "Not implemented" });
});

app.listen(3000, () => {
  console.log("backend started on port 3000");
});
