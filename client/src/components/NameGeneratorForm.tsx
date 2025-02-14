import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { generateNameSchema } from "@shared/schema";
import { INDUSTRIES, BRAND_STYLES, PLACEHOLDER_DESCRIPTIONS } from "@/lib/constants";

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
      style: "auto"
    }
  });

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onGenerate)} className="space-y-6">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      onIndustryChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                  <FormLabel>Business Description</FormLabel>
                  <FormControl>
                    <Input {...field} value={description} onChange={(e) => {
                      field.onChange(e);
                      setDescription(e.target.value);
                    }} />
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
                  <FormLabel>Keywords (comma-separated)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value.split(',').map(k => k.trim()))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Names"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
