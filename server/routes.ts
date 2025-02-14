import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateNames, generateDescription, generateLogo } from "./openai";
import { generateNameSchema } from "@shared/schema";
import { ZodError } from "zod";
import { apiRouter } from "./routes/api";
import { checkDomainAvailability } from "./utils/domain";
import { checkTrademarkAvailability } from "./utils/trademark";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.use("/api", apiRouter);

  // Web App Routes
  app.post("/api/generate", async (req, res) => {
    try {
      const data = generateNameSchema.parse(req.body);
      const names = await generateNames(data);

      // Check domain and trademark availability for each name
      // Generate logos separately to handle rate limits
      const namesWithChecks = await Promise.all(
        names.map(async (name) => {
          try {
            const [domainCheck, trademarkCheck] = await Promise.all([
              checkDomainAvailability(name),
              checkTrademarkAvailability(name),
            ]);

            let logoUrl = null;
            try {
              logoUrl = await generateLogo(name, data.industry, data.description, data.keywords);
            } catch (logoError) {
              console.error(`Error generating logo for ${name}:`, logoError);
              // Continue without logo if generation fails
            }

            return {
              name,
              domain: domainCheck.domain,
              domainAvailable: domainCheck.available,
              trademarkExists: trademarkCheck.exists,
              similarTrademarks: trademarkCheck.similarMarks,
              logoUrl
            };
          } catch (error) {
            // If any check fails, return the name with default values
            return {
              name,
              domain: `${name.toLowerCase()}.com`,
              domainAvailable: false,
              trademarkExists: false,
              similarTrademarks: [],
              logoUrl: null
            };
          }
        })
      );

      res.json(namesWithChecks);
    } catch (error) {
      if (error instanceof ZodError || error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  app.post("/api/describe", async (req, res) => {
    try {
      const { name, industry, description, keywords } = req.body;
      const brandDescription = await generateDescription(name, industry, description, keywords);
      res.json({ description: brandDescription });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  app.get("/api/names", async (req, res) => {
    const names = await storage.getBrandNames();
    res.json(names);
  });

  app.post("/api/names", async (req, res) => {
    try {
      const { name } = req.body;
      const [domainCheck, trademarkCheck] = await Promise.all([
        checkDomainAvailability(name),
        checkTrademarkAvailability(name)
      ]);

      const savedName = await storage.saveBrandName({
        ...req.body,
        domainAvailable: domainCheck.available,
        trademarkExists: trademarkCheck.exists,
        similarTrademarks: trademarkCheck.similarMarks,
        trademarkCheckedAt: new Date()
      });

      res.json(savedName);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  app.post("/api/names/:id/toggle", async (req, res) => {
    try {
      const name = await storage.toggleSaved(parseInt(req.params.id));
      res.json(name);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  app.get("/api/names/saved", async (req, res) => {
    const names = await storage.getSavedNames();
    res.json(names);
  });

  const httpServer = createServer(app);
  return httpServer;
}