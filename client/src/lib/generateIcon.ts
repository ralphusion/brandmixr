type IconStyle = 'geometric' | 'initials' | 'abstract';
type IconShape = 'circle' | 'square' | 'hexagon';
type IconOptions = {
  style?: IconStyle;
  color?: string;
  backgroundColor?: string;
};

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

const abstractShapes = {
  waves: (size: number, color: string) => {
    const path = `M0 ${size/2} 
                  C${size/4} ${size/3}, 
                   ${size*3/4} ${size*2/3}, 
                   ${size} ${size/2}`;
    return `<path d="${path}" stroke="${color}" fill="none" stroke-width="${size/10}" />`;
  },
  dots: (size: number, color: string) => {
    let dots = '';
    const numDots = 5;
    const radius = size/15;
    for(let i = 0; i < numDots; i++) {
      for(let j = 0; j < numDots; j++) {
        const x = (size/numDots) * (i + 0.5);
        const y = (size/numDots) * (j + 0.5);
        dots += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" />`;
      }
    }
    return dots;
  },
  lines: (size: number, color: string) => {
    let lines = '';
    const numLines = 5;
    const spacing = size/numLines;
    for(let i = 0; i < numLines; i++) {
      lines += `<line x1="0" y1="${i*spacing}" x2="${size}" y2="${i*spacing}" 
                stroke="${color}" stroke-width="${size/30}" />`;
    }
    return lines;
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

export const generateIconSvg = (brandName: string, options: IconOptions = {}): string => {
  const size = 100;
  const mainColor = options.color || getColorFromName(brandName);
  const backgroundColor = options.backgroundColor || 'none';
  const style = options.style || 'geometric';
  const letter = brandName.charAt(0).toUpperCase();

  let content = '';
  if (style === 'geometric') {
    const shape = getShapeFromName(brandName);
    content = shapes[shape](size, mainColor);
  } else if (style === 'abstract') {
    content = `
      ${abstractShapes.waves(size, mainColor)}
      ${abstractShapes.dots(size, mainColor)}
      ${abstractShapes.lines(size, mainColor)}
    `;
  } else { // initials
    content = `
      <rect x="0" y="0" width="${size}" height="${size}" rx="20" fill="${mainColor}" />
      <text 
        x="50%" 
        y="50%" 
        dy=".3em"
        text-anchor="middle" 
        fill="white" 
        font-family="system-ui, sans-serif"
        font-size="${size/1.5}"
        font-weight="bold"
      >
        ${letter}
      </text>
    `;
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" fill="${backgroundColor}" />
      ${content}
    </svg>
  `;
};

// Function to download icon in different formats
export const downloadIcon = async (svg: string, format: 'svg' | 'png', filename: string) => {
  if (format === 'svg') {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    // Convert SVG to PNG
    const img = new Image();
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
          resolve(null);
        }, 'image/png');
      };
      img.src = url;
    });
  }
};