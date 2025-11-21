export type PromptMode = 'image';

export interface FormState {
  mode: PromptMode;
  title: string;
  style: string;
  colors: string;
  lens: string;
  composition: string;
  elements: string;
  extras: string;
  preserveFeatures: boolean;
}

export interface GeneratedOutput {
  block: string;
  compact: string;
}

export interface Preset {
  label: string;
  mode: PromptMode;
  data: Partial<FormState>;
}