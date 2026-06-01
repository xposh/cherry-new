import cron from "node-cron";
import sql from "../util/db";
import { calculateMatchReadinessScore } from "./scoreCalculation";

export function startCronJobs() {
  console.log("🕐 Starting Cron Jobs...");

  // Every hour: Recalculate Match Readiness Score for all users
  cron.schedule("0 * * * *", async () => {
    console.log("⚡ Calculating Match Readiness Scores...");

    try {
      const usersResult = await sql`
        SELECT id, role FROM users WHERE profile_complete = TRUE
      `;

      for (const user of usersResult) {
        await calculateMatchReadinessScore(user.id, user.role);
      }

      console.log(`✅ Recalculated scores for ${usersResult.length} users`);
    } catch (error) {
      console.error("❌ Error in Match Readiness Cron Job:", error);
    }
  });

  console.log("✅ Cron Jobs started!");
}
