import type { Ionicons } from '@expo/vector-icons';

export type CategoryId =
  | 'sains'
  | 'sejarah'
  | 'koding'
  | 'finansial'
  | 'bahasa'
  | 'seni'
  | 'kesehatan'
  | 'bisnis';

export type Category = {
  id: CategoryId;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

export const CATEGORIES: readonly Category[] = [
  { id: 'sains', label: 'Sains', icon: 'flask' },
  { id: 'sejarah', label: 'Sejarah', icon: 'hourglass' },
  { id: 'koding', label: 'Koding', icon: 'code-slash' },
  { id: 'finansial', label: 'Finansial', icon: 'cash' },
  { id: 'bahasa', label: 'Bahasa', icon: 'language' },
  { id: 'seni', label: 'Seni', icon: 'color-palette' },
  { id: 'kesehatan', label: 'Kesehatan', icon: 'fitness' },
  { id: 'bisnis', label: 'Bisnis', icon: 'briefcase' },
];

export function findCategory(id: string | undefined): Category | undefined {
  if (!id) return undefined;
  return CATEGORIES.find((c) => c.id === id);
}

export function otherCategories(
  excludeId: string | undefined,
  count = 3,
): Category[] {
  return CATEGORIES.filter((c) => c.id !== excludeId).slice(0, count);
}
