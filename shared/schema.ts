import { pgTable, text, serial, integer, boolean, jsonb, timestamp, uuid, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stylePresets = pgTable("style_presets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  settings: jsonb("settings").notNull(),
});

export const brandNames = pgTable("brand_names", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  description: text("description").notNull(),
  keywords: text("keywords").array().notNull(),
  style: text("style").notNull(),
  saved: boolean("saved").default(false).notNull(),
  languageCode: text("language_code").default("en").notNull(),
  domainAvailable: boolean("domain_available"),
  domainCheckedAt: timestamp("domain_checked_at"),
  trademarkExists: boolean("trademark_exists"),
  trademarkCheckedAt: timestamp("trademark_checked_at"),
  similarTrademarks: jsonb("similar_trademarks"),
  colorPalette: jsonb("color_palette"),
  fontPairings: jsonb("font_pairings"),
  rating: integer("rating").default(0),
  workspaceId: uuid("workspace_id").references(() => workspaces.id),
  logoUrl: text("logo_url"), // Added field for storing logo URL
});

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  brandNameId: integer("brand_name_id").references(() => brandNames.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: uuid("user_id").notNull(),
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastUsed: timestamp("last_used"),
  usageCount: integer("usage_count").default(0).notNull(),
  rateLimit: integer("rate_limit").default(100).notNull(),
});

export const insertBrandNameSchema = createInsertSchema(brandNames).pick({
  name: true,
  industry: true,
  description: true,
  keywords: true,
  style: true,
  saved: true,
  languageCode: true,
  workspaceId: true,
  trademarkExists: true,
  trademarkCheckedAt: true,
  similarTrademarks: true,
  colorPalette: true,
  fontPairings: true,
  rating: true,
  logoUrl:true
});

export const insertWorkspaceSchema = createInsertSchema(workspaces).pick({
  name: true,
  description: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  brandNameId: true,
  content: true,
  userId: true,
});

export const insertStylePresetSchema = createInsertSchema(stylePresets);
export const stylePresetSchema = insertStylePresetSchema;

export const insertApiKeySchema = createInsertSchema(apiKeys).pick({
  name: true,
  rateLimit: true,
});

export type InsertBrandName = z.infer<typeof insertBrandNameSchema>;
export type BrandName = typeof brandNames.$inferSelect;
export type Workspace = typeof workspaces.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type StylePreset = typeof stylePresets.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertStylePreset = z.infer<typeof insertStylePresetSchema>;

export const generateNameSchema = z.object({
  industry: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  style: z.string(),
  languageCode: z.string().optional(),
  stylePresetId: z.number().optional(),
});

export type GenerateNameRequest = z.infer<typeof generateNameSchema>;