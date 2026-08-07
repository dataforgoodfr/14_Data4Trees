catalog:
	# All 4 Trees - Inventaire forestier

	coordo add kobotoolbox data/all4trees/inventaire_for/20260422_InventaireForestier_DonneesK_test.xlsx --form data/all4trees/inventaire_for/20260519_InventaireForestier_QuestionnaireK.xlsx --package catalog/inventaire_for
	coordo add file data/all4trees/inventaire_for/20260713_InventaireForestier_DonneesExternes_test.xlsx --package catalog/inventaire_for

	coordo add foreignkey adu for_dw decay decay --package catalog/inventaire_for
	coordo add foreignkey inv_for for_samp proj proj --package catalog/inventaire_for
	coordo add foreignkey inv_for for_pop proj proj year year typ typ --package catalog/inventaire_for
	coordo add foreignkey inv_for for_weath proj proj year year loc2 loc2 --package catalog/inventaire_for
	coordo add foreignkey inv_for for_soil proj proj year year loc2 loc2 cod cod --package catalog/inventaire_for
	coordo add foreignkey adu for_sp adu_sp adu_sp --package catalog/inventaire_for

	# All 4 Trees - Inventaire Biologique
	coordo add kobotoolbox data/all4trees/inventaire_bio/20260710_InventaireBiologique_DonneesK.xlsx --form data/all4trees/inventaire_bio/20260709_InventaireBiologique_QuestionnaireK.xlsx --package catalog/inventaire_bio
	coordo add file data/all4trees/inventaire_bio/20260713_InventaireBiologique_DonneesExternes.xlsx --package catalog/inventaire_bio

	coordo add foreignkey inv_bio bio_samp proj proj --package catalog/inventaire_bio
	coordo add foreignkey inv_bio bio_pop proj proj year year --package catalog/inventaire_bio

	# All 4 Trees - Enquête ménage
	coordo add kobotoolbox data/all4trees/enquete/20260709_EnqueteMenage_DonneesK.xlsx --form data/all4trees/enquete/20260519_EnqueteMenage_QuestionnaireK.xlsx --package catalog/enquete
	coordo add file data/all4trees/enquete/20260713_EnqueteMenage_DonneesExternes.xlsx --package catalog/enquete

	coordo add foreignkey enquete_menage hh_samp proj proj --package catalog/enquete
	coordo add foreignkey enquete_menage hh_pop proj proj year year typ typ --package catalog/enquete
	coordo add foreignkey enquete_menage hh_gps proj proj loc2 loc2 --package catalog/enquete
	coordo add foreignkey enquete_menage hh_fw proj proj year year fw_cod fw_cod --package catalog/enquete
	coordo add foreignkey enquete_menage hh_coal proj proj year year loc1 loc1 coal_unit coal_unit --package catalog/enquete

	# Seed - Survey
	coordo add file data/seed/survey.zip --package catalog/seed
	coordo add file data/seed/suivi_sites_reboises.zip --package catalog/seed
	coordo add file data/seed/ident_sites.zip --package catalog/seed
	coordo add file data/seed/reboisement_id.zip --package catalog/seed
	coordo add file data/seed/sensib_communautaire.zip --package catalog/seed


recatalog:
	rm -rf catalog/
	make catalog

test:
	python manage.py test