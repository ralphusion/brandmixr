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
import { ArrowLeft, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  logoUrl?: string | null;
}

const NAMES_PER_PAGE = 12;

export default function Generate() {
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [displayedNames, setDisplayedNames] = useState<GeneratedName[]>([]);
  const [page, setPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const formData = sessionStorage.getItem('generatorFormData');

  useEffect(() => {
    if (!formData) {
      navigate('/');
      return;
    }
    // Generate names when the page loads
    generateMutation.mutate(JSON.parse(formData));
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
      try {
        const res = await apiRequest("POST", "/api/generate", data);
        const responseData = await res.json();
        if (!res.ok) {
          throw new Error(responseData.error || 'Failed to generate names');
        }
        return responseData as GeneratedName[];
      } catch (error) {
        console.error("Generation error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setGeneratedNames(data);
      setDisplayedNames(data.slice(0, NAMES_PER_PAGE));
      setPage(1);
      setIsGenerating(false);
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate names. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (name: string) => {
      const formDataObj = JSON.parse(formData || '{}');
      const res = await apiRequest("POST", "/api/names", {
        name,
        industry: formDataObj.industry || "",
        description: formDataObj.description || "",
        keywords: formDataObj.keywords || [],
        style: formDataObj.style || "",
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

  const handleGenerateMore = () => {
    if (formData) {
      generateMutation.mutate(JSON.parse(formData));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-4xl font-bold">Brand Names</h1>
      </div>

      <Tabs defaultValue="generated" className="mt-8">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="generated">Generated Names</TabsTrigger>
          <TabsTrigger value="saved">Saved Names</TabsTrigger>
        </TabsList>

        <TabsContent value="generated">
          {generateMutation.isPending && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Generating names and logos...</p>
              <p className="text-sm text-muted-foreground mt-2">This might take a moment</p>
            </div>
          )}

          {!generateMutation.isPending && generateMutation.isError && (
            <div className="text-center py-12">
              <p className="text-lg text-destructive">
                {generateMutation.error instanceof Error 
                  ? generateMutation.error.message 
                  : "Failed to generate names. Please try again."}
              </p>
              <Button
                onClick={handleGenerateMore}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          )}

          {!generateMutation.isPending && displayedNames.length > 0 && (
            <div className="mt-8">
              <ResultsGrid
                names={displayedNames}
                onSave={(name) => saveMutation.mutate(name)}
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
            {savedNames.length > 0 ? (
              <ResultsGrid
                names={savedNames.map(n => ({
                  name: n.name,
                  domain: '',
                  domainAvailable: false
                }))}
                onSave={() => {}}
                readOnly
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