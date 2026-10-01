import type { AppNotification } from '../types/index';

export type NotificationListener = (notification: AppNotification) => void;

/**
 * Система сповіщень (замість alert). Сервіс нічого не знає про DOM:
 * UI-шар підписується на сповіщення і сам вирішує, як їх показати (модальне вікно).
 */
export class NotificationService {
  private listeners: NotificationListener[] = [];

  /** Повертає функцію для відписки. */
  subscribe(listener: NotificationListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }

  notify(notification: AppNotification): void {
    this.listeners.forEach((listener) => listener(notification));
  }

  info(title: string, message: string, confirmLabel?: string): void {
    this.notify(this.build(title, message, 'info', confirmLabel));
  }

  success(title: string, message: string, confirmLabel?: string): void {
    this.notify(this.build(title, message, 'success', confirmLabel));
  }

  error(title: string, message: string, confirmLabel?: string): void {
    this.notify(this.build(title, message, 'error', confirmLabel));
  }

  private build(
    title: string,
    message: string,
    type: AppNotification['type'],
    confirmLabel?: string,
  ): AppNotification {
    return confirmLabel === undefined
      ? { title, message, ...(type ? { type } : {}) }
      : { title, message, ...(type ? { type } : {}), confirmLabel };
  }
}
