import { Router, Request, Response } from "express";
import sql from "../util/db";
import { requireAuth } from "../authMiddleware";

const router = Router();

const requireUserId = (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return userId as string; // Ensure userId is treated as a string
};

function safelyParseProfileData(input: any): Record<string, any> {
  if (!input) return {};
  if (typeof input === "object" && input !== null) return input;

  let parsed = input;
  for (let i = 0; i < 4; i++) {
    if (typeof parsed !== "string") break;
    try {
      parsed = JSON.parse(parsed);
    } catch {
      break;
    }
  }

  return typeof parsed === "object" && parsed !== null ? parsed : {};
}

function normalizeText(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function extractSkills(data: Record<string, any>): string[] {
  if (!Array.isArray(data.skills)) return [];
  return data.skills
    .map((s: unknown) => String(s ?? "").trim().toLowerCase())
    .filter(Boolean);
}

function hasOverlap(needles: string[], haystackText: string): boolean {
  if (!needles.length || !haystackText) return false;
  return needles.some((n) => n.length >= 3 && haystackText.includes(n));
}

function textToKeywords(value: unknown): string[] {
  return normalizeText(value)
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9äöüß-]/gi, ""))
    .filter((w) => w.length >= 4);
}

function splitLocation(locationRaw: string): { city: string; country: string } {
  const parts = locationRaw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    city: parts[0] ?? locationRaw,
    country: parts[1] ?? "",
  };
}

// ========================================
// 1. GET MATCH READINESS SCORE
// ========================================
router.get(
  "/match-readiness",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return; // Guard clause to handle unauthorized access

      const result = await sql`
      SELECT
        profile_completeness_score,
        engagement_score,
        freshness_score,
        total_readiness_score,
        last_calculated
      FROM user_analytics
      WHERE user_id = ${userId}
    `;

      if (result.length === 0) {
        // User hat noch keine Analytics → erstelle default
        await sql`
        INSERT INTO user_analytics (user_id, total_readiness_score)
        VALUES (${userId}, 0)
      `;

        return res.json({
          profileCompletenessScore: 0,
          engagementScore: 0,
          freshnessScore: 0,
          totalReadinessScore: 0,
        });
      }

      const analytics = result[0];

      res.json({
        profileCompletenessScore: analytics.profile_completeness_score,
        engagementScore: analytics.engagement_score,
        freshnessScore: analytics.freshness_score,
        totalReadinessScore: analytics.total_readiness_score,
        lastCalculated: analytics.last_calculated,
      });
    } catch (error) {
      console.error("Error fetching match readiness:", error);
      res.status(500).json({ error: "Failed to fetch match readiness score" });
    }
  },
);

// ========================================
// 2. GET SCREEN TIME (This Week)
// ========================================
router.get("/screen-time", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return; // Guard clause to handle unauthorized access

    // Get current week's screen time (Monday to Sunday)
    const result = await sql`
      SELECT COALESCE(SUM(duration_minutes), 0) as total_minutes
      FROM screen_time_sessions
      WHERE user_id = ${userId}
      AND session_start >= DATE_TRUNC('week', NOW())
      AND session_start < DATE_TRUNC('week', NOW()) + INTERVAL '1 week'
    `;

    const totalMinutes = parseInt(result[0].total_minutes);

    // Khaki-zu-Blau-Skala: wenig Screen Time = khaki-gruen (positiv),
    // viel Screen Time = dunkles blau, aber bewusst nicht zu dunkel.
    let status = "In The Flow";
    let color = "#D2C4AA"; // darker eggshell white — bester Zustand

    if (totalMinutes > 120) {
      status = "Consider Taking a Break";
      color = "#2D4F7C"; // dunkles blau — hoechste Stufe, aber weicher
    } else if (totalMinutes > 60) {
      status = "Mindful Usage";
      color = "#4A6E9D"; // mittleres blau — ausgewogen
    } else if (totalMinutes > 30) {
      status = "Perfect Balance";
      color = "#6E8FB2"; // soft blue — Uebergang von khaki zu blau
    }

    res.json({
      totalMinutes,
      status,
      color,
      remainingHealthyMinutes: Math.max(0, 60 - totalMinutes),
    });
  } catch (error) {
    console.error("Error fetching screen time:", error);
    res.status(500).json({ error: "Failed to fetch screen time" });
  }
});

