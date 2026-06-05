catalog:
	# All 4 Trees - Inventaire forestier

	coordo load kobotoolbox --action add data/all4trees/inventaire_for/20260519_InventaireForestier_QuestionnaireK.xlsx data/all4trees/inventaire_for/20260422_InventaireForestier_DonneesK.xlsx --package catalog/inventaire_for
	coordo load file --action add data/all4trees/inventaire_for/samp.csv --package catalog/inventaire_for
	coordo add-foreignkey inv_for.proj samp.proj --package catalog/inventaire_for

	coordo load file --action add data/all4trees/inventaire_for/pop.csv --package catalog/inventaire_for
	coordo add-foreignkey inv_for.typ pop.typ --package catalog/inventaire_for

	coordo load file --action add data/all4trees/inventaire_for/weath.csv --package catalog/inventaire_for
	coordo add-foreignkey inv_for.loc2 weath.loc2 --package catalog/inventaire_for

	coordo load file --action add data/all4trees/inventaire_for/soil.csv --package catalog/inventaire_for
	coordo add-foreignkey inv_for._id soil._index --package catalog/inventaire_for

	coordo load file --action add data/all4trees/inventaire_for/score.csv --package catalog/inventaire_for

	coordo load file --action add data/all4trees/inventaire_for/sp.csv --package catalog/inventaire_for
	coordo add-foreignkey adu.adu_sp sp.adu_sp --package catalog/inventaire_for

	coordo load file --action add data/all4trees/inventaire_for/dw.csv --package catalog/inventaire_for
	coordo add-foreignkey adu.decay dw.decay --package catalog/inventaire_for

	coordo load file --action add data/all4trees/inventaire_for/mf_tax1.csv --package catalog/inventaire_for
	coordo add-foreignkey tsbf_001.tsbf_tax1 mf_tax1.tax1 --package catalog/inventaire_for
	coordo add-foreignkey barba_001.barbA_tax1 mf_tax1.tax1 --package catalog/inventaire_for
	coordo add-foreignkey barbb_001.barbB_tax1 mf_tax1.tax1 --package catalog/inventaire_for
	coordo add-foreignkey barbc_001.barbC_tax1 mf_tax1.tax1 --package catalog/inventaire_for
	coordo add-foreignkey barbd_001.barbD_tax1 mf_tax1.tax1 --package catalog/inventaire_for

	coordo load file --action add data/all4trees/inventaire_for/mf_tax2.csv --package catalog/inventaire_for
	coordo add-foreignkey tsbf_001.tsbf_tax2 mf_tax2.tax2 --package catalog/inventaire_for
	coordo add-foreignkey barba_001.barbA_tax2 mf_tax2.tax2 --package catalog/inventaire_for
	coordo add-foreignkey barbb_001.barbB_tax2 mf_tax2.tax2 --package catalog/inventaire_for
	coordo add-foreignkey barbc_001.barbC_tax2 mf_tax2.tax2 --package catalog/inventaire_for
	coordo add-foreignkey barbd_001.barbD_tax2 mf_tax2.tax2 --package catalog/inventaire_for

	coordo load file --action add data/all4trees/inventaire_for/mf_tax3.csv --package catalog/inventaire_for
	coordo add-foreignkey tsbf_001.tsbf_tax3 mf_tax3.tax3 --package catalog/inventaire_for
	coordo add-foreignkey barba_001.barbA_tax3 mf_tax3.tax3 --package catalog/inventaire_for
	coordo add-foreignkey barbb_001.barbB_tax3 mf_tax3.tax3 --package catalog/inventaire_for
	coordo add-foreignkey barbc_001.barbC_tax3 mf_tax3.tax3 --package catalog/inventaire_for
	coordo add-foreignkey barbd_001.barbD_tax3 mf_tax3.tax3 --package catalog/inventaire_for

	coordo load file --action add data/all4trees/inventaire_for/choic.csv --package catalog/inventaire_for

	# All 4 Trees - Inventaire Biologique
	coordo load kobotoolbox --action add data/all4trees/inventaire_bio/20260519_InventaireBiologique_QuestionnaireK.xlsx data/all4trees/inventaire_bio/20260422_InventaireBiologique_DonneesK.xlsx --package catalog/inventaire_bio

	# All 4 Trees - Enquête ménage
	coordo load kobotoolbox --action add data/all4trees/enquete/20260519_EnqueteMenage_QuestionnaireK.xlsx data/all4trees/enquete/20260422_EnqueteMenage_DonneesK.csv --package catalog/enquete
	coordo load file --action add data/all4trees/enquete/samp.csv --package catalog/enquete
	coordo add-foreignkey enquete_menage.proj samp.proj --package catalog/enquete
	coordo load file --action add data/all4trees/enquete/pop.csv --package catalog/enquete
	coordo add-foreignkey enquete_menage.typ pop.typ --package catalog/enquete
	coordo load file --action add data/all4trees/enquete/gps.csv --package catalog/enquete
	coordo add-foreignkey enquete_menage.loc2 gps.loc2 --package catalog/enquete
	coordo load file --action add data/all4trees/enquete/fw.csv --package catalog/enquete
	coordo add-foreignkey enquete_menage.fw_cod fw.fw_cod --package catalog/enquete
	coordo load file --action add data/all4trees/enquete/coal.csv --package catalog/enquete
	coordo add-foreignkey enquete_menage.coal_unit coal.coal_unit --package catalog/enquete
	coordo load file --action add data/all4trees/enquete/choic.csv --package catalog/enquete

	# Seed - Survey
# 	coordo load file --action add data/seed/survey.zip --package catalog/seed
# 	coordo load file --action add data/seed/suivi_sites_reboises.zip --package catalog/seed
# 	coordo load file --action add data/seed/ident_sites.zip --package catalog/seed
# 	coordo load file --action add data/seed/reboisement_id.zip --package catalog/seed
# 	coordo load file --action add data/seed/sensib_communautaire.zip --package catalog/seed

test:
	python manage.py test