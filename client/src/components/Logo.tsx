import { Text } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-gradient-to-r from-primary to-primary/90 p-2 rounded-lg dark:from-primary/90 dark:to-primary">
        <Text className="w-6 h-6 text-primary-foreground" />
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent dark:from-primary dark:to-primary/90 dark:text-primary-foreground/90">
        BrandMixr
      </span>
    </div>
  );
}