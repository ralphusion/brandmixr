import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
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

export const insertBrandNameSchema = createInsertSchema(brandNames).pick({
  name: true,
  industry: true,
  description: true,
  keywords: true,
  style: true,
  saved: true,
});

export type InsertBrandName = z.infer<typeof insertBrandNameSchema>;
export type BrandName = typeof brandNames.$inferSelect;

export const generateNameSchema = z.object({
  industry: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  style: z.string(),
});

export type GenerateNameRequest = z.infer<typeof generateNameSchema>;
