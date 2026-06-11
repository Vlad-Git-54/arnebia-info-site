# Информационный сайт ООО «Арнебия»

Современный информационный сайт для производителя и дистрибьютора натуральной косметики, эфирных масел, БАДов и витаминов. Проект не является интернет-магазином: в каталоге нет корзины, цен и оформления заказа. В карточках товаров есть блок «Купить на маркетплейсах» с внешними ссылками на Wildberries и Ozon.

## Стек

- vinext / Next-compatible App Router surface для Sites-деплоя
- TypeScript
- Tailwind CSS 4
- MDX-файлы с frontmatter в `content/`
- schema.org JSON-LD, `sitemap.xml`, `robots.txt`, Open Graph metadata

## Запуск

```bash
npm install
npm run dev
```

Проверка сборки:

```bash
npm run build
```

## Деплой в Timeweb Cloud App Platform

В корне проекта есть `Dockerfile`. В Timeweb App Platform выбирайте Docker/Dockerfile, порт `3000`.

Основные переменные:

```bash
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
NEXT_PUBLIC_SITE_URL=https://ваш-временный-домен
```

## Структура

```text
app/                 страницы, sitemap.xml, robots.txt
components/          Header, Footer, ProductCard, CatalogFilters, формы и UI
content/products/    товары в MDX + frontmatter
content/posts/       новости, акции, семинары и статьи в MDX + frontmatter
content/taxonomy.ts  бренды и категории
content/site.ts      контакты, соцсети, базовые настройки
lib/                 загрузчик контента, SEO, frontmatter parser
```

## Как добавить товар

1. Создайте файл `content/products/new-product.mdx`.
2. Скопируйте frontmatter из существующей карточки.
3. Задайте `slug`, `title`, `description`, `brand`, `categories`, `image`, `imageAlt`, `ingredients`, `keywords`.
4. Обновите ссылки:

```yaml
marketplaces: {"wildberries":"https://www.wildberries.ru/catalog/123456789/detail.aspx","ozon":"https://www.ozon.ru/product/product-name-123456789/"}
```

Ссылки в примерах демонстрационные. Для production замените их на реальные карточки Wildberries и Ozon.

## Как добавить новость

Создайте MDX-файл в `content/posts/`:

```yaml
---
slug: "new-event"
title: "Заголовок"
description: "Краткое описание"
date: "2026-02-15"
category: "news"
image: "https://www.arnebia.ru/img/shop/4333b.jpg"
imageAlt: "Описание изображения"
tags: ["Арнебия", "Новость"]
---
```

Поддерживаемые категории: `news`, `seminar`, `promo`, `article`.

## SEO

У каждой страницы есть metadata. У товаров дополнительно есть `Product` JSON-LD без `Offer`, чтобы сайт не выглядел как магазин. У организации подключен `Organization` JSON-LD, у сайта `WebSite` JSON-LD с SearchAction.

Полезные поля для товаров:

- `seoTitle`
- `seoDescription`
- `keywords`
- `imageAlt`
- заголовки `##` и `###` в MDX-теле

## Аналитика и коммуникации

Скопируйте `.env.example` в `.env` и заполните нужные значения:

```bash
NEXT_PUBLIC_SITE_URL=https://www.arnebia.ru
NEXT_PUBLIC_YANDEX_METRIKA_ID=
NEXT_PUBLIC_GA_ID=
```

Telegram, WhatsApp, email, телефон и адрес находятся в `content/site.ts`.

## Масштабирование

Проект готов к расширению:

- новые бренды и категории добавляются в `content/taxonomy.ts`;
- новые товары и новости добавляются без изменения страниц;
- мультиязычность можно добавить через сегменты маршрутов `app/[locale]/`;
- для настоящей CMS можно заменить `lib/content.ts`, оставив компоненты и страницы.
