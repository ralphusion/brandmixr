import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const STYLE_OPTIONS = [
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "playful", label: "Playful" },
  { value: "sophisticated", label: "Sophisticated" },
  { value: "minimalist", label: "Minimalist" },
];

const COLOR_SCHEMES = [
  { name: "Professional", colors: ["#2C3E50", "#E74C3C", "#ECF0F1"] },
  { name: "Creative", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"] },
  { name: "Elegant", colors: ["#2C3E50", "#BDC3C7", "#E0E0E0"] },
  { name: "Vibrant", colors: ["#9B59B6", "#3498DB", "#E74C3C"] },
  { name: "Natural", colors: ["#27AE60", "#2ECC71", "#F1C40F"] },
];

export default function LogoStudio() {
  const [, navigate] = useLocation();
  const [selectedStyle, setSelectedStyle] = useState<string>("modern");
  const [selectedColorScheme, setSelectedColorScheme] = useState<string>(COLOR_SCHEMES[0].name);

  const params = new URLSearchParams(window.location.search);
  const brandName = params.get('name');

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
            onClick={() => navigate(`/mood-board?name=${encodeURIComponent(brandName)}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mood Board
          </Button>
          <Logo />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Logo Designer</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="brand-name">Brand Name</Label>
                <Input
                  id="brand-name"
                  value={brandName}
                  readOnly
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="style">Style Preference</Label>
                <Select
                  value={selectedStyle}
                  onValueChange={setSelectedStyle}
                >
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
                <Label>Color Scheme</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {COLOR_SCHEMES.map((scheme) => (
                    <Button
                      key={scheme.name}
                      variant="outline"
                      className={`p-4 h-auto flex flex-col items-center gap-2 ${
                        selectedColorScheme === scheme.name ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedColorScheme(scheme.name)}
                    >
                      <span className="text-sm font-medium">{scheme.name}</span>
                      <div className="flex gap-1">
                        {scheme.colors.map((color) => (
                          <div
                            key={color}
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Button className="w-full" size="lg">
                Generate Logo Variations
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Preview</h2>
            <div className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Logo preview will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
