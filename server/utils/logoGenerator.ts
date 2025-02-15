type LogoStyle = 'modern' | 'classic' | 'minimal' | 'bold';

interface LogoConfig {
  brandName: string;
  style: string;
  industry: string;
}

const DEFAULT_COLORS = {
  modern: ['#2196F3', '#FF4081', '#4CAF50', '#FFC107'],
  classic: ['#1976D2', '#D32F2F', '#388E3C', '#FBC02D'],
  minimal: ['#212121', '#757575', '#BDBDBD', '#FFFFFF'],
  bold: ['#E91E63', '#00BCD4', '#FFEB3B', '#9C27B0']
};

function mapStyleToLogoStyle(style: string): LogoStyle {
  // Map various possible style inputs to our LogoStyle types
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

export function generateSimpleLogo(config: LogoConfig): string {
  const { brandName, style, industry } = config;
  const logoStyle = mapStyleToLogoStyle(style);
  const colors = DEFAULT_COLORS[logoStyle];

  // Generate different logo variations
  const variations = [
    generateTextOnlyLogo(brandName, colors[0]),
    generateCircleLogo(brandName, colors[0], colors[1]),
    generateSquareLogo(brandName, colors[0], colors[2]),
    generateGeometricLogo(brandName, colors)
  ];

  return variations[Math.floor(Math.random() * variations.length)];
}

function generateTextOnlyLogo(text: string, color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100">
    <text x="100" y="50" font-family="Arial, sans-serif" font-size="32" 
          font-weight="bold" fill="${color}" text-anchor="middle" 
          dominant-baseline="middle">${text}</text>
  </svg>`;
}

function generateCircleLogo(text: string, primaryColor: string, secondaryColor: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <circle cx="100" cy="100" r="80" fill="${primaryColor}"/>
    <text x="100" y="100" font-family="Arial, sans-serif" font-size="28" 
          font-weight="bold" fill="${secondaryColor}" text-anchor="middle" 
          dominant-baseline="middle">${text}</text>
  </svg>`;
}

function generateSquareLogo(text: string, primaryColor: string, secondaryColor: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect x="20" y="20" width="160" height="160" fill="${primaryColor}"/>
    <text x="100" y="100" font-family="Arial, sans-serif" font-size="28" 
          font-weight="bold" fill="${secondaryColor}" text-anchor="middle" 
          dominant-baseline="middle">${text}</text>
  </svg>`;
}

function generateGeometricLogo(text: string, colors: string[]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <polygon points="100,20 180,180 20,180" fill="${colors[0]}"/>
    <text x="100" y="120" font-family="Arial, sans-serif" font-size="24" 
          font-weight="bold" fill="${colors[3]}" text-anchor="middle" 
          dominant-baseline="middle">${text}</text>
  </svg>`;
}