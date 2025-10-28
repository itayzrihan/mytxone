// Reusable categories list with emojis and metadata
export interface Category {
  name: string;
  emoji: string;
  value: string; // lowercase value for database/API use
}

export const CATEGORIES: Category[] = [
  { name: 'Business', emoji: '💼', value: 'business' },
  { name: 'Technology', emoji: '💻', value: 'technology' },
  { name: 'Health', emoji: '🏥', value: 'health' },
  { name: 'Education', emoji: '📚', value: 'education' },
  { name: 'Entertainment', emoji: '🎬', value: 'entertainment' },
  { name: 'Sports', emoji: '⚽', value: 'sports' },
  { name: 'Travel', emoji: '✈️', value: 'travel' },
  { name: 'Food', emoji: '🍕', value: 'food' },
  { name: 'Music', emoji: '🎵', value: 'music' },
  { name: 'Art', emoji: '🎨', value: 'art' },
  { name: 'Science', emoji: '🔬', value: 'science' },
  { name: 'Finance', emoji: '💰', value: 'finance' },
  { name: 'Fashion', emoji: '👗', value: 'fashion' },
  { name: 'Gaming', emoji: '🎮', value: 'gaming' },
  { name: 'Nature', emoji: '🌿', value: 'nature' },
];

/**
 * Get category display name and emoji
 * @param categoryValue - lowercase category value (e.g., 'business')
 * @returns Category object with name and emoji, or undefined if not found
 */
export function getCategoryByValue(categoryValue: string): Category | undefined {
  return CATEGORIES.find(cat => cat.value === categoryValue.toLowerCase());
}

/**
 * Get category label for display
 * @param categoryValue - lowercase category value
 * @returns formatted label like "💼 Business"
 */
export function getCategoryLabel(categoryValue: string): string {
  const category = getCategoryByValue(categoryValue);
  return category ? `${category.emoji} ${category.name}` : categoryValue;
}

/**
 * Split categories into two rows for display
 * @returns array of two arrays: [firstRow, secondRow]
 */
export function splitCategoriesIntoRows(): [Category[], Category[]] {
  const firstRow = CATEGORIES.slice(0, Math.ceil(CATEGORIES.length / 2));
  const secondRow = CATEGORIES.slice(Math.ceil(CATEGORIES.length / 2));
  return [firstRow, secondRow];
}
