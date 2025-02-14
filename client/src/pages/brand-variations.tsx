import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const FONT_STYLES = [
  'uppercase tracking-wider font-bold',
  'uppercase tracking-tight font-extrabold',
  'normal-case tracking-wide font-semibold',
  'font-serif italic font-medium',
  'font-mono uppercase tracking-widest font-bold',
  'font-sans small-caps tracking-normal font-bold',
];

const BACKGROUNDS = [
  { 
    bg: "bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900", 
    text: "text-emerald-800 dark:text-emerald-100" 
  },
  { 
    bg: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900", 
    text: "text-blue-800 dark:text-blue-100" 
  },
  { 
    bg: "bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900", 
    text: "text-amber-800 dark:text-amber-100" 
  },
  { 
    bg: "bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-950 dark:to-pink-900", 
    text: "text-rose-800 dark:text-rose-100" 
  },
  { 
    bg: "bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-950 dark:to-purple-900", 
    text: "text-violet-800 dark:text-violet-100" 
  },
  { 
    bg: "bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-gray-900", 
    text: "text-slate-800 dark:text-slate-100" 
  },
  // Additional pastel and darker variants
  { 
    bg: "bg-gradient-to-br from-lime-50 to-green-100 dark:from-lime-950 dark:to-green-900", 
    text: "text-lime-800 dark:text-lime-100" 
  },
  { 
    bg: "bg-gradient-to-br from-sky-50 to-cyan-100 dark:from-sky-950 dark:to-cyan-900", 
    text: "text-sky-800 dark:text-sky-100" 
  },
  { 
    bg: "bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-900", 
    text: "text-orange-800 dark:text-orange-100" 
  }
];

export default function BrandVariations() {
  const [, navigate] = useLocation();
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const { toast } = useToast();
  const params = new URLSearchParams(window.location.search);
  const brandName = params.get('name');

  useEffect(() => {
    if (!brandName) {
      navigate('/');
      return;
    }
    generateLogo();
  }, [brandName]);

  const generateLogo = async () => {
    if (!brandName) return;

    setIsGeneratingLogo(true);
    try {
      const res = await apiRequest("POST", "/api/generate-logo", { 
        brandName,
        style: "minimalist brand logo design with simple shapes and clean typography" 
      });
      const data = await res.json();
      setLogoUrl(data.url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  if (!brandName) {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => navigate('/generate')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Generated Names
          </Button>
          <Logo />
        </div>
        <Button
          variant="outline"
          onClick={generateLogo}
          disabled={isGeneratingLogo}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isGeneratingLogo ? 'animate-spin' : ''}`} />
          Refresh Logo
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Brand Variations: {brandName}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BACKGROUNDS.map((style, bgIndex) => (
          FONT_STYLES.map((fontStyle, fontIndex) => (
            <Card 
              key={`${bgIndex}-${fontIndex}`}
              className={`${style.bg} transition-transform hover:scale-105 overflow-hidden shadow-lg dark:shadow-md dark:shadow-black/20`}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] gap-4">
                {logoUrl && (
                  <div className="w-24 h-24 mb-4">
                    <img src={logoUrl} alt="Brand Logo" className="w-full h-full object-contain" />
                  </div>
                )}
                {isGeneratingLogo && !logoUrl && (
                  <div className="w-24 h-24 mb-4 flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
                <h3 className={`text-3xl text-center ${style.text} ${fontStyle}`}>
                  {brandName}
                </h3>
              </CardContent>
            </Card>
          ))
        ))}
      </div>
    </div>
  );
}