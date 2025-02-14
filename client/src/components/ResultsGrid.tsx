import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type BrandName } from "@shared/schema";
import { BookmarkIcon } from "lucide-react";

interface ResultsGridProps {
  names: string[];
  onSave: (name: string) => void;
}

export function ResultsGrid({ names, onSave }: ResultsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {names.map((name, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">{name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => onSave(name)}
            >
              <BookmarkIcon className="h-4 w-4 mr-2" />
              Save Name
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
