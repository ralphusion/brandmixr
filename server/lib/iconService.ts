import type { Typography, IconCategory, IconStyle } from './types';
import * as MaterialIcons from '@mui/icons-material';
import * as PhosphorIcons from '@phosphor-icons/react';
import * as LucideIcons from 'lucide-react';
import * as TablerIcons from '@tabler/icons-react';
import * as RemixIcons from '@remixicon/react';
import { IconContext } from 'react-icons';

class IconService {
  private static instance: IconService | null = null;
  private materialIcons: string[] = [];
  private phosphorIcons: string[] = [];
  private lucideIcons: string[] = [];
  private tablerIcons: string[] = [];
  private remixIcons: string[] = [];
  private initialized: boolean = false;

  private constructor() {
    // Initialize immediately to count icons
    this.initializeIfNeeded();
  }

  public static getInstance(): IconService {
    if (!IconService.instance) {
      IconService.instance = new IconService();
    }
    return IconService.instance;
  }

  private initializeIfNeeded() {
    if (!this.initialized) {
      console.log('Initializing IconService with multiple icon libraries...');

      // Initialize Material Icons
      this.materialIcons = Object.keys(MaterialIcons).filter(key =>
        typeof MaterialIcons[key as keyof typeof MaterialIcons] === 'function' &&
        key !== 'default' &&
        !key.startsWith('Create')
      );
      console.log(`Material Icons available: ${this.materialIcons.length}`);

      // Initialize Phosphor Icons
      this.phosphorIcons = Object.keys(PhosphorIcons).filter(key =>
        typeof PhosphorIcons[key as keyof typeof PhosphorIcons] === 'function' &&
        key !== 'default' &&
        !key.includes('Logo')
      );
      console.log(`Phosphor Icons available: ${this.phosphorIcons.length}`);

      // Initialize Lucide Icons
      this.lucideIcons = Object.keys(LucideIcons).filter(key =>
        typeof LucideIcons[key as keyof typeof LucideIcons] === 'function' &&
        key !== 'default'
      );
      console.log(`Lucide Icons available: ${this.lucideIcons.length}`);

      // Initialize Tabler Icons
      this.tablerIcons = Object.keys(TablerIcons).filter(key =>
        typeof TablerIcons[key as keyof typeof TablerIcons] === 'function' &&
        key !== 'default'
      );
      console.log(`Tabler Icons available: ${this.tablerIcons.length}`);

      // Initialize Remix Icons
      this.remixIcons = Object.keys(RemixIcons).filter(key =>
        typeof RemixIcons[key as keyof typeof RemixIcons] === 'function' &&
        key !== 'default'
      );
      console.log(`Remix Icons available: ${this.remixIcons.length}`);

      this.initialized = true;
      console.log('Total icons available:', 
        this.materialIcons.length +
        this.phosphorIcons.length +
        this.lucideIcons.length +
        this.tablerIcons.length +
        this.remixIcons.length
      );
    }
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private extractSvgPath(icon: any, library: 'material' | 'phosphor' | 'lucide' | 'tabler' | 'remix'): string | null {
    try {
      const element = icon({});

      switch (library) {
        case 'material':
          return element?.props?.children?.props?.d || 
                 element?.props?.children?.[0]?.props?.d;

        case 'phosphor':
        case 'lucide':
        case 'tabler':
        case 'remix':
          if (element?.props?.children?.type === 'path') {
            return element.props.children.props.d;
          }
          if (Array.isArray(element?.props?.children)) {
            const pathElement = element.props.children.find((child: any) => child?.type === 'path');
            return pathElement?.props?.d;
          }
          break;
      }

      return null;
    } catch (error) {
      console.error(`Error extracting SVG path from ${library} icon:`, error);
      return null;
    }
  }

  public getRandomIcon(industry: string): string {
    this.initializeIfNeeded();
    console.log('Generating random icon for industry:', industry);

    // Default icon path as fallback
    const defaultIconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z';

    try {
      // Randomly select an icon library
      const libraries = [
        { name: 'material', icons: this.materialIcons, module: MaterialIcons },
        { name: 'phosphor', icons: this.phosphorIcons, module: PhosphorIcons },
        { name: 'lucide', icons: this.lucideIcons, module: LucideIcons },
        { name: 'tabler', icons: this.tablerIcons, module: TablerIcons },
        { name: 'remix', icons: this.remixIcons, module: RemixIcons }
      ] as const;

      const library = this.getRandomElement(libraries);
      console.log(`Selected library: ${library.name} with ${library.icons.length} icons`);

      // Get a random icon name from the selected library
      const iconName = this.getRandomElement(library.icons);
      console.log('Selected icon:', iconName);

      // Get the icon component
      const IconComponent = library.module[iconName as keyof typeof library.module];
      if (!IconComponent) {
        console.warn('Icon component not found:', iconName);
        return defaultIconPath;
      }

      // Extract the SVG path
      const path = this.extractSvgPath(IconComponent, library.name);
      if (!path) {
        console.warn('Could not extract path from icon:', iconName);
        return defaultIconPath;
      }

      console.log('Successfully generated icon path');
      return path;
    } catch (error) {
      console.error('Error generating icon:', error);
      return defaultIconPath;
    }
  }

  public clearCache() {
    this.materialIcons = [];
    this.phosphorIcons = [];
    this.lucideIcons = [];
    this.tablerIcons = [];
    this.remixIcons = [];
    this.initialized = false;
    console.log('Icon cache cleared');
  }
}

export const iconService = IconService.getInstance();
export default iconService;

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