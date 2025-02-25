import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  generateNames, 
  generateDescription, 
  generateMoodBoard, 
  generateFontRecommendations 
} from "./openai";
import { generateNameSchema } from "@shared/schema";
import { ZodError } from "zod";
import { apiRouter } from "./routes/api";
import { 
  checkDomainAvailability, 
  checkTrademarkAvailability 
} from "./utils/domainChecker";
import { generateSimpleLogo } from "./utils/logoGenerator";

// Utility function for error handling
const handleError = (error: unknown) => {
  if (error instanceof ZodError) {
    return { status: 400, message: "Invalid input data", details: error.errors };
  }
  if (error instanceof Error) {
    if (error.message.includes('API key')) {
      return { status: 503, message: "API service unavailable", details: "Configuration issue" };
    }
    return { status: 500, message: error.message };
  }
  return { status: 500, message: "An unexpected error occurred" };
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.use("/api", apiRouter);

  app.post("/api/generate", async (req, res) => {
    try {
      const data = generateNameSchema.parse(req.body);
      const names = await generateNames(data);

      const namesWithChecks = await Promise.all(
        names.map(async (name) => {
          const [domainCheck, trademarkCheck] = await Promise.all([
            checkDomainAvailability(name),
            checkTrademarkAvailability(name)
          ]);

          return {
            name,
            domain: domainCheck.domain,
            domainAvailable: domainCheck.available,
            trademarkExists: trademarkCheck.exists,
            similarTrademarks: trademarkCheck.similarMarks
          };
        })
      );

      res.json(namesWithChecks);
    } catch (error) {
      const { status, message, details } = handleError(error);
      res.status(status).json({ error: message, details });
    }
  });

  app.post("/api/generate-logo", async (req, res) => {
    try {
      const { brandName, style, industry, isMore } = req.body;
      if (!brandName || !style || !industry) {
        throw new Error("Missing required parameters");
      }

      const numberOfLogos = 15;
      const currentLogos = isMore ? (req.body.currentLogos || []) : [];
      const newLogos = Array(numberOfLogos)
        .fill(null)
        .map(() => generateSimpleLogo({ brandName, style, industry }));

      res.json({ logos: isMore ? [...currentLogos, ...newLogos] : newLogos });
    } catch (error) {
      const { status, message } = handleError(error);
      res.status(status).json({ error: message });
    }
  });

  app.post("/api/describe", async (req, res) => {
    try {
      const { name, industry, description, keywords } = req.body;
      const brandDescription = await generateDescription(name, industry, description, keywords);
      res.json({ description: brandDescription });
    } catch (error) {
      const { status, message } = handleError(error);
      res.status(status).json({ error: message });
    }
  });

  app.get("/api/names", async (_req, res) => {
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
      const { status, message } = handleError(error);
      res.status(status).json({ error: message });
    }
  });

  app.post("/api/names/:id/toggle", async (req, res) => {
    try {
      const name = await storage.toggleSaved(parseInt(req.params.id));
      res.json(name);
    } catch (error) {
      const { status, message } = handleError(error);
      res.status(status).json({ error: message });
    }
  });

  app.get("/api/names/saved", async (_req, res) => {
    const names = await storage.getSavedNames();
    res.json(names);
  });

  app.get("/api/mood-board", async (req, res) => {
    try {
      const { name, industry, style, provider } = req.query;
      if (!name || !industry || !style) {
        throw new Error("Missing required parameters");
      }

      const moodBoard = await generateMoodBoard(
        name as string,
        industry as string,
        style as string,
        provider as 'openai' | 'gemini'
      );

      res.json(moodBoard);
    } catch (error) {
      const { status, message } = handleError(error);
      res.status(status).json({ error: message });
    }
  });
    app.post("/api/mood-board/regenerate-keywords", async (req, res) => {
    try {
      const { name, industry, style, provider } = req.query;
      if (!name || !industry || !style) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const moodBoard = await generateMoodBoard(
        name as string,
        industry as string,
        style as string,
        provider as 'openai' | 'gemini'
      );

      res.json({
        keywords: moodBoard.keywords,
      });
    } catch (error) {
      const { status, message } = handleError(error);
      res.status(status).json({ error: message });
    }
  });

  app.post("/api/mood-board/regenerate-mood", async (req, res) => {
    try {
      const { name, industry, style, provider } = req.query;
      if (!name || !industry || !style) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const moodBoard = await generateMoodBoard(
        name as string,
        industry as string,
        style as string,
        provider as 'openai' | 'gemini'
      );

      res.json({
        moodDescription: moodBoard.moodDescription,
      });
    } catch (error) {
      const { status, message } = handleError(error);
      res.status(status).json({ error: message });
    }
  });

  app.post("/api/mood-board/regenerate-image", async (req, res) => {
    try {
      const { prompt, style } = req.body;
      if (!prompt || !style) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const result = await generateSimpleLogo({ brandName: prompt, style, industry: ""}); 

      res.json({
        image: result
      });
    } catch (error) {
      const { status, message } = handleError(error);
      res.status(status).json({ error: message });
    }
  });

  app.post("/api/mood-board/regenerate-colors", async (req, res) => {
    try {
      const { name, industry, style, provider } = req.query;
      if (!name || !industry || !style) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const moodBoard = await generateMoodBoard(
        name as string,
        industry as string,
        style as string,
        provider as 'openai' | 'gemini'
      );

      res.json({
        colors: moodBoard.colors,
      });
    } catch (error) {
      const { status, message } = handleError(error);
      res.status(status).json({ error: message });
    }
  });

  app.get("/api/font-recommendations", async (req, res) => {
    try {
      const { name, industry, style } = req.query;
      if (!name || !industry || !style) {
        throw new Error("Missing required parameters");
      }

      const recommendations = await generateFontRecommendations(
        name as string,
        industry as string,
        style as string
      );

      res.json(recommendations);
    } catch (error) {
      const { status, message } = handleError(error);
      res.status(status).json({ error: message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}