catalog:
	# All 4 Trees - Inventaire forestier
	coordo load kobotoolbox --add data/all4trees/inventaire/20250213_Inventaire_ID_QuestionnaireK.xlsx data/all4trees/inventaire/20251017_Inventaire_ID_Donnees.xlsx --package catalog/inventaire
	coordo load file --add data/all4trees/inventaire/dens_bois.csv --package catalog/inventaire
	coordo add-foreignkey ind.ess_arb dens_bois.ess_arb --package catalog/inventaire
	coordo load file --add data/all4trees/inventaire/inventaire_external.csv --package catalog/inventaire
	coordo add-foreignkey inventaire_id._id inventaire_external.index --package catalog/inventaire
	coordo load file --add data/all4trees/inventaire/dens_bois_mort.csv --package catalog/inventaire
	coordo add-foreignkey ind.decomp dens_bois_mort.decomp --package catalog/inventaire
	coordo load file --add data/all4trees/inventaire/constants.csv --package catalog/inventaire
	coordo load file --add data/all4trees/inventaire/meteo.csv --package catalog/inventaire
	coordo add-foreignkey inventaire_id.for meteo.strat --package catalog/inventaire

	# All 4 Trees - Enquête ménage
	coordo load kobotoolbox --add data/all4trees/enquete/20240808_EnqueteMenage_CDF_QuestionnaireK.xlsx data/all4trees/enquete/20241007_EnqueteMenage_CDF_Donnees.csv --package catalog/enquete
	coordo load file --add data/all4trees/enquete/socio_eco_gps.csv --package catalog/enquete
	coordo add-foreignkey enquete_menage_cdf.admi2 socio_eco_gps.admi2 --package catalog/enquete

	# Seed - Survey
	coordo load file --add data/seed/survey.zip --package catalog/seed