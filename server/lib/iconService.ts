// Server-side implementation of icon service with professional icon libraries
import type { Typography, IconCategory, IconStyle } from './types';

// High-quality icon paths from professional libraries
const PROFESSIONAL_ICONS = {
  technology: {
    modern: [
      // Phosphor Icons - Tech
      'M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2zm0 0v-7m14 7v-7M8 12h8M12 8v8', // Monitor
      'M13 2L3 14h9l-1 8 10-12h-9l1-8z', // Lightning
      'M12 2v6m0 4v6m-4-8h8M6 8l12 8M6 16l12-8', // Circuit
      'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z M12 8v8 M8 12h8', // Power
    ],
    tabler: [
      // Tabler Icons - Tech
      'M22 9L12 5 2 9l10 4 10-4v6', // Server
      'M3 12h4l3 8 4-16 3 8h4', // Signal
      'M11 7H6a2 2 0 0 0-2 2v9M20 14h-5a2 2 0 0 1-2-2V5', // Chip
      'M12 3v3M3.6 8.4l2.12 2.12M20.4 8.4l-2.12 2.12', // Process
    ],
    material: [
      // Material Icons - Tech
      'M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z', // Laptop
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z', // Help
      'M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z', // Server Stack
    ]
  },
  business: {
    modern: [
      // Phosphor Icons - Business
      'M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5zm0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2zm0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z', // Layers
      'M12 8V4m0 4L9 4m3 0l3-4M6 20h12M9 16v4m6-4v4', // Chart
      'M12 4a8 8 0 0 0-8 8h8zm0 0a8 8 0 0 1 8 8h-8zm0 0v16', // Stats
    ],
    remix: [
      // Remix Icons - Business
      'M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6h18zm0 2H3v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6zM6 14h8v3H6v-3z', // Briefcase
      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', // Star Rating
      'M3 4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4zm6 0v18M15 4v18', // Document
    ]
  },
  creative: {
    modern: [
      // Phosphor Icons - Creative
      'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z', // Pen
      'M7 21a4 4 0 0 1-4-4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H7z', // Canvas
      'M9.53 16.122a3 3 0 0 0-1.65 1.65l-1.243 2.796A1 1 0 0 0 7.9 22h8.2a1 1 0 0 0 1.262-1.432l-1.243-2.796a3 3 0 0 0-1.65-1.65l-2.469-.988a1 1 0 0 0-.742 0l-2.47.988z', // Paint
    ],
    tabler: [
      // Tabler Icons - Creative
      'M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z M8 12L16 12 M12 8L12 16', // Design Grid
      'M6.5 6.5L17.5 17.5M6.5 17.5L17.5 6.5M12 12L12 12.01', // Art Board
      'M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14', // Gallery
    ]
  }
};

// Keep track of used icons globally to prevent any repetition
const usedIcons = new Set<string>();

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

// Get all available icons for a category
function getAllIcons(categoryKey: keyof typeof PROFESSIONAL_ICONS): string[] {
  const category = PROFESSIONAL_ICONS[categoryKey];
  const allIcons: string[] = [];

  Object.values(category).forEach(styleIcons => {
    allIcons.push(...styleIcons);
  });

  return allIcons;
}

export const iconService = {
  getRandomFont(): Typography {
    return getRandomElement(EXTENDED_TYPOGRAPHY);
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

    // If all icons have been used, clear the used icons set and try again
    if (availableIcons.length === 0) {
      usedIcons.clear();
      return this.getRandomIcon(industry);
    }

    // Get a random unused icon
    const icon = getRandomElement(availableIcons);
    usedIcons.add(icon);

    return icon;
  },

  // Clear the used icons cache (useful for new generation sessions)
  clearUsedIcons() {
    usedIcons.clear();
  }
};

export default iconService;