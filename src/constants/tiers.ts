export const defaultTiers = [0, 1, 2, 3, 4, 5, null];
export const maxTier = Math.max(...defaultTiers.filter(t => t != null));