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
    'M12 18h.01M8 6h8l6 6v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z M12 12v.01',  // Document
    'M20 7h-7m0 0V1h7a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2z M13 7H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h7m0-6v6m0 0v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-6h-6z',  // Plugin
    'M9.25 9a6.5 6.5 0 0 1 13 0c0 3.5-2.5 6.5-6 7.5V22h-2v-5.5c-3.5-1-6-4-6-7.5z M9 2v4M4 4h10',  // Idea
  ],
  finance: [
    'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',  // Dollar
    'M2 8h20M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',  // Credit card
    'M16 8v8M12 8v8M8 8v8M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',  // Bank
  ],
  health: [
    'M8 2h8M12 2v6m-4 0h8M8 14h8M12 14v6M12 2v20M2 12h20',  // Medical cross
    'M7 10h2v4H7v-4z M15 10h2v4h-2v-4z M11 2h2v4h-2V2z M11 18h2v4h-2v-4z',  // Health monitoring
    'M12 2a3 3 0 0 0-3 3v7h6V5a3 3 0 0 0-3-3z',  // Medicine
  ],
  education: [
    'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',  // Book
    'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',  // Graduation cap
    'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 14.5A2.5 2.5 0 0 1 6.5 12H20',  // Lines
  ],
  food: [
    'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z',  // Coffee
    'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78',  // Chef hat
    'M12 20h9M3 20h3M12 4v16',  // Fork and knife
  ],
  fashion: [
    'M12 2l-8 8v12h16V10l-8-8z',  // T-shirt
    'M16.5 16l-4.5-4.5L7.5 16M12 2v14',  // Hanger
    'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z M9 12h6',  // Button
  ],
  business: [
    'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',  // Briefcase
    'M18 8a6 6 0 0 1-7.743 5.743L10 14l-2 1-6 3M6 16l2-1 1.367-.684',  // Graph
    'M21 21H3v-7l9-9 9 9v7z M9 21v-6h6v6',  // Building
  ]
};

export const iconService = {
  getRandomFont(): Typography {
    return EXTENDED_TYPOGRAPHY[Math.floor(Math.random() * EXTENDED_TYPOGRAPHY.length)];
  },

  getRandomIcon(industry: string): string {
    const normalizedIndustry = industry.toLowerCase();
    let icons = [];

    // Match industry to closest category
    if (normalizedIndustry.includes('tech')) {
      icons = INDUSTRY_ICONS.technology;
    } else if (normalizedIndustry.includes('finan')) {
      icons = INDUSTRY_ICONS.finance;
    } else if (normalizedIndustry.includes('health')) {
      icons = INDUSTRY_ICONS.healthcare;
    } else if (normalizedIndustry.includes('edu')) {
      icons = INDUSTRY_ICONS.education;
    } else if (normalizedIndustry.includes('food')) {
      icons = INDUSTRY_ICONS.food;
    } else if (normalizedIndustry.includes('fashion')) {
      icons = INDUSTRY_ICONS.fashion;
    } else {
      icons = INDUSTRY_ICONS.business;
    }

    return icons[Math.floor(Math.random() * icons.length)] || INDUSTRY_ICONS.business[0];
  }
};

export default iconService;