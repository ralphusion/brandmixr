import { useLocation } from "wouter";
import { NameGeneratorForm } from "@/components/NameGeneratorForm";
import { type GenerateNameRequest } from "@shared/schema";

export default function Input() {
  const [, navigate] = useLocation();

  const handleGenerate = (data: GenerateNameRequest) => {
    // Store form data in sessionStorage to persist between pages
    sessionStorage.setItem('generatorFormData', JSON.stringify(data));
    navigate('/generate');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">AI Brand Name Generator</h1>
      <p className="text-center text-muted-foreground mb-8">
        Enter your business details below to generate unique brand name ideas
      </p>

      <NameGeneratorForm
        onGenerate={handleGenerate}
        isGenerating={false}
      />
    </div>
  );
}