# 21.05.26

## Fix: POST /profile soll userId aus token nutzen und NICHT aus body

- POST /profile kann momentan von jedem aufgerufen werden, es kann ein Profil mit einer beliebigen userId gespeichert werden.
- Verwende die Middleware `requireAuth`, damit die Route nur von eingeloggten Usern aufgerufen werden kann
- Verwende dann statt `user_id` aus dem Body, die userId, die `requireAuth` in den Request schreibt!
- Das Frontend verwendet momentan `fetch` (in `TalentProfileSetup3.tsx`) um den Request zu schicken, hierbei wird aber kein Token mitgeschickt! Verwende stattdessen `authFetch` aus dem AuthContext. Es kann genauso wie fetch verwendet werden, schickt aber im Hintergrund automatisch das Token mit.
- Wenn das funktioniert, solltest Du `user_id` auch im Frontend komplett aus dem Body rausnehmen.

## Registration Flow für Companies

- company_profiles Tabelle erstellen (Vorher in create-db.sql das entsprechende CREATE TABLE statement erstellen und dann das create-db.sql script ausführen (z.B. in pgadmin) um zu testen, ob die Tabelle korrekt erstellt wurde!)

- POST /profile anpassen: Wenn ich als `company` angemeldet bin, muss das INSERT statement in `company_profiles` erfolgen, ansonsten wie bisher in `talent_profiles`

- Die Dateien `CompanyProfileSetup[1-3].tsx` müssen analog zu den Talent-Profilen so angepasst werden, dass "Zwischenstände" im LocalStorage gespeichert werden und Bilder/Medien bei Supabase.

- Dann muss auf `CompanyProfileSetup3.tsx` das eigentliche Speichern in der Datenbank erfolgen, analog zu dem, was wir in `TalentProfileSetup3.tsx` gemacht haben. (Achtung! Vorher den Fix oben durchführen!)
