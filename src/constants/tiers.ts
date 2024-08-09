import { Enums } from "../database.types";

export const defaultTiers = [0, 1, 2, 3, 4, 5, null];
export const maxTier = Math.max(...defaultTiers.filter(t => t != null));
export const TIERLIST_VALUES: Enums<"Tierlist">[] = ['CHILL', 'META'];