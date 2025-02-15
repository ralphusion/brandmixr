import { createCanvas } from 'canvas';
import * as HB from 'node-harfbuzz';
import * as opentype from 'opentype.js';
import { Typography } from './types';

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

export class TypographyService {
  private static instance: TypographyService;
  private hb: typeof HB;

  private constructor() {
    this.hb = require('node-harfbuzz');
  }

  public static getInstance(): TypographyService {
    if (!TypographyService.instance) {
      TypographyService.instance = new TypographyService();
    }
    return TypographyService.instance;
  }

  async shapeText(options: TextShapingOptions): Promise<string> {
    const { font, text, features = {}, fontSize = 42, letterSpacing = 0 } = options;

    // Create font face with OpenType.js
    const fontPath = `/usr/share/fonts/truetype/${font.family.toLowerCase().replace(/\s+/g, '-')}.ttf`;
    const fontData = await opentype.load(fontPath);

    // Create HarfBuzz buffer
    const buffer = this.hb.createBuffer();
    buffer.addText(text);
    buffer.guessSegmentProperties();

    // Set up font features
    const fontFeatures = [
      features.ligatures ? '+liga' : '-liga',
      features.swashes ? '+swsh' : '-swsh',
      features.alternates ? '+salt' : '-salt',
      features.kerning ? '+kern' : '-kern',
    ];

    if (features.styleSet && features.styleSet > 0) {
      fontFeatures.push(`+ss${String(features.styleSet).padStart(2, '0')}`);
    }

    // Shape the text
    const hbFont = this.hb.createFace(fontData.arrayBuffer, 0);
    this.hb.shape(hbFont, buffer, fontFeatures);

    // Get glyph positions and generate SVG path
    const glyphPositions = buffer.getGlyphPositions();
    const glyphInfos = buffer.getGlyphInfos();
    
    let svgPath = '';
    let xOffset = 0;

    for (let i = 0; i < glyphInfos.length; i++) {
      const glyph = fontData.glyphs.get(glyphInfos[i].codepoint);
      const position = glyphPositions[i];
      
      // Scale the glyph path to fontSize
      const scale = fontSize / fontData.unitsPerEm;
      const glyphPath = glyph.path.toPathData(scale);
      
      // Add letter spacing
      xOffset += position.xAdvance * scale + letterSpacing;
      
      // Transform the path to the correct position
      svgPath += `<path transform="translate(${xOffset},0)" d="${glyphPath}"/>`;
    }

    return svgPath;
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
