import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { FontSettings } from "@/types/FontSettings";

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
  const moodBoardRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleExport = () => {
    // Implementation
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

  const handleRegenerate = (section: string) => {
    // Implementation
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
