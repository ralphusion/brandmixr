import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateNames, generateDescription, generateLogoWithDalle, generateMoodBoard, generateFontRecommendations } from "./openai";
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
      if (error instanceof ZodError || error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  app.post("/api/generate-logo", async (req, res) => {
    try {
      const { brandName, style } = req.body;
      if (!brandName) {
        throw new Error("Brand name is required");
      }
      const result = await generateLogoWithDalle(brandName, style);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
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

  app.get("/api/mood-board", async (req, res) => {
    try {
      const { name, industry, style } = req.query;

      if (!name || !industry || !style) {
        console.error("Missing parameters:", { name, industry, style });
        return res.status(400).json({
          error: "Missing required parameters",
          details: {
            name: !name ? "missing" : "present",
            industry: !industry ? "missing" : "present",
            style: !style ? "missing" : "present"
          }
        });
      }

      console.log("Generating mood board for:", { name, industry, style });

      // Generate mood board content
      const moodBoard = await generateMoodBoard(
        name as string,
        industry as string,
        style as string
      );

      console.log("Generated mood board content:", moodBoard);

      // Generate images based on the prompts
      const imagePromises = moodBoard.imagePrompts.map(async (prompt) => {
        try {
          const result = await generateLogoWithDalle(prompt, style as string);
          // Fetch the image and convert to base64
          const response = await fetch(result.url);
          const buffer = await response.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          return `data:image/png;base64,${base64}`;
        } catch (error) {
          console.error("Error generating image:", error);
          return null;
        }
      });

      const imageResults = await Promise.all(imagePromises);
      const images = imageResults.filter(Boolean) as string[];

      console.log("Generated images:", images.length);

      res.json({
        ...moodBoard,
        images
      });
    } catch (error) {
      console.error("Error generating mood board:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  app.post("/api/mood-board/regenerate-keywords", async (req, res) => {
    try {
      const { name, industry, style } = req.query;
      if (!name || !industry || !style) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const moodBoard = await generateMoodBoard(
        name as string,
        industry as string,
        style as string
      );

      res.json({
        keywords: moodBoard.keywords,
      });
    } catch (error) {
      console.error("Error regenerating keywords:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  app.post("/api/mood-board/regenerate-mood", async (req, res) => {
    try {
      const { name, industry, style } = req.query;
      if (!name || !industry || !style) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const moodBoard = await generateMoodBoard(
        name as string,
        industry as string,
        style as string
      );

      res.json({
        moodDescription: moodBoard.moodDescription,
      });
    } catch (error) {
      console.error("Error regenerating mood description:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  app.post("/api/mood-board/regenerate-image", async (req, res) => {
    try {
      const { prompt, style } = req.body;
      if (!prompt || !style) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const result = await generateLogoWithDalle(prompt, style as string);
      const response = await fetch(result.url);
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');

      res.json({
        image: `data:image/png;base64,${base64}`
      });
    } catch (error) {
      console.error("Error regenerating image:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  app.post("/api/mood-board/regenerate-colors", async (req, res) => {
    try {
      const { name, industry, style } = req.query;
      if (!name || !industry || !style) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const moodBoard = await generateMoodBoard(
        name as string,
        industry as string,
        style as string
      );

      res.json({
        colors: moodBoard.colors,
      });
    } catch (error) {
      console.error("Error regenerating colors:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  app.get("/api/font-recommendations", async (req, res) => {
    try {
      const { name, industry, style } = req.query;

      if (!name || !industry || !style) {
        return res.status(400).json({
          error: "Missing required parameters",
          details: {
            name: !name ? "missing" : "present",
            industry: !industry ? "missing" : "present",
            style: !style ? "missing" : "present"
          }
        });
      }

      const recommendations = await generateFontRecommendations(
        name as string,
        industry as string,
        style as string
      );

      res.json(recommendations);
    } catch (error) {
      console.error("Error generating font recommendations:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}