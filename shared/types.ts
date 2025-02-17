export type LogoStyle = 'modern' | 'classic' | 'minimal' | 'bold';

export interface IconOptions {
  style?: string;
  color?: string;
  backgroundColor?: string;
}
export type AIModel = 'openai' | 'gemini' | 'openrouter';

export type ModelConfig = {
  provider: AIModel;
  model: string;
};

export const OPENROUTER_MODELS = [
  { value: 'anthropic/claude-3-opus', label: 'Claude 3 Opus' },
  { value: 'anthropic/claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { value: 'meta-llama/llama-2-70b-chat', label: 'LLaMA 2 70B' },
  { value: 'google/gemini-pro', label: 'Gemini Pro' },
  { value: 'mistralai/mistral-large', label: 'Mistral Large' }
] as const;
