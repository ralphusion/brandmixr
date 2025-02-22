
export function generateRandomColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70 + Math.random() * 30;
    const lightness = 45 + Math.random() * 10;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}

export function adjustColorLightness(color: string, amount: number): string {
  const hsl = color.match(/\d+/g)?.map(Number);
  if (!hsl || hsl.length !== 3) return color;
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${Math.max(0, Math.min(100, hsl[2] + amount))}%)`;
}
