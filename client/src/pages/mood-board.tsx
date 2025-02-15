import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Type, SparkleIcon, Copy } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const BACKGROUNDS = [
  { bg: 'bg-blue-500 text-white', text: 'text-white' },
  { bg: 'bg-red-500 text-white', text: 'text-white' },
  { bg: 'bg-green-500 text-white', text: 'text-white' },
  { bg: 'bg-yellow-500 text-black', text: 'text-black' },
  { bg: 'bg-purple-500 text-white', text: 'text-white' },
];

const getRandomPleaseantColor = () => {
  const randomIndex = Math.floor(Math.random() * BACKGROUNDS.length);
  return BACKGROUNDS[randomIndex].bg;
}


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

const FONT_FAMILIES = [
  { family: 'Playfair Display', style: 'normal', weight: '700' },
  { family: 'Montserrat', style: 'normal', weight: '600' },
  { family: 'Roboto Slab', style: 'normal', weight: '500' },
  { family: 'Poppins', style: 'normal', weight: '700' },
  { family: 'Lora', style: 'italic', weight: '600' },
  { family: 'Merriweather', style: 'normal', weight: '900' },
  { family: 'Source Sans Pro', style: 'normal', weight: '700' },
  { family: 'Open Sans', style: 'normal', weight: '800' },
  { family: 'Raleway', style: 'normal', weight: '700' },
  { family: 'Nunito', style: 'normal', weight: '800' },
  { family: 'Work Sans', style: 'normal', weight: '700' },
  { family: 'DM Serif Display', style: 'normal', weight: '400' }
];

const TEXT_TRANSFORMS = [
  'uppercase',
  'lowercase',
  'capitalize',
  'none'
];

