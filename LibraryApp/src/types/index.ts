// спільні типи, enum-и, глобальні d.ts

export interface BookFormData {
  title: string;
  author: string;
  year: string;
}

export interface UserFormData {
  name: string;
  email: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export type ModalType = 'info' | 'error' | 'success';

export interface Identifiable {
  getId(): string;
}
