import { Router, Request, Response } from "express";
import sql from "../util/db";
import { requireAuth } from "../authMiddleware";

const router = Router();

/**
 * Architektur-Hilfsfunktion: Eliminiert die mehrfache String-Serialisierung.
 * Akzeptiert Text oder Objekte und bricht nach maximal 5 Iterationen ab.
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

          // E-Mail-Fallback verhindert komplett leere Karten im UI
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

// ─── POST /discover/interact — Like oder Skip ─────────────────────────────────
router.post("/interact", requireAuth, async (req: Request, res: Response) => {
  const fromId = req.auth!.userId!;
  const { targetId, action } = req.body as {
    targetId: string;
    action: "like" | "skip";
  };

  if (!targetId || !action) {
    return res.status(400).json({ msg: "targetId und action erforderlich" });
  }

  try {
    await sql`
      INSERT INTO user_interactions (from_user_id, to_user_id, action)
      VALUES (${fromId}::uuid, ${targetId}::uuid, ${action})
      ON CONFLICT (from_user_id, to_user_id)
      DO UPDATE SET action = ${action}, created_at = NOW()
    `;

    if (action !== "like") {
      return res.json({ status: "skipped" });
    }

    const [mutual] = await sql`
      SELECT id FROM user_interactions
      WHERE from_user_id = ${targetId}::uuid
        AND to_user_id   = ${fromId}::uuid
        AND action = 'like'
    `;

    if (!mutual) {
      return res.json({ status: "liked" });
    }

    const [existing] = await sql`
      SELECT id FROM matches
      WHERE (user1_id = ${fromId}::uuid AND user2_id = ${targetId}::uuid)
         OR (user1_id = ${targetId}::uuid AND user2_id = ${fromId}::uuid)
    `;

    if (existing) {
      return res.json({ status: "match", matchId: existing.id });
    }

    const [newMatch] = await sql`
      INSERT INTO matches (user1_id, user2_id)
      VALUES (${fromId}::uuid, ${targetId}::uuid)
      RETURNING id
    `;

    return res.json({ status: "match", matchId: newMatch.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ msg: "Server Fehler", detail: msg });
  }
});

// ─── GET /discover/:id — Einzelnes Profil laden ───────────────────────────────
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

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
      return res.json({ profile: cleanData, type: "company" });
    }

    return res.status(404).json({ msg: "Profil nicht gefunden" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ msg: "Server Fehler", detail: msg });
  }
});

export default router;
