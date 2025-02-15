import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Download, Edit, RefreshCw } from "lucide-react";
import { parseToHsla, adjustHue } from 'color2k';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Color {
  hex: string;
  name: string;
}

interface ColorPaletteEditorProps {
  colors: Color[];
  onChange: (colors: Color[]) => void;
}

interface ColorHarmony {
  name: string;
  colors: string[];
}

function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string) => {
    const rgb = hex.match(/[A-Za-z0-9]{2}/g)!.map(v => parseInt(v, 16) / 255);
    const [r, g, b] = rgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(color1.replace('#', ''));
  const l2 = getLuminance(color2.replace('#', ''));
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Math.round(ratio * 100) / 100;
}

function getAccessibilityScore(color: string): { score: number; level: string } {
  const whiteContrast = getContrastRatio(color, '#FFFFFF');
  const blackContrast = getContrastRatio(color, '#000000');
  const maxContrast = Math.max(whiteContrast, blackContrast);

  if (maxContrast >= 7) return { score: maxContrast, level: 'AAA' };
  if (maxContrast >= 4.5) return { score: maxContrast, level: 'AA' };
  return { score: maxContrast, level: 'Fail' };
}

function generateHarmonies(baseColor: string): ColorHarmony[] {
  const hsl = parseToHsla(baseColor);

  return [
    {
      name: 'Complementary',
      colors: [baseColor, adjustHue(baseColor, 180)]
    },
    {
      name: 'Triadic',
      colors: [baseColor, adjustHue(baseColor, 120), adjustHue(baseColor, 240)]
    },
    {
      name: 'Split Complementary',
      colors: [baseColor, adjustHue(baseColor, 150), adjustHue(baseColor, 210)]
    }
  ];
}

export function ColorPaletteEditor({ colors, onChange }: ColorPaletteEditorProps) {
  const [harmonies, setHarmonies] = useState<ColorHarmony[]>([]);
  const [selectedColor, setSelectedColor] = useState<{ color: Color; index: number } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const updateColor = (index: number, hex: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], hex };
    onChange(newColors);
  };

  const showHarmonies = (color: Color) => {
    setHarmonies(generateHarmonies(color.hex));
  };

  const exportPalette = (format: 'css' | 'scss' | 'figma') => {
    let output = '';
    switch (format) {
      case 'css':
        output = `:root {\n${colors.map((c, i) => `  --color-${c.name.toLowerCase().replace(/\s+/g, '-')}: ${c.hex};`).join('\n')}\n}`;
        break;
      case 'scss':
        output = colors.map((c) => `$${c.name.toLowerCase().replace(/\s+/g, '-')}: ${c.hex};`).join('\n');
        break;
      case 'figma':
        output = JSON.stringify(colors.map((c) => ({ name: c.name, color: c.hex })), null, 2);
        break;
    }

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `color-palette.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportPalette('css')}>
                Export CSS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportPalette('scss')}>
                Export SCSS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportPalette('figma')}>
                Export Figma
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {colors.map((color, index) => {
          const accessibility = getAccessibilityScore(color.hex);
          return (
            <Dialog key={index} open={editDialogOpen && selectedColor?.index === index} onOpenChange={(open) => {
              if (!open) {
                setEditDialogOpen(false);
                setSelectedColor(null);
              }
            }}>
              <DialogTrigger asChild>
                <Card className="relative group cursor-pointer hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div
                      className="w-full aspect-square rounded-md cursor-pointer transition-transform transform group-hover:scale-105"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => {
                        setSelectedColor({ color, index });
                        setEditDialogOpen(true);
                        showHarmonies(color);
                      }}
                    />
                    <div className="mt-2 text-center">
                      <p className="font-medium text-sm truncate">{color.name}</p>
                      <p className="text-xs text-muted-foreground">{color.hex}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setSelectedColor({ color, index });
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Color</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={color.hex}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="w-full h-10"
                      />
                      <Input
                        type="text"
                        value={color.hex}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="w-full font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={color.name}
                      onChange={(e) => {
                        const newColors = [...colors];
                        newColors[index] = { ...color, name: e.target.value };
                        onChange(newColors);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Accessibility
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant={accessibility.level === 'Fail' ? 'destructive' : 'default'}>
                            {accessibility.level} ({accessibility.score})
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Contrast ratio with white/black text</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                  </div>

                  {harmonies.length > 0 && (
                    <div className="space-y-2">
                      <Label>Color Harmonies</Label>
                      <div className="space-y-3">
                        {harmonies.map((harmony, hIndex) => (
                          <div key={hIndex} className="space-y-2">
                            <p className="text-sm text-muted-foreground">{harmony.name}</p>
                            <div className="flex gap-2">
                              {harmony.colors.map((harmonicColor, colorIndex) => (
                                <div
                                  key={colorIndex}
                                  className="w-12 h-12 rounded-md cursor-pointer transition-transform hover:scale-105"
                                  style={{ backgroundColor: harmonicColor }}
                                  onClick={() => {
                                    const newColors = [...colors];
                                    newColors[index] = { ...color, hex: harmonicColor };
                                    onChange(newColors);
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}