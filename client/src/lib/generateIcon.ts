type IconStyle = 'initials-simple' | 'initials-gradient' |
                'abstract-waves' | 'abstract-dots' | 'abstract-lines' | 'abstract-mesh' | 'abstract-swirl' |
                'modern-minimal' | 'modern-tech' | 'modern-gradient' |
                'decorative-floral' | 'decorative-vintage' | 'decorative-ornate';

type IconOptions = {
  style?: IconStyle;
  color?: string;
  backgroundColor?: string;
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
        dots += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" opacity="${0.5 + Math.random() * 0.5}" />`;
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

// Modern font styles for sophisticated typography
const FONT_STYLES = [
  { family: 'Playfair Display', weight: '700', style: 'normal' },
  { family: 'Montserrat', weight: '300', style: 'normal' },
  { family: 'Roboto Slab', weight: '500', style: 'normal' },
  { family: 'Poppins', weight: '600', style: 'normal' },
  { family: 'Raleway', weight: '800', style: 'normal' },
  { family: 'Open Sans', weight: '400', style: 'italic' },
  { family: 'Lora', weight: '700', style: 'italic' },
  { family: 'Source Sans Pro', weight: '300', style: 'normal' },
  { family: 'DM Sans', weight: '500', style: 'normal' },
  { family: 'Work Sans', weight: '600', style: 'normal' }
];

export const generateIconSvg = (brandName: string, options: IconOptions = {}): string => {
  const size = 100;
  const mainColor = options.color || '#000000';
  const backgroundColor = options.backgroundColor || '#FFFFFF';
  const style = options.style || 'modern-minimal';
  const letter = brandName.charAt(0).toUpperCase();

  let content = '';
  const [category, subStyle] = style.split('-');

  // Get random font style
  const randomFont = FONT_STYLES[Math.floor(Math.random() * FONT_STYLES.length)];

  if (category === 'initials') {
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
      <text 
        x="50%" 
        y="50%" 
        dy=".3em"
        text-anchor="middle" 
        fill="${subStyle === 'gradient' ? 'url(#grad)' : mainColor}" 
        font-family="${randomFont.family}, system-ui, sans-serif"
        font-size="${size/1.5}"
        font-weight="${randomFont.weight}"
        font-style="${randomFont.style}"
        letter-spacing="-0.02em"
      >
        ${letter}
      </text>
    `;
  } else if (category === 'abstract' && abstractShapes[subStyle]) {
    content = abstractShapes[subStyle](size, mainColor);
  } else if (category === 'modern') {
    if (subStyle === 'minimal') {
      content = `
        <text 
          x="50%" 
          y="50%" 
          text-anchor="middle" 
          fill="${mainColor}"
          font-family="${randomFont.family}, system-ui, sans-serif"
          font-size="${size/2}"
          font-weight="${randomFont.weight}"
          font-style="${randomFont.style}"
          letter-spacing="0.2em"
        >
          ${brandName.toUpperCase()}
        </text>
      `;
    } else if (subStyle === 'tech') {
      content = `
        <line x1="10" y1="10" x2="90" y2="90" stroke="${mainColor}" stroke-width="4" />
        <line x1="90" y1="10" x2="10" y2="90" stroke="${mainColor}" stroke-width="4" />
        <text 
          x="50%" 
          y="75%" 
          text-anchor="middle"
          fill="${mainColor}"
          font-family="${randomFont.family}, system-ui, sans-serif"
          font-size="${size/3}"
          font-weight="${randomFont.weight}"
          font-style="${randomFont.style}"
        >
          ${brandName}
        </text>
      `;
    } else if (subStyle === 'gradient') {
      content = `
        <defs>
          <linearGradient id="modernGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${mainColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${mainColor};stop-opacity:0.4" />
          </linearGradient>
        </defs>
        <text 
          x="50%" 
          y="50%" 
          text-anchor="middle"
          fill="url(#modernGrad)"
          font-family="${randomFont.family}, system-ui, sans-serif"
          font-size="${size/2}"
          font-weight="${randomFont.weight}"
          font-style="${randomFont.style}"
          letter-spacing="0.1em"
        >
          ${brandName}
        </text>
      `;
    }
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      ${content}
    </svg>
  `;
};

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