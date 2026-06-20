import { Router, Request, Response } from "express";
import sql from "../util/db";
import { requireAuth } from "../authMiddleware";
import {
  trackProfileView,
  addActivityToFeed,
  trackDailyEngagement,
} from "../services/scoreCalculation";

const router = Router();

/**
 * Eliminiert mehrfache String-Serialisierung von profile_data. Akzeptiert
 * Text oder Objekte und bricht nach maximal 5 Iterationen ab.
 */
function safelyParseJSON(input: any): any {
  if (!input) return {};
  if (typeof input === "object" && input !== null) return input;

  let parsed = input;
  for (let i = 0; i < 5; i++) {
    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch (err) {
        break;
      }
    } else {
      break;
    }
  }
  return typeof parsed === "object" && parsed !== null ? parsed : {};
}

/**
 * Liefert einen menschenlesbaren Anzeigenamen für Activity-Feed-Texte.
 * Fällt auf die E-Mail zurück, falls der Name im profile_data JSON fehlt.
 */
async function getDisplayName(userId: string): Promise<string> {
  const [user] = await sql`
    SELECT email, role FROM users WHERE id = ${userId}::uuid
  `;
  if (!user) return "Jemand";

  if (user.role === "talent") {
    const [profile] = await sql`
      SELECT profile_data FROM talent_profiles WHERE user_id = ${userId}::uuid
    `;
    const data = safelyParseJSON(profile?.profile_data);
    return data.name || user.email;
  } else {
    const [profile] = await sql`
      SELECT profile_data FROM company_profiles WHERE user_id = ${userId}::uuid
    `;
    const data = safelyParseJSON(profile?.profile_data);
    return data.companyName || user.email;
  }
}

// ─── GET /discover — Haupt-Feed ──────────────────────────────────────────────
router.get("/", requireAuth, async (req: Request, res: Response) => {
  const fromId = req.auth!.userId!;
  const role = req.auth!.role!;
  const targetRole = role === "talent" ? "company" : "talent";

  const search = (req.query.search as string | undefined)?.trim() || "";
  const city = (req.query.city as string | undefined)?.trim() || "";

  try {
    let rawProfiles;

    if (targetRole === "talent") {
      rawProfiles = await sql`
        SELECT
          u.id,
          u.email,
          tp.profile_data AS data,
          COALESCE((
            SELECT CASE WHEN action = 'like' THEN true ELSE false END
            FROM user_interactions
            WHERE from_user_id = u.id AND to_user_id = ${fromId}::uuid
            LIMIT 1
          ), false) AS is_match_preview
        FROM users u
        JOIN talent_profiles tp ON u.id = tp.user_id
        WHERE u.role = 'talent'
          AND u.id != ${fromId}::uuid
          AND jsonb_typeof(tp.profile_data) = 'object'
        ORDER BY u.created_at DESC
      `;
    } else {
      rawProfiles = await sql`
        SELECT
          u.id,
          u.email,
          cp.profile_data AS data,
          COALESCE((
            SELECT CASE WHEN action = 'like' THEN true ELSE false END
            FROM user_interactions
            WHERE from_user_id = u.id AND to_user_id = ${fromId}::uuid
            LIMIT 1
          ), false) AS is_match_preview
        FROM users u
        JOIN company_profiles cp ON u.id = cp.user_id
        WHERE u.role = 'company'
          AND u.id != ${fromId}::uuid
          AND jsonb_typeof(cp.profile_data) = 'object'
        ORDER BY u.created_at DESC
      `;
    }

    const cleanedProfiles = rawProfiles
      .map((row: any) => {
        const d = safelyParseJSON(row.data);

        if (targetRole === "talent") {
          const rawImg = String(
            d.profileImage || d.imageUrl || d.main_image_url || "",
          );
          const cleanImg = rawImg.replace(
            /\/Photographer\//g,
            "/photographer/",
          );

          const fallbackName = String(
            d.name ||
              d.fullName ||
              d.full_name ||
              row.email ||
              "Registrierter User",
          );

          if (
            search &&
            !fallbackName.toLowerCase().includes(search.toLowerCase())
          ) {
            return null;
          }
          if (
            city &&
            !String(d.location || "")
              .toLowerCase()
              .includes(city.toLowerCase())
          ) {
            return null;
          }

          return {
            id: row.id,
            name: fallbackName,
            full_name: fallbackName,
            current_role: String(d.position || "Profil unvollständig"),
            city: String(d.location || "Kein Ort hinterlegt"),
            location: String(d.location || "Kein Ort hinterlegt"),
            bio: String(
              d.about ||
                d.bio ||
                "Noch kein Lebenslauf oder Profil ausgefüllt.",
            ),
            skills: Array.isArray(d.skills) ? d.skills : [],
            main_image_url: cleanImg,
            profileImage: cleanImg,
            imageUrl: cleanImg,
            is_match_preview: Boolean(row.is_match_preview),
          };
        } else {
          const rawLogo = String(d.companyLogo || d.imageUrl || "");
          const fallbackCompany = String(
            d.companyName || d.name || row.email || "Registriertes Unternehmen",
          );

          if (
            search &&
            !fallbackCompany.toLowerCase().includes(search.toLowerCase())
          ) {
            return null;
          }
          if (
            city &&
            !String(d.location || "")
              .toLowerCase()
              .includes(city.toLowerCase())
          ) {
            return null;
          }

          return {
            id: row.id,
            name: fallbackCompany,
            companyName: fallbackCompany,
            full_name: fallbackCompany,
            current_role: String(d.industry || "Branche fehlt"),
            industry: String(d.industry || "Branche fehlt"),
            city: String(d.location || "Kein Ort"),
            location: String(d.location || "Kein Ort"),
            claim: String(d.claim || "Kein Slogan vorhanden"),
            main_image_url: rawLogo,
            profileImage: rawLogo,
            imageUrl: rawLogo,
            is_match_preview: Boolean(row.is_match_preview),
          };
        }
      })
      .filter(Boolean);

    return res.json({ profiles: cleanedProfiles });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ msg: "Server Fehler", detail: msg });
  }
});

