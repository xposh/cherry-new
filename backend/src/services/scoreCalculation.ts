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

    const hasRequiredFields =
      profileData.name &&
      (userRole === "talent" ? profileData.position : profileData.companyName);
    if (hasRequiredFields) profileScore += 20;

    const hasProfileImage = profileData.profileImage || profileData.companyLogo;

    const portfolioCount =
      profileData.portfolioItems?.length ||
      profileData.companyImages?.length ||
      0;
    if (hasProfileImage) profileScore += 10;
    if (portfolioCount >= 3) profileScore += 10;

    const bioLength = (profileData.about || profileData.description || "")
      .length;
    if (bioLength >= 150) profileScore += 10;

    const skillsCount =
      profileData.skills?.length || profileData.cultureValues?.length || 0;
    if (skillsCount >= 3) profileScore += 5;

    if (profileData.availability || profileData.workModel) profileScore += 5;

    // ========================================
    // B. ENGAGEMENT QUALITY (MAX 30 POINTS)
    // ========================================
    let engagementScore = 0;

    const matchField = userRole === "talent" ? "talent_id" : "company_id";
    const responseResult = await sql`
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
      WHERE m.${sql(matchField)} = ${userId} AND m.status = 'accepted'
    `;

    const responded = parseInt(responseResult[0].responded);
    const totalMatches = parseInt(responseResult[0].total);

    if (totalMatches > 0) {
      const responseRate = responded / totalMatches;
      engagementScore += Math.round(responseRate * 15);
    }

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
      engagementScore -= 10;
    }

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
    try {
      const profileEditResult = await sql`
        SELECT updated_at FROM ${sql(tableName)} WHERE user_id = ${userId}
      `;

      if (profileEditResult.length > 0 && profileEditResult[0].updated_at) {
        const lastEdit = new Date(profileEditResult[0].updated_at);
        const daysSinceEdit =
          (Date.now() - lastEdit.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceEdit <= 90) {
          freshnessScore += 5;
        }
      }

      if (portfolioCount > 0) {
        freshnessScore += 5;
      }
    } catch (freshnessError) {
      console.error(
        `Freshness-Berechnung für User ${userId} fehlgeschlagen:`,
        freshnessError,
      );
      if (portfolioCount > 0) freshnessScore += 5;
    }

    // ========================================
    // D. TOTAL SCORE
    // ========================================
    const totalScore =
      profileScore + Math.max(0, engagementScore) + freshnessScore;

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
// ADD ACTIVITY TO FEED (für Like / Match — einzelne, benannte Ereignisse)
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

    await trackDailyEngagement(userId);
  } catch (error) {
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
export async function trackProfileView(
  viewedUserId: string,
  viewerUserId: string,
) {
  try {
    const [alreadyViewedToday] = await sql`
      SELECT 1 FROM profile_views
      WHERE viewed_user_id = ${viewedUserId}
        AND viewer_user_id = ${viewerUserId}
        AND viewed_at >= CURRENT_DATE
      LIMIT 1
    `;
    if (alreadyViewedToday) return;

    // Rohes Event-Log — speist /analytics/profile-views (Totals, 7-Tage-Trend).
    await sql`
      INSERT INTO profile_views (viewed_user_id, viewer_user_id)
      VALUES (${viewedUserId}, ${viewerUserId})
    `;

    // Tages-Aggregat für den Activity Feed: eine Zeile pro User und Tag,
    // die bei jedem zusätzlichen eindeutigen Betrachter hochgezählt wird.
    const [{ activity_count: newCount }] = await sql`
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

    await sql`
      UPDATE activity_feed
      SET activity_text = ${newCount} || ' new profile' || CASE WHEN ${newCount} = 1 THEN '' ELSE 's' END || ' viewed today'
      WHERE user_id = ${viewedUserId}
        AND activity_type = 'profile_view'
        AND activity_date = CURRENT_DATE
    `;

    await trackDailyEngagement(viewedUserId);
  } catch (error) {
    console.error("Error tracking profile view:", error);
  }
}
