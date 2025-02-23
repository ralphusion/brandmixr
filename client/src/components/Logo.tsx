
import { cn } from "@/lib/utils";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <svg
        viewBox="0 0 800 800"
        width="24"
        height="24"
        className="text-primary"
      >
        <path
          fill="currentColor"
          d="M400 100c165.685 0 300 134.315 300 300S565.685 700 400 700 100 565.685 100 400s134.315-300 300-300zm0 0c-82.843 0-150 67.157-150 150s67.157 150 150 150 150-67.157 150-150-67.157-150-150-150zm0 75c-41.421 0-75 33.579-75 75s33.579 75 75 75 75-33.579 75-75-33.579-75-75-75zm0 37.5c-20.711 0-37.5 16.789-37.5 37.5s16.789 37.5 37.5 37.5 37.5-16.789 37.5-37.5-16.789-37.5-37.5-37.5z"
        />
      </svg>
      <span className="text-2xl font-bold text-primary">BRANDMIXR</span>
    </div>
  );
}
