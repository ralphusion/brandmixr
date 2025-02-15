import type { LogoStyle } from '../../shared/types';
import { iconService } from '../lib/iconService';
import type { Typography } from '../lib/types';

interface LogoConfig {
  brandName: string;
  style: string;
  industry: string;
}

const DEFAULT_COLORS = {
  modern: {
    primary: ['#2196F3', '#00BCD4', '#3F51B5', '#009688', '#1976D2', '#0288D1'],
    secondary: ['#FF4081', '#FFC107', '#4CAF50', '#FF5722', '#F50057', '#00E5FF'],
    accent: ['#E91E63', '#FFEB3B', '#009688', '#673AB7', '#FF1744', '#00B0FF']
  },
  classic: {
    primary: ['#1976D2', '#0D47A1', '#2962FF', '#283593', '#1565C0', '#0277BD'],
    secondary: ['#D32F2F', '#FBC02D', '#388E3C', '#1565C0', '#C2185B', '#00838F'],
    accent: ['#C2185B', '#FFA000', '#00796B', '#311B92', '#D50000', '#006064']
  },
  minimal: {
    primary: ['#212121', '#424242', '#616161', '#757575', '#263238', '#37474F'],
    secondary: ['#757575', '#9E9E9E', '#BDBDBD', '#EEEEEE', '#B0BEC5', '#CFD8DC'],
    accent: ['#000000', '#FFFFFF', '#F5F5F5', '#FAFAFA', '#ECEFF1', '#455A64']
  },
  bold: {
    primary: ['#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#F50057', '#D500F9'],
    secondary: ['#00BCD4', '#FFEB3B', '#FF5722', '#795548', '#00B8D4', '#FFD600'],
    accent: ['#F50057', '#D500F9', '#651FFF', '#304FFE', '#00E5FF', '#FFEA00']
  }
};

function generatePastelColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 25 + Math.floor(Math.random() * 25);
  const lightness = 80 + Math.floor(Math.random() * 10);
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

  // Generate logo with better alignment and spacing
  const primary = getRandomElement(colors.primary);
  const accent = getRandomElement(colors.accent);
  const icon = iconService.getRandomIcon(industry);
  const weight = getRandomElement(font.weights);
  const styleAttr = getRandomElement(font.styles);

  // Create a horizontally aligned logo with proper spacing
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${accent};stop-opacity:1" />
        </linearGradient>
      </defs>
      <g transform="translate(30, 35)">
        <path d="${icon}" 
              fill="url(#grad1)" 
              transform="scale(2.5)" 
              stroke="${accent}" 
              stroke-width="0.5"
        />
        <text x="95" y="25" 
              font-family="${font.family}, Arial, sans-serif" 
              font-size="38"
              font-weight="${weight}"
              font-style="${styleAttr}"
              fill="${primary}"
              letter-spacing="0.02em"
              dominant-baseline="central">
              ${brandName}
        </text>
      </g>
    </svg>`;

  const base64 = Buffer.from(svgContent).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}