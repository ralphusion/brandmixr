import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, SparkleIcon, Copy, Building2, Mail, MapPin, Phone, Crown } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

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
}

type RegenerationSection = {
  type: 'colors' | 'keywords' | 'mood';
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
    queryKey: ['/api/mood-board', brandName, formData.provider],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/mood-board?name=${encodeURIComponent(brandName || '')}&industry=${encodeURIComponent(formData.industry || '')}&style=${encodeURIComponent(formData.style || '')}&provider=${encodeURIComponent(formData.provider || 'openai')}`);
      return response.json();
    },
    enabled: !!brandName && !!formData.industry && !!formData.style,
  });

  useEffect(() => {
    if (moodBoardData?.colors) {
      setColors(moodBoardData.colors);
    }
  }, [moodBoardData?.colors]);

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

  const handleRegenerate = async (section: RegenerationSection['type']) => {
    if (!brandName || !formData.industry || !formData.style) {
      toast({
        title: "Missing Information",
        description: "Required information is missing for regeneration",
        variant: "destructive",
      });
      return;
    }

    setRegeneratingSection({ type: section });

    try {
      let endpoint = '';
      let response;
      let updatedData: {
        colors?: Array<{ hex: string; name: string }>;
        keywords?: string[];
        moodDescription?: string;
      } = {};

      switch (section) {
        case 'colors':
          endpoint = `/api/mood-board/regenerate-colors?name=${encodeURIComponent(brandName)}&industry=${encodeURIComponent(formData.industry)}&style=${encodeURIComponent(formData.style)}&provider=${encodeURIComponent(formData.provider || 'openai')}`;
          console.log('Regenerating colors with endpoint:', endpoint);

          response = await apiRequest("POST", endpoint);

          if (!response.ok) {
            throw new Error(`Failed to regenerate colors: ${response.statusText}`);
          }

          updatedData = await response.json();

          if (!updatedData.colors || !Array.isArray(updatedData.colors)) {
            throw new Error('Invalid color data received from server');
          }

          queryClient.setQueryData(['/api/mood-board', brandName], (oldData: any) => ({
            ...oldData,
            colors: updatedData.colors,
          }));
          setColors(updatedData.colors || []);
          break;

        case 'keywords':
          endpoint = `/api/mood-board/regenerate-keywords?name=${encodeURIComponent(brandName)}&industry=${encodeURIComponent(formData.industry)}&style=${encodeURIComponent(formData.style)}&provider=${encodeURIComponent(formData.provider || 'openai')}`;
          response = await apiRequest("POST", endpoint);
          updatedData = await response.json();

          queryClient.setQueryData(['/api/mood-board', brandName], (oldData: any) => ({
            ...oldData,
            keywords: updatedData.keywords,
          }));
          break;

        case 'mood':
          endpoint = `/api/mood-board/regenerate-mood?name=${encodeURIComponent(brandName)}&industry=${encodeURIComponent(formData.industry)}&style=${encodeURIComponent(formData.style)}&provider=${encodeURIComponent(formData.provider || 'openai')}`;
          response = await apiRequest("POST", endpoint);
          updatedData = await response.json();

          queryClient.setQueryData(['/api/mood-board', brandName], (oldData: any) => ({
            ...oldData,
            moodDescription: updatedData.moodDescription,
          }));
          break;
      }

      toast({
        title: "Success",
        description: `Regenerated ${section} successfully`,
      });
    } catch (error) {
      console.error('Regeneration error:', error);
      toast({
        title: "Regeneration failed",
        description: error instanceof Error ? error.message : "Failed to regenerate content",
        variant: "destructive",
      });
    } finally {
      setRegeneratingSection(null);
    }
  };

  const handleDownload = async (format: 'png' | 'pdf') => {
    if (!moodBoardRef.current || !brandName) {
      console.log("Cannot download: missing reference or brand name");
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
      toast({
        title: "Download failed",
        description: "Failed to download the mood board",
        variant: "destructive",
      });
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
      // Create a clone of the card for capturing
      const cloneContainer = document.createElement('div');
      cloneContainer.style.position = 'absolute';
      cloneContainer.style.left = '-9999px';
      cloneContainer.style.width = '400px'; // Fixed width for consistent output
      document.body.appendChild(cloneContainer);

      // Clone the card content
      const clone = selectedCardRef.current.cloneNode(true) as HTMLElement;
      clone.style.width = '400px';
      clone.style.height = '300px';
      clone.style.padding = '24px';
      clone.style.display = 'flex';
      clone.style.flexDirection = 'column';
      clone.style.alignItems = 'center';
      clone.style.justifyContent = 'center';
      clone.style.position = 'relative';
      clone.style.borderRadius = '8px';
      clone.style.overflow = 'hidden';

      // Ensure the background gradient is preserved
      const cardBackground = cardBackgrounds[parseInt(selectedCardId?.split('-')[1] || '0')];
      clone.className = `${cardBackground} shadow-lg`;

      cloneContainer.appendChild(clone);

      const canvas = await html2canvas(clone, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 400,
        height: 300,
        onclone: (_, element) => {
          // Additional styling fixes for the cloned element
          const imgElements = element.getElementsByTagName('img');
          for (let img of imgElements) {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
          }
        }
      });

      // Clean up the temporary elements
      document.body.removeChild(cloneContainer);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-logo.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Logo downloaded successfully with background",
      });
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-lg sm:text-xl font-semibold"
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
                  className="h-10 w-10"
                  onClick={handleDownloadLogo}
                  disabled={!selectedCardId}
                >
                  <Download className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download selected logo as PNG</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10"
                  onClick={handleRegenerateLogo}
                >
                  <SparkleIcon className="h-5 w-5" />
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
    try {
      if (!colors || colors.length === 0) {
        throw new Error('No colors available to export');
      }

      const colorData = JSON.stringify(colors, null, 2);
      const blob = new Blob([colorData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${brandName?.toLowerCase().replace(/\s+/g, '-')}-palette.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Color palette exported successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export color palette",
        variant: "destructive",
      });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoColor(e.target.value);
  };

  if (!brandName) {
    navigate('/');
    return null;
  }

  const ProductMockupsSection = ({ selectedCardId, cardBackgrounds, logoSvg, brandName, fonts }: {
    selectedCardId: string | null;
    cardBackgrounds: string[];
    logoSvg: string;
    brandName: string;
    fonts: FontSettings | null;
  }) => {
    const selectedBackground = selectedCardId ? cardBackgrounds[parseInt(selectedCardId.split('-')[1])] : undefined;
    const selectedIndex = selectedCardId ? parseInt(selectedCardId.split('-')[1]) : 0;

    const fontStyles = JSON.parse(sessionStorage.getItem('fontStyles') || '[]');
    const selectedFont = selectedCardId ? fontStyles[parseInt(selectedCardId.split('-')[1])] : null;

    // Website mockup styling
    const textStyle = {
      fontFamily: selectedFont?.fontFamily || fonts?.primary?.family || 'Inter',
      fontWeight: selectedFont?.fontWeight || fonts?.primary?.weight || '600',
      fontStyle: selectedFont?.fontStyle || 'normal',
      textTransform: selectedFont?.textTransform || 'none',
      letterSpacing: selectedFont?.letterSpacing || 'normal',
      color: colors[0]?.hex || '#000000' // Using first color from palette for headers
    };

    const secondaryTextStyle = {
      fontFamily: selectedFont?.fontFamily || fonts?.secondary?.family || 'Inter',
      fontWeight: selectedFont?.fontWeight || fonts?.secondary?.weight || '400',
      fontStyle: selectedFont?.fontStyle || 'normal',
      textTransform: 'none',
      letterSpacing: 'normal',
      color: colors[1]?.hex || '#000000' // Using second color from palette
    };

    const tertiaryTextStyle = {
      fontFamily: selectedFont?.fontFamily || fonts?.secondary?.family || 'Inter',
      fontWeight: selectedFont?.fontWeight || fonts?.secondary?.weight || '400',
      fontStyle: selectedFont?.fontStyle || 'normal',
      textTransform: 'none',
      letterSpacing: 'normal',
      color: 'white' // Ensure good contrast
    };


    return (
      <Card className="shadow-md">
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground" style={textStyle}>
              Brand Website Preview
            </h2>
          </div>

          {selectedCardId && (
            <div className="space-y-8">
              {/* Navigation Bar */}
              <div className={`${selectedBackground} w-full rounded-lg overflow-hidden`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white/90 dark:bg-white/80 rounded-lg p-2">
                        {logoSvg && (
                          <img
                            src={logoSvg}
                            alt="Brand Logo"
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                      <span className="text-white font-semibold text-lg" style={textStyle}>
                        {brandName}
                      </span>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                      {['Home', 'About', 'Services', 'Contact'].map((item) => (
                        <span
                          key={item}
                          className="text-white/90 hover:text-white cursor-pointer"
                          style={textStyle}
                        >
                          {item}
                        </span>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className={`${selectedBackground} w-full min-h-[400px] rounded-lg overflow-hidden relative`}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                  <div className="max-w-2xl">
                    <h1 
                      className="text-4xl sm:text-5xl font-bold mb-6"
                      style={{...textStyle, color: colors[0]?.hex || '#000000'}}
                    >
                      Elevate Your Experience with {brandName}
                    </h1>
                    <p 
                      className="text-xl mb-8"
                      style={{...textStyle, color: colors[0]?.hex || '#000000'}}
                    >
                      Discover excellence through innovation and style. We bring your vision to life with precision and passion.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button 
                        className="px-4 py-2 rounded"
                        style={{ 
                          backgroundColor: colors[2]?.hex || '#000000',
                          color: '#ffffff'
                        }}
                      >
                        Get Started
                      </Button>
                      <Button 
                        className="px-4 py-2 rounded"
                        style={{ 
                          backgroundColor: colors[1]?.hex || '#000000',
                          color: '#ffffff'
                        }}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                {['Innovation', 'Quality', 'Excellence'].map((feature, idx) => (
                  <Card key={feature} className="overflow-hidden">
                    <CardContent className={`bg-gray-100 p-6 h-full flex flex-col items-center text-center`}>
                      <div className="w-12 h-12 bg-white/90 rounded-full mb-4 flex items-center justify-center">
                        <div className="w-6 h-6 text-gray-900">
                          {idx === 0 && <Building2 />}
                          {idx === 1 && <SparkleIcon />}
                          {idx === 2 && <Crown />}
                        </div>
                      </div>
                      <h3 
                        className="text-xl font-semibold text-black mb-2"
                        style={secondaryTextStyle}
                      >
                        {feature}
                      </h3>
                      <p 
                        className="text-black/90"
                        style={secondaryTextStyle}
                      >
                        Experience unparalleled {feature.toLowerCase()} with our cutting-edge solutions and dedicated expertise.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Contact Section */}
              <Card className={`bg-gray-100 overflow-hidden`}>
                <CardContent className="p-6">
                  <h3 
                    className="text-2xl font-semibold text-black mb-6"
                    style={secondaryTextStyle}
                  >
                    Get in Touch
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      {[
                        { icon: <MapPin className="w-5 h-5" />, text: "123 Business Avenue, Suite 100" },
                        { icon: <Phone className="w-5 h-5" />, text: "+1 (555) 123-4567" },
                        { icon: <Mail className="w-5 h-5" />, text: `contact@${brandName.toLowerCase().replace(/\s+/g, '')}.com` }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center text-black/90 space-x-3">
                          {item.icon}
                          <span style={secondaryTextStyle}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="Name" 
                        className="bg-white/10 border-gray-300 text-black placeholder:text-gray-400"
                        style={secondaryTextStyle}
                      />
                      <Input 
                        placeholder="Email" 
                        className="bg-white/10 border-gray-300 text-black placeholder:text-gray-400"
                        style={secondaryTextStyle}
                      />
                      <Input 
                        placeholder="Message" 
                        className="col-span-2 bg-white/10 border-gray-300 text-black placeholder:text-gray-400"
                        style={secondaryTextStyle}
                      />
                      <Button 
                        className="col-span-2 px-4 py-2 rounded"
                        style={{ 
                          backgroundColor: colors[2]?.hex || '#000000',
                          color: '#ffffff'
                        }}
                      >
                        Send Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!brandName) {
    navigate('/');
    return null;
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
        {/* Header section with improved mobile spacing */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button
              variant="ghost"
              className="p-2 sm:mr-4"
              onClick={() => navigate(`/brand-variations?name=${encodeURIComponent(brandName || '')}`)}
            >
              <span className="hidden sm:inline">Back to Brand Studio</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <Logo className="h-6 sm:h-8" />
          </div>
        </div>

        <h1
          className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-black"
          style={fonts?.primary ? {
            fontFamily: fonts.primary.family,
            fontWeight: fonts.primary.weight,
            fontStyle: fonts.primary.style,
          } : undefined}
        >
          Brand Mood Board: {brandName}
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <Skeleton className="h-[200px] rounded-lg" />
            <Skeleton className="h-[200px] rounded-lg" />
          </div>
        ) : moodBoardData ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-6" ref={moodBoardRef}>
            {/* Brand Logo Section with improved mobile layout */}
            <BrandLogoSection />

            {/* Rest of the components with mobile optimizations */}
            {/* Color Palette Section */}
            <Card className="shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className="text-lg sm:text-xl font-semibold text-black"
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
                          className="h-10 w-10"
                          onClick={handleExport}
                        >
                          <Download className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download color palette</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10"
                          onClick={() => handleRegenerate('colors')}
                          disabled={regeneratingSection?.type === 'colors'}
                        >
                          <SparkleIcon className={`h-5 w-5 ${regeneratingSection?.type === 'colors' ? 'animate-spin' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Generate new colors</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {regeneratingSection?.type === 'colors' ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
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

            {/* Keywords Section */}
            <Card className="shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className="text-lg sm:text-xl font-semibold text-black"
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
                          className="h-10 w-10"
                          onClick={() => handleCopyToClipboard(moodBoardData.keywords.join(', '), 'Keywords')}
                        >
                          <Download className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy keywords</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10"
                          onClick={() => handleRegenerate('keywords')}
                          disabled={regeneratingSection?.type === 'keywords'}
                        >
                          <SparkleIcon className={`h-5 w-5 ${regeneratingSection?.type === 'keywords' ? 'animate-spin' : ''}`} />
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
            {/* Brand Mood Section */}
            <Card className="shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className="text-lg sm:text-xl font-semibold text-black"
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
                          className="h-10 w-10"
                          onClick={() => handleCopyToClipboard(moodBoardData.moodDescription, 'Mood description')}
                        >
                          <Copy className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy description</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10"
                          onClick={() => handleRegenerate('mood')}
                          disabled={regeneratingSection?.type === 'mood'}
                        >
                          <SparkleIcon className={`h-5 w-5 ${regeneratingSection?.type === 'mood' ? 'animate-spin' : ''}`} />
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
                      <Skeleton className="h-24 w-full rounded-lg" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="prose dark:prose-invert"
                    >
                      <p 
                        className="text-black"
                        style={fonts?.secondary ? {
                          fontFamily: fonts.secondary.family,
                          fontWeight: fonts.secondary.weight,
                          fontStyle: fonts.secondary.style,
                        } : undefined}
                      >
                        {moodBoardData.moodDescription}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
            <ProductMockupsSection 
              selectedCardId={selectedCardId} 
              cardBackgrounds={cardBackgrounds} 
              logoSvg={logoSvg} 
              brandName={brandName} 
              fonts={fonts} 
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Failed to load mood board data</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}