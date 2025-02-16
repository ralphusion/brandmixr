import { motion } from "framer-motion";

interface ProductMockupProps {
  type: 'shopping-bag' | 'business-card' | 'product' | 'phone' | 'laptop' | 'letterhead';
  className?: string;
  background?: string;
}

const ShoppingBag = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 200 260" className="w-full h-full absolute inset-0">
    <defs>
      <filter id="bagShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
        <feOffset dx="4" dy="6"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.15"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Main Bag Body */}
    <rect 
      x="40" 
      y="70" 
      width="120" 
      height="160" 
      className={background || "fill-background"}
      filter="url(#bagShadow)"
      rx="2"
    />

    {/* Left Handle */}
    <path 
      d="M65 70 C65 40 80 30 85 30 C90 30 105 40 105 70" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="6"
      strokeLinecap="round"
      className="text-foreground"
    />

    {/* Right Handle */}
    <path 
      d="M95 70 C95 40 110 30 115 30 C120 30 135 40 135 70" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="6"
      strokeLinecap="round"
      className="text-foreground"
    />
  </svg>
);

const BusinessCard = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 200 120" className="w-full h-full absolute inset-0">
    <rect 
      x="20" 
      y="20" 
      width="160" 
      height="80" 
      rx="4" 
      className={background || "fill-background"}
    />
  </svg>
);

const ProductPackage = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 200 300" className="w-full h-full absolute inset-0">
    <rect 
      x="40" 
      y="40" 
      width="120" 
      height="220" 
      rx="8" 
      className={background || "fill-background"}
    />
  </svg>
);

const Phone = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 120 240" className="w-full h-full absolute inset-0">
    <rect 
      x="10" 
      y="10" 
      width="100" 
      height="220" 
      rx="20" 
      className={background || "fill-background"}
    />
    <rect 
      x="15" 
      y="15" 
      width="90" 
      height="210" 
      rx="16" 
      className="fill-background"
    />
  </svg>
);

const Laptop = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 400 280" className="w-full h-full absolute inset-0">
    <path 
      d="M40 20 L360 20 L360 220 L40 220 Z" 
      className={background || "fill-background"}
    />
    <path 
      d="M20 220 L380 220 L400 260 L0 260 Z" 
      className="fill-muted-foreground"
    />
    <rect 
      x="45" 
      y="25" 
      width="310" 
      height="190" 
      rx="2" 
      className="fill-background"
    />
  </svg>
);

const Letterhead = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 200 280" className="w-full h-full absolute inset-0">
    <rect 
      x="20" 
      y="20" 
      width="160" 
      height="240" 
      className={background || "fill-background"}
    />
    <line x1="40" y1="100" x2="160" y2="100" stroke="currentColor" strokeWidth="1" className="text-muted"/>
    <line x1="40" y1="120" x2="160" y2="120" stroke="currentColor" strokeWidth="1" className="text-muted"/>
    <line x1="40" y1="140" x2="160" y2="140" stroke="currentColor" strokeWidth="1" className="text-muted"/>
  </svg>
);

export const ProductMockup: React.FC<ProductMockupProps> = ({ type, className = '', background }) => {
  const components = {
    'shopping-bag': ShoppingBag,
    'business-card': BusinessCard,
    'product': ProductPackage,
    'phone': Phone,
    'laptop': Laptop,
    'letterhead': Letterhead
  };

  const Component = components[type];
  return (
    <div className={`relative ${className}`}>
      <Component background={background} />
    </div>
  );
};