// Server-side implementation of icon service with professional icon libraries
import type { Typography, IconCategory, IconStyle } from './types';

// High-quality icon paths from professional libraries
const PROFESSIONAL_ICONS = {
  technology: {
    modern: [
      // Phosphor Icons - Tech
      'M6.75 7.5l3.25 3.25-3.25 3.25m6.5 0h4m-10.5-12h12a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-12a1.5 1.5 0 0 1-1.5-1.5v-13a1.5 1.5 0 0 1 1.5-1.5Z', // Code
      'M12 8V4H8v4H4v4h4v4h4v-4h4V8h-4z', // Circuit
      'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M12 8v8 M8 12h8', // Power
      'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', // Network
    ],
    geometric: [
      // Remix Icons - Tech
      'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', // Circle
      'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z', // Square
      'M12 2L2 7l10 5 10-5-10-5z', // Triangle
      'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', // Cube
    ]
  },
  business: {
    modern: [
      // Tabler Icons - Business
      'M16 6l2 2v12H6V8l2-2m4 0h4M3 3l18 18M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z', // Analytics
      'M3 3h18v18H3V3zm4 4h10v10H7V7z', // Business Chart
      'M20 7h-4V3h4v4zm-4 4h4v4h-4v-4zm0 8v-4h4v4h-4z', // Growth
      'M12 3v3M3.6 8.4l2.12 2.12M20.4 8.4l-2.12 2.12', // Target
    ],
    minimal: [
      // Material Icons - Business
      'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z', // Document
      'M21 18v-2H3v2h18zm0-5v-2H3v2h18zm0-5V6H3v2h18z', // Menu
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z', // Progress
    ]
  },
  creative: {
    modern: [
      // Phosphor Icons - Creative
      'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z', // Pen
      'M7 21a4 4 0 0 1-4-4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H7z', // Canvas
      'M12 15v3m0 0v3m0-3h3m-3 0H9m3-3V9m0 0V6m0 3h3m-3 0H9', // Star
      'M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14', // Design
    ],
    abstract: [
      // Remix Icons - Creative
      'M21.47 4.35l-1.34-.56v9.03l2.43-5.86c.41-1.02-.06-2.19-1.09-2.61z', // Paint
      'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', // Circle Art
      'M19.071 4.929a10 10 0 0 0-14.142 0 10 10 0 0 0 0 14.142 10 10 0 0 0 14.142 0 10 10 0 0 0 0-14.142z', // Pattern
    ]
  }
};

// Keep track of used icons to prevent repetition
const usedIcons: { [key: string]: Set<string> } = {};

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

    // Initialize set of used icons for this category if not exists
    if (!usedIcons[categoryKey]) {
      usedIcons[categoryKey] = new Set();
    }

    const styleKey = Math.random() > 0.5 ? 'modern' : (Math.random() > 0.5 ? 'geometric' : 'abstract');
    const iconSet = PROFESSIONAL_ICONS[categoryKey][styleKey as keyof (typeof PROFESSIONAL_ICONS)[typeof categoryKey]] || PROFESSIONAL_ICONS[categoryKey].modern;

    const availableIcons = iconSet.filter(
      icon => !usedIcons[categoryKey].has(icon)
    );

    // If all icons have been used, reset the used icons set
    if (availableIcons.length === 0) {
      usedIcons[categoryKey].clear();
      return this.getRandomIcon(industry);
    }

    // Get a random unused icon
    const icon = getRandomElement(availableIcons);
    usedIcons[categoryKey].add(icon);

    return icon;
  }
};

export default iconService;