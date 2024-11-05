import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // host: "localhost",
    // user: "postgres",
    // password: "Himanshu2004%40%23", // URL-encoded
    // database: "gitgossip",
    // port: 5432,
    // ssl: false,
  },
});
