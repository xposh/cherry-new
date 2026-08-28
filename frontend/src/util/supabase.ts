// ERKLÄRUNG: "createClient" ist die feste Methode aus dem installierten Supabase-SDK,
// die die Verbindung zur Cloud-Infrastruktur herstellt.
// Ohne diesen können wir keine authentifizierten Anfragen an den Storage-Bucket senden.
import { createClient } from "@supabase/supabase-js";

// Bestimmung der Umgebungsvariablen. Da wir mit Vite arbeiten, ist das Präfix "VITE_" zwingend vorgeschrieben,
// damit die Variablen zur Laufzeit im Browser verfügbar sind.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validierung: Wenn die Keys in der .env-Datei fehlen, bricht die App sofort kontrolliert ab,
// anstatt im laufenden Betrieb unkontrollierte Laufzeitfehler zu produzieren.
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Kritischer Konfigurationsfehler: VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY müssen in der .env-Datei des Frontends definiert sein.",
  );
}

// Initialisierung des globalen Supabase-Clients.
// "export const" macht diese Instanz in der gesamten App (z.B. in den Setup-Komponenten) wiederverwendbar.
// Also: Wir initialisieren die Verbindung genau einmal zentral. Jede Komponente, die später
// Dateien hochladen will, importiert einfach dieses fertige Objekt, anstatt jedes Mal eine neue Verbindung aufzubauen.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
