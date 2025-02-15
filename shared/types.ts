export type LogoStyle = 'modern' | 'classic' | 'minimal' | 'bold';

export interface IconOptions {
  style?: string;
  color?: string;
  backgroundColor?: string;
}

export interface LogoConfig {
  brandName: string;
  style: string;
  industry: string;
}
