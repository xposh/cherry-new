# Handpicked Activation Plan (Live, nicht mehr Mock)

## Zielbild

- Handpicked ist ein kuratierter Feed mit Match-Logik (nicht nur Discover-Liste).
- Talent sieht Companies, Company sieht Talente.
- Nur Vorschlaege mit Match Score > 85% kommen in Handpicked.
- Discover bleibt breite Exploration, Handpicked bleibt Premium-Ranking.

## Aktueller Stand (Ist)

- Talent Home zieht Handpicked derzeit aus `/analytics/handpicked-opportunities`.
- Company Home nutzt jetzt ebenfalls den Live-Endpoint.
- Route liefert maximal 3 Vorschlaege fuer beide Rollen (Go-Live Modus).

## Produkt-Logik (MVP jetzt)

- Score setzt sich aus regelbasierten Signalen zusammen:
  - Profil-Fit (Skills/Role Ueberschneidung)
  - Location-Fit
  - Readiness/Freshness (aus `user_analytics`)
  - Aktivitaet/Response-Zuverlaessigkeit
- Aktuell: fuer Go-Live wird bei zu wenig Daten ein Fallback genutzt, damit nie leer bleibt.
- Zielzustand: nur Kandidaten mit `score >= 85` (strict mode).
- Sortierung: `score DESC`, dann `freshness DESC`.

## Future Adjustments fuer echtes 85% Handpicked

- [ ] Strict 85 Mode als Feature Flag (`HANDPICKED_STRICT_85=true`) einfuehren.
- [ ] Fallback komplett entfernen, sobald genug Daten vorhanden sind.
- [ ] Mindest-Profilkriterien definieren (z. B. Skills + Location + Rolle), bevor Kandidaten gerankt werden.
- [ ] Score-Breakdown persistieren (`score_breakdown`) fuer Transparenz/Debugging.
- [ ] Quality Gate: Wenn weniger als 3 Kandidaten >=85 vorhanden sind, kontrollierten Empty-State zeigen statt niedrigere Scores.
- [ ] Monitoring-Alarm, wenn Anteil `>=85` dauerhaft unter Zielwert liegt.
- [ ] Explainability-Gruende je Karte im UI anzeigen (warum dieser Match >85 ist).

## Datenmodell / DB Tasks

- Neue Tabelle: `handpicked_recommendations`
  - `id`
  - `viewer_user_id` (wer sieht die Empfehlung)
  - `candidate_user_id` (wer wird empfohlen)
  - `viewer_role` / `candidate_role`
  - `score` (0-100)
  - `score_breakdown` (JSONB mit Teilwerten)
  - `reason_tags` (TEXT[] fuer UI: z. B. `skill_fit`, `nearby`, `high_readiness`)
  - `generated_at`, `expires_at`, `is_active`
  - Unique Index: `(viewer_user_id, candidate_user_id)`
  - Indexe: `(viewer_user_id, score DESC)`, `(expires_at)`, `(is_active)`
- Optional spaeter: `embedding vector` Felder fuer AI Nuancen (Phase 2).

## Backend Tasks

- Neue Service-Datei: `backend/src/services/handpickedScoring.ts`
  - `computeHandpickedScore(viewer, candidate)`
  - `buildReasonTags(...)`
- Neue Route (oder Umbau bestehender):
  - `GET /analytics/handpicked-feed`
  - Liefert role-aware Ergebnisse fuer Talent und Company
  - Filter: Gegenrolle only, `score >= 85`, `is_active = true`, `expires_at > now()`
- Bestehende Route `GET /analytics/handpicked-opportunities` deprecaten oder intern auf neuen Feed umleiten.
- Refresh-Mechanik:
  - Cron Job (z. B. alle 15-30 min) fuer Batch-Recompute
  - On-demand Recompute bei Profil-Update / Opportunity-Update

## Frontend Tasks

- Talent Home:
  - Weg von statischer Handpicked-Opportunity-Logik auf neuen Feed-Response
  - Kartenmodell auf einheitliches DTO umstellen
- Company Home:
  - `mockTalents` komplett entfernen
  - Live-Feed aus gleichem Endpoint nutzen
- Gemeinsame UI Regeln:
  - Empty State: "Noch keine kuratierten Matches >85%"
  - Optional Score-Badge nur intern debugbar (Feature-Flag)

## API Contract (Vorschlag)

- `GET /analytics/handpicked-feed`
- Response:
  - `items[]`
    - `candidateUserId`
    - `candidateRole`
    - `displayName`
    - `headline`
    - `location`
    - `imageUrl`
    - `videoUrl`
    - `score`
    - `reasonTags[]`
    - `generatedAt`

## Acceptance Criteria (Definition of Done)

