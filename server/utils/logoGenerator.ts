type LogoStyle = 'modern' | 'classic' | 'minimal' | 'bold';

interface LogoConfig {
  brandName: string;
  style: string;
  industry: string;
}

const DEFAULT_COLORS = {
  modern: {
    primary: ['#2196F3', '#00BCD4', '#3F51B5'],
    secondary: ['#FF4081', '#FFC107', '#4CAF50'],
    accent: ['#E91E63', '#FFEB3B', '#009688']
  },
  classic: {
    primary: ['#1976D2', '#0D47A1', '#2962FF'],
    secondary: ['#D32F2F', '#FBC02D', '#388E3C'],
    accent: ['#C2185B', '#FFA000', '#00796B']
  },
  minimal: {
    primary: ['#212121', '#424242', '#616161'],
    secondary: ['#757575', '#9E9E9E', '#BDBDBD'],
    accent: ['#000000', '#FFFFFF', '#EEEEEE']
  },
  bold: {
    primary: ['#E91E63', '#9C27B0', '#673AB7'],
    secondary: ['#00BCD4', '#FFEB3B', '#FF5722'],
    accent: ['#F50057', '#D500F9', '#651FFF']
  }
};

const INDUSTRY_ICONS = {
  'technology': [
    'M40,20 L60,20 L80,40 L60,60 L40,40 Z',
    'M30,30 Q50,10 70,30 T90,30',
    'M20,50 h60 l-30,-30 z'
  ],
  'fashion': [
    'M35,65 C35,35 65,35 65,65',
    'M50,20 L80,50 L50,80 L20,50 Z',
    'M30,30 S50,70 70,30'
  ],
  'food': [
    'M25,25 Q50,50 75,25',
    'M40,20 C60,20 80,40 60,60 C40,80 20,60 40,40',
    'M30,70 Q50,30 70,70'
  ],
  'health': [
    'M45,25 L55,25 L55,45 L75,45 L75,55 L55,55 L55,75 L45,75 L45,55 L25,55 L25,45 L45,45 Z',
    'M50,20 Q80,50 50,80 Q20,50 50,20',
    'M30,50 Q50,20 70,50 Q50,80 30,50'
  ],
  'finance': [
    'M35,65 L65,35 M35,35 L65,65',
    'M25,50 Q50,25 75,50 Q50,75 25,50',
    'M40,40 L60,40 L60,60 L40,60 Z'
  ]
};

const TYPOGRAPHY_STYLES = [
  { family: 'Playfair Display', weight: '700', style: 'normal', letterSpacing: '0' },
  { family: 'Montserrat', weight: '300', style: 'normal', letterSpacing: '0.2em' },
  { family: 'Roboto Slab', weight: '500', style: 'normal', letterSpacing: '-0.02em' },
  { family: 'Poppins', weight: '600', style: 'normal', letterSpacing: '0.1em' },
  { family: 'Raleway', weight: '800', style: 'normal', letterSpacing: '0.15em' },
  { family: 'Lora', weight: '700', style: 'italic', letterSpacing: '0' },
  { family: 'Source Sans Pro', weight: '300', style: 'normal', letterSpacing: '0.3em' },
  { family: 'Work Sans', weight: '600', style: 'normal', letterSpacing: '0.05em' }
];

function mapStyleToLogoStyle(style: string): LogoStyle {
  const styleMap: { [key: string]: LogoStyle } = {
    'brandable': 'modern',
    'modern': 'modern',
    'classic': 'classic',
    'minimal': 'minimal',
    'bold': 'bold',
    'professional': 'classic',
    'playful': 'bold',
    'elegant': 'minimal'
  };

  return styleMap[style.toLowerCase()] || 'modern';
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateSimpleLogo(config: LogoConfig): string {
  const { brandName, style, industry } = config;
  const logoStyle = mapStyleToLogoStyle(style);
  const colors = DEFAULT_COLORS[logoStyle];

  // Generate different logo variations
  const variations = [
    generateModernLogo(brandName, colors, industry),
    generateMinimalistLogo(brandName, colors),
    generateIconicLogo(brandName, colors, industry)
  ];

  const svgContent = variations[Math.floor(Math.random() * variations.length)];
  // Convert SVG to base64 and return as data URL
  const base64 = Buffer.from(svgContent).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

function generateModernLogo(text: string, colors: any, industry: string): string {
  const primary = getRandomElement(colors.primary);
  const accent = getRandomElement(colors.accent);
  const typography = getRandomElement(TYPOGRAPHY_STYLES);

  // Get industry-specific icon
  const icons = INDUSTRY_ICONS[industry as keyof typeof INDUSTRY_ICONS] || INDUSTRY_ICONS['technology'];
  const icon = getRandomElement(icons);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${accent};stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d="${icon}" fill="url(#grad1)" transform="translate(20, 20) scale(0.6)"/>
    <text x="100" y="60" 
          font-family="${typography.family}, Arial, sans-serif" 
          font-size="36"
          font-weight="${typography.weight}"
          font-style="${typography.style}"
          fill="${primary}"
          letter-spacing="${typography.letterSpacing}">
          ${text}
    </text>
  </svg>`;
}

function generateMinimalistLogo(text: string, colors: any): string {
  const primary = getRandomElement(colors.primary);
  const typography = getRandomElement(TYPOGRAPHY_STYLES);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
    <rect x="20" y="45" width="30" height="4" fill="${primary}"/>
    <text x="70" y="50" 
          font-family="${typography.family}, Arial, sans-serif" 
          font-size="28"
          font-weight="${typography.weight}"
          font-style="${typography.style}"
          fill="${primary}"
          letter-spacing="${typography.letterSpacing}">
          ${text.toUpperCase()}
    </text>
  </svg>`;
}

function generateIconicLogo(text: string, colors: any, industry: string): string {
  const primary = getRandomElement(colors.primary);
  const accent = getRandomElement(colors.accent);
  const typography = getRandomElement(TYPOGRAPHY_STYLES);

  // Get industry-specific icon
  const icons = INDUSTRY_ICONS[industry as keyof typeof INDUSTRY_ICONS] || INDUSTRY_ICONS['technology'];
  const icon = getRandomElement(icons);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
    <defs>
      <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${accent};stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d="${icon}" fill="url(#grad4)" transform="translate(20, 20) scale(0.6)"/>
    <text x="100" y="60" 
          font-family="${typography.family}, Arial, sans-serif" 
          font-size="32"
          font-weight="${typography.weight}"
          font-style="${typography.style}"
          fill="${primary}"
          letter-spacing="${typography.letterSpacing}">
          ${text}
    </text>
  </svg>`;
}