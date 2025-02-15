import type { Typography, IconCategory, IconStyle } from './types';
import axios from 'axios';

// Track used icons and fonts for the current session
const usedIcons = new Set<string>();
const usedFontStyles = new Set<string>();
const iconCache = new Map<string, string[]>();

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

async function fetchIconsFromSVGRepo(query: string): Promise<string[]> {
  try {
    const response = await axios.get('https://www.svgrepo.com/api/svgs', {
      params: {
        query,
        limit: 20,
        style: 'line',
      },
      headers: {
        'Accept': 'application/json',
      }
    });

    if (response.data && Array.isArray(response.data)) {
      return response.data.map(icon => {
        // Extract the path from the SVG content
        const pathMatch = icon.svg.match(/<path[^>]*d="([^"]*)"[^>]*>/);
        return pathMatch ? pathMatch[1] : null;
      }).filter(Boolean);
    }

    return [];
  } catch (error) {
    console.error('Error fetching icons from SVGRepo:', error);
    return [];
  }
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
    let searchQuery = normalizedIndustry;

    // Enhance search query based on industry
    if (normalizedIndustry.includes('tech')) {
      searchQuery = `${searchQuery} technology digital`;
    } else if (normalizedIndustry.includes('finance')) {
      searchQuery = `${searchQuery} business money`;
    }

    // Check cache first
    if (iconCache.has(searchQuery)) {
      const cachedIcons = iconCache.get(searchQuery)!;
      const availableIcons = cachedIcons.filter(icon => !usedIcons.has(icon));

      if (availableIcons.length > 0) {
        const icon = getRandomElement(availableIcons);
        usedIcons.add(icon);
        return icon;
      }
    }

    // Fetch new icons if not in cache or all used
    const icons = await fetchIconsFromSVGRepo(searchQuery);

    if (icons.length === 0) {
      // Return a default icon path if no icons found
      return "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z";
    }

    // Update cache
    iconCache.set(searchQuery, icons);

    // Get a random unused icon
    const icon = getRandomElement(icons);
    usedIcons.add(icon);

    return icon;
  },

  clearUsedCache() {
    usedIcons.clear();
    usedFontStyles.clear();
    iconCache.clear();
  }
};

export default iconService;