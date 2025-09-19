export const TechClassification = {
  ASSESS: 'Assess',
  TRIAL: 'Trial',
  ADOPT: 'Adopt',
  HOLD: 'Hold',
} as const;

export type TechClassification = typeof TechClassification[keyof typeof TechClassification];
