export const TechCategory = {
  TECHNIQUES: 'Techniques',
  TOOLS: 'Tools',
  FRAMEWORKS: 'Frameworks',
  PLATFORM: 'Platforms',
} as const;

export type TechCategory = typeof TechCategory[keyof typeof TechCategory];
