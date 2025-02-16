import { motion } from "framer-motion";

interface ProductMockupProps {
  type: 'shopping-bag';
  className?: string;
  background?: string;
}

const ShoppingBag = ({ background }: { background?: string }) => (
  <svg viewBox="0 0 200 260" className={`w-full h-full absolute inset-0`}>
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
    <g className={background}>
      <rect 
        x="40" 
        y="70" 
        width="120" 
        height="160"
        filter="url(#bagShadow)"
        rx="2"
      />
    </g>

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

export const ProductMockup: React.FC<ProductMockupProps> = ({ type, className = '', background }) => {
  return (
    <div className={`relative ${className}`}>
      <ShoppingBag background={background} />
    </div>
  );
};