const FONT_STYLES_ARRAY = [
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

type IconStyle =
  | 'initials-simple'
  | 'initials-rounded'
  | 'initials-gradient'
  | 'geometric-circle'
  | 'geometric-square'
  | 'geometric-hexagon'
  | 'geometric-triangle'
  | 'geometric-diamond'
  | 'abstract-waves'
  | 'abstract-dots'
  | 'abstract-lines'
  | 'abstract-mesh'
  | 'abstract-swirl'
  | 'modern-minimal'
  | 'modern-tech'
  | 'modern-gradient'
  | 'decorative-floral'
  | 'decorative-vintage'
  | 'decorative-ornate';

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

interface FontStyle {
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textTransform: string;
  letterSpacing: string;
}


export default function MoodBoard() {
  const [, navigate] = useLocation();
  const moodBoardRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [colors, setColors] = useState<Array<{ hex: string; name: string }>>([]);
  const [showFontDialog, setShowFontDialog] = useState(false);
  const [selectedFont, setSelectedFont] = useState<FontRecommendation | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [regeneratingSection, setRegeneratingSection] = useState<RegenerationSection | null>(null);
  const [logoSvg, setLogoSvg] = useState<string>("");
  const [iconStyle, setIconStyle] = useState<IconStyle>('initials-simple');
  const [iconColor, setIconColor] = useState("#000000");
  const [cardBackgrounds, setCardBackgrounds] = useState<string[]>([
    'bg-gradient-to-br from-blue-50 to-indigo-100',
    'bg-gradient-to-br from-emerald-50 to-teal-100',
    'bg-gradient-to-br from-rose-50 to-pink-100'
  ]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const selectedCardRef = useRef<HTMLDivElement>(null);

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

  const { data: fontRecommendations = [], isLoading: loadingFonts } = useQuery<FontRecommendation[]>({
    queryKey: ['/api/font-recommendations', brandName],
    queryFn: async () => {
      const response = await apiRequest(
        "GET",
        `/api/font-recommendations?name=${encodeURIComponent(brandName || '')}&industry=${encodeURIComponent(formData.industry || '')}&style=${encodeURIComponent(formData.style || '')}`
      );
      return response.json();
    },
    enabled: !!brandName,
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
    const brandStudioFonts = sessionStorage.getItem('brandStudioFonts');

    if (savedConfig || brandStudioFonts) {
      try {
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          setIconStyle(parsedConfig.iconStyle || 'initials-simple');
          setIconColor(parsedConfig.iconColor || '#000000');
          //setCardBackground(parsedConfig.cardBackground || '#FFFFFF');

        }

        if (brandStudioFonts) {
          const parsedFonts = JSON.parse(brandStudioFonts);
          if (parsedFonts?.primary?.family) {
            loadFonts(parsedFonts);
          }
        }
      } catch (error) {
        console.error('Error loading configuration:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (brandName) {
      generateLogo();
    }
  }, [brandName, iconStyle, iconColor]);


  const generateLogo = () => {
    if (!brandName) return;
    const svg = generateIconSvg(brandName, {
      style: iconStyle,
      color: iconColor,
      backgroundColor: 'white' // Always use white background for icon
    });
    const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
    setLogoSvg(dataUrl);
  };

  const handleRegenerateLogo = () => {
    if (!brandName) return;

    try {
      // Get available icon styles
      const styles = Object.keys(ICON_STYLES)
        .flatMap(category => ICON_STYLES[category as keyof typeof ICON_STYLES])
        .map(style => style.value);

      // Select new style and color
      const availableStyles = styles.filter(style => style !== iconStyle);
      const newStyle = availableStyles[Math.floor(Math.random() * availableStyles.length)] as IconStyle;

      const hue = Math.floor(Math.random() * 360);
      const saturation = 60 + Math.floor(Math.random() * 20);
      const lightness = 45 + Math.floor(Math.random() * 15);
      const newIconColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      setIconStyle(newStyle);
      setIconColor(newIconColor);

      // Generate three different font styles
      const newFontStyles = Array(3).fill(null).map(() => {
        const randomFont = FONT_FAMILIES[Math.floor(Math.random() * FONT_FAMILIES.length)];
        return {
          fontFamily: randomFont.family,
          fontWeight: randomFont.weight,
          fontStyle: FONT_STYLES[Math.floor(Math.random() * FONT_STYLES.length)],
          textTransform: TEXT_TRANSFORMS[Math.floor(Math.random() * TEXT_TRANSFORMS.length)],
          letterSpacing: LETTER_SPACING[Math.floor(Math.random() * LETTER_SPACING.length)],
        };
      });

      // Generate new background gradients
      const newBackgrounds = Array(3).fill(null).map(() => {
        const gradients = [
          'bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900',
          'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900',
          'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900',
          'bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-950 dark:to-pink-900',
          'bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-950 dark:to-purple-900',
          'bg-gradient-to-br from-lime-50 to-green-100 dark:from-lime-950 dark:to-green-900',
          'bg-gradient-to-br from-sky-50 to-cyan-100 dark:from-sky-950 dark:to-cyan-900'
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
      });

      // Store font styles in session
      sessionStorage.setItem('fontStyles', JSON.stringify(newFontStyles));

      // Update backgrounds
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
      iconColor,
      //cardBackground
    }));
  };

  // Component for the color inputs section
  const ColorInputs = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="space-y-2">
        <Label htmlFor="icon-style">Icon Options</Label>
        <Select value={iconStyle} onValueChange={setIconStyle}>
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
        <Label htmlFor="icon-color">Icon Color</Label>
        <Input
          id="icon-color"
          type="color"
          value={iconColor}
          onChange={(e) => setIconColor(e.target.value)}
          className="h-10"
        />
      </div>
    </div>
  );

  // Component for the card grid
  const CardGrid = () => {
    const fontStyles = JSON.parse(sessionStorage.getItem('fontStyles') || '[]');

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3).fill(null).map((_, index) => {
          const cardId = `variation-${index}`;
          const isSelected = selectedCardId === cardId;
          const fontStyle = fontStyles[index] || FONT_STYLES_ARRAY[index % FONT_STYLES_ARRAY.length];

          return (
            <motion.div
              key={cardId}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCardSelect(cardId)}
            >
              <Card
                className={`${cardBackgrounds[index]} transition-transform hover:scale-105 overflow-hidden shadow-lg dark:shadow-md dark:shadow-black/20 cursor-pointer ${
                  isSelected ? 'ring-4 ring-primary ring-offset-2' : ''
                }`}
              >
                <CardContent
                  className="p-6 flex flex-col items-center justify-center min-h-[300px] gap-4"
                  ref={isSelected ? selectedCardRef : null}
                >
                  {logoSvg && (
                    <motion.div
                      className="w-16 h-16 mb-2 rounded-lg overflow-hidden bg-white p-2 shadow-sm"
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
                    className="text-3xl text-center"
                    style={{
                      fontFamily: fontStyle?.fontFamily,
                      fontWeight: fontStyle?.fontWeight,
                      fontStyle: fontStyle?.fontStyle,
                      textTransform: fontStyle?.textTransform,
                      letterSpacing: fontStyle?.letterSpacing,
                      color: iconColor
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
        })}
      </div>
    );
  };

  // Render the Brand Logo section
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
    setIconColor(e.target.value);
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
          <Button
            variant="outline"
            onClick={() => setShowFontDialog(true)}
            className="flex items-center gap-2"
          >
            <Type className="h-4 w-4" />
            AI Font Recommendations
          </Button>
        </div>

        <h1
          className="text-3xl font-bold mb-6"
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
                          <SparkleIcon className={`h-4 w-4 ${regeneratingSection?.type === 'colors' ? 'animate-spin' : ''}`} />
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
                      initial={{ opacity:0 }}
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

        <Dialog open={showFontDialog} onOpenChange={setShowFontDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>AI-Recommended Font Combinations</DialogTitle>
            </DialogHeader>

            {loadingFonts ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                {fontRecommendations.map((recommendation, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all ${selectedFont === recommendation ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                    onClick={() => setSelectedFont(recommendation)}
                  >
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3
                          className="text-3xl mb-2"
                          style={{
                            fontFamily: recommendation.primary.family,
                            fontWeight: recommendation.primary.weight,
                            fontStyle: recommendation.primary.style,
                          }}
                        >
                          {brandName}
                        </h3>
                        <p
                          className="text-base"
                          style={{
                            fontFamily: recommendation.secondary.family,
                            fontWeight: recommendation.secondary.weight,
                            fontStyle: recommendation.secondary.style,
                          }}
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Primary:</strong> {recommendation.primary.family} ({recommendation.primary.weight})</p>
                        <p><strong>Secondary:</strong> {recommendation.secondary.family} ({recommendation.secondary.weight})</p>
                        <p className="mt-2">{recommendation.explanation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className="flex justify-end space-x-2 pt-4 border-t flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowFontDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (selectedFont) {
                    await loadFonts({
                      primary: selectedFont.primary,
                      secondary: selectedFont.secondary
                    });
                    setShowFontDialog(false);
                  }
                }}
                disabled={!selectedFont}
              >
                Apply Font Combination
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
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