import { brandNames, type BrandName, type InsertBrandName } from "@shared/schema";

export interface IStorage {
  getBrandNames(): Promise<BrandName[]>;
  saveBrandName(name: InsertBrandName): Promise<BrandName>;
  toggleSaved(id: number): Promise<BrandName>;
  getSavedNames(): Promise<BrandName[]>;
}

export class MemStorage implements IStorage {
  private brandNames: Map<number, BrandName>;
  private currentId: number;

  constructor() {
    this.brandNames = new Map();
    this.currentId = 1;
  }

  async getBrandNames(): Promise<BrandName[]> {
    return Array.from(this.brandNames.values());
  }

  async saveBrandName(name: InsertBrandName): Promise<BrandName> {
    const id = this.currentId++;
    const brandName: BrandName = { 
      ...name, 
      id,
      saved: name.saved ?? false // Ensure saved is always a boolean
    };
    this.brandNames.set(id, brandName);
    return brandName;
  }

  async toggleSaved(id: number): Promise<BrandName> {
    const name = this.brandNames.get(id);
    if (!name) throw new Error("Name not found");

    const updated = { ...name, saved: !name.saved };
    this.brandNames.set(id, updated);
    return updated;
  }

  async getSavedNames(): Promise<BrandName[]> {
    return Array.from(this.brandNames.values()).filter(name => name.saved);
  }
}

export const storage = new MemStorage();