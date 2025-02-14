import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { NameGeneratorForm } from "@/components/NameGeneratorForm";
import { ResultsGrid } from "@/components/ResultsGrid";
import { SavedNames } from "@/components/SavedNames";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { type GenerateNameRequest, type BrandName } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: savedNames = [] } = useQuery<BrandName[]>({
    queryKey: ["/api/names/saved"],
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateNameRequest) => {
      const res = await apiRequest("POST", "/api/generate", data);
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedNames(data);
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">AI Brand Name Generator</h1>
      
      <NameGeneratorForm
        onGenerate={(data) => generateMutation.mutate(data)}
        isGenerating={generateMutation.isPending}
      />

      {generatedNames.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Generated Names</h2>
          <ResultsGrid
            names={generatedNames}
            onSave={(name) => saveMutation.mutate(name)}
          />
        </div>
      )}

      <SavedNames names={savedNames} onExport={handleExport} />
    </div>
  );
}
