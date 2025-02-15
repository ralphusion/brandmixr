import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Download, Type, RotateCcw } from "lucide-react";
import { SparkleIcon } from "@/components/SparkleIcon";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateIconSvg } from "@/lib/generateIcon";

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

// Update the regeneration section type to include 'colors'
type RegenerationSection = {
  type: 'colors' | 'keywords' | 'mood' | 'image';
  index?: number;
};

const ICON_STYLES = {
  initials: [
    { value: 'initials-simple', label: 'Simple Initials' },
    { value: 'initials-detailed', label: 'Detailed Initials' },
  ],
  abstract: [
    { value: 'abstract-geometric', label: 'Geometric Abstract' },
    { value: 'abstract-organic', label: 'Organic Abstract' },
  ],
};

// Update font families with more diverse options
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
  { family: 'DM Serif Display', style: 'normal', weight: '400' },
  { family: 'Roboto', style: 'normal', weight: '400' },
  { family: 'Times New Roman', style: 'normal', weight: '700' },
  { family: 'Helvetica', style: 'normal', weight: '700' },
  { family: 'Georgia', style: 'italic', weight: '700' },
  { family: 'Palatino', style: 'normal', weight: '700' },
  { family: 'Garamond', style: 'italic', weight: '600' },
  { family: 'Futura', style: 'normal', weight: '700' },
  { family: 'Verdana', style: 'normal', weight: '700' }
];

