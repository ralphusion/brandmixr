import type { Typography, IconCategory, IconStyle } from './types';
import * as Icons from '@mui/icons-material';

class IconService {
  private static instance: IconService | null = null;
  private allMaterialIcons: string[] = [];
  private usedIcons = new Set<string>();
  private usedFontStyles = new Set<string>();

  private constructor() {
    // Defer heavy initialization until first use
  }

  public static getInstance(): IconService {
    if (!IconService.instance) {
      IconService.instance = new IconService();
    }
    return IconService.instance;
  }

  private initializeIfNeeded() {
    if (this.allMaterialIcons.length === 0) {
      console.log('Initializing IconService with Material Icons...');
      this.allMaterialIcons = Object.keys(Icons).filter(key => 
        typeof Icons[key as keyof typeof Icons] === 'function' &&
        key !== 'default' &&
        !key.startsWith('Create')
      );
      console.log(`Loaded ${this.allMaterialIcons.length} Material Icons`);
    }
  }

  private ICON_CATEGORIES = {
    technology: {
      modern: [
        'Computer', 'Laptop', 'Memory', 'Storage', 'Code', 'Terminal', 'Bug', 'Cloud',
        'CloudQueue', 'CloudUpload', 'CloudDownload', 'Database', 'DeveloperBoard',
        'SettingsApplications', 'PhoneIphone', 'DevicesOther', 'Router', 'Scanner'
      ],
      minimal: [
        'DeveloperMode', 'Api', 'Token', 'WebAsset', 'WebHook', 'Dns', 'Http', 'Functions',
        'Storage', 'Memory', 'Code', 'Terminal', 'CloudCircle', 'CloudDone', 'CloudSync'
      ]
    },
    business: {
      modern: [
        'Business', 'BusinessCenter', 'Work', 'WorkOutline', 'Assignment',
        'AssignmentTurnedIn', 'Description', 'Report', 'TrendingUp', 'PieChart',
        'BarChart', 'Timeline', 'AccountBalance', 'AccountBalanceWallet'
      ],
      minimal: [
        'Payment', 'CreditCard', 'Receipt', 'AccountBox', 'ContactMail', 'Contacts',
        'People', 'Group', 'Assessment', 'Analytics', 'ShowChart', 'Money'
      ]
    },
    creative: {
      modern: [
        'Palette', 'Brush', 'Edit', 'Create', 'ColorLens', 'Style', 'Format',
        'FormatPaint', 'ImageAspectRatio', 'Crop', 'FilterVintage', 'Camera'
      ],
      minimal: [
        'Image', 'PhotoCamera', 'Collections', 'Brightness', 'Contrast', 'Exposure',
        'Gradient', 'Opacity', 'PanoramaHorizontal', 'Transform', 'Tune'
      ]
    }
  };

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getFallbackIcon(): string {
    this.initializeIfNeeded();
    const randomIconName = this.getRandomElement(this.allMaterialIcons);
    const IconComponent = Icons[randomIconName as keyof typeof Icons];
    return IconComponent?.type?.render?.({ }).props?.children?.[0]?.props?.d || 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z';
  }

  private getIconPath(iconName: string): string {
    const IconComponent = Icons[iconName as keyof typeof Icons];
    if (!IconComponent) {
      console.warn(`Icon ${iconName} not found, using fallback`);
      return this.getFallbackIcon();
    }

    try {
      const renderedIcon = IconComponent?.type?.render?.({});
      const path = renderedIcon?.props?.children?.[0]?.props?.d;
      return path || this.getFallbackIcon();
    } catch (error) {
      console.warn(`Error extracting path for icon ${iconName}, using fallback`);
      return this.getFallbackIcon();
    }
  }

  public getRandomIcon(industry: string): string {
    this.initializeIfNeeded();
    const normalizedIndustry = industry.toLowerCase();
    let categoryKey: keyof typeof this.ICON_CATEGORIES = 'technology';

    if (normalizedIndustry.includes('tech') || normalizedIndustry.includes('digital')) {
      categoryKey = 'technology';
    } else if (normalizedIndustry.includes('business') || normalizedIndustry.includes('finance')) {
      categoryKey = 'business';
    } else {
      categoryKey = 'creative';
    }

    const category = this.ICON_CATEGORIES[categoryKey];
    const styleIcons = [...category.modern, ...category.minimal];
    const availableIcons = styleIcons.filter(icon => !this.usedIcons.has(icon));

    if (availableIcons.length === 0) {
      this.usedIcons.clear();
      return this.getRandomIcon(industry);
    }

    const iconName = this.getRandomElement(availableIcons);
    this.usedIcons.add(iconName);

    const path = this.getIconPath(iconName);
    return path || this.getFallbackIcon();
  }

  public getRandomFont(category?: string): Typography {
    const availableFonts = category
      ? TYPOGRAPHY_STYLES.filter(font => font.category === category)
      : TYPOGRAPHY_STYLES;

    const font = this.getRandomElement(availableFonts);
    const weight = this.getRandomElement(font.weights);
    const style = this.getRandomElement(font.styles);

    const fontStyle = `${font.family}-${weight}-${style}`;

    if (this.usedFontStyles.has(fontStyle)) {
      if (this.usedFontStyles.size >= TYPOGRAPHY_STYLES.length * 5) {
        this.usedFontStyles.clear();
      }
      return this.getRandomFont(category);
    }

    this.usedFontStyles.add(fontStyle);
    return { family: font.family, weights: [weight], styles: [style] };
  }

  public clearUsedCache() {
    this.usedIcons.clear();
    this.usedFontStyles.clear();
  }
}

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

export const iconService = IconService.getInstance();
export default iconService;