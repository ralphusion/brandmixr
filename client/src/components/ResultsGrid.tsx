import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type BrandName } from "@shared/schema";
import { Heart, Copy, Check, Info, Globe, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface GeneratedName {
  name: string;
  domain: string;
  domainAvailable: boolean;
  trademarkExists?: boolean;
  similarTrademarks?: Array<{
    serialNumber: string;
    registrationNumber: string;
    wordMark: string;
    status: string;
  }>;
}

interface ResultsGridProps {
  names: (string | GeneratedName)[];
  onSave: (name: GeneratedName) => void;
  readOnly?: boolean;
}

const FONT_STYLES = [
  'uppercase tracking-wider font-bold',
  'uppercase tracking-tight font-extrabold',
  'normal-case tracking-wide font-semibold',
  'font-serif italic font-medium',
  'font-mono uppercase tracking-widest font-bold',
  'font-sans small-caps tracking-normal font-bold',
];

const cardColors = [
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
];

export function ResultsGrid({ names, onSave, readOnly = false }: ResultsGridProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: savedNames = [] } = useQuery<BrandName[]>({
    queryKey: ["/api/names/saved"],
  });

  const savedNamesSet = new Set(savedNames.map(n => n.name));

  const handleCopy = async (name: string) => {
    await navigator.clipboard.writeText(name);
    setCopiedName(name);
    toast({
      title: "Copied!",
      description: `"${name}" has been copied to your clipboard.`,
    });
    setTimeout(() => setCopiedName(null), 2000);
  };

  const handleSave = async (nameData: string | GeneratedName) => {
    const name = typeof nameData === 'string' ? nameData : nameData.name;
    await onSave(typeof nameData === 'string' ? { name, domain: '', domainAvailable: false } : nameData);
  };

  const handleInfoClick = async (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setSelectedName(name);
    setIsLoading(true);
    try {
      const formData = JSON.parse(sessionStorage.getItem('generatorFormData') || '{}');
      const res = await apiRequest("POST", "/api/describe", { 
        name,
        industry: formData.industry,
        description: formData.description,
        keywords: formData.keywords,
      });
      const data = await res.json();
      setDescription(data.description);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate description.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (name: string) => {
    navigate(`/brand-variations?name=${encodeURIComponent(name)}`);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {names.map((nameData, index) => {
          const name = typeof nameData === 'string' ? nameData : nameData.name;
          const domain = typeof nameData === 'string' ? null : nameData.domain;
          const domainAvailable = typeof nameData === 'string' ? null : nameData.domainAvailable;
          const trademarkExists = typeof nameData === 'string' ? null : nameData.trademarkExists;
          const colorSet = cardColors[index % cardColors.length];
          const isSaved = savedNamesSet.has(name);

          return (
            <Card 
              key={index}
              className={`${colorSet.bg} transition-transform hover:scale-105 cursor-pointer group relative overflow-visible shadow-lg dark:shadow-md dark:shadow-black/20`}
              onClick={() => handleCardClick(name)}
            >
              <CardContent className="p-6 relative h-full flex flex-col items-center justify-center min-h-[200px]">
                {!readOnly && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(name);
                      }}
                    >
                      {copiedName === name ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(nameData);
                      }}
                    >
                      <Heart 
                        className={`h-4 w-4 ${isSaved ? "fill-current text-red-500 dark:text-red-400" : ""}`} 
                      />
                    </Button>
                  </div>
                )}

                <h3 className={`text-3xl text-center mb-6 ${colorSet.text} ${FONT_STYLES[index % FONT_STYLES.length]}`}>
                  {name}
                </h3>

                <div className="absolute bottom-3 right-3 flex gap-2">
                  {domain && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`rounded-full p-1.5 ${
                          domainAvailable 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300' 
                            : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300'
                        }`}>
                          <Globe className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={5} className="z-50">
                        <p>{domainAvailable ? "Domain name is available" : "Domain name is taken"}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {trademarkExists !== null && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`rounded-full p-1.5 ${
                          !trademarkExists 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300' 
                            : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300'
                        }`}>
                          <Shield className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={5} className="z-50">
                        <p>{!trademarkExists ? "No similar trademarks found" : "Similar trademarks exist"}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                <div className="absolute bottom-3 left-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto"
                        onClick={(e) => handleInfoClick(e, name)}
                      >
                        <Info className="h-4 w-4 opacity-50 hover:opacity-75 dark:text-gray-300" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5} className="z-50">
                      <p>Click for brand description</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedName} onOpenChange={() => setSelectedName(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isLoading ? (
              <p className="text-muted-foreground">Generating description...</p>
            ) : (
              <p className="text-base leading-relaxed">{description}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}