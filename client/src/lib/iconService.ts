import * as LucideIcons from 'lucide-react';
import * as TablerIcons from '@tabler/icons-react';
import * as PhosphorIcons from '@phosphor-icons/react';
import * as Remix from '@remixicon/react';
import { 
  FaRegular, 
  FaSolid, 
  FaBrands 
} from '@fortawesome/free-regular-svg-icons';
import { 
  BsCircle, 
  BsSquare, 
  BsTriangle,
  // Add more Bootstrap icons...
} from 'react-icons/bs';
import { 
  MdOutlineDesignServices,
  MdBranding,
  // Add more Material icons...
} from 'react-icons/md';
import { 
  BiAbstract,
  BiAtom,
  // Add more CSS.gg icons...
} from 'react-icons/bi';

// Google Fonts integration
const EXTENDED_TYPOGRAPHY = [
  { family: 'Abril Fatface', weights: ['400'], styles: ['normal'] },
  { family: 'Aclonica', weights: ['400'], styles: ['normal'] },
  { family: 'Adamina', weights: ['400'], styles: ['normal'] },
  { family: 'Alegreya', weights: ['400', '500', '700', '800', '900'], styles: ['normal', 'italic'] },
  { family: 'Alkalami', weights: ['400'], styles: ['normal'] },
  { family: 'Allura', weights: ['400'], styles: ['normal'] },
  { family: 'Amatic SC', weights: ['400', '700'], styles: ['normal'] },
  { family: 'Anonymous Pro', weights: ['400', '700'], styles: ['normal', 'italic'] },
  { family: 'Architects Daughter', weights: ['400'], styles: ['normal'] },
  { family: 'Archivo Black', weights: ['400'], styles: ['normal'] },
  // ... Add hundreds more fonts
];

// Industry-specific icon collections
const INDUSTRY_ICONS = {
  technology: [
    LucideIcons.Cpu,
    LucideIcons.Database,
    LucideIcons.Code,
    TablerIcons.BrandReact,
    PhosphorIcons.Robot,
    // Add hundreds more...
  ],
  fashion: [
    LucideIcons.Scissors,
    TablerIcons.Hanger,
    PhosphorIcons.TShirt,
    // Add hundreds more...
  ],
  food: [
    LucideIcons.Coffee,
    TablerIcons.Pizza,
    PhosphorIcons.Cookie,
    // Add hundreds more...
  ],
  // Add more industries with hundreds of icons each
};

// Convert React component to SVG path
function iconToSvgPath(Icon: any, options = {}): string {
  // Implementation to convert React icon component to SVG path string
  const svg = Icon.render ? Icon.render() : Icon;
  return extractPathFromSvg(svg);
}

export function getRandomFont(): Typography {
  return EXTENDED_TYPOGRAPHY[Math.floor(Math.random() * EXTENDED_TYPOGRAPHY.length)];
}

export function getIndustryIcons(industry: string): any[] {
  return INDUSTRY_ICONS[industry] || INDUSTRY_ICONS.technology;
}

export function getRandomIcon(industry: string): string {
  const icons = getIndustryIcons(industry);
  const icon = icons[Math.floor(Math.random() * icons.length)];
  return iconToSvgPath(icon);
}

// Helper functions for SVG manipulation
function extractPathFromSvg(svg: any): string {
  // Implementation to extract path data from SVG
  // This will handle different icon library formats
  return svg.props?.d || '';
}

export type Typography = {
  family: string;
  weights: string[];
  styles: string[];
};

export const iconService = {
  getRandomFont,
  getIndustryIcons,
  getRandomIcon,
};

export default iconService;