// ========================================
// 3. POST SCREEN TIME SESSION (Start)
// ========================================
router.post(
  "/screen-time/start",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return; // Guard clause to handle unauthorized access

      const result = await sql`
      INSERT INTO screen_time_sessions (user_id, session_start)
      VALUES (${userId}, NOW())
      RETURNING id
    `;

      res.json({ sessionId: result[0].id });
    } catch (error) {
      console.error("Error starting screen time session:", error);
      res.status(500).json({ error: "Failed to start session" });
    }
  },
);

// ========================================
// 4. POST SCREEN TIME SESSION (End)
// ========================================
router.post(
  "/screen-time/end",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return; // Guard clause to handle unauthorized access
      const { sessionId } = req.body;

      await sql`
      UPDATE screen_time_sessions
      SET session_end = NOW(),
          duration_minutes = EXTRACT(EPOCH FROM (NOW() - session_start)) / 60
      WHERE id = ${sessionId} AND user_id = ${userId}
    `;

      res.json({ success: true });
    } catch (error) {
      console.error("Error ending screen time session:", error);
      res.status(500).json({ error: "Failed to end session" });
    }
  },
);

// ========================================
// 5. GET PROFILE VIEWS STATS
// ========================================
router.get(
  "/profile-views",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return; // Guard clause to handle unauthorized access

      // Total views
      const totalResult = await sql`
      SELECT COUNT(*) as total
      FROM profile_views
      WHERE viewed_user_id = ${userId}
    `;

      // This week's views
      const weekResult = await sql`
      SELECT COUNT(*) as week_total
      FROM profile_views
      WHERE viewed_user_id = ${userId}
      AND viewed_at >= DATE_TRUNC('week', NOW())
    `;

      // Last week's views
      const lastWeekResult = await sql`
      SELECT COUNT(*) as last_week_total
      FROM profile_views
      WHERE viewed_user_id = ${userId}
      AND viewed_at >= DATE_TRUNC('week', NOW()) - INTERVAL '1 week'
      AND viewed_at < DATE_TRUNC('week', NOW())
    `;

      // 7-day trend for chart
      const trendResult = await sql`
      SELECT
        TO_CHAR(viewed_at, 'Dy') as day,
        COUNT(*) as views
      FROM profile_views
      WHERE viewed_user_id = ${userId}
      AND viewed_at >= NOW() - INTERVAL '7 days'
      GROUP BY TO_CHAR(viewed_at, 'Dy'), DATE(viewed_at)
      ORDER BY DATE(viewed_at) ASC
    `;

      const total = parseInt(totalResult[0].total);
      const weekTotal = parseInt(weekResult[0].week_total);
      const lastWeekTotal = parseInt(lastWeekResult[0].last_week_total);
      const increase = weekTotal - lastWeekTotal;

      res.json({
        total,
        weekTotal,
        increase,
        trend: trendResult,
      });
    } catch (error) {
      console.error("Error fetching profile views:", error);
      res.status(500).json({ error: "Failed to fetch profile views" });
    }
  },
);

// ========================================
// 6. GET NEW MATCHES COUNT
// ========================================
router.get("/new-matches", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return; // Guard clause to handle unauthorized access
    const userRole = req.auth?.role;
    if (userRole !== "talent" && userRole !== "company") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const field = userRole === "talent" ? "talent_id" : "company_id";

    const result = await sql`
      SELECT COUNT(*) as count
      FROM matches
      WHERE ${sql(field)} = ${userId}
      AND status IN ('pending', 'accepted')
      AND created_at >= NOW() - INTERVAL '7 days'
    `;

    res.json({ newMatches: parseInt(result[0].count) });
  } catch (error) {
    console.error("Error fetching new matches:", error);
    res.status(500).json({ error: "Failed to fetch new matches" });
  }
});

// ========================================
// 7. GET ACTIVITY FEED
// ========================================
router.get(
  "/activity-feed",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return; // Guard clause to handle unauthorized access

      const result = await sql`
      SELECT
        af.activity_type,
        af.related_user_id,
        ru.role AS related_user_role,
        af.related_user_name,
        af.related_user_image,
        af.activity_text,
        af.activity_count,
        af.created_at
      FROM activity_feed af
      LEFT JOIN users ru ON ru.id = af.related_user_id
      WHERE af.user_id = ${userId}
      ORDER BY af.created_at DESC
      LIMIT 10
    `;

      res.json({ activities: result });
    } catch (error) {
      console.error("Error fetching activity feed:", error);
      res.status(500).json({ error: "Failed to fetch activity feed" });
    }
  },
);

