# Save Profile

- `CREATE TABLE` statement in `/backend/sql/create-db.sql` für talent_profiles Tabelle erstellen
- (`DROP TABLE ...`) zu Beginn der Datei nicht vergessen!
- `/backend/sql/create-db.sql` script in Postgres (z.B. in pgadmin) ausführen, damit die Tabelle wirklich entsteht.
- Prüfen, ob die Tabelle wirklich entstanden ist! Gff. rechte Maustaste und Refresh (Tabellen daten nicht automatisch up)

- Test User-Id erzeugen:
  - Mit Postman einmal `POST /signup` schicken, um einen User anzulegen
  - Body `{"email":"xyz", "password":"123456", "role":"talent"}`
  - In der Datenbank die User-Id nachschauen und kopieren

- API Route (z.B. `POST /profile` = `app.post("/profile", ()=>{...})`) in `/backend/src/index.ts` erstellen.
- Mit Postman Daten an diese Route schicken, z.B.:

```json
{
  "user_id": "[Deine Test-User-Id]",
  "name": "Posh",
  "bio": "lorem ipsum"
}
```

- In der Route Daten entgegennehmen und in der Datenbank speichern
