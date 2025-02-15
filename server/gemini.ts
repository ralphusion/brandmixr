import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateLogoWithGemini(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/svg+xml",
          data: "", // Initial empty canvas
        },
      },
    ]);

    const response = await result.response;
    const imagePartBase64 = response.text();
    return `data:image/svg+xml;base64,${imagePartBase64}`;
  } catch (error) {
    console.error("Error generating logo with Gemini:", error);
    throw error;
  }
}

export function generateLogoPrompt(brandName: string, style: string, industry: string, variation: number): string {
  const basePrompt = `Create a professional standalone logo design for a ${industry.toLowerCase()} brand named "${brandName}". The logo should be in a ${style.toLowerCase()} style, delivered as a clean SVG file with a transparent background.`;

  const variations = [
    "Focus on creating a unique and memorable icon or symbol. Use minimal colors and shapes for maximum impact.",
    "Design an elegant typographic logo with creative letterforms. Ensure the text is clear and legible.",
    "Combine a distinctive symbol with modern typography. Keep the design balanced and professional.",
    "Create an abstract or geometric representation of the brand's essence. Make it bold and contemporary."
  ];

  return `${basePrompt} ${variations[variation % variations.length]} The output should be a raw SVG file without any mockups, frames, or additional elements.`;
}