// ========================================
// 8. GET RESPONSE RELIABILITY
// ========================================
router.get(
  "/response-reliability",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return; // Guard clause to handle unauthorized access
      const userRole = req.auth?.role;
      if (userRole !== "talent" && userRole !== "company") {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const matchField = userRole === "talent" ? "talent_id" : "company_id";

      const result = await sql`
      SELECT
        COUNT(*) FILTER (
          WHERE (
            EXISTS (
              SELECT 1
              FROM conversations c
              JOIN messages msg ON msg.conversation_id = c.id
              WHERE c.match_id = m.id
              AND msg.sender_id = ${userId}::uuid
            )
            OR (
              CASE
                WHEN ${userRole} = 'talent' THEN m.talent_responded
                ELSE m.company_responded
              END
            ) = TRUE
          )
        ) as responded,
        COUNT(*) as total
      FROM matches m
      WHERE m.${sql(matchField)} = ${userId}
      AND m.status = 'accepted'
    `;

      const responded = parseInt(result[0].responded);
      const total = parseInt(result[0].total);
      const percentage = total > 0 ? Math.round((responded / total) * 100) : 0;

      res.json({ responseReliability: percentage });
    } catch (error) {
      console.error("Error fetching response reliability:", error);
      res.status(500).json({ error: "Failed to fetch response reliability" });
    }
  },
);

// ========================================
// 9. GET ENGAGEMENT HEATMAP (Last 28 Days)
// ========================================
router.get(
  "/engagement-heatmap",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return; // Guard clause to handle unauthorized access

      const result = await sql`
      SELECT
        engagement_date,
        is_active
      FROM daily_engagement
      WHERE user_id = ${userId}
      AND engagement_date >= CURRENT_DATE - INTERVAL '28 days'
      ORDER BY engagement_date ASC
    `;

      // Fill missing days with inactive
      const heatmap = [];
      for (let i = 27; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        const found = result.find(
          (row: any) =>
            row.engagement_date.toISOString().split("T")[0] === dateStr,
        );

        heatmap.push({
          date: dateStr,
          isActive: found ? found.is_active : false,
        });
      }

      res.json({ heatmap });
    } catch (error) {
      console.error("Error fetching engagement heatmap:", error);
      res.status(500).json({ error: "Failed to fetch engagement heatmap" });
    }
  },
);

