import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Loader2, SparkleIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useFonts } from "@/contexts/FontContext";

const STYLE_OPTIONS = [
  { value: "minimalist", label: "Minimalist & Clean" },
  { value: "modern", label: "Modern & Professional" },
  { value: "playful", label: "Playful & Creative" },
  { value: "luxury", label: "Luxury & Elegant" },
  { value: "tech", label: "Tech & Digital" },
  { value: "organic", label: "Organic & Natural" },
  { value: "vintage", label: "Vintage & Retro" },
  { value: "abstract", label: "Abstract & Artistic" }
];

const INDUSTRY_OPTIONS = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance & Business" },
  { value: "food", label: "Food & Beverage" },
  { value: "health", label: "Health & Wellness" },
  { value: "fashion", label: "Fashion & Lifestyle" },
  { value: "entertainment", label: "Entertainment & Media" },
  { value: "education", label: "Education & Learning" },
  { value: "travel", label: "Travel & Hospitality" }
];

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
  }
];

export default function LogoStudio() {
  const [, navigate] = useLocation();
  const [selectedStyle, setSelectedStyle] = useState<string>("modern");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("technology");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const { fonts } = useFonts();

  const params = new URLSearchParams(window.location.search);
  const brandName = params.get('name');

  if (!brandName) {
    navigate('/');
    return null;
  }

  const handleGenerateLogo = async (isMore = false) => {
    if (!isMore) {
      await apiRequest("POST", "/api/clear-icon-cache");
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/generate-logo", {
        brandName,
        style: selectedStyle,
        industry: selectedIndustry,
        isMore,
        currentLogos: isMore ? generatedLogos : []
      });

      const data = await response.json();
      if (data.logos) {
        if (isMore) {
          setGeneratedLogos(prev => [...prev, ...data.logos]);
          setHasMore(data.logos.length === 15);
        } else {
          setGeneratedLogos(data.logos);
          setHasMore(true);
        }
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate logos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-logo-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the logo",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => navigate(`/mood-board?name=${encodeURIComponent(brandName)}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mood Board
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-6"
          style={fonts?.primary ? {
            fontFamily: fonts.primary.family,
            fontWeight: fonts.primary.weight,
            fontStyle: fonts.primary.style,
          } : undefined}
        >
          Logo Studio: {brandName}
        </h1>

        <Card className="mb-8 shadow-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Logo Generator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="style">Style Preference</Label>
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLE_OPTIONS.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_OPTIONS.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleGenerateLogo(false)}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate AI Logo'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {generatedLogos.length > 0 ? (
            generatedLogos.map((logo, index) => {
              const style = BACKGROUNDS[index % BACKGROUNDS.length];
              const fontStyle = FONT_STYLES[index % FONT_STYLES.length];

              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`${style.bg} transition-transform hover:scale-105 overflow-hidden shadow-lg dark:shadow-md dark:shadow-black/20 cursor-pointer`}>
                    <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] gap-6">
                      <div className="flex flex-col items-center gap-4">
                        <svg
                          viewBox="0 0 24 24"
                          className={`w-12 h-12 ${style.text}`}
                          fill="currentColor"
                          dangerouslySetInnerHTML={{ __html: logo }}
                        />
                        <motion.h3
                          className={`text-3xl text-center ${style.text} ${fontStyle}`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {brandName}
                        </motion.h3>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => handleDownload(logo, index)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              {isGenerating ? (
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
              ) : (
                <>
                  <p className="text-lg mb-2">No logos generated yet</p>
                  <p className="text-sm">Select your preferences and click Generate to create your logos</p>
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {hasMore && generatedLogos.length > 0 && (
        <Button
          className="w-full mt-8"
          variant="outline"
          onClick={() => handleGenerateLogo(true)}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating More...
            </>
          ) : (
            <>
              <SparkleIcon className="mr-2 h-4 w-4" />
              Generate More Variations
            </>
          )}
        </Button>
      )}
    </div>
  );
}