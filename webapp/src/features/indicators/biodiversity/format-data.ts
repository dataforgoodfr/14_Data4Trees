import { i18nInstance } from "@shared/i18n"

/**
 * @todo Inject raw data from JSON
 * Return data in a flatten way for UI rendering
 */
export function formatBiodiversityData() {
  return {
    title: "Point #se-4",
    date: Intl.DateTimeFormat(i18nInstance.language, { "dateStyle": "short" }).format(new Date()),
    biomass: {
      volume: "5 L",
      density: "1765"
    },
    treeDiversity: {
      specificWealth: "Blablabla",
      shannon: 1.1,
    },
    forestPotentialLevel: {
      benef: {
        density: 70,
        ratioDeathmassBiomass: 85,
        diversity: 77,
        spatialDistribution: 43,
        diameterDistribution: 22,
        verticalDistribution: 67,
        masterHeight: 78,
        microhabitat: 2
      },
      temoin: {
        density: 80,
        ratioDeathmassBiomass: 45,
        diversity: 47,
        spatialDistribution: 39,
        diameterDistribution: 32,
        verticalDistribution: 67,
        masterHeight: 98,
        microhabitat: 22
      }
    }
  }
}

export type FormattedData = ReturnType<typeof formatBiodiversityData>;