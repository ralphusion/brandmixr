// Server-side implementation of icon service with professional icon libraries
import type { Typography } from './types';

export type IconStyle = 'modern' | 'classic' | 'minimal' | 'bold';

// Extended typography styles
const EXTENDED_TYPOGRAPHY = [
  { family: 'Playfair Display', weights: ['400', '500', '600', '700', '900'], styles: ['normal', 'italic'] },
  { family: 'Montserrat', weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], styles: ['normal', 'italic'] },
  { family: 'Roboto Slab', weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], styles: ['normal'] },
  { family: 'Poppins', weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], styles: ['normal', 'italic'] },
  { family: 'Raleway', weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], styles: ['normal', 'italic'] }
];

// Professional icon paths from various libraries
const PROFESSIONAL_ICONS = {
  technology: {
    modern: [
      'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', // Network
      'M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12', // Cursor
      'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', // Circuit
      'M13 2L3 14h9l-1 8 10-12h-9l1-8z', // Flash
      'M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9h-0.01', // Loading
      'M4 6h16M4 12h16M4 18h16', // Menu
    ],
    minimal: [
      'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', // Cube
      'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', // Circle
      'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', // Square
      'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', // Layers
    ]
  },
  business: {
    modern: [
      'M16 8v8M12 8v8M8 8v8M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', // Chart
      'M18 8a6 6 0 0 1-7.743 5.743L10 14l-2 1-6 3M6 16l2-1 1.367-.684', // Graph
      'M21 21H3v-7l9-9 9 9v7z M9 21v-6h6v6', // Building
      'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', // Network
    ],
    minimal: [
      'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', // Abstract
      'M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4', // Document
      'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5', // Forward
    ]
  },
  creative: {
    modern: [
      'M12 19l7-7 3 3-7 7-3-3z', // Pen
      'M20 7h-7m0 0V1h7a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2z', // Plugin
      'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z', // Star
    ],
    minimal: [
      'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z', // Eye
      'M12 19l7-7 3 3-7 7-3-3z', // Edit
      'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', // Box
    ]
  }
};

// Material Design icons (SVG paths)
const MATERIAL_ICONS = {
  technology: [
    'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z',
    'M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2zm-4 6H7V7h10v10z',
  ],
  business: [
    'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z',
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
  ],
  creative: [
    'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z',
  ]
};

// Keep track of used icons to prevent repetition
const usedIcons: { [key: string]: Set<string> } = {};

export const iconService = {
  getRandomFont(): Typography {
    return EXTENDED_TYPOGRAPHY[Math.floor(Math.random() * EXTENDED_TYPOGRAPHY.length)];
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

    const styleKey = Math.random() > 0.5 ? 'modern' : 'minimal';
    const availableIcons = PROFESSIONAL_ICONS[categoryKey][styleKey].filter(
      icon => !usedIcons[categoryKey].has(icon)
    );

    // If all icons have been used, reset the used icons set
    if (availableIcons.length === 0) {
      usedIcons[categoryKey].clear();
      return this.getRandomIcon(industry);
    }

    // Get a random unused icon
    const icon = availableIcons[Math.floor(Math.random() * availableIcons.length)];
    usedIcons[categoryKey].add(icon);

    return icon;
  },

  getMaterialIcon(industry: string): string {
    const normalizedIndustry = industry.toLowerCase();
    let categoryKey: keyof typeof MATERIAL_ICONS = 'technology';

    if (normalizedIndustry.includes('tech') || normalizedIndustry.includes('digital')) {
      categoryKey = 'technology';
    } else if (normalizedIndustry.includes('business') || normalizedIndustry.includes('finance')) {
      categoryKey = 'business';
    } else {
      categoryKey = 'creative';
    }

    return MATERIAL_ICONS[categoryKey][Math.floor(Math.random() * MATERIAL_ICONS[categoryKey].length)];
  }
};

export default iconService;