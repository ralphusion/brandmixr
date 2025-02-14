import { Router } from "express";
import { validateApiKey } from "../middleware/auth";
import { generateNames } from "../openai";
import { generateNameSchema } from "@shared/schema";
import { ZodError } from "zod";
import swagger from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";

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

export { router as apiRouter };
