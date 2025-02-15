import type { LogoStyle } from '../../shared/types';
import { iconService } from '../lib/iconService';
import type { Typography } from '../lib/iconService';

interface LogoConfig {
  brandName: string;
  style: string;
  industry: string;
}

const DEFAULT_COLORS = {
  modern: {
    primary: ['#2196F3', '#00BCD4', '#3F51B5', '#009688'],
    secondary: ['#FF4081', '#FFC107', '#4CAF50', '#FF5722'],
    accent: ['#E91E63', '#FFEB3B', '#009688', '#673AB7']
  },
  classic: {
    primary: ['#1976D2', '#0D47A1', '#2962FF', '#283593'],
    secondary: ['#D32F2F', '#FBC02D', '#388E3C', '#1565C0'],
    accent: ['#C2185B', '#FFA000', '#00796B', '#311B92']
  },
  minimal: {
    primary: ['#212121', '#424242', '#616161', '#757575'],
    secondary: ['#757575', '#9E9E9E', '#BDBDBD', '#EEEEEE'],
    accent: ['#000000', '#FFFFFF', '#F5F5F5', '#FAFAFA']
  },
  bold: {
    primary: ['#E91E63', '#9C27B0', '#673AB7', '#3F51B5'],
    secondary: ['#00BCD4', '#FFEB3B', '#FF5722', '#795548'],
    accent: ['#F50057', '#D500F9', '#651FFF', '#304FFE']
  }
};

// Function to generate a pastel color
function generatePastelColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 25 + Math.floor(Math.random() * 25); // 25-50%
  const lightness = 80 + Math.floor(Math.random() * 10); // 80-90%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function mapStyleToLogoStyle(style: string): LogoStyle {
  const styleMap: { [key: string]: LogoStyle } = {
    modern: 'modern',
    classic: 'classic',
    minimal: 'minimal',
    bold: 'bold',
    professional: 'classic',
    playful: 'bold',
    elegant: 'minimal',
    tech: 'modern'
  };

  return styleMap[style.toLowerCase()] || 'modern';
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateSimpleLogo(config: LogoConfig): string {
  const { brandName, style, industry } = config;
  const logoStyle = mapStyleToLogoStyle(style);
  const colors = DEFAULT_COLORS[logoStyle];
  const font = iconService.getRandomFont();

  // Generate different logo variations
  const variations = [
    generateModernLogo(brandName, colors, industry, font),
    generateMinimalistLogo(brandName, colors, font),
    generateIconicLogo(brandName, colors, industry, font)
  ];

  const svgContent = variations[Math.floor(Math.random() * variations.length)];
  const base64 = Buffer.from(svgContent).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

function generateModernLogo(text: string, colors: any, industry: string, font: Typography): string {
  const primary = getRandomElement(colors.primary);
  const accent = getRandomElement(colors.accent);
  const icon = iconService.getRandomIcon(industry);
  const weight = getRandomElement(font.weights);
  const style = getRandomElement(font.styles);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${accent};stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d="${icon}" fill="url(#grad1)" transform="translate(50, 50) scale(2.5)" stroke="${accent}" stroke-width="0.5"/>
    <text x="180" y="130" 
          font-family="${font.family}, Arial, sans-serif" 
          font-size="42"
          font-weight="${weight}"
          font-style="${style}"
          fill="${primary}"
          letter-spacing="0.05em">
          ${text}
    </text>
  </svg>`;
}

function generateMinimalistLogo(text: string, colors: any, font: Typography): string {
  const primary = getRandomElement(colors.primary);
  const weight = getRandomElement(font.weights);
  const style = getRandomElement(font.styles);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
    <text x="50" y="110" 
          font-family="${font.family}, Arial, sans-serif" 
          font-size="48"
          font-weight="${weight}"
          font-style="${style}"
          fill="${primary}"
          letter-spacing="0.15em">
          ${text.toUpperCase()}
    </text>
  </svg>`;
}

function generateIconicLogo(text: string, colors: any, industry: string, font: Typography): string {
  const primary = getRandomElement(colors.primary);
  const accent = getRandomElement(colors.accent);
  const icon = iconService.getRandomIcon(industry);
  const weight = getRandomElement(font.weights);
  const style = getRandomElement(font.styles);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
    <defs>
      <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${accent};stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d="${icon}" fill="url(#grad4)" transform="translate(50, 50) scale(3)" stroke="${primary}" stroke-width="0.5"/>
    <text x="180" y="130" 
          font-family="${font.family}, Arial, sans-serif" 
          font-size="42"
          font-weight="${weight}"
          font-style="${style}"
          fill="${primary}"
          letter-spacing="0.1em">
          ${text}
    </text>
  </svg>`;
}