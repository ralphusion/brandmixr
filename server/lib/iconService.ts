import type { Typography, IconCategory, IconStyle } from './types';

// High-quality Phosphor icon paths for different categories
const PROFESSIONAL_ICONS = {
  technology: {
    modern: [
      'M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5zm2-2v4m12-4v4M6 9h12M6 13h12M6 17h12', // Browser
      'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', // Network
      'M13 2L3 14h9l-1 8 10-12h-9l1-8z', // Lightning Bolt
      'M12 2v6m0 4v6m-4-8h8M6 8l12 8M6 16l12-8', // Circuit
      'M15.75 8.25L19.5 12l-3.75 3.75M8.25 8.25L4.5 12l3.75 3.75M13.5 4.5L10.5 19.5', // Code
      'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z M12 8v8 M8 12h8', // Power
      'M4 6h16M4 12h16M4 18h16', // Menu Lines
      'M12.75 3h7.5v7.5M20.25 3L9 14.25M9 3h6', // Arrow Square Out
    ],
    minimal: [
      'M12 7v10m0-10H8m4 0h4m-4 10H8m4 0h4M6 21h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3z', // Microchip
      'M9 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h5M15 3h5a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-5M12 3v18', // Columns
      'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', // Circle
      'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', // Square
    ]
  },
  business: {
    modern: [
      'M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5zm0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z', // Stack
      'M12 8V4m0 4L9 4m3 0l3-4M6 20h12M9 16v4m6-4v4', // Chart Line Up
      'M12 4a8 8 0 0 0-8 8h8zm0 0a8 8 0 0 1 8 8h-8zm0 0v16', // Stats
      'M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', // Package
      'M12 8c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z', // Target
    ],
    minimal: [
      'M3 12h4l3 8 4-16 3 8h4', // Trend Up
      'M12 2v20M2 12h20', // Plus
      'M3 3h18v18H3V3zm4 4h10v10H7V7z', // Square Half
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', // Circle Half
    ]
  },
  creative: {
    modern: [
      'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z', // Pen Nib
      'M7 21a4 4 0 0 1-4-4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H7z', // Canvas
      'M9.53 16.122a3 3 0 0 0-1.65 1.65l-1.243 2.796A1 1 0 0 0 7.9 22h8.2a1 1 0 0 0 1.262-1.432l-1.243-2.796a3 3 0 0 0-1.65-1.65l-2.469-.988a1 1 0 0 0-.742 0l-2.47.988z', // Paint Brush
      'M20.66 3.34a3.89 3.89 0 0 0-5.5 0l-8.5 8.5a3.89 3.89 0 0 0 0 5.5l2.83 2.83a3.89 3.89 0 0 0 5.5 0l8.5-8.5a3.89 3.89 0 0 0 0-5.5l-2.83-2.83z', // Palette
    ],
    minimal: [
      'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z', // Eye
      'M12 19l7-7 3 3-7 7-3-3z', // Edit
      'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z', // Magic Wand
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', // Circle Dots
    ]
  }
};

// Keep track of used icons and fonts globally for the current session
const usedIcons = new Set<string>();
const usedFontStyles = new Set<string>();

// High-quality typography styles
const EXTENDED_TYPOGRAPHY = [
  { family: 'Playfair Display', weights: ['400', '500', '600', '700', '900'], styles: ['normal', 'italic'] },
  { family: 'Montserrat', weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], styles: ['normal', 'italic'] },
  { family: 'Roboto Slab', weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], styles: ['normal'] },
  { family: 'Poppins', weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], styles: ['normal', 'italic'] },
  { family: 'Raleway', weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], styles: ['normal', 'italic'] }
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getAllIcons(categoryKey: keyof typeof PROFESSIONAL_ICONS): string[] {
  const category = PROFESSIONAL_ICONS[categoryKey];
  const allIcons: string[] = [];

  Object.values(category).forEach(styleIcons => {
    allIcons.push(...styleIcons);
  });

  return allIcons;
}

function generateUniqueFontStyle(): Typography {
  const font = getRandomElement(EXTENDED_TYPOGRAPHY);
  const weight = getRandomElement(font.weights);
  const style = getRandomElement(font.styles);

  const fontStyle = `${font.family}-${weight}-${style}`;

  // If this combination is already used, try again
  if (usedFontStyles.has(fontStyle)) {
    // If all font styles are used, clear the set
    if (usedFontStyles.size >= EXTENDED_TYPOGRAPHY.length * 5) { // Approximate max combinations
      usedFontStyles.clear();
    }
    return generateUniqueFontStyle();
  }

  usedFontStyles.add(fontStyle);
  return { family: font.family, weights: [weight], styles: [style] };
}

export const iconService = {
  getRandomFont(): Typography {
    return generateUniqueFontStyle();
  },

  getRandomIcon(industry: string): string {
    const normalizedIndustry = industry.toLowerCase();
    let categoryKey: keyof typeof PROFESSIONAL_ICONS = 'technology';

    // Match industry to closest category
    if (normalizedIndustry.includes('tech') || normalizedIndustry.includes('digital')) {
      categoryKey = 'technology';
    } else if (normalizedIndustry.includes('business') || normalizedIndustry.includes('finance')) {
      categoryKey = 'business';
    } else {
      categoryKey = 'creative';
    }

    // Get all available icons for this category
    const allIcons = getAllIcons(categoryKey);

    // Filter out already used icons
    const availableIcons = allIcons.filter(icon => !usedIcons.has(icon));

    // If all icons have been used, clear the used icons set
    if (availableIcons.length === 0) {
      usedIcons.clear();
      return this.getRandomIcon(industry);
    }

    // Get a random unused icon
    const icon = getRandomElement(availableIcons);
    usedIcons.add(icon);

    return icon;
  },

  // Clear the used icons and font styles cache (useful for new generation sessions)
  clearUsedCache() {
    usedIcons.clear();
    usedFontStyles.clear();
  }
};

export default iconService;