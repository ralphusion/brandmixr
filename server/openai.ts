import OpenAI from "openai";
import { type GenerateNameRequest } from "@shared/schema";
import { db } from "./db";
import { apiKeys } from "@shared/schema";
import crypto from "crypto";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
export async function generateMoodBoard(
  brandName: string,
  industry: string,
  style: string
): Promise<{
  colors: Array<{ hex: string; name: string }>;
  keywords: string[];
  moodDescription: string;
  imagePrompts: string[];
}> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  const prompt = `Create a brand mood board for "${brandName}" in the ${industry} industry.
Please provide the following elements in JSON format:

1. A color palette (5 colors) that reflects the brand's personality
2. Keywords that capture the brand's essence (5-7 words)
3. A short mood description (2-3 sentences)
4. Image generation prompts (3 prompts) for DALL-E to create mood images

The brand style is: ${style}

Response format:
{
  "colors": [{"hex": "#......", "name": "color name"}],
  "keywords": ["word1", "word2", ...],
  "moodDescription": "description here",
  "imagePrompts": ["prompt1", "prompt2", "prompt3"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating mood board:', error);
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('OpenAI API key is invalid or not properly configured');
    }
    throw error;
  }
}

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
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  const styleGuide = {
    real: "Use real, meaningful words that relate directly to the industry and business description. Focus on clarity and relevance.",
    alternate: "Take real words and create unique spellings while keeping similar pronunciation (e.g., Lyft, Tumblr, Fiverr). Replace vowels or consonants creatively.",
    compound: "Combine two relevant words into one memorable name (e.g., Facebook, WordPress). Ensure the combination flows naturally.",
    brandable: "Create unique, memorable made-up words that sound professional and are easy to pronounce (e.g., Spotify, Google). They should feel modern and distinctive.",
    phrase: "Create short, catchy 2-4 word combinations that tell a story. Focus on rhythm and memorability.",
    auto: "Mix different styles to create a diverse set of names."
  }[request.style];

  try {
    const prompt = `Generate 50 creative brand names based on the following criteria:
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
Format the response as: {"names": ["name1", "name2", ..., "name50"]}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || '{"names": []}';
    const result = JSON.parse(content) as { names: string[] };
    return result.names;
  } catch (error) {
    console.error('Error generating names:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is invalid or not properly configured');
      }
      throw new Error(`Failed to generate names: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while generating names');
  }
}

export async function generateDescription(
  name: string,
  industry: string,
  description: string,
  keywords: string[]
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
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
  } catch (error) {
    console.error('Error generating description:', error);
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('OpenAI API key is invalid or not properly configured');
    }
    throw error;
  }
}



export interface FontRecommendation {
  primary: {
    family: string;
    weight: string;
    style: string;
  };
  secondary: {
    family: string;
    weight: string;
    style: string;
  };
  explanation: string;
}

export async function generateFontRecommendations(
  brandName: string,
  industry: string,
  style: string
): Promise<FontRecommendation[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const prompt = `Generate font combinations for the brand "${brandName}" in the ${industry} industry.
The brand style is: ${style}

Please provide 5 different font combinations in JSON format. Each combination should have:
1. A primary font (for headings and brand name)
2. A secondary font (for body text and supporting content)
3. A brief explanation of why this combination works well for the brand

Use web-safe fonts and Google Fonts. Include specific weights and styles.

Response format:
{
  "recommendations": [
    {
      "primary": {
        "family": "font name",
        "weight": "weight",
        "style": "normal/italic"
      },
      "secondary": {
        "family": "font name",
        "weight": "weight",
        "style": "normal/italic"
      },
      "explanation": "explanation text"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || '{"recommendations": []}';
    const result = JSON.parse(content);
    return result.recommendations;
  } catch (error) {
    console.error('Error generating font recommendations:', error);
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('OpenAI API key is invalid or not properly configured');
    }
    throw error;
  }
}