// ─── GET /discover/matches — Liste aller bestätigten Matches für Cherry Picks ─
// ✅ NEU: ersetzt die bisherige Frontend-Lösung, die Matches nur aus
// localStorage UND statischen Mock-Dateien (mockTalents/mockCompanies)
// zusammensetzte. Liefert die echten, persistierten Matches inkl. der
// tatsächlichen Profildaten des jeweiligen Match-Partners.
router.get("/matches", requireAuth, async (req: Request, res: Response) => {
  const userId = req.auth!.userId!;
  const role = req.auth!.role!;
  const partnerType = role === "talent" ? "company" : "talent";

  try {
    const rows =
      role === "talent"
        ? await sql`
            SELECT
              m.id AS match_id,
              m.company_id AS partner_id,
              m.created_at AS matched_at,
              cp.profile_data AS data,
              u.email
            FROM matches m
            JOIN company_profiles cp ON cp.user_id = m.company_id
            JOIN users u ON u.id = m.company_id
            WHERE m.talent_id = ${userId}::uuid
            ORDER BY m.created_at DESC
          `
        : await sql`
            SELECT
              m.id AS match_id,
              m.talent_id AS partner_id,
              m.created_at AS matched_at,
              tp.profile_data AS data,
              u.email
            FROM matches m
            JOIN talent_profiles tp ON tp.user_id = m.talent_id
            JOIN users u ON u.id = m.talent_id
            WHERE m.company_id = ${userId}::uuid
            ORDER BY m.created_at DESC
          `;

    const matches = rows.map((row: any) => {
      const d = safelyParseJSON(row.data);
      const name =
        partnerType === "talent"
          ? String(d.name || row.email)
          : String(d.companyName || row.email);
      const image =
        partnerType === "talent"
          ? String(d.profileImage || "")
          : String(d.companyLogo || "");

      return {
        matchId: String(row.match_id),
        partnerId: row.partner_id,
        partnerType,
        name,
        image,
        location: String(d.location || ""),
        matchedAt: row.matched_at,
      };
    });

    return res.json({ matches });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ msg: "Server Fehler", detail: msg });
  }
});

