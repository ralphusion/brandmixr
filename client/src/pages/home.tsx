import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { NameGeneratorForm } from "@/components/NameGeneratorForm";
import { ResultsGrid } from "@/components/ResultsGrid";
import { SavedNames } from "@/components/SavedNames";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { type GenerateNameRequest, type BrandName } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Palette, Shapes } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";

const NAMES_PER_PAGE = 5;

const FEATURES = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "AI-Powered Naming",
    description: "Generate unique brand names that resonate with your vision"
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: "Brand Identity",
    description: "Create cohesive visual identities with custom color palettes and typography"
  },
  {
    icon: <Shapes className="w-5 h-5" />,
    title: "Logo Studio",
    description: "Design professional logos with our intelligent design system"
  }
];

export default function Home() {
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [displayedNames, setDisplayedNames] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: savedNames = [] } = useQuery<BrandName[]>({
    queryKey: ["/api/names/saved"],
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && generatedNames.length > displayedNames.length) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [generatedNames.length, displayedNames.length]);

  useEffect(() => {
    const endIndex = page * NAMES_PER_PAGE;
    const newNames = generatedNames.slice(0, endIndex);
    setDisplayedNames(newNames);
  }, [page, generatedNames]);

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateNameRequest) => {
      const res = await apiRequest("POST", "/api/generate", data);
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedNames(data);
      setDisplayedNames(data.slice(0, NAMES_PER_PAGE));
      setPage(1);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate names. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/names", {
        name,
        industry: generateMutation.variables?.industry || "",
        description: generateMutation.variables?.description || "",
        keywords: generateMutation.variables?.keywords || [],
        style: generateMutation.variables?.style || "",
        saved: true,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/names/saved"] });
      toast({
        title: "Success",
        description: "Name saved successfully!",
      });
    },
  });

  const handleExport = () => {
    const csvContent = savedNames
      .map((name) => `${name.name},${name.industry},${name.style}`)
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "saved-names.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <Logo className="mx-auto mb-8" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Create Your Brand Identity
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform your vision into a compelling brand identity with our AI-powered platform. Generate unique names, design professional logos, and craft cohesive visual styles.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="fixed top-4 right-4 flex gap-2 z-50">
            <Button variant="outline" onClick={() => setAuthMode('login')}>Login</Button>
            <Button onClick={() => setAuthMode('signup')}>Sign Up</Button>
          </div>
          <NameGeneratorForm
            onGenerate={(data) => generateMutation.mutate(data)}
            isGenerating={generateMutation.isPending}
          />
          <AuthDialog 
            isOpen={!!authMode} 
            onClose={() => setAuthMode(null)}
            mode={authMode as 'login' | 'signup'} 
          />

          {displayedNames.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Generated Names</h2>
              <ResultsGrid
                names={isAuthenticated ? displayedNames : displayedNames.slice(0, 5)}
                onSave={(name) => {
                  if (!isAuthenticated) {
                    setAuthMode('signup');
                    return;
                  }
                  saveMutation.mutate(name);
                }}
              />
              {!isAuthenticated && displayedNames.length > 5 && (
                <div className="text-center mt-8 p-6 bg-muted rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Want to see more names?</h3>
                  <p className="text-muted-foreground mb-4">Sign up to unlock all generated names and save your favorites.</p>
                  <Button onClick={() => setAuthMode('signup')}>Sign Up Now</Button>
                </div>
              )}
              {generatedNames.length > displayedNames.length && (
                <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                  <p className="text-muted-foreground">Scroll for more names...</p>
                </div>
              )}
            </div>
          )}

          <SavedNames names={savedNames} onExport={handleExport} />
        </div>
      </div>
    </div>
  );
}