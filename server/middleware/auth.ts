import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { db } from "../db";
import { apiKeys } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function generateApiKey(name: string, rateLimit: number = 100): Promise<string> {
  const key = `bng_${crypto.randomBytes(32).toString('hex')}`;
  await db.insert(apiKeys).values({
    key,
    name,
    rateLimit,
  });
  return key;
}

export async function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(401).json({ error: "API key is required" });
  }

  try {
    const [key] = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.key, apiKey));

    if (!key) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // Update usage statistics
    await db
      .update(apiKeys)
      .set({
        lastUsed: new Date(),
        usageCount: key.usageCount + 1,
      })
      .where(eq(apiKeys.key, apiKey));

    // Check rate limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const usageToday = key.lastUsed?.getTime() ?? 0 >= today.getTime() ? key.usageCount : 0;

    if (usageToday >= key.rateLimit) {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }

    // Add API key info to request for logging
    req.apiKey = key;
    next();
  } catch (error) {
    console.error('API Key validation error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}
