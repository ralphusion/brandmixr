import { useLocation } from "wouter";
import { NameGeneratorForm } from "@/components/NameGeneratorForm";
import { type GenerateNameRequest } from "@shared/schema";
import { Logo } from "@/components/Logo";

export default function Input() {
  const [, navigate] = useLocation();

  const handleGenerate = (data: GenerateNameRequest) => {
    // Store form data in sessionStorage to persist between pages
    sessionStorage.setItem('generatorFormData', JSON.stringify(data));
    navigate('/generate');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-12">
        <Logo className="mb-6" />
        <p className="text-center text-muted-foreground">
          Enter your business details below to generate unique brand name ideas
        </p>
      </div>

      <NameGeneratorForm
        onGenerate={handleGenerate}
        isGenerating={false}
      />
    </div>
  );
}