import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SiInstagram, SiLinkedin, SiX, SiFacebook } from "react-icons/si";
import { Logo } from "@/components/Logo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { useBrandContext } from "@/contexts/BrandContext";
import { FontSettings } from "@/types/FontSettings";
import { ColorPaletteEditor } from "@/components/ColorPaletteEditor";
import { ProductMockupsSection } from "@/components/ProductMockupsSection";
import { BrandLogoSection } from "@/components/BrandLogoSection";
import { SparkleIcon } from "@/components/SparkleIcon";

// Social Media Post Generator Component (Unchanged from original)
const SocialMediaPostGenerator = ({ brandName, fonts, colors }: {
  brandName: string;
  fonts: FontSettings | null;
  colors: Array<{ hex: string; name: string }>;
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
  const [tone, setTone] = useState<string>('professional');
  const [generatedPost, setGeneratedPost] = useState<SocialPost | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const formData = JSON.parse(sessionStorage.getItem('generatorFormData') || '{}');

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: SiInstagram },
    { id: 'linkedin', name: 'LinkedIn', icon: SiLinkedin },
    { id: 'x', name: 'X', icon: SiX },
    { id: 'facebook', name: 'Facebook', icon: SiFacebook },
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'humorous', label: 'Humorous' },
  ];

  const generatePost = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/social-posts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName,
          industry: formData.industry,
          style: formData.style,
          platform: selectedPlatform,
          tone
        })
      });

      if (!response.ok) throw new Error('Failed to generate post');
      const data = await response.json();
      setGeneratedPost(data);
      toast({
        title: "Success",
        description: "Social media post generated successfully",
      });
    } catch (error) {
      console.error('Error generating post:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate post",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedPost) return;

    try {
      const element = document.createElement('a');
      const content = `
Caption: ${generatedPost.caption}

Hashtags:
${generatedPost.hashtags.join(' ')}

Platform: ${generatedPost.platform}
      `;

      const blob = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(blob);
      element.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${generatedPost.platform}-post.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      if (generatedPost.imageUrl) {
        const imgElement = document.createElement('a');
        imgElement.href = generatedPost.imageUrl;
        imgElement.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${generatedPost.platform}-image.png`;
        document.body.appendChild(imgElement);
        imgElement.click();
        document.body.removeChild(imgElement);
      }
    } catch (error) {
      console.error('Error downloading post:', error);
      toast({
        title: "Download failed",
        description: "Failed to download the post content",
        variant: "destructive",
      });
    }
  };

  return (
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
            Social Media Post Generator
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={!generatedPost}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label>Platform</Label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <Button
                      key={platform.id}
                      variant={selectedPlatform === platform.id ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedPlatform(platform.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {platform.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={generatePost}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>Generate Post</>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {generatedPost && (
              <div className="space-y-4">
                <div>
                  <Label>Caption</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    {generatedPost.caption}
                  </div>
                </div>
                <div>
                  <Label>Hashtags</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md flex flex-wrap gap-2">
                    {generatedPost.hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {generatedPost.imageUrl && (
                  <div>
                    <Label>Generated Image</Label>
                    <div className="mt-1 rounded-md overflow-hidden">
                      <img
                        src={generatedPost.imageUrl}
                        alt="Generated social media post"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Interface for social post data (Unchanged from original)
interface SocialPost {
  caption: string;
  hashtags: string[];
  imageUrl: string;
  platform: string;
}


// Main MoodBoard Component
export default function MoodBoard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { 
    brandName: brandNameFromContext,
    setBrandName,
    fonts,
    colors,
    setColors,
    isLoading,
    moodBoardData,
    setMoodBoardData,
    handleExport,
    handleCopyToClipboard,
    handleRegenerate,
    regeneratingSection,
    selectedCardId,
    cardBackgrounds,
    logoSvg,
    moodBoardRef
  } = useBrandContext();

  // Load mood board data
  useEffect(() => {
    const loadMoodBoardData = async () => {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('name');
      const industry = params.get('industry');
      const style = params.get('style');

      if (!name || !industry || !style) {
        toast({
          title: "Missing parameters",
          description: "Please provide brand name, industry, and style",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`/api/mood-board?${new URLSearchParams({
          name,
          industry,
          style
        })}`);

        if (!response.ok) {
          throw new Error('Failed to fetch mood board data');
        }

        const data = await response.json();
        setMoodBoardData(data);
        setColors(data.colors || []);
      } catch (error) {
        console.error('Error loading mood board:', error);
        toast({
          title: "Error",
          description: "Failed to load mood board data. Please try again.",
          variant: "destructive"
        });
      }
    };

    if (brandNameFromContext || window.location.search.includes('name=')) {
      loadMoodBoardData();
    }
  }, [brandNameFromContext, navigate, toast, setColors, setMoodBoardData]);

  // Set brand name from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameFromUrl = params.get('name');
    if (nameFromUrl) {
      setBrandName(nameFromUrl);
    } else if (!brandNameFromContext) {
      navigate('/');
    }
  }, [brandNameFromContext, navigate, setBrandName]);

  if (!brandNameFromContext && !window.location.search.includes('name=')) {
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
              onClick={() => navigate(`/brand-variations?name=${encodeURIComponent(brandNameFromContext)}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Brand Studio
            </Button>
            <Logo />
          </div>
        </div>

        <h1
          className="text-3xl font-bold mb-6"
          style={fonts?.primary ? {
            fontFamily: fonts.primary.family,
            fontWeight: fonts.primary.weight,
            fontStyle: fonts.primary.style,
          } : undefined}
        >
          Brand Mood Board: {brandNameFromContext}
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
                          onClick={handleExport}
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

            <ProductMockupsSection
              selectedCardId={selectedCardId}
              cardBackgrounds={cardBackgrounds}
              logoSvg={logoSvg}
              brandName={brandNameFromContext}
              fonts={fonts}
            />
            <SocialMediaPostGenerator
              brandName={brandNameFromContext}
              fonts={fonts}
              colors={colors}
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