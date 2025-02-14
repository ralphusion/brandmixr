import OpenAI from "openai";
import { type GenerateNameRequest } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
export async function generateNames(request: GenerateNameRequest): Promise<string[]> {
  const prompt = `Generate 5 creative brand names based on the following criteria:
Industry: ${request.industry}
Business Description: ${request.description}
Keywords: ${request.keywords.join(", ")}
Style: ${request.style}

Please respond with a JSON array of strings containing only the generated names.
Follow these style guidelines:
- Real Words: Use real words related to the context
- Alternate Spelling: Replace vowels/consonants but keep pronunciation
- Compound Words: Combine two words into one
- Brandable: Create unique memorable words
- Phrase: Use 2-4 word combinations

Format the response as: {"names": ["name1", "name2", "name3", "name4", "name5"]}`;

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