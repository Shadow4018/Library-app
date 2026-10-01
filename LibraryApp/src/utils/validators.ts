import type { BookFormData, UserFormData, ValidationResult } from '../types/index.js';

/**
 * Простір імен з чистими функціями валідації.
 * Не залежить від DOM та не знає нічого про UI.
 */
export namespace Validation {
  const YEAR_REGEXP = /^(1[0-9]{3}|20[0-9]{2}|2100)$/;
  const USER_ID_REGEXP = /^[0-9]+$/;
  const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  export function isRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  /** Рік має складатись лише з цифр і потрапляти в діапазон 1000-2100. */
  export function isValidYear(value: string): boolean {
    return YEAR_REGEXP.test(value.trim());
  }

  /** Id користувача має складатись лише з цифр. */
  export function isValidUserId(value: string): boolean {
    return USER_ID_REGEXP.test(value.trim());
  }

  export function isValidEmail(value: string): boolean {
    return EMAIL_REGEXP.test(value.trim());
  }

  export function validateBookForm(data: BookFormData): ValidationResult {
    const errors: Record<string, string> = {};

    if (!isRequired(data.title)) {
      errors.title = "Це поле є обов'язковим";
    }
    if (!isRequired(data.author)) {
      errors.author = "Це поле є обов'язковим";
    }
    if (!isRequired(data.year)) {
      errors.year = "Це поле є обов'язковим";
    } else if (!isValidYear(data.year)) {
      errors.year = 'Рік видання має містити лише цифри та бути коректним роком';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  export function validateUserForm(data: UserFormData): ValidationResult {
    const errors: Record<string, string> = {};

    if (!isRequired(data.name)) {
      errors.name = "Це поле є обов'язковим";
    }
    if (!isRequired(data.email)) {
      errors.email = "Це поле є обов'язковим";
    } else if (!isValidEmail(data.email)) {
      errors.email = 'Введіть коректну email-адресу';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  /** Валідація id користувача, введеного у модальному вікні позичання книги. */
  export function validateUserIdInput(value: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!isRequired(value)) {
      errors.userId = "Це поле є обов'язковим";
    } else if (!isValidUserId(value)) {
      errors.userId = 'Id користувача має містити лише цифри';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }
}
