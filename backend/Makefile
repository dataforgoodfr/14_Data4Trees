catalog:
	# All 4 Trees - Inventaire forestier
	coordo load kobotoolbox --action add data/all4trees/inventaire_for_bak/20250213_Inventaire_ID_QuestionnaireK.xlsx data/all4trees/inventaire_for_bak/20251017_Inventaire_ID_Donnees.xlsx --package catalog/inventaire
	coordo load file --action add data/all4trees/inventaire_for_bak/dens_bois.csv --package catalog/inventaire
	coordo add-foreignkey ind.ess_arb dens_bois.ess_arb --package catalog/inventaire
	coordo load file --action add data/all4trees/inventaire_for_bak/inventaire_external.csv --package catalog/inventaire
	coordo add-foreignkey inventaire_id._id inventaire_external.index --package catalog/inventaire
	coordo load file --action add data/all4trees/inventaire_for_bak/dens_bois_mort.csv --package catalog/inventaire
	coordo add-foreignkey ind.decomp dens_bois_mort.decomp --package catalog/inventaire
	coordo load file --action add data/all4trees/inventaire_for_bak/constants.csv --package catalog/inventaire
	coordo load file --action add data/all4trees/inventaire_for_bak/meteo.csv --package catalog/inventaire
	coordo add-foreignkey inventaire_id.for meteo.strat --package catalog/inventaire

  	# All 4 Trees - Enquête ménage
	coordo load kobotoolbox --action add data/all4trees/enquete_bak/20240808_EnqueteMenage_CDF_QuestionnaireK.xlsx data/all4trees/enquete_bak/20241007_EnqueteMenage_CDF_Donnees.csv --package catalog/enquete
	coordo load file --action add data/all4trees/enquete_bak/socio_eco_gps.csv --package catalog/enquete
	coordo add-foreignkey enquete_menage_cdf.admi2 socio_eco_gps.admi2 --package catalog/enquete
	coordo load file --action add data/all4trees/enquete_bak/charbon.csv --package catalog/enquete
	coordo add-foreignkey enquete_menage_cdf.char_un charbon.char_un --package catalog/enquete
	coordo load file --action add data/all4trees/enquete_bak/constants.csv --package catalog/enquete
	coordo load file --action add data/all4trees/enquete_bak/menage_ext.csv --package catalog/enquete
	coordo add-foreignkey enquete_menage_cdf._id menage_ext.index --package catalog/enquete
	coordo load file --action add data/all4trees/enquete_bak/volume_bois.csv --package catalog/enquete
	coordo add-foreignkey enquete_menage_cdf.code_bois volume_bois.cod_bois --package catalog/enquete

	#  Seed - Survey
	coordo load file --action add data/seed/survey.zip --package catalog/seed
	coordo load file --action add data/seed/suivi_sites_reboises.zip --package catalog/seed
	coordo load file --action add data/seed/ident_sites.zip --package catalog/seed
	coordo load file --action add data/seed/reboisement_id.zip --package catalog/seed
	coordo load file --action add data/seed/sensib_communautaire.zip --package catalog/seed

test:
	python manage.py test