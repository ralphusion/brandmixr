import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ResultsGrid } from "@/components/ResultsGrid";
import { SavedNames } from "@/components/SavedNames";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { type GenerateNameRequest, type BrandName } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";

const NAMES_PER_PAGE = 12;

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

export default function Generate() {
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [displayedNames, setDisplayedNames] = useState<GeneratedName[]>([]);
  const [page, setPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const formData = sessionStorage.getItem('generatorFormData');

  // Load saved generated names from sessionStorage
  useEffect(() => {
    const savedGeneratedNames = sessionStorage.getItem('generatedNames');
    if (savedGeneratedNames) {
      const parsedNames = JSON.parse(savedGeneratedNames);
      setGeneratedNames(parsedNames);
      setDisplayedNames(parsedNames.slice(0, NAMES_PER_PAGE));
    } else if (!formData) {
      navigate('/');
      return;
    } else {
      // Generate names when the page loads and no saved names exist
      generateMutation.mutate(JSON.parse(formData));
    }
  }, []);

  const { data: savedNames = [] } = useQuery<BrandName[]>({
    queryKey: ["/api/names/saved"],
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isGenerating && generatedNames.length > displayedNames.length) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [generatedNames.length, displayedNames.length, isGenerating]);

  useEffect(() => {
    const endIndex = page * NAMES_PER_PAGE;
    const newNames = generatedNames.slice(0, endIndex);
    setDisplayedNames(newNames);
  }, [page, generatedNames]);

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateNameRequest) => {
      setIsGenerating(true);
      const res = await apiRequest("POST", "/api/generate", data);
      return res.json();
    },
    onSuccess: (data: GeneratedName[]) => {
      setGeneratedNames(data);
      setDisplayedNames(data.slice(0, NAMES_PER_PAGE));
      setPage(1);
      setIsGenerating(false);
      // Store generated names in sessionStorage
      sessionStorage.setItem('generatedNames', JSON.stringify(data));
    },
    onError: () => {
      setIsGenerating(false);
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
        industry: JSON.parse(formData || '{}').industry || "",
        description: JSON.parse(formData || '{}').description || "",
        keywords: JSON.parse(formData || '{}').keywords || [],
        style: JSON.parse(formData || '{}').style || "",
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

  const toggleSaveMutation = useMutation({
    mutationFn: async (name: BrandName) => {
      const res = await apiRequest("POST", `/api/names/${name.id}/toggle`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/names/saved"] });
      toast({
        title: "Success",
        description: "Name updated successfully!",
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

  const handleGenerateMore = () => {
    if (formData) {
      generateMutation.mutate(JSON.parse(formData));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Logo />
        </div>
      </div>

      <Tabs defaultValue="generated" className="mt-8">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="generated">Generated Names</TabsTrigger>
          <TabsTrigger value="saved">Saved Names</TabsTrigger>
        </TabsList>

        <TabsContent value="generated">
          {generateMutation.isPending && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Generating names...</p>
            </div>
          )}

          {displayedNames.length > 0 && (
            <div className="mt-8">
              <ResultsGrid
                names={displayedNames}
                onSave={(name) => saveMutation.mutate(name.name)}
              />
              {generatedNames.length > displayedNames.length && !isGenerating && (
                <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                  <p className="text-muted-foreground">Loading more names...</p>
                </div>
              )}
              {displayedNames.length === generatedNames.length && (
                <div className="mt-8 flex justify-center">
                  <Button 
                    onClick={handleGenerateMore}
                    disabled={isGenerating}
                  >
                    Generate More Names
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          <div className="mt-8">
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={handleExport}>
                Export CSV
              </Button>
            </div>
            {savedNames.length > 0 ? (
              <ResultsGrid
                names={savedNames.map(n => ({
                  name: n.name,
                  domain: '',
                  domainAvailable: false
                }))}
                onSave={(name) => {
                  const savedName = savedNames.find(n => n.name === name.name);
                  if (savedName) {
                    toggleSaveMutation.mutate(savedName);
                  }
                }}
              />
            ) : (
              <p className="text-center text-muted-foreground py-12">
                No saved names yet. Heart your favorite names to save them!
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}