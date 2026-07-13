"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMatchReadinessScore = calculateMatchReadinessScore;
exports.trackDailyEngagement = trackDailyEngagement;
exports.addActivityToFeed = addActivityToFeed;
exports.trackProfileView = trackProfileView;
const db_1 = __importDefault(require("../util/db"));
// ========================================
// CALCULATE MATCH READINESS SCORE
// ========================================
async function calculateMatchReadinessScore(userId, userRole) {
    try {
        // 1. GET PROFILE DATA
        const tableName = userRole === "talent" ? "talent_profiles" : "company_profiles";
        const profileResult = await (0, db_1.default) `
      SELECT profile_data FROM ${(0, db_1.default)(tableName)} WHERE user_id = ${userId}
    `;
        if (profileResult.length === 0) {
            return {
                total: 0,
                breakdown: { profile: 0, engagement: 0, freshness: 0 },
            };
        }
        const profileData = profileResult[0].profile_data;
        // ========================================
        // A. PROFILE COMPLETENESS (MAX 60 POINTS)
        // ========================================
        let profileScore = 0;
        const hasRequiredFields = profileData.name &&
            (userRole === "talent" ? profileData.position : profileData.companyName);
        if (hasRequiredFields)
            profileScore += 20;
        const hasProfileImage = profileData.profileImage || profileData.companyLogo;
        const portfolioCount = profileData.portfolioItems?.length ||
            profileData.companyImages?.length ||
            0;
        if (hasProfileImage)
            profileScore += 10;
        if (portfolioCount >= 3)
            profileScore += 10;
        const bioLength = (profileData.about || profileData.description || "")
            .length;
        if (bioLength >= 150)
            profileScore += 10;
        const skillsCount = profileData.skills?.length || profileData.cultureValues?.length || 0;
        if (skillsCount >= 3)
            profileScore += 5;
        if (profileData.availability || profileData.workModel)
            profileScore += 5;
        // ========================================
        // B. ENGAGEMENT QUALITY (MAX 30 POINTS)
        // ========================================
        let engagementScore = 0;
        const matchField = userRole === "talent" ? "talent_id" : "company_id";
        const respondedField = userRole === "talent" ? "talent_responded" : "company_responded";
        const responseResult = await (0, db_1.default) `
      SELECT
        COUNT(*) FILTER (WHERE ${(0, db_1.default)(respondedField)} = TRUE) as responded,
        COUNT(*) as total
      FROM matches
      WHERE ${(0, db_1.default)(matchField)} = ${userId} AND status = 'accepted'
    `;
        const responded = parseInt(responseResult[0].responded);
        const totalMatches = parseInt(responseResult[0].total);
        if (totalMatches > 0) {
            const responseRate = responded / totalMatches;
            engagementScore += Math.round(responseRate * 15);
        }
        const ignoredResult = await (0, db_1.default) `
      SELECT COUNT(*) as ignored
      FROM matches
      WHERE ${(0, db_1.default)(matchField)} = ${userId}
      AND status = 'pending'
      AND created_at < NOW() - INTERVAL '7 days'
    `;
        const ignoredMatches = parseInt(ignoredResult[0].ignored);
        if (ignoredMatches === 0) {
            engagementScore += 10;
        }
        else if (ignoredMatches >= 3) {
            engagementScore -= 10;
        }
        const qualityMsgResult = await (0, db_1.default) `
      SELECT COUNT(*) FILTER (WHERE is_quality_message = TRUE) as quality,
             COUNT(*) as total
      FROM messages
      WHERE sender_id = ${userId}
    `;
        const qualityMsgs = parseInt(qualityMsgResult[0].quality);
        const totalMsgs = parseInt(qualityMsgResult[0].total);
        if (totalMsgs > 0 && qualityMsgs / totalMsgs > 0.8) {
            engagementScore += 5;
        }
        // ========================================
        // C. FRESHNESS (MAX 10 POINTS)
        // ========================================
        let freshnessScore = 0;
        try {
            const profileEditResult = await (0, db_1.default) `
        SELECT updated_at FROM ${(0, db_1.default)(tableName)} WHERE user_id = ${userId}
      `;
            if (profileEditResult.length > 0 && profileEditResult[0].updated_at) {
                const lastEdit = new Date(profileEditResult[0].updated_at);
                const daysSinceEdit = (Date.now() - lastEdit.getTime()) / (1000 * 60 * 60 * 24);
                if (daysSinceEdit <= 90) {
                    freshnessScore += 5;
                }
            }
            if (portfolioCount > 0) {
                freshnessScore += 5;
            }
        }
        catch (freshnessError) {
            console.error(`Freshness-Berechnung für User ${userId} fehlgeschlagen:`, freshnessError);
            if (portfolioCount > 0)
                freshnessScore += 5;
        }
        // ========================================
        // D. TOTAL SCORE
        // ========================================
        const totalScore = profileScore + Math.max(0, engagementScore) + freshnessScore;
        await (0, db_1.default) `
      INSERT INTO user_analytics (
        user_id,
        profile_completeness_score,
        engagement_score,
        freshness_score,
        total_readiness_score,
        last_calculated
      ) VALUES (${userId}, ${profileScore}, ${Math.max(0, engagementScore)}, ${freshnessScore}, ${totalScore}, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        profile_completeness_score = EXCLUDED.profile_completeness_score,
        engagement_score = EXCLUDED.engagement_score,
        freshness_score = EXCLUDED.freshness_score,
        total_readiness_score = EXCLUDED.total_readiness_score,
        last_calculated = NOW()
    `;
        return {
            total: totalScore,
            breakdown: {
                profile: profileScore,
                engagement: Math.max(0, engagementScore),
                freshness: freshnessScore,
            },
        };
    }
    catch (error) {
        console.error("Error calculating match readiness score:", error);
        throw error;
    }
}
// ========================================
// TRACK DAILY ENGAGEMENT
// ========================================
async function trackDailyEngagement(userId) {
    try {
        await (0, db_1.default) `
      INSERT INTO daily_engagement (user_id, engagement_date, activities_count, is_active)
      VALUES (${userId}, CURRENT_DATE, 1, TRUE)
      ON CONFLICT (user_id, engagement_date) DO UPDATE SET
        activities_count = daily_engagement.activities_count + 1,
        is_active = TRUE
    `;
    }
    catch (error) {
        console.error("Error tracking daily engagement:", error);
    }
}
// ========================================
// ADD ACTIVITY TO FEED (für Like / Match — einzelne, benannte Ereignisse)
// ========================================
async function addActivityToFeed(userId, activityType, activityText, relatedUserId, relatedUserName, relatedUserImage) {
    try {
        await (0, db_1.default) `
      INSERT INTO activity_feed (
        user_id,
        activity_type,
        activity_text,
        related_user_id,
        related_user_name,
        related_user_image
      ) VALUES (${userId}, ${activityType}, ${activityText}, ${relatedUserId ?? null}, ${relatedUserName ?? null}, ${relatedUserImage ?? null})
    `;
        await trackDailyEngagement(userId);
    }
    catch (error) {
        console.error("Error adding activity to feed:", error);
    }
}
// ========================================
// TRACK PROFILE VIEW
// ========================================
// ✅ NEU IMPLEMENTIERT nach dem ursprünglichen Aggregations-Plan: statt bei
// jedem Aufruf eine neue activity_feed-Zeile zu schreiben (Spam-Risiko bei
// vielen Betrachtern), wird pro User und Tag GENAU EINE Zeile gepflegt und
// bei jedem weiteren EINMALIGEN Betrachter hochgezählt. Mehrfache Aufrufe
// derselben Firma am selben Tag erzeugen bewusst KEINEN weiteren Zähler-Tick
// ("Unique Views"-Anforderung aus der ursprünglichen Planung).
async function trackProfileView(viewedUserId, viewerUserId) {
    try {
        const [alreadyViewedToday] = await (0, db_1.default) `
      SELECT 1 FROM profile_views
      WHERE viewed_user_id = ${viewedUserId}
        AND viewer_user_id = ${viewerUserId}
        AND viewed_at >= CURRENT_DATE
      LIMIT 1
    `;
        if (alreadyViewedToday)
            return;
        // Rohes Event-Log — speist /analytics/profile-views (Totals, 7-Tage-Trend).
        await (0, db_1.default) `
      INSERT INTO profile_views (viewed_user_id, viewer_user_id)
      VALUES (${viewedUserId}, ${viewerUserId})
    `;
        // Tages-Aggregat für den Activity Feed: eine Zeile pro User und Tag,
        // die bei jedem zusätzlichen eindeutigen Betrachter hochgezählt wird.
        const [{ activity_count: newCount }] = await (0, db_1.default) `
      INSERT INTO activity_feed (
        user_id, activity_type, activity_text, activity_count, activity_date, created_at
      ) VALUES (
        ${viewedUserId}, 'profile_view', '1 new profile viewed today', 1, CURRENT_DATE, NOW()
      )
      ON CONFLICT (user_id, activity_date) WHERE activity_type = 'profile_view'
      DO UPDATE SET
        activity_count = activity_feed.activity_count + 1,
        created_at = NOW()
      RETURNING activity_count
    `;
        await (0, db_1.default) `
      UPDATE activity_feed
      SET activity_text = ${newCount} || ' new profile' || CASE WHEN ${newCount} = 1 THEN '' ELSE 's' END || ' viewed today'
      WHERE user_id = ${viewedUserId}
        AND activity_type = 'profile_view'
        AND activity_date = CURRENT_DATE
    `;
        await trackDailyEngagement(viewedUserId);
    }
    catch (error) {
        console.error("Error tracking profile view:", error);
    }
}
