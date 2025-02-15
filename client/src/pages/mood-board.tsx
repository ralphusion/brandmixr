import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, SparkleIcon, Copy } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ColorPaletteEditor } from "@/components/ColorPaletteEditor";
import html2canvas from 'html2canvas';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useFonts } from "@/contexts/FontContext";
import { generateIconSvg } from "@/lib/generateIcon";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FontSettings {
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
}

interface MoodBoardData {
  colors: Array<{ hex: string; name: string }>;
  keywords: string[];
  moodDescription: string;
  imagePrompts: string[];
  images: string[];
}

type RegenerationSection = {
  type: 'colors' | 'keywords' | 'mood' | 'image';
  index?: number;
};

const getRandomPleaseantColor = () => {
  return 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800';
}

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

type IconStyle =
  | 'initials-simple'
  | 'initials-rounded'
  | 'initials-gradient'
  | 'abstract-waves'
  | 'abstract-dots'
  | 'abstract-lines'
  | 'abstract-mesh'
  | 'abstract-swirl';


const FONT_FAMILIES = [
  // Modern Sans-Serif
  { family: 'Inter', style: 'normal', weight: '600' },
  { family: 'Montserrat', style: 'normal', weight: '700' },
  { family: 'Poppins', style: 'normal', weight: '700' },
  { family: 'SF Pro Display', style: 'normal', weight: '600' },
  { family: 'Helvetica Neue', style: 'normal', weight: '600' },
  { family: 'Source Sans Pro', style: 'normal', weight: '600' },
  { family: 'Nunito Sans', style: 'normal', weight: '700' },
  { family: 'Work Sans', style: 'normal', weight: '600' },
  // Additional Professional Fonts
  { family: 'Roboto', style: 'normal', weight: '700' },
  { family: 'Open Sans', style: 'normal', weight: '600' },
  { family: 'Raleway', style: 'normal', weight: '600' },
  { family: 'Lato', style: 'normal', weight: '700' },
  { family: 'Ubuntu', style: 'normal', weight: '500' },
  { family: 'DM Sans', style: 'normal', weight: '500' },
  { family: 'Manrope', style: 'normal', weight: '600' },
  // Contemporary Sans
  { family: 'Plus Jakarta Sans', style: 'normal', weight: '600' },
  { family: 'Outfit', style: 'normal', weight: '600' },
  { family: 'Albert Sans', style: 'normal', weight: '700' },
  { family: 'Public Sans', style: 'normal', weight: '600' },
  { family: 'Be Vietnam Pro', style: 'normal', weight: '600' },
  // Geometric Sans
  { family: 'Proxima Nova', style: 'normal', weight: '600' },
  { family: 'Futura PT', style: 'normal', weight: '500' },
  { family: 'Brandon Grotesque', style: 'normal', weight: '500' },
  { family: 'Axiforma', style: 'normal', weight: '600' },
  { family: 'Gilroy', style: 'normal', weight: '600' },
  // Corporate/Business
  { family: 'Articulat CF', style: 'normal', weight: '700' },
  { family: 'Sharp Grotesk', style: 'normal', weight: '600' },
  { family: 'Factor A', style: 'normal', weight: '600' },
  { family: 'Circular Std', style: 'normal', weight: '500' },
  { family: 'Sofia Pro', style: 'normal', weight: '600' },
  // Tech/Modern
  { family: 'Space Grotesk', style: 'normal', weight: '600' },
  { family: 'JetBrains Mono', style: 'normal', weight: '600' },
  { family: 'IBM Plex Sans', style: 'normal', weight: '600' },
  { family: 'Geist', style: 'normal', weight: '600' },
  { family: 'General Sans', style: 'normal', weight: '600' },
  // Neutral/Versatile
  { family: 'Supreme', style: 'normal', weight: '500' },
  { family: 'Cabinet Grotesk', style: 'normal', weight: '700' },
  { family: 'Satoshi', style: 'normal', weight: '700' },
  { family: 'Switzer', style: 'normal', weight: '600' },
  { family: 'Hauora Sans', style: 'normal', weight: '600' }
];

const FONT_STYLES_ARRAY = [
  'font-sans tracking-wide font-bold',
  'font-sans uppercase tracking-[0.2em] font-black',
  'font-sans tracking-tight font-bold',
  'font-sans uppercase tracking-widest font-extrabold',
  'font-sans uppercase tracking-[0.15em] font-bold',
  'font-sans tracking-wide font-semibold'
];

