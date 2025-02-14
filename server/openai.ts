import OpenAI from "openai";
import { type GenerateNameRequest } from "@shared/schema";
import { db } from "./db";
import { apiKeys } from "@shared/schema";
import crypto from "crypto";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateApiKey(name: string, rateLimit: number = 100): Promise<string> {
  const key = `bng_${crypto.randomBytes(32).toString('hex')}`;
  const [apiKey] = await db.insert(apiKeys)
    .values({
      key,
      name,
      rateLimit,
      usageCount: 0
    })
    .returning();
  return apiKey.key;
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
export async function generateNames(request: GenerateNameRequest): Promise<string[]> {
  const styleGuide = {
    real: "Use real, meaningful words that relate directly to the industry and business description. Focus on clarity and relevance.",
    alternate: "Take real words and create unique spellings while keeping similar pronunciation (e.g., Lyft, Tumblr, Fiverr). Replace vowels or consonants creatively.",
    compound: "Combine two relevant words into one memorable name (e.g., Facebook, WordPress). Ensure the combination flows naturally.",
    brandable: "Create unique, memorable made-up words that sound professional and are easy to pronounce (e.g., Spotify, Google). They should feel modern and distinctive.",
    phrase: "Create short, catchy 2-4 word combinations that tell a story. Focus on rhythm and memorability.",
    auto: "Mix different styles to create a diverse set of names."
  }[request.style];

  const prompt = `Generate 20 creative brand names based on the following criteria:
Industry: ${request.industry}
Business Description: ${request.description}
Keywords: ${request.keywords.join(", ")}
Style Guide: ${styleGuide}

Create names that are:
- Memorable and easy to pronounce
- Relevant to the business and industry
- Suitable for a professional brand
- Unique and distinctive
- Available as a domain name (avoid common words)

For the selected style "${request.style}", follow these specific guidelines:
${styleGuide}

Please respond with a JSON array of strings containing only the generated names.
Format the response as: {"names": ["name1", "name2", ..., "name20"]}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  // Ensure content is not null before parsing
  const content = response.choices[0].message.content || '{"names": []}';
  const result = JSON.parse(content) as { names: string[] };
  return result.names;
}

export async function generateDescription(
  name: string,
  industry: string,
  description: string,
  keywords: string[]
): Promise<string> {
  const prompt = `Generate a compelling brand description for a business with the following details:

Brand Name: ${name}
Industry: ${industry}
Business Description: ${description}
Keywords: ${keywords.join(", ")}

Create a description that:
1. Explains why the name is perfect for the brand
2. Connects the name to the industry and business purpose
3. Highlights the brand's potential identity and values
4. Is concise but engaging (2-3 sentences)

Please respond with just the description text, no JSON formatting needed.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content || "Description not available.";
}