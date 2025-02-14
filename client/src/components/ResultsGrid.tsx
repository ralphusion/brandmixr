import { useState } from "react";
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
  onSave: (name: string) => void;
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
  { bg: "bg-gradient-to-br from-emerald-50 to-teal-100", text: "text-emerald-800" },
  { bg: "bg-gradient-to-br from-blue-50 to-indigo-100", text: "text-blue-800" },
  { bg: "bg-gradient-to-br from-amber-50 to-yellow-100", text: "text-amber-800" },
  { bg: "bg-gradient-to-br from-rose-50 to-pink-100", text: "text-rose-800" },
  { bg: "bg-gradient-to-br from-violet-50 to-purple-100", text: "text-violet-800" },
  { bg: "bg-gradient-to-br from-slate-50 to-gray-100", text: "text-slate-800" },
];

export function ResultsGrid({ names, onSave, readOnly = false }: ResultsGridProps) {
  const { toast } = useToast();
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = async (name: string) => {
    await navigator.clipboard.writeText(name);
    setCopiedName(name);
    toast({
      title: "Copied!",
      description: `"${name}" has been copied to your clipboard.`,
    });
    setTimeout(() => setCopiedName(null), 2000);
  };

  const toggleFavorite = (name: string) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(name)) {
      newFavorites.delete(name);
    } else {
      newFavorites.add(name);
      onSave(name);
    }
    setFavorites(newFavorites);
  };

  const handleNameClick = async (name: string) => {
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

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {names.map((nameData, index) => {
          const name = typeof nameData === 'string' ? nameData : nameData.name;
          const domain = typeof nameData === 'string' ? null : nameData.domain;
          const domainAvailable = typeof nameData === 'string' ? null : nameData.domainAvailable;
          const trademarkExists = typeof nameData === 'string' ? null : nameData.trademarkExists;
          const colorSet = cardColors[index % cardColors.length];

          return (
            <Card 
              key={index}
              className={`${colorSet.bg} transition-transform hover:scale-105 cursor-pointer group relative overflow-hidden`}
              onClick={() => handleNameClick(name)}
            >
              <CardContent className="p-6 relative h-full flex flex-col items-center justify-center min-h-[200px]">
                {!readOnly && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/80 hover:bg-white"
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
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(name);
                      }}
                    >
                      <Heart 
                        className={`h-4 w-4 ${favorites.has(name) ? "fill-current" : ""}`} 
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
                      <TooltipTrigger>
                        <div className={`rounded-full p-1.5 ${domainAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          <Globe className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{domainAvailable ? "Domain name is available" : "Domain name is taken"}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {trademarkExists !== null && (
                    <Tooltip>
                      <TooltipTrigger>
                        <div className={`rounded-full p-1.5 ${!trademarkExists ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          <Shield className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{!trademarkExists ? "No similar trademarks found" : "Similar trademarks exist"}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 opacity-50 absolute bottom-3 left-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click for more details</p>
                  </TooltipContent>
                </Tooltip>
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