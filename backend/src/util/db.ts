import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  console.error("Denk dran! DATABASE_URL must be configured in .env");
  process.exit();
}

const sql = postgres(process.env.DATABASE_URL);

export default sql;