// ========================================
// 10. GET HANDPICKED OPPORTUNITIES
// ========================================
router.get(
  "/handpicked-opportunities",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return; // Guard clause to handle unauthorized access
      const userRole = req.auth?.role;

      if (userRole === "talent") {
        const [viewerRaw] = await sql`
          SELECT profile_data FROM talent_profiles WHERE user_id = ${userId}::uuid
        `;
        const viewer = safelyParseProfileData(viewerRaw?.profile_data);
        const viewerLocation = normalizeText(viewer.location);
        const viewerSkills = extractSkills(viewer);
        const viewerFocusKeywords = Array.from(
          new Set([
            ...textToKeywords(viewer.position),
            ...textToKeywords(viewer.specialty),
            ...viewerSkills.flatMap((s) => textToKeywords(s)),
          ]),
        );

        const candidates = await sql`
          SELECT
            fo.owner_id,
            fo.title,
            fo.description,
            fo.image_url,
            fo.video_url,
            fo.deadline,
            cp.profile_data AS company_data,
            u.email
          FROM featured_opportunities fo
          JOIN users u ON u.id = fo.owner_id
          LEFT JOIN company_profiles cp ON cp.user_id = fo.owner_id
          WHERE u.role = 'company'
            AND fo.owner_id <> ${userId}::uuid
            AND fo.is_active = TRUE
            AND fo.deleted_at IS NULL
            AND fo.deadline > NOW()
          ORDER BY fo.updated_at DESC, fo.deadline ASC
          LIMIT 40
        `;

        const ranked = candidates
          .map((row: any) => {
            const companyData = safelyParseProfileData(row.company_data);
            const companyName = String(
              companyData.companyName || companyData.name || row.email || "Company",
            );
            const locationRaw = String(companyData.location || "");
            const { city, country } = splitLocation(locationRaw);
            const jobRole = String(
              row.title || companyData.jobTitle || companyData.industry || "Opportunity",
            );
            const descriptor = normalizeText(
              [
                jobRole,
                row.description,
                companyData.industry,
                companyData.description,
              ].join(" "),
            );
            const roleFit = hasOverlap(viewerFocusKeywords, descriptor);

            let score = 55;
            const candidateLocation = normalizeText(locationRaw);

            if (
              viewerLocation &&
              candidateLocation &&
              (viewerLocation.includes(candidateLocation) ||
                candidateLocation.includes(viewerLocation))
            ) {
              score += 20;
            }

            if (hasOverlap(viewerSkills, descriptor)) {
              score += 15;
            }

            if (viewerFocusKeywords.length > 0) {
              if (roleFit) score += 20;
              else score -= 35;
            }

            if (row.video_url) score += 7;
            else if (row.image_url) score += 4;

            score = Math.min(score, 100);

            return {
              owner_id: String(row.owner_id),
              company_name: companyName,
              company_city: city || "Unknown City",
              company_country: country || "",
              job_role: jobRole,
              image_url: String(row.image_url || companyData.companyLogo || ""),
              video_url: String(row.video_url || ""),
              potential_match_score: score,
            };
          })
          .sort((a, b) => b.potential_match_score - a.potential_match_score);

        const seenCompany = new Set<string>();
        const rankedUnique = ranked
          .filter((item: any) => {
            const key = `${item.owner_id}-${normalizeText(item.company_name)}`;
            if (seenCompany.has(key)) return false;
            seenCompany.add(key);
            return true;
          })
          .slice(0, 3)
          .map(({ owner_id, ...rest }: any) => rest);

        if (rankedUnique.length >= 3) {
          return res.json({ opportunities: rankedUnique });
        }

        // Sparse-data fallback while rollout is in progress
        const fallback = await sql`
          SELECT
            company_name,
            company_city,
            company_country,
            job_role,
            target_skills,
            image_url,
            video_url,
            priority
          FROM handpicked_opportunities
          WHERE is_active = TRUE
            AND (is_featured = FALSE OR is_featured IS NULL)
          ORDER BY priority DESC, created_at DESC
          LIMIT 3
        `;

        const fallbackWithScore = fallback
          .map((row: any, idx: number) => {
            const descriptor = normalizeText(
              [row.job_role, ...(Array.isArray(row.target_skills) ? row.target_skills : [])].join(" "),
            );
            const roleFit =
              viewerFocusKeywords.length === 0 ||
              hasOverlap(viewerFocusKeywords, descriptor);

            return {
              company_name: row.company_name,
              company_city: row.company_city,
              company_country: row.company_country,
              job_role: row.job_role,
              image_url: row.image_url,
              video_url: row.video_url,
              potential_match_score: roleFit ? Math.max(50, 72 - idx * 6) : 0,
            };
          })
          .filter((row: any) => row.potential_match_score > 0)
          .slice(0, 3);

        const merged = [...rankedUnique, ...fallbackWithScore].slice(0, 3);
        if (merged.length >= 3) {
          return res.json({ opportunities: merged });
        }

        const profileFallback = await sql`
          SELECT
            cp.profile_data AS company_data,
            u.email
          FROM users u
          LEFT JOIN company_profiles cp ON cp.user_id = u.id
          WHERE u.role = 'company'
            AND u.id <> ${userId}::uuid
          ORDER BY u.created_at DESC
          LIMIT 20
        `;

        const extra = profileFallback
          .map((row: any) => {
            const companyData = safelyParseProfileData(row.company_data);
            const companyName = String(
              companyData.companyName || companyData.name || row.email || "Company",
            );
            const locationRaw = String(companyData.location || "");
            const { city, country } = splitLocation(locationRaw);
            const descriptor = normalizeText(
              [companyData.industry, companyData.description, companyData.jobTitle].join(" "),
            );
            const roleFit =
              viewerFocusKeywords.length === 0 ||
              hasOverlap(viewerFocusKeywords, descriptor);

            if (!roleFit) return null;

            return {
              company_name: companyName,
              company_city: city || "Unknown City",
              company_country: country || "",
              job_role: String(companyData.jobTitle || companyData.industry || "Opportunity"),
              image_url: String(companyData.companyLogo || ""),
              video_url: "",
              potential_match_score: 58,
            };
          })
          .filter(Boolean) as Array<any>;

        const final = [...merged];
        for (const item of extra) {
          if (final.length >= 3) break;
          const exists = final.some(
            (f) => normalizeText(f.company_name) === normalizeText(item.company_name),
          );
          if (!exists) final.push(item);
        }

        return res.json({ opportunities: final.slice(0, 3) });
      }

      if (userRole === "company") {
        const [viewerRaw] = await sql`
          SELECT profile_data FROM company_profiles WHERE user_id = ${userId}::uuid
        `;
        const viewer = safelyParseProfileData(viewerRaw?.profile_data);
        const viewerLocation = normalizeText(viewer.location);
        const viewerKeywords = [
          normalizeText(viewer.jobTitle),
          normalizeText(viewer.industry),
          normalizeText(viewer.description),
        ].filter(Boolean);

        const talents = await sql`
          SELECT
            u.id,
            u.email,
            tp.profile_data AS talent_data
          FROM users u
          JOIN talent_profiles tp ON tp.user_id = u.id
          WHERE u.role = 'talent'
            AND u.id <> ${userId}::uuid
          ORDER BY u.created_at DESC
          LIMIT 60
        `;

        const ranked = talents
          .map((row: any) => {
            const data = safelyParseProfileData(row.talent_data);
            const name = String(data.name || data.fullName || row.email || "Talent");
            const position = String(data.position || data.specialty || "Talent Profile");
            const location = String(data.location || "Unknown Location");
            const profileText = normalizeText(
              [position, data.about, ...(Array.isArray(data.skills) ? data.skills : [])].join(" "),
            );
            const candidateLocation = normalizeText(location);

            let score = 55;

            if (
              viewerLocation &&
              candidateLocation &&
              (viewerLocation.includes(candidateLocation) ||
                candidateLocation.includes(viewerLocation))
            ) {
              score += 20;
            }

            if (hasOverlap(viewerKeywords, profileText)) {
              score += 15;
            }

            if (data.video_url) score += 7;
            else if (data.profileImage || data.imageUrl) score += 4;

            score = Math.min(score, 100);

            return {
              name,
              position,
              location,
              image_url: String(data.profileImage || data.imageUrl || ""),
              video_url: String(data.video_url || ""),
              potential_match_score: score,
            };
          })
          .sort((a, b) => b.potential_match_score - a.potential_match_score)
          .slice(0, 3);

        return res.json({ opportunities: ranked });
      }

      return res.json({ opportunities: [] });
    } catch (error) {
      console.error("Error fetching handpicked opportunities:", error);
      res.status(500).json({ error: "Failed to fetch opportunities" });
    }
  },
);

