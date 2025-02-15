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
    // Updated API endpoint and parameters
    const response = await axios.get('https://www.svgrepo.com/api/vectors/', {
      params: {
        term: query,
        limit: 20,
        type: 'line'
      },
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.data && Array.isArray(response.data.vectors)) {
      return response.data.vectors.map((vector: any) => {
        const svg = vector.svg;
        // Extract the first path with a 'd' attribute
        const pathMatch = svg.match(/<path[^>]*\sd="([^"]+)"[^>]*>/);
        if (!pathMatch) return null;

        // Clean up the path data
        const pathData = pathMatch[1]
          .replace(/[\n\r\t]/g, '')  // Remove newlines and tabs
          .trim();

        return pathData;
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
      return "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z";
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