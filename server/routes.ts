import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateNames, generateDescription } from "./openai";
import { generateNameSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/generate", async (req, res) => {
    try {
      const data = generateNameSchema.parse(req.body);
      const names = await generateNames(data);
      res.json(names);
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
    const name = await storage.saveBrandName(req.body);
    res.json(name);
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