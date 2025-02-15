export type Typography = {
  family: string;
  weights: string[];
  styles: string[];
  category?: string;
};

export type IconCategory = 'technology' | 'business' | 'creative' | 'ecommerce' | 'health';

export type IconStyle = 
  | 'initials-simple'
  | 'initials-rounded'
  | 'initials-gradient'
  | 'geometric-circle'
  | 'geometric-square'
  | 'geometric-hexagon'
  | 'geometric-triangle'
  | 'geometric-diamond'
  | 'abstract-waves'
  | 'abstract-dots'
  | 'abstract-lines'
  | 'abstract-mesh'
  | 'abstract-swirl'
  | 'modern-minimal'
  | 'modern-tech'
  | 'modern-gradient'
  | 'decorative-floral'
  | 'decorative-vintage'
  | 'decorative-ornate';

export type TextEffect = {
  letterSpacing: string;
  textTransform?: string;
  fontStyle?: string;
  fontVariationSettings: string;
};