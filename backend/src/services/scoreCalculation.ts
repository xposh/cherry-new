import sql from "../util/db";

// ========================================
// CALCULATE MATCH READINESS SCORE
// ========================================
export async function calculateMatchReadinessScore(
  userId: string,
  userRole: string,
) {
  try {
    // 1. GET PROFILE DATA
    const tableName =
      userRole === "talent" ? "talent_profiles" : "company_profiles";
    const profileResult = await sql`
      SELECT profile_data FROM ${sql(tableName)} WHERE user_id = ${userId}
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

    // Required fields (20 points)
    const hasRequiredFields =
      profileData.name &&
      profileData.email &&
      (userRole === "talent" ? profileData.position : profileData.companyName);
    if (hasRequiredFields) profileScore += 20;

    // Profile image + portfolio (20 points)
    const hasProfileImage = profileData.profileImage || profileData.logo;
    const portfolioCount =
      profileData.portfolioImages?.length ||
      profileData.galleryImages?.length ||
      0;
    if (hasProfileImage) profileScore += 10;
    if (portfolioCount >= 3) profileScore += 10;

    // Bio/Description (10 points)
    const bioLength = (profileData.bio || profileData.description || "").length;
    if (bioLength >= 150) profileScore += 10;

    // Skills (5 points)
    const skillsCount =
      profileData.skills?.length || profileData.values?.length || 0;
    if (skillsCount >= 3) profileScore += 5;

    // Availability (5 points)
    if (profileData.availability || profileData.workModel) profileScore += 5;

    // ========================================
    // B. ENGAGEMENT QUALITY (MAX 30 POINTS)
    // ========================================
    let engagementScore = 0;

    const matchField = userRole === "talent" ? "talent_id" : "company_id";
    const respondedField =
      userRole === "talent" ? "talent_responded" : "company_responded";

    // Response Rate (15 points)
    const responseResult = await sql`
      SELECT
        COUNT(*) FILTER (WHERE ${sql(respondedField)} = TRUE) as responded,
        COUNT(*) as total
      FROM matches
      WHERE ${sql(matchField)} = ${userId} AND status = 'accepted'
    `;

    const responded = parseInt(responseResult[0].responded);
    const totalMatches = parseInt(responseResult[0].total);

    if (totalMatches > 0) {
      const responseRate = responded / totalMatches;
      engagementScore += Math.round(responseRate * 15);
    }

    // Ignored Matches Penalty (10 points max)
    const ignoredResult = await sql`
      SELECT COUNT(*) as ignored
      FROM matches
      WHERE ${sql(matchField)} = ${userId}
      AND status = 'pending'
      AND created_at < NOW() - INTERVAL '7 days'
    `;

    const ignoredMatches = parseInt(ignoredResult[0].ignored);
    if (ignoredMatches === 0) {
      engagementScore += 10;
    } else if (ignoredMatches >= 3) {
      engagementScore -= 10; // Penalty
    }

    // Quality Messages (5 points)
    const qualityMsgResult = await sql`
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

    // Profile edited in last 90 days (5 points)
    const profileEditResult = await sql`
      SELECT updated_at FROM ${sql(tableName)} WHERE user_id = ${userId}
    `;

    if (profileEditResult.length > 0) {
      const lastEdit = new Date(profileEditResult[0].updated_at);
      const daysSinceEdit =
        (Date.now() - lastEdit.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceEdit <= 90) {
        freshnessScore += 5;
      }
    }

    // Gallery images exist (5 points)
    if (portfolioCount > 0) {
      freshnessScore += 5;
    }

    // ========================================
    // D. TOTAL SCORE
    // ========================================
    const totalScore =
      profileScore + Math.max(0, engagementScore) + freshnessScore;

    // Update database
    await sql`
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
  } catch (error) {
    console.error("Error calculating match readiness score:", error);
    throw error;
  }
}

// ========================================
// TRACK DAILY ENGAGEMENT
// ========================================
export async function trackDailyEngagement(userId: string) {
  try {
    await sql`
      INSERT INTO daily_engagement (user_id, engagement_date, activities_count, is_active)
      VALUES (${userId}, CURRENT_DATE, 1, TRUE)
      ON CONFLICT (user_id, engagement_date) DO UPDATE SET
        activities_count = daily_engagement.activities_count + 1,
        is_active = TRUE
    `;
  } catch (error) {
    console.error("Error tracking daily engagement:", error);
  }
}

// ========================================
// ADD ACTIVITY TO FEED
// ========================================
export async function addActivityToFeed(
  userId: string,
  activityType: string,
  activityText: string,
  relatedUserId?: string,
  relatedUserName?: string,
  relatedUserImage?: string,
) {
  try {
    await sql`
      INSERT INTO activity_feed (
        user_id,
        activity_type,
        activity_text,
        related_user_id,
        related_user_name,
        related_user_image
      ) VALUES (${userId}, ${activityType}, ${activityText}, ${relatedUserId ?? null}, ${relatedUserName ?? null}, ${relatedUserImage ?? null})
    `;

    // Track engagement
    await trackDailyEngagement(userId);
  } catch (error) {
    console.error("Error adding activity to feed:", error);
  }
}

// ========================================
// TRACK PROFILE VIEW
// ========================================
export async function trackProfileView(
  viewedUserId: string,
  viewerUserId: string,
) {
  try {
    // Add to profile_views
    await sql`
      INSERT INTO profile_views (viewed_user_id, viewer_user_id)
      VALUES (${viewedUserId}, ${viewerUserId})
    `;

    // Get viewer info
    const viewerResult = await sql`
      SELECT email, role FROM users WHERE id = ${viewerUserId}
    `;

    const viewerName = viewerResult[0]?.email || "Someone";

    // Add to activity feed
    await addActivityToFeed(
      viewedUserId,
      "profile_view",
      `${viewerName} viewed your profile`,
      viewerUserId,
      viewerName,
    );

    // Track engagement
    await trackDailyEngagement(viewedUserId);
  } catch (error) {
    console.error("Error tracking profile view:", error);
  }
}
