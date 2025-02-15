import type { Typography, IconCategory, IconStyle } from './types';
//import axios from 'axios'; // Removed as we are using local icons now.

// Track used fonts for the current session
const usedFontStyles = new Set<string>();

// Enhanced typography styles with design system fonts
const TYPOGRAPHY_STYLES = [
  { 
    family: 'Inter',
    weights: ['300', '400', '500', '600', '700'],
    styles: ['normal'],
    category: 'modern'
  },
  { 
    family: 'Montserrat',
    weights: ['300', '400', '500', '600', '700', '800'],
    styles: ['normal', 'italic'],
    category: 'elegant'
  },
  { 
    family: 'Source Code Pro',
    weights: ['400', '500', '600'],
    styles: ['normal'],
    category: 'tech'
  },
  { 
    family: 'DM Sans',
    weights: ['400', '500', '700'],
    styles: ['normal', 'italic'],
    category: 'minimal'
  },
  { 
    family: 'Work Sans',
    weights: ['300', '400', '500', '600', '700'],
    styles: ['normal'],
    category: 'business'
  }
];

// Predefined industry-specific icon paths
const INDUSTRY_ICONS = {
  technology: [
    "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",  // Circuit board
    "M21 12a9 9 0 11-18 0 9 9 0 0118 0z",  // Tech circle
    "M4 6h16M4 12h16M4 18h16",  // Menu bars
    "M13 10V3L4 14h7v7l9-11h-7z"  // Lightning bolt
  ],
  business: [
    "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h12",  // Building
    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v8m0 0v4m0-4h4m-4 0H8",  // Dollar sign
    "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7",  // Chart
    "M3 3h18v18H3V3z"  // Box
  ],
  creative: [
    "M21 12a9 9 0 11-18 0 9 9 0 0118 0z",  // Circle
    "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",  // Pencil
    "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",  // Image
    "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"  // Paint brush
  ]
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateUniqueFontStyle(category?: string): Typography {
  const availableFonts = category
    ? TYPOGRAPHY_STYLES.filter(font => font.category === category)
    : TYPOGRAPHY_STYLES;

  const font = getRandomElement(availableFonts);
  const weight = getRandomElement(font.weights);
  const style = getRandomElement(font.styles);

  const fontStyle = `${font.family}-${weight}-${style}`;

  if (usedFontStyles.has(fontStyle)) {
    if (usedFontStyles.size >= TYPOGRAPHY_STYLES.length * 5) {
      usedFontStyles.clear();
    }
    return generateUniqueFontStyle(category);
  }

  usedFontStyles.add(fontStyle);
  return { family: font.family, weights: [weight], styles: [style] };
}

export const iconService = {
  getRandomFont(category?: string): Typography {
    return generateUniqueFontStyle(category);
  },

  async getRandomIcon(industry: string): Promise<string> {
    const normalizedIndustry = industry.toLowerCase();
    let category: keyof typeof INDUSTRY_ICONS = 'technology';

    // Map industry to icon category
    if (normalizedIndustry.includes('tech') || normalizedIndustry.includes('software')) {
      category = 'technology';
    } else if (normalizedIndustry.includes('business') || normalizedIndustry.includes('finance')) {
      category = 'business';
    } else if (normalizedIndustry.includes('art') || normalizedIndustry.includes('design')) {
      category = 'creative';
    }

    // Get random icon path for the category
    const icons = INDUSTRY_ICONS[category];
    const icon = getRandomElement(icons);

    return icon;
  },

  clearUsedCache() {
    usedFontStyles.clear();
  }
};

export default iconService;