// Server-side implementation of icon service
// We'll use SVG path data directly instead of React components

export type Typography = {
  family: string;
  weights: string[];
  styles: string[];
};

// Extended typography styles
const EXTENDED_TYPOGRAPHY = [
  { family: 'Playfair Display', weights: ['400', '500', '600', '700', '900'], styles: ['normal', 'italic'] },
  { family: 'Montserrat', weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], styles: ['normal', 'italic'] },
  { family: 'Roboto Slab', weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], styles: ['normal'] },
  { family: 'Poppins', weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], styles: ['normal', 'italic'] },
  { family: 'Raleway', weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], styles: ['normal', 'italic'] }
];

// Pre-defined SVG paths for different industries
const INDUSTRY_ICONS = {
  technology: [
    'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',  // Network
    'M13 2L3 14h9l-1 8 10-12h-9l1-8z',  // Lightning
    'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',  // Cube
    'M18.31 6c-.628 2.59-2.782 4.5-5.31 4.5C10.472 10.5 8.318 8.59 7.69 6H4v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6h-1.69z',  // Database
    'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 17v.01 M12 13v.01 M12 9v.01',  // Server
    'M20 7h-7m0 0V1h7a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2z M13 7H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h7m0-6v6',  // Plugin
    'M9.25 9a6.5 6.5 0 0 1 13 0c0 3.5-2.5 6.5-6 7.5V22h-2v-5.5c-3.5-1-6-4-6-7.5z',  // Idea
    'M22 12h-4l-3 9L9 3l-3 9H2',  // Signal
  ],
  finance: [
    'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',  // Dollar
    'M2 8h20M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',  // Credit card
    'M16 8v8M12 8v8M8 8v8M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',  // Bank
    'M21 21H3v-7l9-9 9 9v7z M9 21v-6h6v6',  // Investment
    'M2 20h20v-8H2v8z M12 4v8 M8 8v4 M16 8v4',  // Chart
    'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z M8 8l-4-4 M8 8h8',  // Stats
  ],
  health: [
    'M8 2h8M12 2v6m-4 0h8M8 14h8M12 14v6M12 2v20M2 12h20',  // Medical cross
    'M7 10h2v4H7v-4z M15 10h2v4h-2v-4z M11 2h2v4h-2V2z M11 18h2v4h-2v-4z',  // Health monitoring
    'M12 2a3 3 0 0 0-3 3v7h6V5a3 3 0 0 0-3-3z',  // Medicine
    'M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M14.83 9.17l3.53-3.53',  // DNA
    'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z',  // Healthcare
    'M12 22c6.23-.05 11.25-7.3 11.25-13.5 0-2.08-.45-4.84-3-4.84-2.54 0-3.5 3.15-3.5 3.15s-.97-3.15-3.5-3.15c-2.55 0-3 2.76-3 4.84C10.25 14.7 15.27 21.95 21.5 22',  // Heart
  ],
  business: [
    'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',  // Business development
    'M18 8a6 6 0 0 1-7.743 5.743L10 14l-2 1-6 3M6 16l2-1 1.367-.684',  // Growth
    'M21 21H3v-7l9-9 9 9v7z M9 21v-6h6v6',  // Office building
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',  // Team
    'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',  // Strategy
    'M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4',  // Documents
    'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5',  // Meeting
    'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z',  // Target
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
    let categoryKey: string;

    // Match industry to closest category
    if (normalizedIndustry.includes('tech')) {
      categoryKey = 'technology';
    } else if (normalizedIndustry.includes('finan')) {
      categoryKey = 'finance';
    } else if (normalizedIndustry.includes('health')) {
      categoryKey = 'health';
    } else {
      categoryKey = 'business';
    }

    // Initialize set of used icons for this category if not exists
    if (!usedIcons[categoryKey]) {
      usedIcons[categoryKey] = new Set();
    }

    const availableIcons = INDUSTRY_ICONS[categoryKey].filter(
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
  }
};

export default iconService;