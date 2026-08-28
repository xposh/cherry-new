import cron from "node-cron";
import sql from "../util/db";
import { calculateMatchReadinessScore } from "./scoreCalculation";

// ✅ BUG-FIX: in eigene Funktion ausgelagert, damit sie sowohl beim Serverstart
// als auch im stündlichen Cron wiederverwendet werden kann, ohne Code zu duplizieren.
async function recalculateAllScores() {
  // ✅ BUG-FIX: "users.profile_complete" existiert NICHT als Spalte in der DB.
  // Das hat bisher JEDEN Cron-Lauf mit einem PostgresError abgebrochen, wodurch
  // NIE Scores berechnet wurden -> deshalb standen Profile/Engagement/Freshness
  // immer auf 0, völlig unabhängig vom tatsächlichen Profilstand.
  // Stattdessen prüfen wir jetzt genauso wie im /is-profile-complete Endpoint:
  // hat der User einen Eintrag in talent_profiles bzw. company_profiles?
  const usersResult = await sql`
    SELECT u.id, u.role
    FROM users u
    WHERE
      (u.role = 'talent' AND EXISTS (
        SELECT 1 FROM talent_profiles tp WHERE tp.user_id = u.id
      ))
      OR
      (u.role = 'company' AND EXISTS (
        SELECT 1 FROM company_profiles cp WHERE cp.user_id = u.id
      ))
  `;

  for (const user of usersResult) {
    await calculateMatchReadinessScore(user.id, user.role);
  }

  return usersResult.length;
}

export function startCronJobs() {
  console.log("🕐 Starting Cron Jobs...");

  // 🆕 ZUSATZ (kein Teil des ursprünglichen Bugs, sondern eine Verbesserung
  // zum Testen): einmal sofort beim Serverstart berechnen, damit du den Fix
  // direkt sehen kannst, ohne bis zur nächsten vollen Stunde zu warten.
  // Kann gefahrlos entfernt werden, falls nicht gewünscht.
  (async () => {
    try {
      console.log("⚡ Initial Match Readiness calculation on startup...");
      const count = await recalculateAllScores();
      console.log(`✅ Initial calculation done for ${count} users`);
    } catch (error) {
      console.error("❌ Error in initial Match Readiness calculation:", error);
    }
  })();

  // Every hour: Recalculate Match Readiness Score for all users
  cron.schedule("0 * * * *", async () => {
    console.log("⚡ Calculating Match Readiness Scores...");

    try {
      const count = await recalculateAllScores();
      console.log(`✅ Recalculated scores for ${count} users`);
    } catch (error) {
      console.error("❌ Error in Match Readiness Cron Job:", error);
    }
  });

  console.log("✅ Cron Jobs started!");
}
