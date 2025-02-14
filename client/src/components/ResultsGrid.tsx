import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type BrandName } from "@shared/schema";
import { Heart, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultsGridProps {
  names: string[];
  onSave: (name: string) => void;
}

export function ResultsGrid({ names, onSave }: ResultsGridProps) {
  const { toast } = useToast();
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {names.map((name, index) => (
        <Card 
          key={index}
          className={`${cardColors[index % cardColors.length]} transition-transform hover:scale-105`}
        >
          <CardContent className="p-6 relative">
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopy(name)}
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
                onClick={() => toggleFavorite(name)}
              >
                <Heart 
                  className={`h-4 w-4 ${favorites.has(name) ? "fill-current" : ""}`} 
                />
              </Button>
            </div>
            <h3 className="text-2xl font-semibold mt-4 mb-2">{name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}