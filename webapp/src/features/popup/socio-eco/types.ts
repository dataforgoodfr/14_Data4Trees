import type { EconomicData } from "@features/indicators/economy/types";
import type { SocialData } from "@features/indicators/social/types";

export type SocioEcoData = {
  project: string;
  year: number;
  cohort: number;
  type: number;
  loc1: string;
  loc2: string;
  population: number;
  household_nb: number;
} & SocialData &
  EconomicData;
