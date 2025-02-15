type LogoStyle = 'modern' | 'classic' | 'minimal' | 'bold';

interface LogoConfig {
  brandName: string;
  style: LogoStyle;
  industry: string;
}

const DEFAULT_COLORS = {
  modern: ['#2196F3', '#FF4081', '#4CAF50', '#FFC107'],
  classic: ['#1976D2', '#D32F2F', '#388E3C', '#FBC02D'],
  minimal: ['#212121', '#757575', '#BDBDBD', '#FFFFFF'],
  bold: ['#E91E63', '#00BCD4', '#FFEB3B', '#9C27B0']
};

export function generateSimpleLogo(config: LogoConfig): string {
  const { brandName, style } = config;
  const colors = DEFAULT_COLORS[style];
  
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
  return `<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="32" 
          font-weight="bold" fill="${color}" text-anchor="middle" 
          dominant-baseline="middle">${text}</text>
  </svg>`;
}

function generateCircleLogo(text: string, primaryColor: string, secondaryColor: string): string {
  return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="${primaryColor}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="28" 
          font-weight="bold" fill="${secondaryColor}" text-anchor="middle" 
          dominant-baseline="middle">${text}</text>
  </svg>`;
}

function generateSquareLogo(text: string, primaryColor: string, secondaryColor: string): string {
  return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="20" width="160" height="160" fill="${primaryColor}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="28" 
          font-weight="bold" fill="${secondaryColor}" text-anchor="middle" 
          dominant-baseline="middle">${text}</text>
  </svg>`;
}

function generateGeometricLogo(text: string, colors: string[]): string {
  return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <polygon points="100,20 180,180 20,180" fill="${colors[0]}"/>
    <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="24" 
          font-weight="bold" fill="${colors[3]}" text-anchor="middle" 
          dominant-baseline="middle">${text}</text>
  </svg>`;
}
