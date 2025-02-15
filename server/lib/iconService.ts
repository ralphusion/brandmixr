import type { Typography, IconCategory, IconStyle } from './types';

// Google Material Icons pack - organized by categories with semantic meaning
const MATERIAL_ICONS = {
  technology: {
    modern: [
      'M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21v-2z', // Keyboard return
      'M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2V9c0-1.1-.9-2-2-2h-2V5c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v2H9V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v2H1c-1.1 0-2 .9-2 2v2h2v2H1v2c0 1.1.9 2 2 2h2v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h-2v-2h2z', // Memory
      'M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z', // Laptop
      'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z', // Security
    ],
    minimal: [
      'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z', // Cloud
      'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z', // Video Call
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z', // Help
    ]
  },
  business: {
    modern: [
      'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z', // Add Box
      'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z', // Dashboard
      'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z', // Payment
      'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z', // Work
    ],
    minimal: [
      'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z', // Credit Card
      'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z', // Trending Up
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z', // Money
    ]
  },
  creative: {
    modern: [
      'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z', // Edit
      'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z', // Palette
      'M18 4V3c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6h1v4H9v11c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-9h8V4h-3z', // Format Paint
    ],
    minimal: [
      'M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64s.78 4.11 2.34 5.67 3.61 2.35 5.66 2.35 4.1-.79 5.66-2.35S20 15.64 20 13.64 19.22 9.56 17.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z', // Lightbulb
      'M12 16c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0-2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', // Circles
      'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z', // Crop Square
    ]
  }
};

// Track used icons and fonts for the current session
const usedIcons = new Set<string>();
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

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getAllIcons(categoryKey: keyof typeof MATERIAL_ICONS): string[] {
  const category = MATERIAL_ICONS[categoryKey];
  const allIcons: string[] = [];

  Object.values(category).forEach(styleIcons => {
    allIcons.push(...styleIcons);
  });

  return allIcons;
}

function generateUniqueFontStyle(category?: string): Typography {
  // Filter fonts by category if provided
  const availableFonts = category
    ? TYPOGRAPHY_STYLES.filter(font => font.category === category)
    : TYPOGRAPHY_STYLES;

  const font = getRandomElement(availableFonts);
  const weight = getRandomElement(font.weights);
  const style = getRandomElement(font.styles);

  const fontStyle = `${font.family}-${weight}-${style}`;

  // If this combination is already used, try again with a different font
  if (usedFontStyles.has(fontStyle)) {
    // If all font styles are used, clear the set
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

  getRandomIcon(industry: string): string {
    const normalizedIndustry = industry.toLowerCase();
    let categoryKey: keyof typeof MATERIAL_ICONS = 'technology';

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

    // If all icons have been used, clear the set
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