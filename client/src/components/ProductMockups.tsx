import { motion } from "framer-motion";

interface ProductMockupProps {
  type: 'shopping-bag' | 'business-card' | 'product' | 'phone' | 'laptop' | 'letterhead';
  className?: string;
  background?: string;
}

const ShoppingBag = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 200 260" className="w-full h-full absolute inset-0">
    <defs>
      <linearGradient id="bagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#fafafa', stopOpacity: 1 }} />
      </linearGradient>
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

    {/* Background */}
    {background && (
      <rect x="0" y="0" width="200" height="260" className={background} />
    )}

    {/* Main Bag Body */}
    <rect 
      x="40" 
      y="70" 
      width="120" 
      height="160" 
      fill="url(#bagGradient)" 
      filter="url(#bagShadow)"
      rx="2"
    />

    {/* Left Handle */}
    <path 
      d="M65 70 C65 40 80 30 85 30 C90 30 105 40 105 70" 
      fill="none" 
      stroke="#333333" 
      strokeWidth="6"
      strokeLinecap="round"
    />

    {/* Right Handle */}
    <path 
      d="M95 70 C95 40 110 30 115 30 C120 30 135 40 135 70" 
      fill="none" 
      stroke="#333333" 
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
);

const BusinessCard = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 200 120" className="w-full h-full absolute inset-0">
    {background && (
      <rect x="0" y="0" width="200" height="120" className={background} />
    )}
    <rect x="20" y="20" width="160" height="80" rx="4" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
  </svg>
);

const ProductPackage = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 200 300" className="w-full h-full absolute inset-0">
    {background && (
      <rect x="0" y="0" width="200" height="300" className={background} />
    )}
    <rect x="40" y="40" width="120" height="220" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="2"/>
  </svg>
);

const Phone = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 120 240" className="w-full h-full absolute inset-0">
    {background && (
      <rect x="0" y="0" width="120" height="240" className={background} />
    )}
    <rect x="10" y="10" width="100" height="220" rx="20" fill="#1f2937" stroke="#374151" strokeWidth="2"/>
    <rect x="15" y="15" width="90" height="210" rx="16" fill="white"/>
  </svg>
);

const Laptop = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 400 280" className="w-full h-full absolute inset-0">
    {background && (
      <rect x="0" y="0" width="400" height="280" className={background} />
    )}
    <path d="M40 20 L360 20 L360 220 L40 220 Z" fill="#1f2937" stroke="#374151" strokeWidth="2"/>
    <path d="M20 220 L380 220 L400 260 L0 260 Z" fill="#374151"/>
    <rect x="45" y="25" width="310" height="190" rx="2" fill="white"/>
  </svg>
);

const Letterhead = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 200 280" className="w-full h-full absolute inset-0">
    {background && (
      <rect x="0" y="0" width="200" height="280" className={background} />
    )}
    <rect x="20" y="20" width="160" height="240" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
    <line x1="40" y1="100" x2="160" y2="100" stroke="#e5e7eb" strokeWidth="1"/>
    <line x1="40" y1="120" x2="160" y2="120" stroke="#e5e7eb" strokeWidth="1"/>
    <line x1="40" y1="140" x2="160" y2="140" stroke="#e5e7eb" strokeWidth="1"/>
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