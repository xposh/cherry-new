"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../util/db"));
const authMiddleware_1 = require("../authMiddleware");
const router = (0, express_1.Router)();
const requireUserId = (req, res) => {
    const userId = req.auth?.userId;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return null;
    }
    return userId; // Ensure userId is treated as a string
};
// ========================================
// 1. GET MATCH READINESS SCORE
// ========================================
router.get("/match-readiness", authMiddleware_1.requireAuth, async (req, res) => {
    try {
        const userId = requireUserId(req, res);
        if (!userId)
            return; // Guard clause to handle unauthorized access
        const result = await (0, db_1.default) `
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
            await (0, db_1.default) `
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
    }
    catch (error) {
        console.error("Error fetching match readiness:", error);
        res.status(500).json({ error: "Failed to fetch match readiness score" });
    }
});
// ========================================
// 2. GET SCREEN TIME (This Week)
// ========================================
router.get("/screen-time", authMiddleware_1.requireAuth, async (req, res) => {
    try {
        const userId = requireUserId(req, res);
        if (!userId)
            return; // Guard clause to handle unauthorized access
        // Get current week's screen time (Monday to Sunday)
        const result = await (0, db_1.default) `
      SELECT COALESCE(SUM(duration_minutes), 0) as total_minutes
      FROM screen_time_sessions
      WHERE user_id = ${userId}
      AND session_start >= DATE_TRUNC('week', NOW())
      AND session_start < DATE_TRUNC('week', NOW()) + INTERVAL '1 week'
    `;
        const totalMinutes = parseInt(result[0].total_minutes);
        // Color system
        let status = "Perfect Balance";
        let color = "#00FF88";
        if (totalMinutes > 120) {
            status = "Consider Taking a Break";
            color = "#FF3366";
        }
        else if (totalMinutes > 60) {
            status = "Mindful Usage";
            color = "#FFA500";
        }
        res.json({
            totalMinutes,
            status,
            color,
            remainingHealthyMinutes: Math.max(0, 60 - totalMinutes),
        });
    }
    catch (error) {
        console.error("Error fetching screen time:", error);
        res.status(500).json({ error: "Failed to fetch screen time" });
    }
});
// ========================================
// 3. POST SCREEN TIME SESSION (Start)
// ========================================
router.post("/screen-time/start", authMiddleware_1.requireAuth, async (req, res) => {
    try {
        const userId = requireUserId(req, res);
        if (!userId)
            return; // Guard clause to handle unauthorized access
        const result = await (0, db_1.default) `
      INSERT INTO screen_time_sessions (user_id, session_start)
      VALUES (${userId}, NOW())
      RETURNING id
    `;
        res.json({ sessionId: result[0].id });
    }
    catch (error) {
        console.error("Error starting screen time session:", error);
        res.status(500).json({ error: "Failed to start session" });
    }
});
// ========================================
// 4. POST SCREEN TIME SESSION (End)
// ========================================
router.post("/screen-time/end", authMiddleware_1.requireAuth, async (req, res) => {
    try {
        const userId = requireUserId(req, res);
        if (!userId)
            return; // Guard clause to handle unauthorized access
        const { sessionId } = req.body;
        await (0, db_1.default) `
      UPDATE screen_time_sessions
      SET session_end = NOW(),
          duration_minutes = EXTRACT(EPOCH FROM (NOW() - session_start)) / 60
      WHERE id = ${sessionId} AND user_id = ${userId}
    `;
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error ending screen time session:", error);
        res.status(500).json({ error: "Failed to end session" });
    }
});
// ========================================
// 5. GET PROFILE VIEWS STATS
// ========================================
router.get("/profile-views", authMiddleware_1.requireAuth, async (req, res) => {
    try {
        const userId = requireUserId(req, res);
        if (!userId)
            return; // Guard clause to handle unauthorized access
        // Total views
        const totalResult = await (0, db_1.default) `
      SELECT COUNT(*) as total
      FROM profile_views
      WHERE viewed_user_id = ${userId}
    `;
        // This week's views
        const weekResult = await (0, db_1.default) `
      SELECT COUNT(*) as week_total
      FROM profile_views
      WHERE viewed_user_id = ${userId}
      AND viewed_at >= DATE_TRUNC('week', NOW())
    `;
        // Last week's views
        const lastWeekResult = await (0, db_1.default) `
      SELECT COUNT(*) as last_week_total
      FROM profile_views
      WHERE viewed_user_id = ${userId}
      AND viewed_at >= DATE_TRUNC('week', NOW()) - INTERVAL '1 week'
      AND viewed_at < DATE_TRUNC('week', NOW())
    `;
        // 7-day trend for chart
        const trendResult = await (0, db_1.default) `
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
    }
    catch (error) {
        console.error("Error fetching profile views:", error);
        res.status(500).json({ error: "Failed to fetch profile views" });
    }
});
// ========================================
// 6. GET NEW MATCHES COUNT
// ========================================
router.get("/new-matches", authMiddleware_1.requireAuth, async (req, res) => {
    try {
        const userId = requireUserId(req, res);
        if (!userId)
            return; // Guard clause to handle unauthorized access
        const userRole = req.auth?.role;
        const field = userRole === "talent" ? "talent_id" : "company_id";
        const result = await (0, db_1.default) `
      SELECT COUNT(*) as count
      FROM matches
      WHERE ${(0, db_1.default)(field)} = ${userId}
      AND status = 'pending'
      AND created_at >= NOW() - INTERVAL '7 days'
    `;
        res.json({ newMatches: parseInt(result[0].count) });
    }
    catch (error) {
        console.error("Error fetching new matches:", error);
        res.status(500).json({ error: "Failed to fetch new matches" });
    }
});
// ========================================
// 7. GET ACTIVITY FEED
// ========================================
router.get("/activity-feed", authMiddleware_1.requireAuth, async (req, res) => {
    try {
        const userId = requireUserId(req, res);
        if (!userId)
            return; // Guard clause to handle unauthorized access
        const result = await (0, db_1.default) `
      SELECT
        activity_type,
        related_user_name,
        related_user_image,
        activity_text,
        activity_count,
        created_at
      FROM activity_feed
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 10
    `;
        res.json({ activities: result });
    }
    catch (error) {
        console.error("Error fetching activity feed:", error);
        res.status(500).json({ error: "Failed to fetch activity feed" });
    }
});
// ========================================
// 8. GET RESPONSE RELIABILITY
// ========================================
router.get("/response-reliability", authMiddleware_1.requireAuth, async (req, res) => {
    try {
        const userId = requireUserId(req, res);
        if (!userId)
            return; // Guard clause to handle unauthorized access
        const userRole = req.auth?.role;
        const field = userRole === "talent" ? "talent_responded" : "company_responded";
        const matchField = userRole === "talent" ? "talent_id" : "company_id";
        const result = await (0, db_1.default) `
      SELECT
        COUNT(*) FILTER (WHERE ${(0, db_1.default)(field)} = TRUE) as responded,
        COUNT(*) as total
      FROM matches
      WHERE ${(0, db_1.default)(matchField)} = ${userId}
      AND status = 'accepted'
    `;
        const responded = parseInt(result[0].responded);
        const total = parseInt(result[0].total);
        const percentage = total > 0 ? Math.round((responded / total) * 100) : 0;
        res.json({ responseReliability: percentage });
    }
    catch (error) {
        console.error("Error fetching response reliability:", error);
        res.status(500).json({ error: "Failed to fetch response reliability" });
    }
});
// ========================================
// 9. GET ENGAGEMENT HEATMAP (Last 28 Days)
// ========================================
router.get("/engagement-heatmap", authMiddleware_1.requireAuth, async (req, res) => {
    try {
        const userId = requireUserId(req, res);
        if (!userId)
            return; // Guard clause to handle unauthorized access
        const result = await (0, db_1.default) `
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
            const found = result.find((row) => row.engagement_date.toISOString().split("T")[0] === dateStr);
            heatmap.push({
                date: dateStr,
                isActive: found ? found.is_active : false,
            });
        }
        res.json({ heatmap });
    }
    catch (error) {
        console.error("Error fetching engagement heatmap:", error);
        res.status(500).json({ error: "Failed to fetch engagement heatmap" });
    }
});
// ========================================
// 10. GET HANDPICKED OPPORTUNITIES
// ========================================
router.get("/handpicked-opportunities", authMiddleware_1.requireAuth, async (req, res) => {
    try {
        const userId = requireUserId(req, res);
        if (!userId)
            return; // Guard clause to handle unauthorized access
        const userRole = req.auth?.role;
        // Only for talents (companies get mock data on frontend)
        if (userRole !== "talent") {
            return res.json({ opportunities: [] });
        }
        // Get handpicked opportunities (NOT featured)
        const result = await (0, db_1.default) `
      SELECT
        company_name,
        company_city,
        company_country,
        job_role,
        image_url,
        video_url
      FROM handpicked_opportunities
      WHERE is_active = TRUE
      AND (is_featured = FALSE OR is_featured IS NULL)
      ORDER BY priority DESC, created_at DESC
      LIMIT 10
    `;
        res.json({ opportunities: result });
    }
    catch (error) {
        console.error("Error fetching handpicked opportunities:", error);
        res.status(500).json({ error: "Failed to fetch opportunities" });
    }
});
// ========================================
// 11. GET FEATURED OPPORTUNITY (NEW!)
// ========================================
router.get("/featured-opportunity", authMiddleware_1.requireAuth, async (req, res) => {
    try {
        const userRole = req.auth?.role;
        if (userRole === "talent") {
            // Get featured job opportunity
            const result = await (0, db_1.default) `
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
        }
        else {
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
    }
    catch (error) {
        console.error("Error fetching featured opportunity:", error);
        res.status(500).json({ error: "Failed to fetch featured opportunity" });
    }
});
exports.default = router;
