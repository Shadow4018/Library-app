import type { BookFormData, UserFormData, ValidationResult } from '../types/index';

/**
 * Простір імен з чистими функціями валідації.
 * Не залежить від DOM та не знає нічого про UI.
 * namespace використано свідомо - цього вимагає завдання (організація коду всередині модуля).
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Validation {
  const YEAR_REGEXP = /^(1[0-9]{3}|20[0-9]{2})$/;
  const USER_ID_REGEXP = /^[0-9]+$/;
  const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const REQUIRED_MESSAGE = "Це поле є обов'язковим";

  export function isRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  /** Рік: рівно 4 цифри (1000-2099) і не пізніше за поточний рік. */
  export function isValidYear(value: string): boolean {
    const trimmed = value.trim();
    return YEAR_REGEXP.test(trimmed) && Number(trimmed) <= new Date().getFullYear();
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
      errors.title = REQUIRED_MESSAGE;
    }
    if (!isRequired(data.author)) {
      errors.author = REQUIRED_MESSAGE;
    }
    if (!isRequired(data.year)) {
      errors.year = REQUIRED_MESSAGE;
    } else if (!isValidYear(data.year)) {
      errors.year = 'Рік видання має містити лише цифри та бути коректним роком';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  export function validateUserForm(data: UserFormData): ValidationResult {
    const errors: Record<string, string> = {};

    if (!isRequired(data.name)) {
      errors.name = REQUIRED_MESSAGE;
    }
    if (!isRequired(data.email)) {
      errors.email = REQUIRED_MESSAGE;
    } else if (!isValidEmail(data.email)) {
      errors.email = 'Введіть коректну email-адресу';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  /** Валідація id користувача, введеного у модальному вікні позичання книги. */
  export function validateUserIdInput(value: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!isRequired(value)) {
      errors.userId = REQUIRED_MESSAGE;
    } else if (!isValidUserId(value)) {
      errors.userId = 'Id користувача має містити лише цифри';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }
}
