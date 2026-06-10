import { Router, Request, Response } from "express";
import sql from "../util/db";
import { requireAuth } from "../authMiddleware";

const router = Router();

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
      const searchFilter = search
        ? sql`AND (
            tp.profile_data->>'name' ILIKE ${"%" + search + "%"}
            OR tp.profile_data->>'position' ILIKE ${"%" + search + "%"}
            OR tp.profile_data->>'location' ILIKE ${"%" + search + "%"}
          )`
        : sql``;
      const cityFilter = city
        ? sql`AND tp.profile_data->>'location' ILIKE ${"%" + city + "%"}`
        : sql``;

      rawProfiles = await sql`
        SELECT
          u.id,
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
          ${searchFilter}
          ${cityFilter}
        ORDER BY u.created_at DESC
      `;
    } else {
      const searchFilter = search
        ? sql`AND (
            cp.profile_data->>'companyName' ILIKE ${"%" + search + "%"}
            OR cp.profile_data->>'industry' ILIKE ${"%" + search + "%"}
            OR cp.profile_data->>'location' ILIKE ${"%" + search + "%"}
          )`
        : sql``;
      const cityFilter = city
        ? sql`AND cp.profile_data->>'location' ILIKE ${"%" + city + "%"}`
        : sql``;

      rawProfiles = await sql`
        SELECT
          u.id,
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
          ${searchFilter}
          ${cityFilter}
        ORDER BY u.created_at DESC
      `;
    }

    const cleanedProfiles = rawProfiles.map((row: any) => {
      const d = row.data || {};
      if (targetRole === "talent") {
        const rawImg = String(d.profileImage || "");
        const cleanImg = rawImg.replace(/\/Photographer\//g, "/photographer/");
        return {
          id: row.id,
          full_name: String(d.name || "Unbekanntes Talent"),
          current_role: String(d.position || "Keine Position"),
          city: String(d.location || "Kein Ort"),
          main_image_url: cleanImg,
          profileImage: cleanImg,
          imageUrl: cleanImg,
          is_match_preview: Boolean(row.is_match_preview),
        };
      } else {
        const rawLogo = String(d.companyLogo || "");
        return {
          id: row.id,
          full_name: String(d.companyName || "Unbekanntes Unternehmen"),
          current_role: String(d.industry || "Keine Branche"),
          city: String(d.location || "Kein Ort"),
          main_image_url: rawLogo,
          profileImage: rawLogo,
          imageUrl: rawLogo,
          is_match_preview: Boolean(row.is_match_preview),
        };
      }
    });

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

    // Gegenseitigen Like prüfen
    const [mutual] = await sql`
      SELECT id FROM user_interactions
      WHERE from_user_id = ${targetId}::uuid
        AND to_user_id   = ${fromId}::uuid
        AND action = 'like'
    `;

    if (!mutual) {
      return res.json({ status: "liked" });
    }

    // Match! In matches-Tabelle speichern
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
    // Talent prüfen
    const [talentRow] = await sql`
      SELECT tp.profile_data
      FROM talent_profiles tp
      JOIN users u ON u.id = tp.user_id
      WHERE tp.user_id = ${id}::uuid AND u.role = 'talent'
    `;

    if (talentRow) {
      return res.json({ profile: talentRow.profile_data, type: "talent" });
    }

    // Company prüfen
    const [companyRow] = await sql`
      SELECT cp.profile_data
      FROM company_profiles cp
      JOIN users u ON u.id = cp.user_id
      WHERE cp.user_id = ${id}::uuid AND u.role = 'company'
    `;

    if (companyRow) {
      return res.json({ profile: companyRow.profile_data, type: "company" });
    }

    return res.status(404).json({ msg: "Profil nicht gefunden" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ msg: "Server Fehler", detail: msg });
  }
});

export default router;
