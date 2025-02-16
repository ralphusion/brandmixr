import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useState, useEffect, useRef } from "react";
import { generateIconSvg } from "@/lib/generateIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import html2canvas from 'html2canvas';
import { useFonts } from "@/contexts/FontContext";

// Extended background styles including dark greys
const BACKGROUNDS = [
  {
    bg: "bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900",
    text: "text-emerald-800 dark:text-emerald-100"
  },
  {
    bg: "bg-gradient-to-br from-slate-800 to-gray-900",
    text: "text-gray-100"
  },
  {
    bg: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900",
    text: "text-blue-800 dark:text-blue-100"
  },
  {
    bg: "bg-gradient-to-br from-zinc-700 to-slate-800",
    text: "text-zinc-100"
  },
  {
    bg: "bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900",
    text: "text-amber-800 dark:text-amber-100"
  },
  {
    bg: "bg-gradient-to-br from-gray-800 to-neutral-900",
    text: "text-gray-100"
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
    bg: "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900",
    text: "text-purple-100"
  },
  {
    bg: "bg-gradient-to-br from-lime-50 to-green-100 dark:from-lime-950 dark:to-green-900",
    text: "text-lime-800 dark:text-lime-100"
  },
  {
    bg: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black",
    text: "text-gray-100"
  },
  {
    bg: "bg-gradient-to-br from-sky-50 to-cyan-100 dark:from-sky-950 dark:to-cyan-900",
    text: "text-sky-800 dark:text-sky-100"
  }
];

// Creative font styles for diverse brand presentations
const FONT_STYLES = [
  'font-serif italic tracking-wide font-medium',
  'font-sans uppercase tracking-[0.2em] font-black',
  'font-mono uppercase tracking-tight font-bold',
  'font-serif normal-case tracking-normal font-light',
  'font-sans small-caps tracking-widest font-extrabold',
  'font-mono lowercase tracking-tight font-semibold',
  'font-serif uppercase tracking-[0.15em] font-bold italic',
  'font-sans normal-case tracking-wide font-thin',
  'font-mono small-caps tracking-normal font-medium',
  'font-serif uppercase tracking-[0.25em] font-black',
  'font-sans italic tracking-wider font-extrabold',
  'font-mono normal-case tracking-[0.1em] font-bold'
];

// Function to generate a random pleasing color
const getRandomPleaseantColor = () => {
  const hue = Math.floor(Math.random() * 360); // Random hue
  const saturation = 60 + Math.floor(Math.random() * 20); // 60-80%
  const lightness = 45 + Math.floor(Math.random() * 15); // 45-60%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const ICON_STYLES = {
  initials: [
    { value: 'initials-simple', label: 'Simple Initials' },
    { value: 'initials-rounded', label: 'Rounded Initials' },
    { value: 'initials-gradient', label: 'Gradient Initials' }
  ],
  abstract: [
    { value: 'abstract-waves', label: 'Waves' },
    { value: 'abstract-dots', label: 'Dots Pattern' },
    { value: 'abstract-lines', label: 'Line Pattern' },
    { value: 'abstract-mesh', label: 'Mesh Pattern' },
    { value: 'abstract-swirl', label: 'Swirl Pattern' }
  ]
};

interface IconStyle {
    style: string;
    color: string;
    backgroundColor: string;

}

interface FontRecommendation {
  primary: {
    family: string;
    weight: string;
    style: string;
  };
  secondary: {
    family: string;
    weight: string;
    style: string;
  };
  explanation: string;
}