// ========================================
// 11. GET FEATURED OPPORTUNITY (NEW!)
// ========================================
router.get(
  "/featured-opportunity",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userRole = req.auth?.role;

      if (userRole === "talent") {
        // Get featured job opportunity
        const result = await sql`
        SELECT
          company_name as name,
          company_city as city,
          job_description as description,
          3 as days_remaining,
          image_url,
          video_url
        FROM handpicked_opportunities
        WHERE is_active = TRUE
        AND is_featured = TRUE
        ORDER BY priority DESC
        LIMIT 1
      `;

        if (result.length > 0) {
          return res.json(result[0]);
        }

        // Fallback: Mock data
        return res.json({
          name: "Private Dinner",
          city: "Hamburg",
          description: "An exclusive culinary experience",
          days_remaining: 3,
          image_url: "/barkeeper-sommelier/IMG_4431.JPG",
          video_url: "/videos/CherryPrivateDinner.mp4",
        });
      } else {
        // Company: Return mock featured talent (until you build real backend)
        return res.json({
          name: "Lisa Meier",
          position: "Executive Chef",
          description: "Award-winning culinary artist",
          availability: "Available immediately",
          image_url: "/barkeeper-sommelier/IMG_4431.JPG",
          video_url: "/videos/CherryPrivateDinner.mp4",
        });
      }
    } catch (error) {
      console.error("Error fetching featured opportunity:", error);
      res.status(500).json({ error: "Failed to fetch featured opportunity" });
    }
  },
);

export default router;
