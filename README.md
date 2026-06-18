# Aura Cosmetology 🌸

[![Deploy to GitHub Pages](https://github.com/delopochtamp-byte/aura-cosmetology/actions/workflows/deploy.yml/badge.svg)](https://github.com/delopochtamp-byte/aura-cosmetology/actions/workflows/deploy.yml)

**Красота не имеет границ** — мобильный сайт-лонгрид для косметологической клиники.

## Стек

- **React 19** + **Vite**
- Мультиязычность: 🇷🇺 Русский, 🇬🇧 English, 🇨🇳 中文, 🇰🇿 Қазақ
- 3D FlipCard на CSS (perspective + rotateY)
- localStorage для лайков (без регистрации)
- Mobile-first дизайн в стиле соцсети

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Генерация данных (100 услуг)
npm run generate

# Запуск dev-сервера
npm run dev
```

## Структура проекта

```
src/
├── components/          # React-компоненты
│   ├── Header.jsx       # Шапка: лого, слоган, переключатель языков
│   ├── LangSwitcher.jsx # Кнопки языков с флагами
│   ├── CategoryFilter.jsx # Фильтр по категориям
│   ├── FlipCard.jsx     # 3D-карточка с переворотом
│   ├── ServiceCard.jsx  # Обёртка карточки + лайк
│   ├── FeedPage.jsx     # Лента услуг
│   ├── BookingModal.jsx # Модалка записи (плейсхолдер)
│   └── Footer.jsx       # Подвал
├── data/                # JSON-данные
│   ├── services.json    # 100 услуг (генерируется)
│   ├── categories.json  # Категории с переводами
│   └── translations.json # Тексты интерфейса
├── hooks/               # Кастомные хуки
│   ├── useTranslation.js # Мультиязычность
│   └── useLikes.js      # Лайки (localStorage)
├── App.jsx              # Главный компонент
├── App.css              # Стили
├── index.css            # Глобальные стили
└── main.jsx             # Точка входа
```

## Наполнение контентом

1. Сгенерируйте данные: `npm run generate`
2. Замените плейсхолдеры изображений в `public/media/` на реальные фото/видео
3. Отредактируйте `src/data/services.json` для реальных цен и описаний
4. Настройте категории в `src/data/categories.json`
5. Интегрируйте Bitrix24 форму в компонент `BookingModal.jsx`

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка для продакшена |
| `npm run preview` | Превью продакшен-сборки |
| `npm run generate` | Генерация 100 услуг в services.json |
| `start-live.bat` | Запуск dev-сервера + ngrok-туннеля |

## Live-сервер (доступ с телефона через интернет)

Для демонстрации правок на реальном устройстве используется **ngrok** — сервис, создающий временный публичный URL, который пробрасывает трафик на локальный dev-сервер.

### Быстрый запуск

```bash
# 1. Убедиться, что ngrok установлен
ngrok version

# 2. Запустить dev-сервер + туннель одной командой
start-live.bat

# Или вручную в двух терминалах:
# Терминал 1: npm run dev
# Терминал 2: ngrok http http://localhost:5173
```

После запуска скопировать URL вида `https://xxxx-xx-xx-xx-xx.ngrok-free.app` из окна ngrok и открыть его на телефоне.

### Установка ngrok

**Через winget (рекомендуется):**
```bash
winget install --id Ngrok.Ngrok --exact
```

**Через npm:**
```bash
npm install -g ngrok
```

**Вручную:**
1. Скачать с https://ngrok.com/download
2. Распаковать и добавить в `PATH`

### Регистрация и authtoken

1. Зарегистрироваться на https://dashboard.ngrok.com/signup
2. Получить токен в https://dashboard.ngrok.com/get-started/your-authtoken
3. Выполнить: `ngrok config add-authtoken <ВАШ_ТОКЕН>`

### Примечания

- **Бесплатный тариф** — до 40 соединений/мин, 1 туннель. Этого достаточно для разработки.
- При каждом перезапуске ngrok URL меняется (кроме платных статических доменов).
- На бесплатном тарифе при открытии туннеля показывается предупреждающая страница — просто закройте её.
- **Альтернативы:** Cloudflare Tunnel (`cloudflared`), localtunnel, bore.

## Лицензия

MIT
