# Library App (TypeScript, лабораторна №2)

Клієнтський застосунок для керування бібліотекою: книги, користувачі, позичання/повернення,
пошук, пагінація, збереження в LocalStorage. Вся розмітка генерується з TypeScript
(`index.html` містить лише `<div id="app"></div>`).

## Скрипти

| Команда | Призначення |
| --- | --- |
| `npm start` | dev-сервер webpack (http://localhost:9000) |
| `npm run build` | продакшн-збірка в `dist/` |
| `npm test` | юніт-тести (Mocha + Chai) |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` / `format:check` | Prettier |

Husky `pre-commit` запускає `lint`, `format:check` та `test` - коміт блокується, якщо щось не пройшло.

## Архітектура

- `src/models` - Book, User + інтерфейси (без знання про UI/storage)
- `src/services` - `Library<T>` (generic), `Storage<T>`, `BorrowService`, `NotificationService`
- `src/utils` - `Validation` (namespace), пагінація, пошук, генератор id
- `src/ui` - єдиний шар, що працює з DOM
- `tests` - Mocha-тести

## Висновок: webpack vs Vite

_(заповніть за результатами порівняння на гілці `vite-migration`: швидкість старту dev-сервера та HMR,
складність конфігурації, розмір і швидкість production-збірки, підключення Bootstrap та TS,
екосистема плагінів, суб'єктивна оцінка)_
