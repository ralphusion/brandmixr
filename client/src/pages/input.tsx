import { useLocation } from "wouter";
import { NameGeneratorForm } from "@/components/NameGeneratorForm";
import { type GenerateNameRequest } from "@shared/schema";
import { Logo } from "@/components/Logo";
import { Text, Sparkles, Globe } from "lucide-react";

export default function Input() {
  const [, navigate] = useLocation();

  const handleGenerate = (data: GenerateNameRequest) => {
    // Clear previous generated names when submitting new parameters
    sessionStorage.removeItem('generatedNames');
    // Store form data in sessionStorage to persist between pages
    sessionStorage.setItem('generatorFormData', JSON.stringify(data));
    navigate('/generate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="mb-8">
            <Logo className="mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
              AI-Powered Brand Name Generator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create unique, memorable brand names tailored to your business using advanced AI. 
              Get instant domain availability and trademark checks for your generated names.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full mb-12">
            <div className="flex flex-col items-center p-6 rounded-lg bg-card border shadow-sm">
              <Text className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Smart Generation</h3>
              <p className="text-sm text-muted-foreground text-center">
                AI-powered suggestions based on your business description
              </p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-lg bg-card border shadow-sm">
              <Sparkles className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Multiple Styles</h3>
              <p className="text-sm text-muted-foreground text-center">
                Choose from various naming styles to match your brand
              </p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-lg bg-card border shadow-sm">
              <Globe className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Instant Checks</h3>
              <p className="text-sm text-muted-foreground text-center">
                Domain availability and trademark verification
              </p>
            </div>
          </div>
        </div>

        {/* Form Section with subtle background */}
        <div className="max-w-2xl mx-auto bg-card border rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Start Generating Names</h2>
          <NameGeneratorForm
            onGenerate={handleGenerate}
            isGenerating={false}
          />
        </div>
      </div>
    </div>
  );
}