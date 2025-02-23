
import { cn } from "@/lib/utils";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 100 100" 
        className="text-primary"
      >
        <path
          fill="currentColor"
          d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 10c22.1 0 40 17.9 40 40S72.1 90 50 90 10 72.1 10 50s17.9-40 40-40zm0 10c-16.6 0-30 13.4-30 30s13.4 30 30 30 30-13.4 30-30-13.4-30-30-30zm0 10c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 10c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10z"
        />
      </svg>
      <span className="text-lg font-bold text-primary tracking-wider">BRANDMIXR</span>
    </div>
  );
}
