import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export interface FilterOptions {
  nameLength: [number, number];
  startingLetter: string;
  searchText: string;
}

interface FilterMenuProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export function FilterMenu({ onFilterChange }: FilterMenuProps) {
  const [nameLength, setNameLength] = useState<[number, number]>([3, 20]);
  const [startingLetter, setStartingLetter] = useState<string>("all");
  const [searchText, setSearchText] = useState("");

  // Generate alphabet array with "#" for numbers
  const alphabet = ["#", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

  useEffect(() => {
    onFilterChange({
      nameLength,
      startingLetter: startingLetter === "all" ? "" : startingLetter,
      searchText,
    });
  }, [nameLength, startingLetter, searchText]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Customize your name search results
            </p>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Name Length ({nameLength[0]}-{nameLength[1]} letters)</Label>
              <Slider
                min={3}
                max={20}
                step={1}
                value={nameLength}
                onValueChange={(value: number[]) => setNameLength([value[0], value[1]])}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              />
            </div>
            <div className="space-y-2">
              <Label>Starting Letter</Label>
              <Select
                value={startingLetter}
                onValueChange={setStartingLetter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any letter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  {alphabet.map((letter) => (
                    <SelectItem key={letter} value={letter}>
                      {letter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search Text</Label>
              <Input
                placeholder="Filter by text..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}