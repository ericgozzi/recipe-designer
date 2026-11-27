import { Vegan, Leaf, WheatOff, MilkOff, Flame, Beef, Ham, Drumstick, Fish, Shell, Nut, Egg } from 'lucide-vue-next';

// Recipe symbols. `tone` sets the LED colour: green = suitable for a diet,
// orange = spicy, saffron = contains.
export const SYMBOLS = [
  { key: 'vegan', icon: Vegan, tone: 'green' },
  { key: 'vegetarian', icon: Leaf, tone: 'green' },
  { key: 'glutenFree', icon: WheatOff, tone: 'green' },
  { key: 'lactoseFree', icon: MilkOff, tone: 'green' },
  { key: 'spicy', icon: Flame, tone: 'orange' },
  { key: 'meat', icon: Beef, tone: 'saffron' },
  { key: 'pork', icon: Ham, tone: 'saffron' },
  { key: 'poultry', icon: Drumstick, tone: 'saffron' },
  { key: 'fish', icon: Fish, tone: 'saffron' },
  { key: 'shellfish', icon: Shell, tone: 'saffron' },
  { key: 'nuts', icon: Nut, tone: 'saffron' },
  { key: 'eggs', icon: Egg, tone: 'saffron' },
];

export const SYMBOL_KEYS = SYMBOLS.map((s) => s.key);

// Defaults for the example recipe.
export const PRESET_SYMBOLS = {
  carbonara: ['pork', 'eggs'],
};
