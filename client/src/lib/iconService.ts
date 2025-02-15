import * as LucideIcons from 'lucide-react';
import * as TablerIcons from '@tabler/icons-react';
import * as PhosphorIcons from '@phosphor-icons/react';
import { 
  VscCode, 
  VscDatabase,
  VscGear,
  VscRocket,
  VscSymbolClass,
  VscTerminal,
  VscTools,
  VscServer
} from 'react-icons/vsc';
import { 
  BsBuilding,
  BsBank,
  BsBarChart,
  BsBasket,
  BsBriefcase,
  BsCoin,
  BsCreditCard,
  BsGear,
  BsGraph,
  BsShop
} from 'react-icons/bs';
import { 
  MdOutlineDesignServices,
  MdRestaurant,
  MdStorefront,
  MdLocalHospital,
  MdPeople,
  MdSchool,
  MdSpa,
  MdSports
} from 'react-icons/md';
import { 
  IoAirplaneOutline,
  IoBusinessOutline,
  IoBagHandleOutline,
  IoCartOutline,
  IoFastFoodOutline,
  IoLeafOutline,
  IoMedicalOutline,
  IoShirtOutline
} from 'react-icons/io5';

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
  { family: 'Archivo Black', weights: ['400'], styles: ['normal'] }
];

// Industry-specific icon collections
const INDUSTRY_ICONS = {
  technology: [
    VscCode,
    VscDatabase,
    VscGear,
    VscRocket,
    VscSymbolClass,
    VscTerminal,
    VscTools,
    VscServer
  ],
  finance: [
    BsBank,
    BsBarChart,
    BsCoin,
    BsCreditCard,
    BsGraph,
    BsBuilding
  ],
  retail: [
    BsBasket,
    BsShop,
    IoCartOutline,
    MdStorefront,
    IoBagHandleOutline
  ],
  healthcare: [
    MdLocalHospital,
    IoMedicalOutline,
    MdSpa
  ],
  education: [
    MdSchool,
    MdPeople
  ],
  food: [
    MdRestaurant,
    IoFastFoodOutline
  ],
  fashion: [
    IoShirtOutline
  ],
  business: [
    BsBriefcase,
    IoBusinessOutline
  ],
  travel: [
    IoAirplaneOutline
  ],
  nature: [
    IoLeafOutline
  ]
};

// Convert React Icon to SVG path
function iconToSvgPath(Icon: any): string {
  if (!Icon || typeof Icon !== 'function') return '';

  try {
    // Create a temporary DOM element
    const div = document.createElement('div');
    const svg = Icon(); // Call the icon function to get the SVG element

    // If it's a React element, we need to extract the path data
    if (svg && svg.props && svg.props.children) {
      // Handle both single path and multiple paths
      const paths = Array.isArray(svg.props.children) 
        ? svg.props.children 
        : [svg.props.children];

      return paths
        .filter((path: any) => path && path.props && path.props.d)
        .map((path: any) => path.props.d)
        .join(' ');
    }

    return '';
  } catch (error) {
    console.error('Error converting icon to SVG path:', error);
    return '';
  }
}

export function getRandomFont(): Typography {
  return EXTENDED_TYPOGRAPHY[Math.floor(Math.random() * EXTENDED_TYPOGRAPHY.length)];
}

export function getIndustryIcons(industry: string): any[] {
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
  } else if (normalizedIndustry.includes('travel')) {
    icons = INDUSTRY_ICONS.travel;
  } else {
    // Default to business icons if no specific match
    icons = INDUSTRY_ICONS.business;
  }

  return icons;
}

export function getRandomIcon(industry: string): string {
  const icons = getIndustryIcons(industry);
  if (!icons || icons.length === 0) return '';

  const icon = icons[Math.floor(Math.random() * icons.length)];
  return iconToSvgPath(icon) || '';
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