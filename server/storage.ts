import { db } from "./db";
import { eq } from "drizzle-orm";
import { 
  brandNames, stylePresets,
  type BrandName, type InsertBrandName,
  type StylePreset, type InsertStylePreset
} from "@shared/schema";

export interface IStorage {
  getBrandNames(): Promise<BrandName[]>;
  saveBrandName(name: InsertBrandName & { domainAvailable?: boolean }): Promise<BrandName>;
  toggleSaved(id: number): Promise<BrandName>;
  getSavedNames(): Promise<BrandName[]>;
  // Style preset methods
  getStylePresets(): Promise<StylePreset[]>;
  getStylePreset(id: number): Promise<StylePreset | undefined>;
  createStylePreset(preset: InsertStylePreset): Promise<StylePreset>;
}

export class DatabaseStorage implements IStorage {
  async getBrandNames(): Promise<BrandName[]> {
    return await db.select().from(brandNames);
  }

  async saveBrandName(name: InsertBrandName & { domainAvailable?: boolean }): Promise<BrandName> {
    const [brandName] = await db
      .insert(brandNames)
      .values({
        ...name,
        domainAvailable: name.domainAvailable ?? null,
        domainCheckedAt: name.domainAvailable !== undefined ? new Date() : null,
        colorPalette: null,
        fontPairings: null,
        rating: 0
      })
      .returning();
    return brandName;
  }

  async toggleSaved(id: number): Promise<BrandName> {
    const [name] = await db
      .select()
      .from(brandNames)
      .where(eq(brandNames.id, id));

    if (!name) throw new Error("Name not found");

    const [updated] = await db
      .update(brandNames)
      .set({ saved: !name.saved })
      .where(eq(brandNames.id, id))
      .returning();

    return updated;
  }

  async getSavedNames(): Promise<BrandName[]> {
    return await db
      .select()
      .from(brandNames)
      .where(eq(brandNames.saved, true));
  }

  async getStylePresets(): Promise<StylePreset[]> {
    return await db.select().from(stylePresets);
  }

  async getStylePreset(id: number): Promise<StylePreset | undefined> {
    const [preset] = await db
      .select()
      .from(stylePresets)
      .where(eq(stylePresets.id, id));
    return preset;
  }

  async createStylePreset(preset: InsertStylePreset): Promise<StylePreset> {
    const [newPreset] = await db
      .insert(stylePresets)
      .values(preset)
      .returning();
    return newPreset;
  }
}

export const storage = new DatabaseStorage();