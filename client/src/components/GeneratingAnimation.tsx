import { RefreshCw, Sparkles, Text } from "lucide-react";

export function GeneratingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="relative bg-primary/10 p-4 rounded-full animate-pulse">
          <Sparkles className="w-8 h-8 text-primary animate-bounce" />
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-muted-foreground">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <p className="text-lg animate-pulse">Crafting unique brand names...</p>
      </div>
      
      <div className="flex gap-4 text-xs text-muted-foreground/80">
        <span className="animate-pulse delay-0">Analyzing industry trends</span>
        <span className="animate-pulse delay-150">Checking availability</span>
        <span className="animate-pulse delay-300">Ensuring uniqueness</span>
      </div>
    </div>
  );
}
