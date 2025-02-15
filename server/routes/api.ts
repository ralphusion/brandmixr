import { Router } from "express";
import { validateApiKey } from "../middleware/auth";
import { generateNames, generateApiKey } from "../openai"; // Added generateApiKey import
import { generateNameSchema, stylePresetSchema } from "@shared/schema";
import { ZodError } from "zod";
import swagger from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import { storage } from "../storage";

const router = Router();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Brand Name Generator API",
      version: "1.0.0",
      description: "API for generating brand names using AI",
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
    },
    security: [{ ApiKeyAuth: [] }],
  },
  apis: ["./server/routes/api.ts"],
};

const swaggerDocs = swagger(swaggerOptions);
router.use("/docs", serve, setup(swaggerDocs));

// Create a test API key if none exists
async function ensureTestApiKey() {
  try {
    const testKey = await generateApiKey("test", 1000);
    console.log("Test API key generated:", testKey);
    return testKey;
  } catch (error) {
    console.error("Error generating test API key:", error);
    throw error;
  }
}

// Call this when the router is created
ensureTestApiKey().catch(console.error);

/**
 * @swagger
 * /api/v1/generate:
 *   post:
 *     summary: Generate brand names
 *     description: Generate AI-powered brand names based on industry and other parameters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - industry
 *               - description
 *               - keywords
 *               - style
 *             properties:
 *               industry:
 *                 type: string
 *               description:
 *                 type: string
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *               style:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully generated brand names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.post("/v1/generate", validateApiKey, async (req, res) => {
  try {
    const data = generateNameSchema.parse(req.body);
    const names = await generateNames(data);
    res.json(names);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

/**
 * @swagger
 * /api/v1/style-presets:
 *   get:
 *     summary: Get all style presets
 *     description: Retrieve a list of all available style presets
 *     responses:
 *       200:
 *         description: List of style presets
 */
router.get("/v1/style-presets", validateApiKey, async (req, res) => {
  try {
    const presets = await storage.getStylePresets();
    res.json(presets);
  } catch (error) {
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

/**
 * @swagger
 * /api/v1/style-presets/{id}:
 *   get:
 *     summary: Get a specific style preset
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The style preset ID
 *     responses:
 *       200:
 *         description: Style preset found
 *       404:
 *         description: Style preset not found
 */
router.get("/v1/style-presets/:id", validateApiKey, async (req, res) => {
  try {
    const preset = await storage.getStylePreset(parseInt(req.params.id));
    if (!preset) {
      return res.status(404).json({ error: "Style preset not found" });
    }
    res.json(preset);
  } catch (error) {
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

/**
 * @swagger
 * /api/v1/style-presets:
 *   post:
 *     summary: Create a new style preset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - settings
 *     responses:
 *       201:
 *         description: Style preset created successfully
 */
router.post("/v1/style-presets", validateApiKey, async (req, res) => {
  try {
    const data = stylePresetSchema.parse(req.body);
    const preset = await storage.createStylePreset(data);
    res.status(201).json(preset);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

export { router as apiRouter };