// ─── POST /discover/interact — Like oder Skip ─────────────────────────────────
router.post("/interact", requireAuth, async (req: Request, res: Response) => {
  const fromId = req.auth!.userId!;
  const role = req.auth!.role!; // ✅ NEU benötigt, um talent_id/company_id korrekt zuzuordnen
  const { targetId, action } = req.body as {
    targetId: string;
    action: "like" | "skip";
  };

  if (!targetId || !action) {
    return res.status(400).json({ msg: "targetId und action erforderlich" });
  }

  // ✅ BUG-FIX: Die matches-Tabelle hat KEINE user1_id/user2_id Spalten,
  // sondern talent_id und company_id (per information_schema.columns
  // bestätigt). Jeder INSERT/SELECT gegen user1_id/user2_id ist bisher mit
  // "column does not exist" fehlgeschlagen — deshalb wurde NIE ein Match
  // angelegt, der Match-Screen erschien nie, und /analytics/new-matches
  // sowie /analytics/response-reliability standen dauerhaft auf 0.
  const talentId = role === "talent" ? fromId : targetId;
  const companyId = role === "talent" ? targetId : fromId;

  try {
    await sql`
      INSERT INTO user_interactions (from_user_id, to_user_id, action)
      VALUES (${fromId}::uuid, ${targetId}::uuid, ${action})
      ON CONFLICT (from_user_id, to_user_id)
      DO UPDATE SET action = ${action}, created_at = NOW()
    `;

    await trackDailyEngagement(fromId).catch((err) =>
      console.error("trackDailyEngagement (interact) fehlgeschlagen:", err),
    );

    if (action !== "like") {
      return res.json({ status: "skipped" });
    }

    getDisplayName(fromId)
      .then((fromName) =>
        addActivityToFeed(
          targetId,
          "like",
          `${fromName} liked your profile`,
          fromId,
          fromName,
        ),
      )
      .catch((err) =>
        console.error("addActivityToFeed (like) fehlgeschlagen:", err),
      );

    const [mutual] = await sql`
      SELECT id FROM user_interactions
      WHERE from_user_id = ${targetId}::uuid
        AND to_user_id   = ${fromId}::uuid
        AND action = 'like'
    `;

    if (!mutual) {
      return res.json({ status: "liked" });
    }

    // ✅ BUG-FIX: talent_id/company_id sind fix zugeordnet (nicht
    // symmetrisch), daher reicht jetzt eine einzige Bedingung statt der
    // vorherigen OR-Abfrage über user1_id/user2_id in beide Richtungen.
    const [existing] = await sql`
      SELECT id FROM matches
      WHERE talent_id = ${talentId}::uuid
        AND company_id = ${companyId}::uuid
    `;

    if (existing) {
      return res.json({ status: "match", matchId: String(existing.id) });
    }

    // ✅ BUG-FIX: status wird jetzt explizit gesetzt. Vorher blieb die Spalte
    // NULL, wodurch /analytics/new-matches (Filter status='pending') und
    // /analytics/response-reliability (Filter status='accepted') niemals
    // einen Treffer finden konnten.
    const [newMatch] = await sql`
      INSERT INTO matches (talent_id, company_id, status)
      VALUES (${talentId}::uuid, ${companyId}::uuid, 'pending')
      RETURNING id
    `;

    Promise.all([getDisplayName(fromId), getDisplayName(targetId)])
      .then(([fromName, targetName]) =>
        Promise.all([
          addActivityToFeed(
            fromId,
            "match",
            `You matched with ${targetName}!`,
            targetId,
            targetName,
          ),
          addActivityToFeed(
            targetId,
            "match",
            `You matched with ${fromName}!`,
            fromId,
            fromName,
          ),
          trackDailyEngagement(targetId),
        ]),
      )
      .catch((err) =>
        console.error("Match-Activity-Feed fehlgeschlagen:", err),
      );

    return res.json({ status: "match", matchId: String(newMatch.id) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ msg: "Server Fehler", detail: msg });
  }
});

// ─── GET /discover/:id — Einzelnes Profil laden ───────────────────────────────
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) {
    return res.status(400).json({ msg: "ID fehlt" });
  }
  const viewerId = req.auth!.userId!;

  try {
    const [talentRow] = await sql`
      SELECT tp.profile_data, u.email
      FROM talent_profiles tp
      JOIN users u ON u.id = tp.user_id
      WHERE tp.user_id = ${id}::uuid AND u.role = 'talent'
    `;

    if (talentRow) {
      const cleanData = safelyParseJSON(talentRow.profile_data);
      if (!cleanData.name) cleanData.name = talentRow.email;

      if (viewerId !== id) {
        trackProfileView(id, viewerId).catch((err) =>
          console.error("trackProfileView (talent) fehlgeschlagen:", err),
        );

        // Ich markiere hier zusätzlich meinen eigenen Tag als aktiv — bisher wurde
        // nur bei Like/Skip Engagement getrackt, wodurch reines Browsen ohne
        // Interaktion nie in der Heatmap auftauchte.
        trackDailyEngagement(viewerId).catch((err) =>
          console.error("trackDailyEngagement (browsing) fehlgeschlagen:", err),
        );
      }

      return res.json({ profile: cleanData, type: "talent" });
    }

    const [companyRow] = await sql`
      SELECT cp.profile_data, u.email
      FROM company_profiles cp
      JOIN users u ON u.id = cp.user_id
      WHERE cp.user_id = ${id}::uuid AND u.role = 'company'
    `;

    if (companyRow) {
      const cleanData = safelyParseJSON(companyRow.profile_data);
      if (!cleanData.companyName) cleanData.companyName = companyRow.email;

      if (viewerId !== id) {
        trackProfileView(id, viewerId).catch((err) =>
          console.error("trackProfileView (company) fehlgeschlagen:", err),
        );

        // Ich markiere hier zusätzlich meinen eigenen Tag als aktiv — bisher wurde
        // nur bei Like/Skip Engagement getrackt, wodurch reines Browsen ohne
        // Interaktion nie in der Heatmap auftauchte.
        trackDailyEngagement(viewerId).catch((err) =>
          console.error("trackDailyEngagement (browsing) fehlgeschlagen:", err),
        );
      }

      return res.json({ profile: cleanData, type: "company" });
    }

    return res.status(404).json({ msg: "Profil nicht gefunden" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ msg: "Server Fehler", detail: msg });
  }
});

export default router;
