import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type BrandName } from "@shared/schema";
import { Heart, Copy, Check, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";

interface ResultsGridProps {
  names: string[];
  onSave: (name: string) => void;
}

export function ResultsGrid({ names, onSave }: ResultsGridProps) {
  const { toast } = useToast();
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const cardColors = [
    "bg-[#F5F5F5] text-[#37B5B5]",  // Teal
    "bg-[#E6E6E6] text-[#4A4A4A]",  // Gray
    "bg-[#F0F7F4] text-[#A77E58]",  // Brown
    "bg-[#FFE4E1] text-[#FF6B6B]",  // Pink
    "bg-[#F5F5DC] text-[#8B4513]"   // Beige
  ];

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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {names.map((name, index) => (
          <Card 
            key={index}
            className={`${cardColors[index % cardColors.length]} transition-transform hover:scale-105 aspect-square cursor-pointer`}
            onClick={() => handleNameClick(name)}
          >
            <CardContent className="p-6 relative h-full flex flex-col justify-between">
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
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
                  className="h-8 w-8"
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
              <h3 className="text-2xl font-semibold mt-4 mb-2">{name}</h3>
              <Info className="h-4 w-4 opacity-50" />
            </CardContent>
          </Card>
        ))}
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
    </>
  );
}