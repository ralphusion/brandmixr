import type { LogoStyle } from '../../shared/types';
import { iconService } from '../lib/iconService';

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

export async function generateSimpleLogo(config: LogoConfig): Promise<string> {
  const { brandName, style, industry } = config;
  const logoStyle = mapStyleToLogoStyle(style);
  const colors = DEFAULT_COLORS[logoStyle];

  try {
    const iconSvg = await iconService.getRandomIcon(industry);
    const primaryColor = getRandomElement(colors.primary);
    const accentColor = getRandomElement(colors.accent);

    // Extract the path from the icon SVG
    const pathMatch = iconSvg.match(/<path[^>]*\sd="([^"]+)"[^>]*>/);
    if (!pathMatch) {
      console.error('No path found in icon SVG:', iconSvg);
      throw new Error('Invalid icon SVG format');
    }

    const pathData = pathMatch[1];

    return `
      <path 
        d="${pathData}"
        fill="url(#gradient-${primaryColor.substring(1)})"
      />
      <defs>
        <linearGradient id="gradient-${primaryColor.substring(1)}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.8" />
        </linearGradient>
      </defs>
    `;
  } catch (error) {
    console.error('Error generating logo:', error);
    const primaryColor = getRandomElement(colors.primary);
    const accentColor = getRandomElement(colors.accent);

    // Fallback to a simple circle if icon generation fails
    return `
      <path 
        d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z"
        fill="url(#gradient-${primaryColor.substring(1)})"
      />
      <defs>
        <linearGradient id="gradient-${primaryColor.substring(1)}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.8" />
        </linearGradient>
      </defs>
    `;
  }
}

const TEXT_EFFECTS = {
  modern: {
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontVariationSettings: "'wght' 600"
  },
  classic: {
    letterSpacing: '0.02em',
    fontStyle: 'italic',
    fontVariationSettings: "'wght' 500"
  },
  minimal: {
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontVariationSettings: "'wght' 300"
  },
  bold: {
    letterSpacing: '0.03em',
    fontVariationSettings: "'wght' 800"
  }
};