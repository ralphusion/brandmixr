import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type BrandName } from "@shared/schema";
import { Download } from "lucide-react";

interface SavedNamesProps {
  names: BrandName[];
  onExport: () => void;
}

export function SavedNames({ names, onExport }: SavedNamesProps) {
  if (names.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Saved Names</CardTitle>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {names.map((name) => (
            <Card key={name.id}>
              <CardContent className="pt-6">
                <p className="text-lg font-medium">{name.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{name.industry}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
