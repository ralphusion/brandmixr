export type Typography = {
  family: string;
  weights: string[];
  styles: string[];
  category?: string;
};

export type IconCategory = 'technology' | 'business' | 'creative';
export type IconStyle = 'modern' | 'minimal';

export type TextEffect = {
  letterSpacing: string;
  textTransform?: string;
  fontStyle?: string;
  fontVariationSettings: string;
};