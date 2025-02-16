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
      fill={`url('#${background?.replace(/[^a-zA-Z0-9]/g, '_')}')`}
      filter="url(#bagShadow)"
      rx="2"
    >
      <defs>
        <linearGradient id={background?.replace(/[^a-zA-Z0-9]/g, '_')} gradientTransform="rotate(45)">
          <stop offset="0%" className="stop-color-from" />
          <stop offset="50%" className="stop-color-via" />
          <stop offset="100%" className="stop-color-to" />
        </linearGradient>
      </defs>
    </rect>

    {/* Handles */}
    <path 
      d="M65 70 C65 40 80 30 85 30 C90 30 105 40 105 70" 
      fill="none" 
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
      opacity="0.8"
    />
    <path 
      d="M95 70 C95 40 110 30 115 30 C120 30 135 40 135 70" 
      fill="none" 
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
      opacity="0.8"
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
      fill={`url('#${background?.replace(/[^a-zA-Z0-9]/g, '_')}')`}
    >
      <defs>
        <linearGradient id={background?.replace(/[^a-zA-Z0-9]/g, '_')} gradientTransform="rotate(45)">
          <stop offset="0%" className="stop-color-from" />
          <stop offset="50%" className="stop-color-via" />
          <stop offset="100%" className="stop-color-to" />
        </linearGradient>
      </defs>
    </rect>
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
      fill={`url('#${background?.replace(/[^a-zA-Z0-9]/g, '_')}')`}
    >
      <defs>
        <linearGradient id={background?.replace(/[^a-zA-Z0-9]/g, '_')} gradientTransform="rotate(45)">
          <stop offset="0%" className="stop-color-from" />
          <stop offset="50%" className="stop-color-via" />
          <stop offset="100%" className="stop-color-to" />
        </linearGradient>
      </defs>
    </rect>
  </svg>
);

const Phone = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 120 240" className="w-full h-full absolute inset-0">
    {/* Phone Frame */}
    <rect 
      x="10" 
      y="10" 
      width="100" 
      height="220" 
      rx="20" 
      fill={`url('#${background?.replace(/[^a-zA-Z0-9]/g, '_')}')`}
    >
      <defs>
        <linearGradient id={background?.replace(/[^a-zA-Z0-9]/g, '_')} gradientTransform="rotate(45)">
          <stop offset="0%" className="stop-color-from" />
          <stop offset="50%" className="stop-color-via" />
          <stop offset="100%" className="stop-color-to" />
        </linearGradient>
      </defs>
    </rect>
    {/* Screen */}
    <rect 
      x="15" 
      y="15" 
      width="90" 
      height="210" 
      rx="16" 
      fill="rgba(255, 255, 255, 0.1)"
    />
  </svg>
);

const Laptop = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 400 280" className="w-full h-full absolute inset-0">
    {/* Screen */}
    <path 
      d="M40 20 L360 20 L360 220 L40 220 Z" 
      fill={`url('#${background?.replace(/[^a-zA-Z0-9]/g, '_')}')`}
    >
      <defs>
        <linearGradient id={background?.replace(/[^a-zA-Z0-9]/g, '_')} gradientTransform="rotate(45)">
          <stop offset="0%" className="stop-color-from" />
          <stop offset="50%" className="stop-color-via" />
          <stop offset="100%" className="stop-color-to" />
        </linearGradient>
      </defs>
    </path>
    {/* Base */}
    <path 
      d="M20 220 L380 220 L400 260 L0 260 Z" 
      fill="rgba(255, 255, 255, 0.2)"
    />
    {/* Display Area */}
    <rect 
      x="45" 
      y="25" 
      width="310" 
      height="190" 
      rx="2" 
      fill="rgba(255, 255, 255, 0.1)"
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
      fill={`url('#${background?.replace(/[^a-zA-Z0-9]/g, '_')}')`}
    >
      <defs>
        <linearGradient id={background?.replace(/[^a-zA-Z0-9]/g, '_')} gradientTransform="rotate(45)">
          <stop offset="0%" className="stop-color-from" />
          <stop offset="50%" className="stop-color-via" />
          <stop offset="100%" className="stop-color-to" />
        </linearGradient>
      </defs>
    </rect>
    <line x1="40" y1="100" x2="160" y2="100" stroke="white" strokeWidth="1" opacity="0.2"/>
    <line x1="40" y1="120" x2="160" y2="120" stroke="white" strokeWidth="1" opacity="0.2"/>
    <line x1="40" y1="140" x2="160" y2="140" stroke="white" strokeWidth="1" opacity="0.2"/>
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