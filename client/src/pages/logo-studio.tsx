import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
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
  { value: "fashion", label: "Fashion & Lifestyle" },
  { value: "food", label: "Food & Beverage" },
  { value: "health", label: "Health & Wellness" },
  { value: "finance", label: "Finance & Business" },
  { value: "entertainment", label: "Entertainment & Media" },
  { value: "education", label: "Education & Learning" },
  { value: "travel", label: "Travel & Hospitality" }
];

export default function LogoStudio() {
  const [, navigate] = useLocation();
  const [brandName, setBrandName] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("modern");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("technology");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerateLogo = async () => {
    if (!brandName.trim()) {
      toast({
        title: "Brand name required",
        description: "Please enter a brand name to generate logos",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/generate-logo", {
        brandName,
        style: selectedStyle,
        industry: selectedIndustry
      });

      const data = await response.json();
      if (data.logos) {
        setGeneratedLogos(data.logos);
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
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Logo />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Logo Generator</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="brand-name">Brand Name</Label>
                <Input
                  id="brand-name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter your brand name"
                  className="mt-1"
                />
              </div>

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

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleGenerateLogo}
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
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="shadow-md h-full">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Generated Logos</h2>
              {generatedLogos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedLogos.map((logo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden">
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
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                  {isGenerating ? (
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  ) : (
                    <>
                      <p className="text-lg mb-2">No logos generated yet</p>
                      <p className="text-sm">Fill in the details and click Generate to create your logos</p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}