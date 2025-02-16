import { motion } from "framer-motion";

const ShoppingBag = () => (
  <svg viewBox="0 0 200 260" className="w-full h-full absolute inset-0">
    <defs>
      <linearGradient id="bagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#f8f8f8', stopOpacity: 1 }} />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.1"/>
      </filter>
    </defs>
    {/* Main Bag Body */}
    <path 
      d="M40 80 L160 80 L150 240 L50 240 Z" 
      fill="url(#bagGradient)" 
      stroke="#e5e7eb" 
      strokeWidth="1"
      filter="url(#shadow)"
    />
    {/* Left Handle */}
    <path 
      d="M60 80 C60 60 70 40 80 40 C90 40 90 60 90 80" 
      fill="none" 
      stroke="#d1d5db" 
      strokeWidth="1"
      strokeLinecap="round"
    />
    {/* Right Handle */}
    <path 
      d="M110 80 C110 60 120 40 130 40 C140 40 140 60 140 80" 
      fill="none" 
      stroke="#d1d5db" 
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

const BusinessCard = () => (
  <svg viewBox="0 0 200 120" className="w-full h-full absolute inset-0">
    <defs>
      <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#f9fafb', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="160" height="80" rx="4" fill="url(#cardGradient)" stroke="#e5e7eb" strokeWidth="1"/>
  </svg>
);

const ProductPackage = () => (
  <svg viewBox="0 0 200 300" className="w-full h-full absolute inset-0">
    <defs>
      <linearGradient id="packageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f9fafb', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#f3f4f6', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect x="40" y="40" width="120" height="220" rx="8" fill="url(#packageGradient)" stroke="#e5e7eb" strokeWidth="2"/>
  </svg>
);

const Phone = () => (
  <svg viewBox="0 0 120 240" className="w-full h-full absolute inset-0">
    <defs>
      <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#1f2937', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#111827', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="100" height="220" rx="20" fill="url(#phoneGradient)" stroke="#374151" strokeWidth="2"/>
    <rect x="15" y="15" width="90" height="210" rx="16" fill="#f9fafb"/>
  </svg>
);

const Laptop = () => (
  <svg viewBox="0 0 400 280" className="w-full h-full absolute inset-0">
    <defs>
      <linearGradient id="laptopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#1f2937', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#111827', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M40 20 L360 20 L360 220 L40 220 Z" fill="url(#laptopGradient)" stroke="#374151" strokeWidth="2"/>
    <path d="M20 220 L380 220 L400 260 L0 260 Z" fill="#374151"/>
    <rect x="45" y="25" width="310" height="190" rx="2" fill="#f9fafb"/>
  </svg>
);

const Letterhead = () => (
  <svg viewBox="0 0 200 280" className="w-full h-full absolute inset-0">
    <defs>
      <linearGradient id="paperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#f9fafb', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="160" height="240" fill="url(#paperGradient)" stroke="#e5e7eb" strokeWidth="1"/>
    <line x1="40" y1="100" x2="160" y2="100" stroke="#e5e7eb" strokeWidth="1"/>
    <line x1="40" y1="120" x2="160" y2="120" stroke="#e5e7eb" strokeWidth="1"/>
    <line x1="40" y1="140" x2="160" y2="140" stroke="#e5e7eb" strokeWidth="1"/>
  </svg>
);

export interface ProductMockupProps {
  type: 'shopping-bag' | 'business-card' | 'product' | 'phone' | 'laptop' | 'letterhead';
  className?: string;
}

export const ProductMockup: React.FC<ProductMockupProps> = ({ type, className = '' }) => {
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
      <Component />
    </div>
  );
};