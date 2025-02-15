import { createContext, useContext, useState, ReactNode } from 'react';

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

interface FontContextType {
  fonts: FontSettings | null;
  setFonts: (fonts: FontSettings) => void;
  loadFonts: (fonts: FontSettings) => Promise<void>;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: ReactNode }) {
  const [fonts, setFonts] = useState<FontSettings | null>(null);

  const loadFonts = async (newFonts: FontSettings) => {
    try {
      // Load fonts using Google Fonts API
      const link = document.createElement('link');
      const primaryFamily = newFonts.primary.family.replace(/\s+/g, '+');
      const secondaryFamily = newFonts.secondary.family.replace(/\s+/g, '+');
      link.href = `https://fonts.googleapis.com/css2?family=${primaryFamily}:wght@${newFonts.primary.weight}&family=${secondaryFamily}:wght@${newFonts.secondary.weight}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // Wait for fonts to load
      await document.fonts.ready;
      setFonts(newFonts);
    } catch (error) {
      console.error('Error loading fonts:', error);
    }
  };

  return (
    <FontContext.Provider value={{ fonts, setFonts, loadFonts }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFonts() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFonts must be used within a FontProvider');
  }
  return context;
}
