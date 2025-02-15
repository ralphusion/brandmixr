import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface FilterControlsProps {
  onStartingWithChange: (value: string) => void;
  onLengthChange: (value: number[]) => void;
  onSearchChange: (value: string) => void;
  minLength: number;
  maxLength: number;
}

// Generate A-Z, 0-9 options
const generateAlphanumericOptions = () => {
  const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const numbers = Array.from({ length: 10 }, (_, i) => i.toString());
  return ['All', ...letters, ...numbers];
};

export function FilterControls({
  onStartingWithChange,
  onLengthChange,
  onSearchChange,
  minLength,
  maxLength,
}: FilterControlsProps) {
  const alphanumericOptions = generateAlphanumericOptions();

  return (
    <Card className="p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Starting With</Label>
          <Select onValueChange={onStartingWithChange} defaultValue="All">
            <SelectTrigger>
              <SelectValue placeholder="Select starting character" />
            </SelectTrigger>
            <SelectContent>
              {alphanumericOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Brand Name Length: {maxLength}</Label>
          <Slider
            defaultValue={[maxLength]}
            max={20}
            min={1}
            step={1}
            onValueChange={onLengthChange}
            className="mt-2"
          />
        </div>

        <div className="space-y-2">
          <Label>Filter by</Label>
          <Input
            type="text"
            placeholder="Enter text to filter"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}
