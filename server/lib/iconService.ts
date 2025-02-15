import type { Typography, IconCategory, IconStyle } from './types';

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

// Basic SVG paths for different industries
const INDUSTRY_ICONS = {
  technology: [
    'M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1zm2 3v8h6V4H4zm6-1v10h1V3H4V2h8v1h-2z', // Laptop
    'M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0zm-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z', // CPU
    'M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z' // Monitor
  ],
  business: [
    'M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z', // Briefcase
    'M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916l-7.5-5zM12.375 6v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1H.5z', // Building
    'M0 13.5A1.5 1.5 0 0 0 1.5 15h13a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 14.5 1h-13A1.5 1.5 0 0 0 0 2.5v11zm1 0V2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5z' // Graph box
  ],
  creative: [
    'M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z', // Brush
    'M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z', // Camera
    'M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' // Pencil
  ]
} as const;

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

    // Get random icon path from our predefined set
    const paths = INDUSTRY_ICONS[category];
    const path = getRandomElement(paths);

    // Return complete SVG with the selected path
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="${path}"/>
    </svg>`;
  },

  clearUsedCache() {
    usedFontStyles.clear();
  }
};

export default iconService;