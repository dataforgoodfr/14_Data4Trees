import type { SocialData } from "@features/indicators/social/types";
import type { EconomicData } from "@features/indicators/economy/types";

export type SocioEcoData = {
  admi2: string;
  } & SocialData &
    EconomicData;
