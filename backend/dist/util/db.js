"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const postgres_1 = __importDefault(require("postgres"));
if (!process.env.DATABASE_URL) {
    console.error("Denk dran! DATABASE_URL must be configured in .env");
    process.exit();
}
const sql = (0, postgres_1.default)(process.env.DATABASE_URL);
exports.default = sql;
