import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import html2canvas from 'html2canvas';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MoodBoardData {
  colors: Array<{ hex: string; name: string }>;
  keywords: string[];
  moodDescription: string;
  imagePrompts: string[];
  images?: string[];
}

export default function MoodBoard() {
  const [, navigate] = useLocation();
  const moodBoardRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const brandName = params.get('name');
  const formData = JSON.parse(sessionStorage.getItem('generatorFormData') || '{}');

  const { data: moodBoardData, isLoading } = useQuery<MoodBoardData>({
    queryKey: ['/api/mood-board', brandName],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/mood-board?name=${encodeURIComponent(brandName || '')}&industry=${encodeURIComponent(formData.industry || '')}&style=${encodeURIComponent(formData.style || '')}`);
      return response.json();
    },
    enabled: !!brandName && !!formData.industry && !!formData.style,
  });

  // Track image loading
  useEffect(() => {
    if (!moodBoardData?.images?.length) return;

    const loadImages = async () => {
      const imagePromises = moodBoardData.images.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(true);
          img.onerror = reject;
          img.src = url;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    };

    loadImages();
  }, [moodBoardData?.images]);

  const handleDownload = async (format: 'png' | 'pdf') => {
    if (!moodBoardRef.current || !brandName || !imagesLoaded) {
      console.log("Cannot download: ", { 
        hasRef: !!moodBoardRef.current, 
        brandName, 
        imagesLoaded 
      });
      return;
    }

    try {
      const canvas = await html2canvas(moodBoardRef.current, {
        scale: 2, // Higher quality
        backgroundColor: null,
        useCORS: true, // Handle cross-origin images
        logging: true, // Enable logging for debugging
        allowTaint: true,
        foreignObjectRendering: true,
      });

      if (format === 'png') {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-moodboard.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });

        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          0,
          canvas.width,
          canvas.height
        );
        pdf.save(`${brandName.toLowerCase().replace(/\s+/g, '-')}-moodboard.pdf`);
      }
    } catch (error) {
      console.error("Error during download:", error);
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
            onClick={() => navigate(`/brand-variations?name=${encodeURIComponent(brandName)}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brand Studio
          </Button>
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={!imagesLoaded}
              >
                <Download className="h-4 w-4" />
                {imagesLoaded ? 'Download Mood Board' : 'Loading Images...'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleDownload('png')}>
                Download as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                Download as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6">Brand Mood Board: {brandName}</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[200px] rounded-lg" />
          <Skeleton className="h-[200px] rounded-lg" />
        </div>
      ) : moodBoardData ? (
        <div ref={moodBoardRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="flex flex-wrap gap-3">
                {moodBoardData.keywords.map((keyword, index) => (
                  <motion.span
                    key={index}
                    className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-muted-foreground"
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
                    crossOrigin="anonymous"
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          Failed to load mood board data. Please make sure you have selected a brand name and style.
        </p>
      )}
    </div>
  );
}