- Talent bekommt nur Companies im Handpicked Feed.
- Company bekommt nur Talente im Handpicked Feed.
- Nur Eintraege mit Score >= 85 werden ausgeliefert.
- Feed ist fuer beide Rollen live (keine Mockdaten mehr).
- Response-Zeit fuer Feed < 400ms im Warm Cache.
- Fallback bei fehlenden Daten: stabile Empty State, kein Frontend-Crash.

## Tests

- Unit:
  - Scoring-Funktion mit festen Fixtures
  - Threshold-Filter (`84.9` raus, `85.0` rein)
- Integration:
  - Route liefert role-correct Ergebnisse
  - Auth + Ownership korrekt
- E2E:
  - Talent Login -> Handpicked zeigt Companies
  - Company Login -> Handpicked zeigt Talente

## Phase 2 (AI / Vektor-Vergleich)

- Embeddings fuer Bio/Skills/Job-Beschreibung einfuehren.
- Vektor-Similarity als zusaetzlichen Score-Kanal nutzen.
- Finale Score-Formel z. B.:
  - `0.45 * semantic_fit`
  - `0.25 * skills_fit`
  - `0.15 * location_fit`
  - `0.15 * readiness_fit`
- Weiterhin harte Business-Regel: nur `score >= 85` in Handpicked.

## Reihenfolge der Umsetzung (empfohlen)

1. DB-Migration + Recommendation-Tabelle
2. Scoring-Service (regelbasiert, ohne AI)
3. Neue Feed-Route live fuer beide Rollen
4. Frontend Company/Talent auf neuen Feed umstellen
5. Tests + Telemetrie + Monitoring
6. Danach AI/Vektor als Iteration

## Nächster konkreter Schritt

- Ich starte mit Schritt 1 und 2: Migration + `handpickedScoring` Service, danach route ich beide Homepages auf `GET /analytics/handpicked-feed`.

## Premium Gating (vor Payment-Integration)

- [ ] Membership-Status zentral im Backend/User-Model einfuehren (`is_premium`, `membership_tier`).
- [ ] Activity-Identity nur fuer Premium freischalten:
  - Premium: Klick auf Activity oeffnet Zielprofil.
  - Free: Klick fuehrt auf Upgrade-Seite.
- [ ] Premium Guard Utility bauen (re-usable fuer weitere locked Features).
- [ ] Payment & Membership Bereich in Account an echtes Membership-Flag anbinden (ohne Zahlungsabwicklung vorerst).
- [ ] Feature-Flag-Liste pflegen: welche Seiten/Insights Premium-only sind.

## Media Framing Fix (Desktop) - Upload Art Direction

### Problem

- Dieselben Bilder/Videos werden in mehreren Seiten mit unterschiedlichen Aspect Ratios verwendet.
- `object-cover` schneidet auf Desktop oft den falschen Bereich ab (Home, Discover Cards, Profil-Ansichten).
- Mobile/Tablet wirkt okay, weil die Ratio dort naeher an den Originalformaten liegt.

### Best Implementation Path

#### Phase 1 - Focal Point (MVP, hoher Impact)

- [ ] Upload-UI um Focal-Point Picker erweitern (Bild + Video).
- [ ] Focal-Koordinaten speichern (`focalX`, `focalY`, Werte 0..1).
- [ ] Rendering auf `object-fit: cover` + dynamisches `object-position` umstellen.
- [ ] In Home + Discover + Profil-Karten den gespeicherten Fokus konsequent anwenden.

#### Phase 2 - Desktop Preview Overlay

- [ ] Im Upload-Flow eine Desktop-Frame-Vorschau anzeigen.
- [ ] User kann vor dem Speichern sehen, welcher Bereich auf Desktop sichtbar ist.
- [ ] Optional mehrere Ziel-Frames in der Vorschau (z. B. Home Card, Discover Card).

#### Phase 3 - Optional Per-Surface Overrides

- [ ] Falls Phase 1/2 nicht reicht: separate Fokuswerte pro Surface speichern.
- [ ] Start nur fuer sensible Flaechen: Home + Discover.
- [ ] Profil-Ansichten spaeter nachziehen, wenn noetig.

### Professioneller Standard (Referenz)

- Focal Point + Cover Rendering ist der gaengigste Industry-Ansatz.
- CMS/Media-Tools kombinieren oft Focal Point + Preview Frame.
- Per-Surface Crops nur dort, wo Art Direction besonders wichtig ist.

### Datenmodell (Vorschlag)

- [ ] `media_assets` oder bestehendes JSON um Felder erweitern:
  - `focalX`, `focalY`
  - optional spaeter: `focal_home_x/y`, `focal_discover_x/y`
  - fuer Video optional `posterFrameTime` + `posterUrl`

### Acceptance Criteria

- Desktop zeigt bei Bild/Video den vom User bestimmten Fokusbereich.
- Home, Discover und Profil-Karten wirken konsistent framed.
- Kein unkontrolliertes Abschneiden wichtiger Gesichter/Objekte auf Desktop.
