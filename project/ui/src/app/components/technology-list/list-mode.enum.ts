export const ListMode = {
  MODIFIABLE: 'modifiable',
  PUBLISHED_READONLY: 'published_readonly',
} as const;

export type ListMode = typeof ListMode[keyof typeof ListMode];
