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
  const { brandName, style } = config;
  const logoStyle = mapStyleToLogoStyle(style);
  const colors = DEFAULT_COLORS[logoStyle];

  // Generate different logo variations
  const variations = [
    generateModernLogo(brandName, colors),
    generateCircularLogo(brandName, colors),
    generateMinimalistLogo(brandName, colors),
    generateIconicLogo(brandName, colors)
  ];

  const svgContent = variations[Math.floor(Math.random() * variations.length)];
  // Convert SVG to base64 and return as data URL
  const base64 = Buffer.from(svgContent).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

function generateModernLogo(text: string, colors: any): string {
  const primary = getRandomElement(colors.primary);
  const accent = getRandomElement(colors.accent);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${accent};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="60" height="60" rx="10" fill="url(#grad1)"/>
    <text x="100" y="60" font-family="Arial, sans-serif" font-size="36" 
          font-weight="bold" fill="${primary}" letter-spacing="1">
          ${text}
    </text>
  </svg>`;
}

function generateCircularLogo(text: string, colors: any): string {
  const primary = getRandomElement(colors.primary);
  const secondary = getRandomElement(colors.secondary);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${secondary};stop-opacity:1" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="90" fill="none" stroke="url(#grad2)" stroke-width="8"/>
    <text x="100" y="90" font-family="Arial, sans-serif" font-size="24" 
          font-weight="bold" fill="${primary}" text-anchor="middle">${text}</text>
    <text x="100" y="120" font-family="Arial, sans-serif" font-size="14" 
          fill="${secondary}" text-anchor="middle">ESTABLISHED 2024</text>
  </svg>`;
}

function generateMinimalistLogo(text: string, colors: any): string {
  const primary = getRandomElement(colors.primary);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
    <rect x="20" y="45" width="30" height="4" fill="${primary}"/>
    <text x="70" y="50" font-family="Arial, sans-serif" font-size="28" 
          font-weight="300" fill="${primary}" letter-spacing="4">
          ${text.toUpperCase()}
    </text>
  </svg>`;
}

function generateIconicLogo(text: string, colors: any): string {
  const primary = getRandomElement(colors.primary);
  const accent = getRandomElement(colors.accent);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${accent};stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d="M100,20 L180,180 L20,180 Z" fill="url(#grad4)"/>
    <text x="100" y="140" font-family="Arial, sans-serif" font-size="24" 
          font-weight="bold" fill="#FFFFFF" text-anchor="middle" 
          dominant-baseline="middle">${text}</text>
  </svg>`;
}