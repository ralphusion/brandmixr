import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { generateNameSchema } from "@shared/schema";
import { INDUSTRIES, BRAND_STYLES, PLACEHOLDER_DESCRIPTIONS } from "@/lib/constants";
import { AIModel, OPENROUTER_MODELS } from "@shared/types";

interface NameGeneratorFormProps {
  onGenerate: (data: any) => void;
  isGenerating: boolean;
}

export function NameGeneratorForm({ onGenerate, isGenerating }: NameGeneratorFormProps) {
  const [description, setDescription] = useState("");

  const form = useForm({
    resolver: zodResolver(generateNameSchema),
    defaultValues: {
      industry: "",
      description: "",
      keywords: [],
      style: "auto",
      provider: "openai",
      model: "gpt-4"
    }
  });

  // Load saved form data when component mounts
  useEffect(() => {
    const savedData = sessionStorage.getItem('generatorFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      form.reset(parsedData);
      setDescription(parsedData.description || "");
    }
  }, []);

  const generateRandomDescription = (industry: string) => {
    const descriptions = PLACEHOLDER_DESCRIPTIONS[industry] || [];
    const randomIndex = Math.floor(Math.random() * descriptions.length);
    return descriptions[randomIndex] || "";
  };

  const onIndustryChange = (value: string) => {
    const newDescription = generateRandomDescription(value);
    form.setValue("description", newDescription);
    setDescription(newDescription);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border dark:border-gray-800">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onGenerate)} className="space-y-6">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">Industry</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      onIndustryChange(value);
                    }}
                    value={field.value || "select-industry"}
                  >
                    <FormControl>
                      <SelectTrigger className="dark:border-gray-700">
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="select-industry" disabled>Select an industry</SelectItem>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">Business Description</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      value={description} 
                      onChange={(e) => {
                        field.onChange(e);
                        setDescription(e.target.value);
                      }}
                      className="dark:border-gray-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">Keywords (comma-separated)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(k => k.trim()))}
                      className="dark:border-gray-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel className="dark:text-gray-200">AI Model Provider</FormLabel>
              <Select defaultValue="openai" onValueChange={(value: AIModel) => {
                form.setValue("provider", value);
                form.setValue("model", value === "openai" ? "gpt-4" : 
                            value === "gemini" ? "gemini-1.5-pro" : 
                            "anthropic/claude-3-opus");
              }}>
                <FormControl>
                  <SelectTrigger className="dark:border-gray-700">
                    <SelectValue placeholder="Select model provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="openrouter">OpenRouter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.watch("provider") === "openrouter" && (
              <div className="space-y-2">
                <FormLabel className="dark:text-gray-200">OpenRouter Model</FormLabel>
                <Select defaultValue="anthropic/claude-3-opus" onValueChange={(value) => form.setValue("model", value)}>
                  <FormControl>
                    <SelectTrigger className="dark:border-gray-700">
                      <SelectValue placeholder="Select OpenRouter model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {OPENROUTER_MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">Brand Style</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || "select-style"}>
                    <FormControl>
                      <SelectTrigger className="dark:border-gray-700">
                        <SelectValue placeholder="Select a style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="select-style" disabled>Select a style</SelectItem>
                      {BRAND_STYLES.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90" 
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Names"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}