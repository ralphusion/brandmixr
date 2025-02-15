type IconShape = 'circle' | 'square' | 'hexagon';

const shapes = {
  circle: (size: number, color: string) => `
    <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="${color}" />
  `,
  square: (size: number, color: string) => `
    <rect x="${size/6}" y="${size/6}" width="${size*2/3}" height="${size*2/3}" fill="${color}" />
  `,
  hexagon: (size: number, color: string) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 3;
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      points.push(`${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`);
    }
    return `<polygon points="${points.join(' ')}" fill="${color}" />`;
  }
};

const getColorFromName = (name: string): string => {
  const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

const getShapeFromName = (name: string): IconShape => {
  const shapes: IconShape[] = ['circle', 'square', 'hexagon'];
  const index = name.length % shapes.length;
  return shapes[index];
};

export const generateIconSvg = (brandName: string): string => {
  const size = 100;
  const shape = getShapeFromName(brandName);
  const color = getColorFromName(brandName);
  const letter = brandName.charAt(0).toUpperCase();

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.7" />
        </linearGradient>
      </defs>
      ${shapes[shape](size, 'url(#iconGradient)')}
      <text 
        x="50%" 
        y="50%" 
        dy=".3em"
        text-anchor="middle" 
        fill="white" 
        font-family="system-ui, sans-serif"
        font-size="${size/2}"
        font-weight="bold"
      >
        ${letter}
      </text>
    </svg>
  `;
};
