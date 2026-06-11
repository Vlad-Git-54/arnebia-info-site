import type { Brand, Category } from "@/types/content";

export const categories: Category[] = [
  {
    slug: "face-care",
    title: "Уход за лицом",
    description: "Кремы, гели, гидролаты и мягкое очищение для ежедневного ухода.",
  },
  {
    slug: "body-care",
    title: "Уход за телом",
    description: "Натуральные средства для душа, питания, восстановления и комфорта кожи.",
  },
  {
    slug: "hair-care",
    title: "Уход за волосами",
    description: "Шампуни, бальзамы и уходовые формулы для разных типов волос.",
  },
  {
    slug: "oral-care",
    title: "Уход за полостью рта",
    description: "Зубные пасты и ополаскиватели без агрессивных компонентов.",
  },
  {
    slug: "supplements",
    title: "БАДы",
    description: "Нутрицевтические комплексы, спирулина, пробиотики и тоники.",
  },
  {
    slug: "vitamins",
    title: "Витамины",
    description: "Витаминные комплексы Арнебия для поддержки здоровья и красоты.",
  },
  {
    slug: "essential-oils",
    title: "Эфирные масла",
    description: "Ароматерапия, органические эфирные масла, смеси и гидролаты.",
  },
  {
    slug: "decorative-cosmetics",
    title: "Декоративная косметика",
    description: "Минеральная и натуральная декоративная косметика, аксессуары.",
  },
  {
    slug: "hair-color",
    title: "Краски для волос",
    description: "Деликатное окрашивание и уход за волосами после окрашивания.",
  },
  {
    slug: "children",
    title: "Для детей",
    description: "Бережный уход и профилактические продукты для семьи и детей.",
  },
  {
    slug: "vegan",
    title: "Для веганов",
    description: "Продукты без компонентов животного происхождения.",
  },
  {
    slug: "accessories",
    title: "Аксессуары",
    description: "Бьюти-аксессуары, щетки, массажные и уходовые принадлежности.",
  },
];

export const brands: Brand[] = [
  {
    slug: "villaphyta",
    title: "Виллафита",
    latin: "Villaphyta",
    short: "Эфирные масла, гидролаты, БАДы и современная натуральная косметика.",
    description:
      "Собственный бренд Арнебии с фокусом на природные активы, ароматерапию и ежедневный уход для всей семьи.",
    origin: "Франция / Россия",
    focus: ["Гидролаты", "Эфирные масла", "БАДы", "Уход за волосами"],
    image: "https://www.arnebia.ru/img/shop/4306b.jpg",
    accent: "#7f9f57",
    featured: true,
  },
  {
    slug: "arnebia-selection",
    title: "Арнебия Селекшн",
    latin: "Arnebia Selection",
    short: "Доступная инновационная дерматокосметика из России.",
    description:
      "Линия ухода с мочевиной, гиалуроновой кислотой и современными комплексами для сухой, чувствительной и требовательной кожи.",
    origin: "Россия",
    focus: ["Дерматокосметика", "Уход за лицом", "Уход за руками", "Уход за стопами"],
    image: "https://www.arnebia.ru/img/shop/4333b.jpg",
    accent: "#8f795d",
    featured: true,
  },
  {
    slug: "atlantomarin",
    title: "Атлантомарин",
    latin: "Atlantomarin",
    short: "Уход за полостью рта со спирулиной и минеральными комплексами.",
    description:
      "Пасты и ополаскиватели для ежедневной профилактики, свежего дыхания и бережной защиты десен.",
    origin: "Россия",
    focus: ["Ополаскиватели", "Зубные пасты", "Минералы", "Спирулина"],
    image: "https://www.arnebia.ru/img/shop/4413b.jpg",
    accent: "#4c8a90",
    featured: true,
  },
  {
    slug: "benecos",
    title: "Бенекос",
    latin: "Benecos",
    short: "Натуральная декоративная косметика и аксессуары.",
    description:
      "Демократичная европейская линия макияжа с натуральной эстетикой и понятными ежедневными продуктами.",
    origin: "Германия",
    focus: ["Макияж", "Аксессуары", "Минеральные текстуры"],
    image: "https://www.arnebia.ru/img/shop/2225b.jpg",
    accent: "#b26f7e",
  },
  {
    slug: "primavera",
    title: "Примавера",
    latin: "Primavera Life",
    short: "Натуральная аромакосметика и эфирные масла.",
    description:
      "Ароматерапевтическая экспертиза, органическое сырье и формулы для эмоционального и телесного баланса.",
    origin: "Германия",
    focus: ["Аромакосметика", "Эфирные масла", "SPA"],
    image: "https://www.arnebia.ru/img/shop/2359b.jpg",
    accent: "#9c8d49",
  },
  {
    slug: "herbatint",
    title: "Гербатинт",
    latin: "Herbatint",
    short: "Краски и уход за волосами с мягким подходом к окрашиванию.",
    description:
      "Линия для окрашивания и поддерживающего ухода, созданная для клиентов, которым важна деликатность формул.",
    origin: "Италия",
    focus: ["Краски для волос", "Уход после окрашивания"],
    image: "https://www.arnebia.ru/img/shop/3620b.jpg",
    accent: "#6f7c45",
  },
  {
    slug: "sanatur",
    title: "Санатур",
    latin: "Sanatur",
    short: "БАДы со спирулиной и нутрицевтические продукты.",
    description:
      "Немецкая линия нутрицевтиков на основе спирулины и природных компонентов для осознанной поддержки организма.",
    origin: "Германия",
    focus: ["Спирулина", "Нутрицевтики", "БАДы"],
    image: "https://www.arnebia.ru/img/shop/3060b.jpg",
    accent: "#527b52",
  },
  {
    slug: "erboristeria",
    title: "Эрбористериа Маджентина",
    latin: "Erboristeria Magentina",
    short: "Холистическая натуральная косметика из Италии.",
    description:
      "Фитобальзамы, эфирные масла и уходовые продукты, вдохновленные традициями итальянских травников.",
    origin: "Италия",
    focus: ["Фитобальзамы", "Эфирные масла", "Холистический уход"],
    image: "https://www.arnebia.ru/img/shop/3595b.jpg",
    accent: "#768550",
  },
  {
    slug: "florame",
    title: "Флорам",
    latin: "Florame",
    short: "Натуральная косметика и ароматерапия.",
    description:
      "Европейский бренд с фокусом на органические ингредиенты, уходовые текстуры и ароматерапевтические решения.",
    origin: "Франция",
    focus: ["Натуральная косметика", "Ароматерапия"],
    image: "https://www.arnebia.ru/img/shop/3645b.jpg",
    accent: "#6d915f",
  },
  {
    slug: "foersters",
    title: "Фёрстерс",
    latin: "Foerster's",
    short: "Бьюти-аксессуары для ухода и массажа.",
    description:
      "Щетки, массажные аксессуары и практичные инструменты для ежедневных ритуалов ухода.",
    origin: "Германия",
    focus: ["Аксессуары", "Массаж", "Уход за телом"],
    image: "https://www.arnebia.ru/img/shop/1612b.jpg",
    accent: "#a9854c",
  },
];

export function getBrand(slug: string) {
  return brands.find((brand) => brand.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