export default function BrandVariations() {
  const [, navigate] = useLocation();
  const [logoSvg, setLogoSvg] = useState<string>("");
  const [iconStyle, setIconStyle] = useState<string>('initials-simple');
  const [iconColor, setIconColor] = useState(getRandomPleaseantColor());
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const selectedCardRef = useRef<HTMLDivElement>(null);
  const { fonts } = useFonts();

  const params = new URLSearchParams(window.location.search);
  const brandName = params.get('name');

  useEffect(() => {
    if (!brandName) {
      navigate('/');
      return;
    }
    generateLogo();
  }, [brandName, iconStyle, iconColor, backgroundColor]);

  // Update the generateLogo function to handle the IconStyle type correctly
  const generateLogo = () => {
    if (!brandName) return;
    const svg = generateIconSvg(brandName, {
      style: iconStyle as IconStyle,
      color: iconColor,
      backgroundColor
    });
    const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
    setLogoSvg(dataUrl);
  };

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
    // Store the selected logo configuration
    const selectedStyle = BACKGROUNDS[parseInt(cardId.split('-')[1])];
    sessionStorage.setItem('selectedLogoConfig', JSON.stringify({
      iconStyle,
      iconColor,
      backgroundColor,
      selectedBackground: selectedStyle,
      fontStyle: FONT_STYLES[parseInt(cardId.split('-')[1]) % FONT_STYLES.length]
    }));
  };

  const handleRefresh = () => {
    setIconColor(getRandomPleaseantColor());
    setSelectedCardId(null);
  };

  const handleDownload = async (format: 'svg' | 'png') => {
    if (!brandName || !selectedCardRef.current) return;

    if (format === 'png') {
      const canvas = await html2canvas(selectedCardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-brand.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For SVG, we need to capture the entire card content
      const cardContent = selectedCardRef.current.innerHTML;
      const svgContent = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <foreignObject width="100%" height="100%">
            ${cardContent}
          </foreignObject>
        </svg>
      `;

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-brand.svg`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (!brandName) {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
      {/* Header with improved mobile layout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            variant="ghost"
            className="p-2"
            onClick={() => navigate('/generate')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Generated Names</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <Logo className="h-6 sm:h-8" />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="text-sm sm:text-base"
            onClick={() => navigate(`/mood-board?name=${encodeURIComponent(brandName || '')}`)}
          >
            View Mood Board
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sm sm:text-base h-10"
                disabled={!selectedCardId}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download {selectedCardId ? 'Selected' : ''}</span>
                <span className="sm:hidden">Download</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => handleDownload('svg')}
                className="py-3 sm:py-2" // Larger touch target
              >
                Download SVG
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDownload('png')}
                className="py-3 sm:py-2" // Larger touch target
              >
                Download PNG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
          style={fonts?.primary ? {
            fontFamily: fonts.primary.family,
            fontWeight: fonts.primary.weight,
            fontStyle: fonts.primary.style,
          } : undefined}
        >
          Branding Studio: {brandName}
        </h1>

        {/* Controls with improved mobile layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="space-y-2">
            <Label htmlFor="icon-style" className="text-sm sm:text-base">Icon Options</Label>
            <Select value={iconStyle} onValueChange={(value: string) => setIconStyle(value)}>
              <SelectTrigger id="icon-style" className="h-12 sm:h-10">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ICON_STYLES).map(([category, styles]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                    {styles.map((style) => (
                      <SelectItem 
                        key={style.value} 
                        value={style.value}
                        className="py-3 sm:py-2" // Larger touch target
                      >
                        {style.label}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon-color" className="text-sm sm:text-base">Icon Color</Label>
            <Input
              id="icon-color"
              type="color"
              value={iconColor}
              onChange={(e) => setIconColor(e.target.value)}
              className="h-12 sm:h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="background-color" className="text-sm sm:text-base">Background Color</Label>
            <Input
              id="background-color"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="h-12 sm:h-10"
            />
          </div>
        </div>
      </div>

      {/* Variations grid with improved responsive layout */}
      <AnimatePresence mode="wait">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {BACKGROUNDS.map((style, index) => {
            const cardId = `variation-${index}`;
            const isSelected = selectedCardId === cardId;
            const fontStyle = FONT_STYLES[index % FONT_STYLES.length];

            return (
              <motion.div
                key={cardId}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCardSelect(cardId)}
                className="touch-manipulation" // Better touch handling
              >
                <Card
                  className={`${style.bg} transition-transform hover:scale-105 active:scale-95 overflow-hidden shadow-lg dark:shadow-md dark:shadow-black/20 cursor-pointer ${
                    isSelected ? 'ring-4 ring-primary ring-offset-2' : ''
                  }`}
                >
                  <CardContent
                    className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] gap-4"
                    ref={isSelected ? selectedCardRef : null}
                  >
                    {logoSvg && (
                      <motion.div
                        className="w-14 h-14 sm:w-16 sm:h-16 mb-2 rounded-lg overflow-hidden bg-white/90 dark:bg-gray-800/90 p-2 shadow-sm"
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
                      className={`text-2xl sm:text-3xl text-center ${style.text} ${fontStyle}`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {brandName}
                    </motion.h3>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}