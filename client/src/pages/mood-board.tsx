import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface MoodBoardData {
  colors: Array<{ hex: string; name: string }>;
  keywords: string[];
  moodDescription: string;
  imagePrompts: string[];
  images?: string[];
}

export default function MoodBoard() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const brandName = params.get('name');
  const formData = JSON.parse(sessionStorage.getItem('generatorFormData') || '{}');

  const { data: moodBoardData, isLoading } = useQuery<MoodBoardData>({
    queryKey: ['/api/mood-board', brandName],
    enabled: !!brandName,
  });

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
            onClick={() => navigate('/brand-variations')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brand Studio
          </Button>
          <Logo />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6">Brand Mood Board: {brandName}</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[200px] rounded-lg" />
          <Skeleton className="h-[200px] rounded-lg" />
        </div>
      ) : moodBoardData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Color Palette */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
              <div className="flex flex-wrap gap-4">
                {moodBoardData.colors.map((color, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className="w-16 h-16 rounded-lg shadow-md"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm text-muted-foreground mt-2">
                      {color.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Brand Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {moodBoardData.keywords.map((keyword, index) => (
                  <motion.span
                    key={index}
                    className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {keyword}
                  </motion.span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Brand Mood</h2>
              <p className="text-muted-foreground leading-relaxed">
                {moodBoardData.moodDescription}
              </p>
            </CardContent>
          </Card>

          {/* AI Generated Images */}
          {moodBoardData.images?.map((imageUrl, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <img
                    src={imageUrl}
                    alt={`Mood image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          Failed to load mood board data.
        </p>
      )}
    </div>
  );
}