const TEXT_TRANSFORMS = [
  'uppercase',
  'lowercase',
  'capitalize',
  'none'
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

type IconStyle = 'initials-simple' | 'initials-detailed' | 'abstract-geometric' | 'abstract-organic';

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
  textDecoration: string;
  letterSpacing: string;
}

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
  const [iconStyle, setIconStyle] = useState<string>('initials-simple');
  const [iconColor, setIconColor] = useState("#000000");
  const [selectedBackground, setSelectedBackground] = useState<typeof BACKGROUNDS[0] | null>(null);
  const [selectedFontStyle, setSelectedFontStyle] = useState<FontStyle | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null); // Added state for selected card


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
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
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
      let updatedData;

      switch (section) {
        case 'colors':
          endpoint = `/api/mood-board/regenerate-colors?name=${encodeURIComponent(brandName)}&industry=${encodeURIComponent(formData.industry)}&style=${encodeURIComponent(formData.style)}`;
          const colorsResponse = await apiRequest("POST", endpoint);
          updatedData = await colorsResponse.json();

          queryClient.setQueryData(['/api/mood-board', brandName], (oldData: any) => ({
            ...oldData,
            colors: updatedData.colors,
          }));
          setColors(updatedData.colors);
          break;

        case 'keywords':
          endpoint = `/api/mood-board/regenerate-keywords?name=${encodeURIComponent(brandName)}&industry=${encodeURIComponent(formData.industry)}&style=${encodeURIComponent(formData.style)}`;
          const keywordsResponse = await apiRequest("POST", endpoint);
          updatedData = await keywordsResponse.json();

          queryClient.setQueryData(['/api/mood-board', brandName], (oldData: any) => ({
            ...oldData,
            keywords: updatedData.keywords,
          }));
          break;

        case 'mood':
          endpoint = `/api/mood-board/regenerate-mood?name=${encodeURIComponent(brandName)}&industry=${encodeURIComponent(formData.industry)}&style=${encodeURIComponent(formData.style)}`;
          const moodResponse = await apiRequest("POST", endpoint);
          updatedData = await moodResponse.json();

          queryClient.setQueryData(['/api/mood-board', brandName], (oldData: any) => ({
            ...oldData,
            moodDescription: updatedData.moodDescription,
          }));
          break;

        case 'image':
          if (typeof imageIndex !== 'number' || !moodBoardData) return;

          endpoint = `/api/mood-board/regenerate-image`;
          const imageResponse = await apiRequest("POST", endpoint, {
            prompt: moodBoardData.imagePrompts[imageIndex],
            style: formData.style,
          });
          updatedData = await imageResponse.json();

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
      const parsedConfig = JSON.parse(savedConfig);
      setIconStyle(parsedConfig.iconStyle);
      setIconColor(parsedConfig.iconColor);
      setSelectedBackground(parsedConfig.selectedBackground);
      setSelectedFontStyle(parsedConfig.fontStyle);
    }
  }, []);


  useEffect(() => {
    if (brandName) {
      const svg = generateIconSvg(brandName, {
        style: iconStyle as IconStyle,
        color: iconColor,
        backgroundColor: 'transparent'
      });
      const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
      setLogoSvg(dataUrl);
    }
  }, [brandName, iconStyle, iconColor]);

  const handleRegenerateLogo = () => {
    if (!brandName) return;

    // Get all available icon styles
    const styles = Object.keys(ICON_STYLES)
      .flatMap(category => ICON_STYLES[category as keyof typeof ICON_STYLES])
      .map(style => style.value);

    // Filter out current style and select random
    const availableStyles = styles.filter(style => style !== iconStyle);
    const newStyle = availableStyles[Math.floor(Math.random() * availableStyles.length)] as IconStyle;

    // Generate new colors
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 20);
    const lightness = 45 + Math.floor(Math.random() * 15);
    const newIconColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    // Select random background
    const randomBgIndex = Math.floor(Math.random() * BACKGROUNDS.length);
    const newBackground = BACKGROUNDS[randomBgIndex];

    // Generate random font styling
    const randomFont = FONT_FAMILIES[Math.floor(Math.random() * FONT_FAMILIES.length)];
    const textTransform = TEXT_TRANSFORMS[Math.floor(Math.random() * TEXT_TRANSFORMS.length)];
    const fontStyle = FONT_STYLES[Math.floor(Math.random() * FONT_STYLES.length)];
    const textDecoration = TEXT_DECORATIONS[Math.floor(Math.random() * TEXT_DECORATIONS.length)];
    const letterSpacing = LETTER_SPACING[Math.floor(Math.random() * LETTER_SPACING.length)];

    // Create font style object
    const newFontStyle: FontStyle = {
      fontFamily: randomFont.family,
      fontWeight: randomFont.weight,
      fontStyle,
      textTransform,
      textDecoration,
      letterSpacing: letterSpacing === 'normal' ? 'normal' : `var(--letter-spacing-${letterSpacing})`,
    };

    // Update all states
    setIconStyle(newStyle);
    setIconColor(newIconColor);
    setSelectedBackground(newBackground);
    setSelectedFontStyle(newFontStyle);

    // Load the font
    const fontSettings: FontSettings = {
      primary: {
        family: randomFont.family,
        weight: randomFont.weight,
        style: randomFont.style,
      },
      secondary: {
        family: randomFont.family,
        weight: randomFont.weight,
        style: randomFont.style,
      }
    };
    loadFonts(fontSettings);
  };

  const handleResetLogo = () => {
    const savedConfig = sessionStorage.getItem('selectedLogoConfig');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setIconStyle(parsedConfig.iconStyle);
      setIconColor(parsedConfig.iconColor);
      setSelectedBackground(parsedConfig.selectedBackground);
      setSelectedFontStyle(parsedConfig.fontStyle); 
    }
  };

  const handleDownloadLogo = async () => {
    if (!brandName) return;

    const logoElement = document.querySelector('.logo-container');
    if (!logoElement) return;

    try {
      const canvas = await html2canvas(logoElement, {
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
    // Store the selected logo configuration
    const selectedStyle = BACKGROUNDS[parseInt(cardId.split('-')[1])];
    sessionStorage.setItem('selectedLogoConfig', JSON.stringify({
      iconStyle,
      iconColor,
      selectedBackground: selectedStyle,
      fontStyle: selectedFontStyle 
    }));
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
                          onClick={handleResetLogo}
                          title="Reset to selected logo"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Reset to selected logo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDownloadLogo}
                          title="Download logo as PNG"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download logo as PNG</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRegenerateLogo}
                          title="Generate new logo variation"
                        >
                          <SparkleIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Generate new logo variation</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div className={`flex items-center justify-center p-8 rounded-lg ${selectedBackground?.bg || 'bg-gray-50 dark:bg-gray-900'}`}>
                  <div className="flex flex-col items-center gap-6 logo-container bg-transparent">
                    <div className="w-24 h-24 bg-white/90 dark:bg-gray-800/90 rounded-xl p-4 shadow-sm">
                      {logoSvg && (
                        <img
                          src={logoSvg}
                          alt="Brand Logo"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <h3
                      className={`text-3xl ${selectedBackground?.text || ''}`}
                      style={selectedFontStyle ? {
                        fontFamily: selectedFontStyle.fontFamily,
                        fontWeight: selectedFontStyle.fontWeight,
                        fontStyle: selectedFontStyle.fontStyle,
                        textTransform: selectedFontStyle.textTransform as React.CSSProperties['textTransform'],
                        textDecoration: selectedFontStyle.textDecoration as React.CSSProperties['textDecoration'],
                        letterSpacing: selectedFontStyle.letterSpacing as React.CSSProperties['letterSpacing'],
                      } : fonts?.primary ? {
                        fontFamily: fonts.primary.family,
                        fontWeight: fonts.primary.weight,
                        fontStyle: fonts.primary.style,
                      } : undefined}
                    >
                      {brandName}
                    </h3>
                  </div>
                </div>
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
                    Color Palette
                  </h2>
                  <div className="flex gap-2">
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
                          <Copy className="h-4 w-4" />
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
                        <motion.div                      initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="aspect-video bg-muted/50 rounded-lg overflow-hidden"
                        >
                          <img
                            src={imageUrl}
                            alt={`Mood image ${index+ 1}`}
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>AI-Recommended Font Combinations</DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 gap-6 py-4">
                {loadingFonts ? (
                  <p className="text-center text-muted-foreground">
                    Generating font recommendations...
                  </p>
                ) : (
                  fontRecommendations.map((recommendation, index) => (
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
                  ))
                )}
              </div>

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