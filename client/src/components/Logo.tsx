import { Text } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-gradient-to-r from-primary/90 to-primary p-2 rounded-lg dark:from-primary/70 dark:to-primary/90">
        <Text className="w-6 h-6 text-primary-foreground" />
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent dark:from-primary/70 dark:to-primary">
        BrandEzee
      </span>
    </div>
  );
}