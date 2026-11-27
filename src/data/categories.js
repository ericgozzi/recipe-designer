import {
  Sandwich,
  Soup,
  Salad,
  Wheat,
  UtensilsCrossed,
  Sprout,
  Droplets,
  CookingPot,
  Croissant,
  IceCreamCone,
  CakeSlice,
  Coffee,
  Wine,
} from 'lucide-vue-next';

// Recipe categories, in menu order. Names come from t('categories')[key].
export const CATEGORIES = [
  { key: 'starters', icon: Sandwich },
  { key: 'soups', icon: Soup },
  { key: 'salads', icon: Salad },
  { key: 'pastaRisotto', icon: Wheat },
  { key: 'mains', icon: UtensilsCrossed },
  { key: 'sides', icon: Sprout },
  { key: 'sauces', icon: Droplets },
  { key: 'stocks', icon: CookingPot },
  { key: 'breads', icon: Croissant },
  { key: 'desserts', icon: IceCreamCone },
  { key: 'cakes', icon: CakeSlice },
  { key: 'breakfast', icon: Coffee },
  { key: 'drinks', icon: Wine },
];

export const CATEGORY_KEYS = CATEGORIES.map((c) => c.key);
export const categoryByKey = (key) => CATEGORIES.find((c) => c.key === key) || null;

// Categories of the built-in presets.
export const PRESET_CATEGORY = {
  carbonara: 'pastaRisotto',
  cookies: 'desserts',
  tiramisu: 'desserts',
};
