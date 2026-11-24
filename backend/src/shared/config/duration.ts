const MILLISECONDS_PER_UNIT = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
} as const;

export const DURATION_PATTERN = /^(\d+)([smhd])$/;

export const durationToMs = (value: string) => {
  const match = DURATION_PATTERN.exec(value);
  if (!match) throw new Error(`invalid duration: ${value}`);
  return Number(match[1]) * MILLISECONDS_PER_UNIT[match[2] as keyof typeof MILLISECONDS_PER_UNIT];
};
