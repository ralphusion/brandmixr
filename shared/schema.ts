import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const brandNames = pgTable("brand_names", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  description: text("description").notNull(),
  keywords: text("keywords").array().notNull(),
  style: text("style").notNull(),
  saved: boolean("saved").default(false).notNull(),
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastUsed: timestamp("last_used"),
  usageCount: integer("usage_count").default(0).notNull(),
  rateLimit: integer("rate_limit").default(100).notNull(), // requests per day
});

export const insertBrandNameSchema = createInsertSchema(brandNames).pick({
  name: true,
  industry: true,
  description: true,
  keywords: true,
  style: true,
  saved: true,
});

export const insertApiKeySchema = createInsertSchema(apiKeys).pick({
  name: true,
  rateLimit: true,
});

export type InsertBrandName = z.infer<typeof insertBrandNameSchema>;
export type BrandName = typeof brandNames.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;

export const generateNameSchema = z.object({
  industry: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  style: z.string(),
});

export type GenerateNameRequest = z.infer<typeof generateNameSchema>;