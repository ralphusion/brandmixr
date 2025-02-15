type IconStyle = 'initials-simple' | 'initials-rounded' | 'initials-gradient' |
                'geometric-circle' | 'geometric-square' | 'geometric-hexagon' | 'geometric-triangle' | 'geometric-diamond' |
                'abstract-waves' | 'abstract-dots' | 'abstract-lines' | 'abstract-mesh' | 'abstract-swirl' |
                'modern-minimal' | 'modern-tech' | 'modern-gradient' |
                'decorative-floral' | 'decorative-vintage' | 'decorative-ornate';

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
  },
  triangle: (size: number, color: string) => {
    const h = size * 0.866; // height of equilateral triangle
    return `<polygon points="${size/2},${size/6} ${size*5/6},${h*5/6} ${size/6},${h*5/6}" fill="${color}" />`;
  },
  diamond: (size: number, color: string) => {
    const points = `${size/2},${size/6} ${size*5/6},${size/2} ${size/2},${size*5/6} ${size/6},${size/2}`;
    return `<polygon points="${points}" fill="${color}" />`;
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
  mesh: (size: number, color: string) => {
    let paths = '';
    const grid = 4;
    const spacing = size / grid;
    for(let i = 0; i <= grid; i++) {
      paths += `
        <line x1="0" y1="${i*spacing}" x2="${size}" y2="${i*spacing}" 
              stroke="${color}" stroke-width="1" opacity="0.5" />
        <line x1="${i*spacing}" y1="0" x2="${i*spacing}" y2="${size}" 
              stroke="${color}" stroke-width="1" opacity="0.5" />
      `;
    }
    return paths;
  },
  swirl: (size: number, color: string) => {
    const centerX = size / 2;
    const centerY = size / 2;
    let path = `M${centerX},${centerY} `;
    for(let i = 0; i < 720; i += 5) {
      const angle = i * Math.PI / 180;
      const radius = (i / 720) * size / 3;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      path += `L${x},${y} `;
    }
    return `<path d="${path}" stroke="${color}" fill="none" stroke-width="2" />`;
  }
};

export const generateIconSvg = (brandName: string, options: IconOptions = {}): string => {
  const size = 100;
  const mainColor = options.color || '#000000';
  const backgroundColor = options.backgroundColor || '#FFFFFF';
  const style = options.style || 'initials-simple';
  const letter = brandName.charAt(0).toUpperCase();

  let content = '';
  const [category, subStyle] = style.split('-');

  if (category === 'initials') {
    const radius = subStyle === 'rounded' ? 20 : 0;
    const gradient = subStyle === 'gradient' ? `
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${mainColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${mainColor};stop-opacity:0.6" />
        </linearGradient>
      </defs>
    ` : '';

    content = `
      ${gradient}
      <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" 
            fill="${subStyle === 'gradient' ? 'url(#grad)' : mainColor}" />
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
  } else if (category === 'geometric' && shapes[subStyle]) {
    content = shapes[subStyle](size, mainColor);
  } else if (category === 'abstract' && abstractShapes[subStyle]) {
    content = abstractShapes[subStyle](size, mainColor);
  } else if (category === 'modern') {
    if (subStyle === 'minimal') {
      content = `
        <rect x="${size/4}" y="${size/4}" width="${size/2}" height="${size/2}" fill="${mainColor}" />
        <circle cx="${size/2}" cy="${size/2}" r="${size/6}" fill="white" />
      `;
    } else if (subStyle === 'tech') {
      content = `
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="${mainColor}" stroke-width="4" />
        <circle cx="50" cy="50" r="20" fill="${mainColor}" />
      `;
    } else if (subStyle === 'gradient') {
      content = `
        <defs>
          <linearGradient id="modernGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${mainColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${mainColor};stop-opacity:0.4" />
          </linearGradient>
        </defs>
        <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="url(#modernGrad)" />
      `;
    }
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" fill="${backgroundColor}" />
      ${content}
    </svg>
  `;
};

// Download function remains unchanged
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