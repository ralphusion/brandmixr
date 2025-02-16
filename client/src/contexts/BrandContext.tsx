import { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { FontSettings } from "@/types/FontSettings";
import html2canvas from 'html2canvas';

interface BrandContextType {
  brandName: string | null;
  fonts: FontSettings | null;
  colors: Array<{ hex: string; name: string }>;
  isLoading: boolean;
  moodBoardData: any;
  handleExport: () => void;
  handleCopyToClipboard: (text: string, type: string) => void;
  handleRegenerate: (section: string) => void;
  regeneratingSection: { type: string } | null;
  selectedCardId: string | null;
  cardBackgrounds: string[];
  logoSvg: string;
  moodBoardRef: React.RefObject<HTMLDivElement>;
  setColors: (colors: Array<{ hex: string; name: string }>) => void;
  setBrandName: (name: string | null) => void;
  setMoodBoardData: (data: any) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brandName, setBrandName] = useState<string | null>(null);
  const [fonts, setFonts] = useState<FontSettings | null>(null);
  const [colors, setColors] = useState<Array<{ hex: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [moodBoardData, setMoodBoardData] = useState(null);
  const [regeneratingSection, setRegeneratingSection] = useState<{ type: string } | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [cardBackgrounds, setCardBackgrounds] = useState<string[]>([]);
  const [logoSvg, setLogoSvg] = useState("");
  const moodBoardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize brand name from URL if available
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameFromUrl = params.get('name');
    if (nameFromUrl && !brandName) {
      setBrandName(nameFromUrl);
    }
  }, []);

  const handleExport = async () => {
    if (!moodBoardRef.current) return;

    try {
      const canvas = await html2canvas(moodBoardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${brandName?.toLowerCase().replace(/\s+/g, '-')}-moodboard.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Mood board exported successfully",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export mood board",
        variant: "destructive",
      });
    }
  };

  const handleCopyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
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

  const handleRegenerate = async (section: string) => {
    setRegeneratingSection({ type: section });
    try {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('name');
      const industry = params.get('industry');
      const style = params.get('style');

      if (!name || !industry || !style) {
        throw new Error("Missing required parameters");
      }

      const response = await fetch(`/api/mood-board/regenerate-${section}?` + new URLSearchParams({
        name,
        industry,
        style
      }));

      if (!response.ok) {
        throw new Error(`Failed to regenerate ${section}`);
      }

      const data = await response.json();

      switch (section) {
        case 'colors':
          setColors(data.colors);
          break;
        case 'mood':
          setMoodBoardData((prev: any) => ({ ...prev, moodDescription: data.moodDescription }));
          break;
        case 'keywords':
          setMoodBoardData((prev: any) => ({ ...prev, keywords: data.keywords }));
          break;
      }

      toast({
        title: "Success",
        description: `${section.charAt(0).toUpperCase() + section.slice(1)} regenerated successfully`,
      });
    } catch (error) {
      toast({
        title: "Regeneration failed",
        description: error instanceof Error ? error.message : "Failed to regenerate content",
        variant: "destructive",
      });
    } finally {
      setRegeneratingSection(null);
    }
  };

  return (
    <BrandContext.Provider
      value={{
        brandName,
        fonts,
        colors,
        isLoading,
        moodBoardData,
        handleExport,
        handleCopyToClipboard,
        handleRegenerate,
        regeneratingSection,
        selectedCardId,
        cardBackgrounds,
        logoSvg,
        moodBoardRef,
        setColors,
        setBrandName,
        setMoodBoardData,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrandContext() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrandContext must be used within a BrandProvider');
  }
  return context;
}