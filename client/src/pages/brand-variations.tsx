import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useState, useEffect } from "react";
import { generateIconSvg, downloadIcon } from "@/lib/generateIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ICON_STYLES = {
  initials: [
    { value: 'initials-simple', label: 'Simple Initials' },
    { value: 'initials-rounded', label: 'Rounded Initials' },
    { value: 'initials-gradient', label: 'Gradient Initials' }
  ],
  geometric: [
    { value: 'geometric-circle', label: 'Circle' },
    { value: 'geometric-square', label: 'Square' },
    { value: 'geometric-hexagon', label: 'Hexagon' },
    { value: 'geometric-triangle', label: 'Triangle' },
    { value: 'geometric-diamond', label: 'Diamond' }
  ],
  abstract: [
    { value: 'abstract-waves', label: 'Waves' },
    { value: 'abstract-dots', label: 'Dots Pattern' },
    { value: 'abstract-lines', label: 'Line Pattern' },
    { value: 'abstract-mesh', label: 'Mesh Pattern' },
    { value: 'abstract-swirl', label: 'Swirl Pattern' }
  ],
  modern: [
    { value: 'modern-minimal', label: 'Minimal' },
    { value: 'modern-tech', label: 'Tech Style' },
    { value: 'modern-gradient', label: 'Modern Gradient' }
  ],
  decorative: [
    { value: 'decorative-floral', label: 'Floral Pattern' },
    { value: 'decorative-vintage', label: 'Vintage Style' },
    { value: 'decorative-ornate', label: 'Ornate Design' }
  ]
};

// Function to generate a random pleasing color
const getRandomPleaseantColor = () => {
  const hue = Math.floor(Math.random() * 360); // Random hue
  const saturation = 60 + Math.floor(Math.random() * 20); // 60-80%
  const lightness = 45 + Math.floor(Math.random() * 15); // 45-60%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const FONT_STYLES = [
  'uppercase tracking-wider font-bold',
  'uppercase tracking-tight font-extrabold',
  'normal-case tracking-wide font-semibold',
  'font-serif italic font-medium',
  'font-mono uppercase tracking-widest font-bold',
  'font-sans small-caps tracking-normal font-bold',
];

const BACKGROUNDS = [
  { 
    bg: "bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900", 
    text: "text-emerald-800 dark:text-emerald-100" 
  },
  { 
    bg: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900", 
    text: "text-blue-800 dark:text-blue-100" 
  },
  { 
    bg: "bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900", 
    text: "text-amber-800 dark:text-amber-100" 
  },
  { 
    bg: "bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-950 dark:to-pink-900", 
    text: "text-rose-800 dark:text-rose-100" 
  },
  { 
    bg: "bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-950 dark:to-purple-900", 
    text: "text-violet-800 dark:text-violet-100" 
  },
  { 
    bg: "bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-gray-900", 
    text: "text-slate-800 dark:text-slate-100" 
  },
  { 
    bg: "bg-gradient-to-br from-lime-50 to-green-100 dark:from-lime-950 dark:to-green-900", 
    text: "text-lime-800 dark:text-lime-100" 
  },
  { 
    bg: "bg-gradient-to-br from-sky-50 to-cyan-100 dark:from-sky-950 dark:to-cyan-900", 
    text: "text-sky-800 dark:text-sky-100" 
  },
  { 
    bg: "bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-900", 
    text: "text-orange-800 dark:text-orange-100" 
  }
];

export default function BrandVariations() {
  const [, navigate] = useLocation();
  const [logoSvg, setLogoSvg] = useState<string>("");
  const [iconStyle, setIconStyle] = useState<string>('initials-simple');
  const [iconColor, setIconColor] = useState(getRandomPleaseantColor());
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");

  const params = new URLSearchParams(window.location.search);
  const brandName = params.get('name');

  useEffect(() => {
    if (!brandName) {
      navigate('/');
      return;
    }
    generateLogo();
  }, [brandName, iconStyle, iconColor, backgroundColor]);

  const generateLogo = () => {
    if (!brandName) return;
    const svg = generateIconSvg(brandName, {
      style: iconStyle,
      color: iconColor,
      backgroundColor
    });
    const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
    setLogoSvg(dataUrl);
  };

  const handleDownload = async (format: 'svg' | 'png') => {
    if (!brandName || !logoSvg) return;
    const svg = generateIconSvg(brandName, {
      style: iconStyle,
      color: iconColor,
      backgroundColor
    });
    await downloadIcon(svg, format, brandName.toLowerCase().replace(/\s+/g, '-'));
  };

  if (!brandName) {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => navigate('/generate')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Generated Names
          </Button>
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleDownload('svg')}>
                Download SVG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('png')}>
                Download PNG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Branding Studio: {brandName}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <Label htmlFor="icon-style">Icon Options</Label>
            <Select value={iconStyle} onValueChange={(value: string) => setIconStyle(value)}>
              <SelectTrigger id="icon-style">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ICON_STYLES).map(([category, styles]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                    {styles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="icon-color">Icon Color</Label>
            <Input
              id="icon-color"
              type="color"
              value={iconColor}
              onChange={(e) => setIconColor(e.target.value)}
              className="h-10"
            />
          </div>

          <div>
            <Label htmlFor="background-color">Background Color</Label>
            <Input
              id="background-color"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="h-10"
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {BACKGROUNDS.map((style, bgIndex) => (
            FONT_STYLES.map((fontStyle, fontIndex) => (
              <motion.div
                key={`${bgIndex}-${fontIndex}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: (bgIndex * FONT_STYLES.length + fontIndex) * 0.05 }}
              >
                <Card 
                  className={`${style.bg} transition-transform hover:scale-105 overflow-hidden shadow-lg dark:shadow-md dark:shadow-black/20`}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] gap-4">
                    {logoSvg && (
                      <motion.div 
                        className="w-16 h-16 mb-2 rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-2 shadow-sm"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <img 
                          src={logoSvg} 
                          alt="Brand Icon" 
                          className="w-full h-full object-contain"
                        />
                      </motion.div>
                    )}
                    <motion.h3 
                      className={`text-3xl text-center ${style.text} ${fontStyle}`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {brandName}
                    </motion.h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}