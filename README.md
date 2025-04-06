# 🧵 3D Print Shop — Monorepo

Полный стек для бэкенда заказов 3D-печати.

## Сервисы

- 🤖 `bot-service` — Telegram бот
- 📈 `pricing-service` — Расчёт стоимости печати
- 🌍 `i18n-service` — Переводы и текстовые шаблоны
- 🔗 `shared` — Общие утилиты, типы, схемы

## Запуск

```bash
npm install
npm run dev
```

## Проверки

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test
```

## CI

GitHub Actions: запускается на каждый PR в `main`, проверяет весь код.
