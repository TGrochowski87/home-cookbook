import { CategoryGetDto, RecipeDetailsGetDto, RecipeGetDto, TagGetDto } from "api/GET/DTOs";

const categories: ReadonlyArray<CategoryGetDto> = [
  {
    id: 1,
    name: "main",
    color: "#E28930",
    symbol: String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cooking-pot"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/></svg>`,
  },
  {
    id: 2,
    name: "dessert",
    color: "#D785DB",
    symbol: String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ice-cream-bowl"><path d="M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6m-4 4h8m-4-3v3M5.14 11a3.5 3.5 0 1 1 6.71 0"/><path d="M12.14 11a3.5 3.5 0 1 1 6.71 0"/><path d="M15.5 6.5a3.5 3.5 0 1 0-7 0"/></svg>`,
  },
  {
    id: 3,
    name: "breakfast/supper",
    color: "#55B5C6",
    symbol: String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sandwich"><path d="m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777"/><path d="M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25"/><path d="M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9"/><path d="m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2"/><rect width="20" height="4" x="2" y="11" rx="1"/></svg>`,
  },
  {
    id: 4,
    name: "soup",
    color: "#DAB436",
    symbol: String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-soup"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 21h10"/><path d="M19.5 12 22 6"/><path d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62"/><path d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62"/><path d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62"/></svg>`,
  },
  {
    id: 5,
    name: "sauce",
    color: "#CB4F39",
    symbol: String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dessert"><circle cx="12" cy="4" r="2"/><path d="M10.2 3.2C5.5 4 2 8.1 2 13a2 2 0 0 0 4 0v-1a2 2 0 0 1 4 0v4a2 2 0 0 0 4 0v-4a2 2 0 0 1 4 0v1a2 2 0 0 0 4 0c0-4.9-3.5-9-8.2-9.8"/><path d="M3.2 14.8a9 9 0 0 0 17.6 0"/></svg>`,
  },
  {
    id: 6,
    name: "alcohol",
    color: "#5D69E4",
    symbol: String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wine"><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>`,
  },
  {
    id: 7,
    name: "other",
    color: "#9F9F9F",
    symbol: String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-croissant"><path d="m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z"/><path d="m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83"/><path d="M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4"/><path d="m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2"/><path d="M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5"/></svg>`,
  },
];

const tags: ReadonlyArray<TagGetDto> = [
  { id: 1, name: "vegan" },
  { id: 2, name: "vegetarian" },
  { id: 3, name: "sweet" },
  { id: 4, name: "spicy" },
  { id: 5, name: "sour" },
  { id: 6, name: "chicken" },
  { id: 7, name: "beef" },
  { id: 8, name: "pork" },
  { id: 9, name: "light" },
  { id: 10, name: "heavy" },
  { id: 11, name: "fast" },
  { id: 12, name: "healthy" },
  { id: 13, name: "low-sugar" },
  { id: 14, name: "mexican" },
  { id: 15, name: "italian" },
  { id: 16, name: "polish" },
  { id: 17, name: "drink" },
  { id: 18, name: "shots" },
];

const recipes: ReadonlyArray<RecipeDetailsGetDto> = [
  {
    id: 1,
    name: "Beef burritos",
    category: categories[0],
    tags: [tags[4], tags[7], tags[14]],
    imageSrc: "db/images/1-beef-burrito.jpg",
    ingredients: [{ id: 1, name: "", amount: { value: "", unit: "" }, checked: false }],
    description: "",
    creationDate: "03-01-2025",
    updateDate: "04-01-2025",
  },
  {
    id: 2,
    name: "Carbonara",
    category: categories[0],
    tags: [tags[8], tags[11], tags[15]],
    imageSrc: "db/images/2-carbonara.jpg",
    ingredients: [{ id: 1, name: "", amount: { value: "", unit: "" }, checked: false }],
    description: "",
    creationDate: "03-01-2025",
    updateDate: "04-01-2025",
  },
  {
    id: 3,
    name: "Margarita",
    category: categories[6],
    tags: [tags[5], tags[17]],
    imageSrc: "db/images/3-margarita.jpg",
    ingredients: [{ id: 1, name: "", amount: { value: "", unit: "" }, checked: false }],
    description: "",
    creationDate: "03-01-2025",
    updateDate: "04-01-2025",
  },
  {
    id: 4,
    name: "Oatmeal",
    category: categories[3],
    tags: [tags[4], tags[7], tags[11], tags[14]],
    imageSrc: "db/images/1-beef-burrito.jpg",
    ingredients: [{ id: 1, name: "", amount: { value: "", unit: "" }, checked: false }],
    description: "",
    creationDate: "03-01-2025",
    updateDate: "04-01-2025",
  },
  {
    id: 5,
    name: "Cheesecake",
    category: categories[2],
    tags: [],
    imageSrc: "db/images/1-beef-burrito.jpg",
    ingredients: [{ id: 1, name: "", amount: { value: "", unit: "" }, checked: false }],
    description: "",
    creationDate: "03-01-2025",
    updateDate: "04-01-2025",
  },
];

const dbData = { categories, tags };
export default dbData;
