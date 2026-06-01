"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJobs = startCronJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = __importDefault(require("../util/db"));
const scoreCalculation_1 = require("./scoreCalculation");
function startCronJobs() {
    console.log("🕐 Starting Cron Jobs...");
    // Every hour: Recalculate Match Readiness Score for all users
    node_cron_1.default.schedule("0 * * * *", async () => {
        console.log("⚡ Calculating Match Readiness Scores...");
        try {
            const usersResult = await (0, db_1.default) `
        SELECT id, role FROM users WHERE profile_complete = TRUE
      `;
            for (const user of usersResult) {
                await (0, scoreCalculation_1.calculateMatchReadinessScore)(user.id, user.role);
            }
            console.log(`✅ Recalculated scores for ${usersResult.length} users`);
        }
        catch (error) {
            console.error("❌ Error in Match Readiness Cron Job:", error);
        }
    });
    console.log("✅ Cron Jobs started!");
}
