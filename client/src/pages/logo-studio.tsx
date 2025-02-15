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

// Generate a pastel color
const generatePastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 25 + Math.floor(Math.random() * 25); // 25-50%
  const lightness = 80 + Math.floor(Math.random() * 10); // 80-90%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export default function LogoStudio() {
  const [, navigate] = useLocation();
  const [selectedStyle, setSelectedStyle] = useState<string>("modern");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("technology");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const params = new URLSearchParams(window.location.search);
  const brandName = params.get('name');

  if (!brandName) {
    navigate('/');
    return null;
  }

  const handleGenerateLogo = async (isMore = false) => {
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
          setHasMore(data.logos.length === 15); // If we get less than 15, we've reached the end
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
          <Logo />
        </div>
      </div>

      {/* Logo Generator Section */}
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

      {/* Generated Logos Section */}
      <Card className="shadow-md mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Generated Logos</h2>
          {generatedLogos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {generatedLogos.map((logo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="overflow-hidden"
                      style={{ backgroundColor: generatePastelColor() }}
                    >
                      <CardContent className="p-4">
                        <img
                          src={logo}
                          alt={`Generated logo ${index + 1}`}
                          className="w-full aspect-square object-contain mb-4"
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleDownload(logo, index)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              {hasMore && (
                <Button
                  className="w-full"
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
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
        </CardContent>
      </Card>

      {/* Generate More Button */}
      <Button
        className="w-full mb-8"
        size="lg"
        onClick={() => handleGenerateLogo(true)}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating More Logos...
          </>
        ) : (
          <>
            <SparkleIcon className="mr-2 h-4 w-4" />
            Generate More Logo Variations
          </>
        )}
      </Button>
    </div>
  );
}