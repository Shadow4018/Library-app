/** Генерує унікальний рядковий id на основі поточного часу. */
export function generateId(): string {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}
