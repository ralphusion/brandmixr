import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateNames, generateDescription, generateMoodBoard, generateFontRecommendations, generateLogoWithDalle } from "./openai";
import { generateNameSchema } from "@shared/schema";
import { ZodError } from "zod";
import { apiRouter } from "./routes/api";
import { checkDomainAvailability } from "./utils/domain";
import { checkTrademarkAvailability } from "./utils/trademark";
import { generateSimpleLogo } from "./utils/logoGenerator";
import openai from 'openai'; // Added import


export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.use("/api", apiRouter);

  // Web App Routes
  app.post("/api/generate", async (req, res) => {
    try {
      const data = generateNameSchema.parse(req.body);
      console.log("Generating names with params:", {
        industry: data.industry,
        style: data.style,
        description: data.description?.substring(0, 50) + "..."
      });

      const names = await generateNames(data);
      console.log(`Successfully generated ${names.length} names`);

      // Check domain and trademark availability for each name
      const namesWithChecks = await Promise.all(
        names.map(async (name) => {
          try {
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
          } catch (error) {
            console.error(`Error checking availability for name ${name}:`, error);
            return {
              name,
              domain: name.toLowerCase().replace(/\s+/g, '') + '.com',
              domainAvailable: false,
              trademarkExists: false,
              similarTrademarks: []
            };
          }
        })
      );

      res.json(namesWithChecks);
    } catch (error) {
      console.error("Error in name generation:", error);

      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid input data", details: error.errors });
      } else if (error instanceof Error) {
        if (error.message.includes('API key')) {
          res.status(503).json({ 
            error: "API service is currently unavailable. Please try again later.",
            details: "OpenAI API configuration issue"
          });
        } else {
          res.status(500).json({ 
            error: "Failed to generate names. Please try again.",
            details: error.message
          });
        }
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

app.post("/api/generate-logo", async (req, res) => {
    try {
      console.log("Received generate-logo request:", req.body);
      const { brandName, style, industry, isMore } = req.body;

      if (!brandName || !style || !industry) {
        throw new Error("Brand name, style, and industry are required");
      }

      const numberOfLogos = 15; // Increased to generate 15 logos at once
      const currentLogos = isMore ? (req.body.currentLogos || []) : [];
      const startIndex = currentLogos.length;

      console.log(`Generating ${numberOfLogos} logos for ${brandName}`);

      // Generate new logos using our SVG generator
      const newLogos = Array(numberOfLogos).fill(null).map(() =>
        generateSimpleLogo({ brandName, style, industry })
      );

      console.log(`Successfully generated ${newLogos.length} new logos`);

      const logos = isMore ? [...currentLogos, ...newLogos] : newLogos;
      res.json({ logos });
    } catch (error) {
      console.error("Error in generate-logo endpoint:", error);
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

      // Generate images using DALL-E for mood board
      const generatedImages = await Promise.all(
        moodBoard.imagePrompts.map(async (prompt) => {
          try {
            const result = await generateLogoWithDalle(name as string, prompt);
            return result.url;
          } catch (error) {
            console.error("Error generating image:", error);
            // Return a default image URL or pattern if DALL-E fails
            return '/placeholder-image.svg';
          }
        })
      );

      console.log("Generated images:", generatedImages.length);

      res.json({
        ...moodBoard,
        images: generatedImages
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

      const result = await generateSimpleLogo({ brandName: prompt, style, industry: ""}); //Assuming industry isn't needed here

      res.json({
        image: result
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

  app.post("/api/social-posts/generate", async (req, res) => {
    try {
      const { brandName, industry, style, platform, tone } = req.body;

      if (!brandName || !industry || !platform) {
        return res.status(400).json({
          error: "Missing required parameters",
          details: {
            brandName: !brandName ? "missing" : "present",
            industry: !industry ? "missing" : "present",
            platform: !platform ? "missing" : "present"
          }
        });
      }

      // Generate social media post content using OpenAI
      const prompt = `Create a ${tone || 'professional'} social media post for ${platform} for a ${industry} brand named "${brandName}". 
      The brand style is ${style || 'modern and professional'}. 
      Include:
      1. A creative and engaging caption
      2. Relevant hashtags
      3. A description of what the accompanying image should look like`;

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{
          role: "system",
          content: "You are a professional social media manager and brand strategist."
        }, {
          role: "user",
          content: prompt
        }],
        response_format: { type: "json_object" }
      }).catch(err => {
        console.error("OpenAI API error:", err);
        throw new Error("Failed to generate social media post. OpenAI API error.");
      });


      const content = JSON.parse(response.choices[0].message.content);

      // Generate an image for the post using DALL-E
      const imagePrompt = content.imageDescription;
      const imageResult = await generateLogoWithDalle(brandName, imagePrompt).catch(err => {
        console.error("DALL-E API error:", err);
        throw new Error("Failed to generate image. DALL-E API error.");
      });

      res.json({
        caption: content.caption,
        hashtags: content.hashtags,
        imageUrl: imageResult.url,
        platform
      });

    } catch (error) {
      console.error("Error generating social media post:", error);
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