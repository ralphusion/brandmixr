import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const BASE_SVG_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <rect width="100%" height="100%" fill="white"/>
</svg>`;

export async function generateLogoWithGemini(prompt: string): Promise<string> {
  try {
    console.log("Generating logo with prompt:", prompt);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: "image/svg+xml",
              data: Buffer.from(BASE_SVG_TEMPLATE).toString('base64')
            }
          }
        ]
      }
    ]);

    const response = await result.response;
    const imagePartBase64 = response.text();
    console.log("Generated logo response:", imagePartBase64.substring(0, 100) + "...");
    return `data:image/svg+xml;base64,${Buffer.from(imagePartBase64).toString('base64')}`;
  } catch (error) {
    console.error("Error in generateLogoWithGemini:", error);
    throw new Error(`Failed to generate logo: ${error.message}`);
  }
}

export function generateLogoPrompt(brandName: string, style: string, industry: string, variation: number): string {
  const basePrompt = `Create a professional vector logo design for a ${industry.toLowerCase()} brand named "${brandName}". The logo should be in a ${style.toLowerCase()} style, delivered as a clean SVG file with a transparent background.`;

  const variations = [
    "Focus on creating a unique and memorable icon or symbol. Use minimal colors and shapes for maximum impact. The design should be clean and scalable.",
    "Design an elegant typographic logo with creative letterforms. Ensure the text is clear and legible at all sizes.",
    "Combine a distinctive symbol with modern typography. Keep the design balanced and professional. Make it suitable for both digital and print use.",
    "Create an abstract or geometric representation of the brand's essence. Make it bold and contemporary. Ensure it works well in monochrome."
  ];

  return `${basePrompt} ${variations[variation % variations.length]} The output should be a raw SVG file without any mockups, frames, or additional elements.`;
}