
import { cn } from "@/lib/utils";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <svg
        viewBox="0 0 800 800"
        width="48"
        height="48"
        className="text-primary"
      >
        <path
          fill="currentColor"
          d="M400 0C179.1 0 0 179.1 0 400s179.1 400 400 400 400-179.1 400-400S620.9 0 400 0zm0 100c165.7 0 300 134.3 300 300S565.7 700 400 700 100 565.7 100 400s134.3-300 300-300zm0 75c-124.3 0-225 100.7-225 225s100.7 225 225 225 225-100.7 225-225-100.7-225-225-225zm0 75c-82.8 0-150 67.2-150 150s67.2 150 150 150 150-67.2 150-150-67.2-150-150-150zm0 75c-41.4 0-75 33.6-75 75s33.6 75 75 75 75-33.6 75-75-33.6-75-75-75z"
        />
      </svg>
      <span className="text-2xl font-bold text-primary tracking-wider">BRANDMIXR</span>
    </div>
  );
}
