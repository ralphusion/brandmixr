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
    secondary: ['#FF4081', '#FFC107', '#4CAF50', '#FF5722', '#F50057', '#00E5FF']
  },
  minimalist: {
    primary: ['#212121', '#424242', '#616161', '#757575', '#263238', '#37474F'],
    secondary: ['#757575', '#9E9E9E', '#BDBDBD', '#EEEEEE', '#B0BEC5', '#CFD8DC']
  },
  playful: {
    primary: ['#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#F50057', '#D500F9'],
    secondary: ['#00BCD4', '#FFEB3B', '#FF5722', '#795548', '#00B8D4', '#FFD600']
  },
  luxury: {
    primary: ['#8D6E63', '#795548', '#6D4C41', '#5D4037', '#4E342E', '#3E2723'],
    secondary: ['#D4AF37', '#CFB53B', '#C5B358', '#B8860B', '#DAA520', '#CD853F']
  }
};

function mapStyleToLogoStyle(style: string): keyof typeof DEFAULT_COLORS {
  const styleMap: { [key: string]: keyof typeof DEFAULT_COLORS } = {
    minimalist: 'minimalist',
    modern: 'modern',
    playful: 'playful',
    luxury: 'luxury',
    tech: 'modern',
    organic: 'modern',
    vintage: 'luxury',
    abstract: 'playful'
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

  // Get icon path and colors
  const iconPath = iconService.getRandomIcon(industry);
  const primaryColor = getRandomElement(colors.primary);
  const secondaryColor = getRandomElement(colors.secondary);

  // Return the SVG path with styling
  return `
    <path 
      d="${iconPath}"
      fill="url(#gradient-${primaryColor.substring(1)})"
    />
    <defs>
      <linearGradient id="gradient-${primaryColor.substring(1)}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:0.8" />
      </linearGradient>
    </defs>
  `;
}