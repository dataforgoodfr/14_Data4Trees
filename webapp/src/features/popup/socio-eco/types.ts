import type { EconomicData } from "@features/indicators/economy/types";
import type { SocialData } from "@features/indicators/social/types";

export type SocioEcoData = {
  household_nb: number;
  population: number;
  admi2: string;
} & SocialData &
  EconomicData;