const TEXT_TRANSFORMS = [
  'uppercase',
  'none',
  'capitalize'
];

const FONT_STYLES = [
  'normal',
  'italic'
];

const TEXT_DECORATIONS = [
  'none',
  'underline'
];

const LETTER_SPACING = [
  'normal',
  'wide',
  'wider',
  'widest',
  'tight',
  'tighter'
];

const CARD_GRADIENTS = [
  'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800',
  'bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700',
  'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700',
  'bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600',
  'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900',
  'bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-800',
  'bg-gradient-to-br from-teal-700 via-emerald-700 to-teal-800'
];

export default function MoodBoard() {
  const [, navigate] = useLocation();
  const moodBoardRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [colors, setColors] = useState<Array<{ hex: string; name: string }>>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [regeneratingSection, setRegeneratingSection] = useState<RegenerationSection | null>(null);
  const [logoSvg, setLogoSvg] = useState<string>("");
  const [iconStyle, setIconStyle] = useState<IconStyle>('initials-simple');
  const [logoColor, setLogoColor] = useState("#000000");
  const [cardBackgrounds, setCardBackgrounds] = useState<string[]>(CARD_GRADIENTS.slice(0, 3));
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const selectedCardRef = useRef<HTMLDivElement>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const brandName = params.get('name');
  const formData = JSON.parse(sessionStorage.getItem('generatorFormData') || '{}');

  const { fonts, loadFonts } = useFonts();

  const { data: moodBoardData, isLoading } = useQuery<MoodBoardData>({
    queryKey: ['/api/mood-board', brandName],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/mood-board?name=${encodeURIComponent(brandName || '')}&industry=${encodeURIComponent(formData.industry || '')}&style=${encodeURIComponent(formData.style || '')}`);
      return response.json();
    },
    enabled: !!brandName && !!formData.industry && !!formData.style,
  });


  useEffect(() => {
    if (moodBoardData?.colors) {
      setColors(moodBoardData.colors);
    }
  }, [moodBoardData?.colors]);

  useEffect(() => {
    if (!moodBoardData?.images?.length) return;

    const loadImages = async () => {
      const imagePromises = moodBoardData.images.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = reject;
          img.src = url;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    };

    loadImages();
  }, [moodBoardData?.images]);

  const handleCopyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${brandName?.toLowerCase().replace(/\s+/g, '-')}-image-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the image",
        variant: "destructive",
      });
    }
  };

  const handleRegenerate = async (section: RegenerationSection['type'], imageIndex?: number) => {
    if (!brandName || !formData.industry || !formData.style) return;

    setRegeneratingSection({ type: section, index: imageIndex });

    try {
      let endpoint = '';
      let response;
      let updatedData: {
        colors?: Array<{ hex: string; name: string }>;
        keywords?: string[];
        moodDescription?: string;
        image?: string;
      } = {};

      switch (section) {
        case 'colors':
          endpoint = `/api/mood-board/regenerate-colors?name=${encodeURIComponent(brandName)}&industry=${encodeURIComponent(formData.industry)}&style=${encodeURIComponent(formData.style)}`;
          response = await apiRequest("POST", endpoint);
          updatedData = await response.json();

          queryClient.setQueryData(['/api/mood-board', brandName], (oldData: any) => ({
            ...oldData,
            colors: updatedData.colors,
          }));
          setColors(updatedData.colors || []);
          break;

        case 'keywords':
          endpoint = `/api/mood-board/regenerate-keywords?name=${encodeURIComponent(brandName)}&industry=${encodeURIComponent(formData.industry)}&style=${encodeURIComponent(formData.style)}`;
          response = await apiRequest("POST", endpoint);
          updatedData = await response.json();

          queryClient.setQueryData(['/api/mood-board', brandName], (oldData: any) => ({
            ...oldData,
            keywords: updatedData.keywords,
          }));
          break;

        case 'mood':
          endpoint = `/api/mood-board/regenerate-mood?name=${encodeURIComponent(brandName)}&industry=${encodeURIComponent(formData.industry)}&style=${encodeURIComponent(formData.style)}`;
          response = await apiRequest("POST", endpoint);
          updatedData = await response.json();

          queryClient.setQueryData(['/api/mood-board', brandName], (oldData: any) => ({
            ...oldData,
            moodDescription: updatedData.moodDescription,
          }));
          break;

        case 'image':
          if (typeof imageIndex !== 'number' || !moodBoardData) return;

          endpoint = `/api/mood-board/regenerate-image`;
          response = await apiRequest("POST", endpoint, {
            prompt: moodBoardData.imagePrompts[imageIndex],
            style: formData.style,
          });
          updatedData = await response.json();

          queryClient.setQueryData(['/api/mood-board', brandName], (oldData: any) => {
            const newImages = [...oldData.images];
            newImages[imageIndex] = updatedData.image;
            return {
              ...oldData,
              images: newImages,
            };
          });
          break;
      }

      toast({
        title: "Success",
        description: `Regenerated ${section} successfully`,
      });
    } catch (error) {
      toast({
        title: "Regeneration failed",
        description: "Failed to regenerate content",
        variant: "destructive",
      });
    } finally {
      setRegeneratingSection(null);
    }
  };

  const handleDownload = async (format: 'png' | 'pdf') => {
    if (!moodBoardRef.current || !brandName || !imagesLoaded) {
      console.log("Cannot download: ", {
        hasRef: !!moodBoardRef.current,
        brandName,
        imagesLoaded
      });
      return;
    }

    try {
      const canvas = await html2canvas(moodBoardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: true,
        allowTaint: true,
        foreignObjectRendering: true,
        width: moodBoardRef.current.offsetWidth,
        height: moodBoardRef.current.offsetHeight,
        windowWidth: moodBoardRef.current.scrollWidth,
        windowHeight: moodBoardRef.current.scrollHeight,
      });

      if (format === 'png') {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-moodboard.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });

        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          0,
          canvas.width,
          canvas.height
        );
        pdf.save(`${brandName.toLowerCase().replace(/\s+/g, '-')}-moodboard.pdf`);
      }
    } catch (error) {
      console.error("Error during download:", error);
    }
  };

  useEffect(() => {
    const savedConfig = sessionStorage.getItem('selectedLogoConfig');

    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setIconStyle(parsedConfig.iconStyle || 'initials-simple');
        setLogoColor(parsedConfig.iconColor || '#000000');
      } catch (error) {
        console.error('Error loading configuration:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (brandName) {
      generateLogo();
    }
  }, [brandName, iconStyle, logoColor]);


  const generateLogo = () => {
    if (!brandName) return;
    const svg = generateIconSvg(brandName, {
      style: iconStyle,
      color: logoColor,
      backgroundColor: 'white'
    });
    const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
    setLogoSvg(dataUrl);
  };

  const handleRegenerateLogo = () => {
    if (!brandName) return;

    try {
      const styles = Object.keys(ICON_STYLES)
        .flatMap(category => ICON_STYLES[category as keyof typeof ICON_STYLES])
        .map(style => style.value);

      const availableStyles = styles.filter(style => style !== iconStyle);
      const newStyle = availableStyles[Math.floor(Math.random() * availableStyles.length)] as IconStyle;

      const hue = Math.floor(Math.random() * 360);
      const saturation = 60 + Math.floor(Math.random() * 20);
      const lightness = 45 + Math.floor(Math.random() * 15);
      const newLogoColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      setIconStyle(newStyle);
      setLogoColor(newLogoColor);

      const newFontStyles = Array(3).fill(null).map(() => {
        const randomFont = FONT_FAMILIES[Math.floor(Math.random() * FONT_FAMILIES.length)];
        return {
          fontFamily: randomFont.family,
          fontWeight: randomFont.weight,
          fontStyle: 'normal',
          textTransform: TEXT_TRANSFORMS[Math.floor(Math.random() * TEXT_TRANSFORMS.length)],
          letterSpacing: LETTER_SPACING[Math.floor(Math.random() * LETTER_SPACING.length)],
        };
      });

      const usedGradients = new Set();
      const newBackgrounds = Array(3).fill(null).map(() => {
        let gradient;
        do {
          gradient = CARD_GRADIENTS[Math.floor(Math.random() * CARD_GRADIENTS.length)];
        } while (usedGradients.has(gradient));
        usedGradients.add(gradient);
        return gradient;
      });

      sessionStorage.setItem('fontStyles', JSON.stringify(newFontStyles));

      setCardBackgrounds(newBackgrounds);

    } catch (error) {
      console.error('Error regenerating logo:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate new variations.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadLogo = async () => {
    if (!brandName || !selectedCardRef.current) {
      console.log("Cannot download: missing brandName or card reference");
      return;
    }

    try {
      const canvas = await html2canvas(selectedCardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-logo.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error during logo download:", error);
      toast({
        title: "Download failed",
        description: "Failed to download the logo",
        variant: "destructive",
      });
    }
  };

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
    sessionStorage.setItem('selectedLogoConfig', JSON.stringify({
      iconStyle,
      logoColor,
    }));
  };

  const handleStyleChange = (value: string) => {
    setIconStyle(value as IconStyle);
  };

  const ColorInputs = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="space-y-2">
        <Label htmlFor="icon-style">Icon Options</Label>
        <Select
          value={iconStyle}
          onValueChange={handleStyleChange}
        >
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

      <div className="space-y-2">
        <Label htmlFor="logo-color">Logo Color</Label>
        <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-10 p-0 flex items-center justify-center"
            >
              <span className="text-foreground">{logoColor}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" onPointerDownOutside={(e) => e.preventDefault()}>
            <HexColorPicker
              color={logoColor}
              onChange={setLogoColor}
              style={{ width: '200px', height: '200px' }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  const LogoCard = ({ index, cardId, isSelected, background, fontStyle, onSelect }: {
    index: number;
    cardId: string;
    isSelected: boolean;
    background: string;
    fontStyle: any;
    onSelect: () => void;
  }) => {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card
          className={`${background} transition-transform hover:scale-105 overflow-hidden shadow-lg dark:shadow-md dark:shadow-black/20 cursor-pointer ${
            isSelected ? 'ring-4 ring-primary ring-offset-2' : ''
          }`}
          onClick={onSelect}
        >
          <CardContent
            className="p-6 flex flex-col items-center justify-center min-h-[300px] gap-4"
            ref={isSelected ? selectedCardRef : null}
          >
            {logoSvg && (
              <motion.div
                className="w-16 h-16 mb-2 rounded-lg overflow-hidden bg-white/90 dark:bg-white/80 p-2 shadow-sm"
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
              className="text-3xl text-center text-white"
              style={{
                fontFamily: fontStyle?.fontFamily || 'Inter',
                fontWeight: fontStyle?.fontWeight || '600',
                fontStyle: 'normal',
                textTransform: fontStyle?.textTransform || 'none',
                letterSpacing: fontStyle?.letterSpacing || 'normal',
                color: 'white'
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {brandName}
            </motion.h3>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const CardGrid = () => {
    const fontStyles = JSON.parse(sessionStorage.getItem('fontStyles') || '[]');

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3).fill(null).map((_, index) => {
          const cardId = `variation-${index}`;
          const isSelected = selectedCardId === cardId;
          const fontStyle = fontStyles[index] || FONT_STYLES_ARRAY[index % FONT_STYLES_ARRAY.length];

          return (
            <LogoCard
              key={cardId}
              index={index}
              cardId={cardId}
              isSelected={isSelected}
              background={cardBackgrounds[index]}
              fontStyle={fontStyle}
              onSelect={() => handleCardSelect(cardId)}
            />
          );
        })}
      </div>
    );
  };

  const BrandLogoSection = () => (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl font-semibold"
            style={fonts?.primary ? {
              fontFamily: fonts.primary.family,
              fontWeight: fonts.primary.weight,
              fontStyle: fonts.primary.style,
            } : undefined}
          >
            Brand Logo
          </h2>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadLogo}
                  disabled={!selectedCardId}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download selected logo as PNG</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerateLogo}
                >
                  <SparkleIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate new variations</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <ColorInputs />
        <CardGrid />
      </CardContent>
    </Card>
  );

  const handleExport = () => {
    const a = document.createElement('a');
    a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(colors));
    a.download = `${brandName?.toLowerCase().replace(/\s+/g, '-')}-palette.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoColor(e.target.value);
  };

  if (!brandName) {
    navigate('/');
    return null;
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-4"
              onClick={() => navigate(`/brand-variations?name=${encodeURIComponent(brandName || '')}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Brand Studio
            </Button>
            <Logo />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6"
          style={fonts?.primary ? {
            fontFamily: fonts.primary.family,
            fontWeight: fonts.primary.weight,
            fontStyle: fonts.primary.style,
          } : undefined}
        >
          Brand Mood Board: {brandName}
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[200px] rounded-lg" />
            <Skeleton className="h-[200px] rounded-lg" />
          </div>
        ) : moodBoardData ? (
          <div className="grid grid-cols-1 gap-6" ref={moodBoardRef}>
            <BrandLogoSection />
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className="text-xl font-semibold"
                    style={fonts?.primary ? {
                      fontFamily: fonts.primary.family,
                      fontWeight: fonts.primary.weight,
                      fontStyle: fonts.primary.style,
                    } : undefined}
                  >
                    Color Palette
                  </h2>
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExport()}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download color palette</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRegenerate('colors')}
                          disabled={regeneratingSection?.type === 'colors'}
                        >
                          <SparkleIcon className={`h-4 w-4 ${regeneratingSection?.type=== 'colors' ? 'animate-spin' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Generate new colors</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  {regeneratingSection?.type === 'colors' ? (
                    <motion.div
                      initial={{ opacity: 0 }}                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2"
                    >
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ColorPaletteEditor
                        colors={colors}
                        onChange={setColors}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className="text-xl font-semibold"
                    style={fonts?.primary ? {
                      fontFamily: fonts.primary.family,
                      fontWeight: fonts.primary.weight,
                      fontStyle: fonts.primary.style,
                    } : undefined}
                  >
                    Brand Keywords
                  </h2>
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyToClipboard(moodBoardData.keywords.join(', '), 'Keywords')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy keywords</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRegenerate('keywords')}
                          disabled={regeneratingSection?.type === 'keywords'}
                        >
                          <SparkleIcon className={`h-4 w-4 ${regeneratingSection?.type === 'keywords' ? 'animate-spin' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Regenerate with AI</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  {regeneratingSection?.type === 'keywords' ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-wrap gap-3"
                    >
                      {Array(5).fill(0).map((_, index) => (
                        <Skeleton key={index} className="h-8 w-24 rounded-full" />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-wrap gap-3"
                    >
                      {moodBoardData.keywords.map((keyword, index) => (
                        <motion.span
                          key={index}
                          className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-muted-foreground"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          style={fonts?.secondary ? {
                            fontFamily: fonts.secondary.family,
                            fontWeight: fonts.secondary.weight,
                            fontStyle: fonts.secondary.style,
                          } : undefined}
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className="text-xl font-semibold"
                    style={fonts?.primary ? {
                      fontFamily: fonts.primary.family,
                      fontWeight: fonts.primary.weight,
                      fontStyle: fonts.primary.style,
                    } : undefined}
                  >
                    Brand Mood
                  </h2>
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyToClipboard(moodBoardData.moodDescription, 'Mood description')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy description</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRegenerate('mood')}
                          disabled={regeneratingSection?.type === 'mood'}
                        >
                          <SparkleIcon className={`h-4 w-4 ${regeneratingSection?.type === 'mood' ? 'animate-spin' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Regenerate with AI</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  {regeneratingSection?.type === 'mood' ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2"
                    >
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/6" />
                    </motion.div>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-muted-foreground leading-relaxed"
                      style={fonts?.secondary ? {
                        fontFamily: fonts.secondary.family,
                        fontWeight: fonts.secondary.weight,
                        fontStyle: fonts.secondary.style,
                      } : undefined}
                    >
                      {moodBoardData.moodDescription}
                    </motion.p>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {moodBoardData.images?.map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <div className="flex justify-end gap-2 mb-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadImage(imageUrl, index)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download image</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRegenerate('image', index)}
                            disabled={regeneratingSection?.type === 'image' && regeneratingSection.index === index}
                          >
                            <SparkleIcon className={`h-4 w-4 ${regeneratingSection?.type === 'image' && regeneratingSection.index === index ? 'animate-spin' : ''}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Regenerate with AI</TooltipContent>
                      </Tooltip>
                    </div>
                    <AnimatePresence mode="wait">
                      {regeneratingSection?.type === 'image' && regeneratingSection.index === index ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="aspect-video bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center"
                        >
                          <Skeleton className="w-full h-full" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="aspect-video bg-muted/50 rounded-lg overflow-hidden"
                        >
                          <img
                            src={imageUrl}
                            alt={`Mood image ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Failed to load mood board data. Please make sure you have selected a brand name and style.
          </p>
        )}

      </div>
    </TooltipProvider>
  );
}