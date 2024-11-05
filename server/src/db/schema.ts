import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  githubId: text("github_id").unique(),
  name: text("name"),
  email: text("email").unique(),
  accessToken: text("access_token"),
  subscriptionType: text("subscription_type").default("free"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  sessionToken: text("session_token").unique(),
  accessToken: text("access_token").unique(),
  expiresAt: timestamp("expires_at"),
});
