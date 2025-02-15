import { createCanvas } from 'canvas';
import TextToSVG from 'text-to-svg';
import * as opentype from 'opentype.js';
import { Typography } from './types';
import { promisify } from 'util';
import path from 'path';

interface FontFeatures {
  ligatures?: boolean;
  styleSet?: number;
  swashes?: boolean;
  alternates?: boolean;
  kerning?: boolean;
}

interface TextShapingOptions {
  font: Typography;
  text: string;
  features?: FontFeatures;
  fontSize?: number;
  letterSpacing?: number;
}

class TypographyService {
  private static instance: TypographyService | null = null;
  private textToSVG: typeof TextToSVG | null = null;
  private initialized: boolean = false;

  private constructor() {
    // Defer initialization until first use
  }

  public static getInstance(): TypographyService {
    if (!TypographyService.instance) {
      TypographyService.instance = new TypographyService();
    }
    return TypographyService.instance;
  }

  private async initialize() {
    if (!this.initialized) {
      console.log('Initializing TypographyService...');
      this.textToSVG = TextToSVG;
      this.initialized = true;
      console.log('TypographyService initialized');
    }
  }

  async loadFont(fontFamily: string): Promise<TextToSVG> {
    await this.initialize();
    if (!this.textToSVG) {
      throw new Error('TypographyService not initialized');
    }

    const fontPath = path.join('/usr/share/fonts/truetype', `${fontFamily.toLowerCase().replace(/\s+/g, '-')}.ttf`);
    return new Promise((resolve, reject) => {
      this.textToSVG!.load(fontPath, (err: Error | null, textToSVG?: TextToSVG) => {
        if (err) reject(err);
        else if (textToSVG) resolve(textToSVG);
        else reject(new Error('Failed to load font'));
      });
    });
  }

  async shapeText(options: TextShapingOptions): Promise<string> {
    const { font, text, fontSize = 42, letterSpacing = 0 } = options;

    try {
      const textToSVG = await this.loadFont(font.family);

      const attributes = {
        fill: 'currentColor',
        stroke: 'none'
      };

      const textOptions = {
        x: 0,
        y: 0,
        fontSize,
        kerning: true,
        letterSpacing,
        anchor: 'left top',
        attributes
      };

      const svgPath = textToSVG.getPath(text, textOptions);
      return svgPath;
    } catch (error) {
      console.error('Error shaping text:', error);
      // Return a basic text path as fallback
      const canvas = createCanvas(fontSize * text.length, fontSize * 1.5);
      const ctx = canvas.getContext('2d');
      ctx.font = `${fontSize}px ${font.family}`;
      ctx.fillText(text, 0, fontSize);
      return `<path d="M0,${fontSize} L${fontSize * text.length},${fontSize}"/>`;
    }
  }

  generateDynamicTypography(text: string, style: 'modern' | 'classic' | 'playful' | 'elegant'): FontFeatures {
    const features: FontFeatures = {
      ligatures: true,
      kerning: true,
    };

    switch (style) {
      case 'modern':
        features.styleSet = 1;
        features.alternates = true;
        break;
      case 'classic':
        features.swashes = true;
        features.styleSet = 2;
        break;
      case 'playful':
        features.alternates = true;
        features.styleSet = 3;
        break;
      case 'elegant':
        features.swashes = true;
        features.ligatures = true;
        features.styleSet = 4;
        break;
    }

    return features;
  }
}

export const typographyService = TypographyService.getInstance();
export default typographyService;