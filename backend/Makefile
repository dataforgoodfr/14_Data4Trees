catalog:
	# All 4 Trees - Inventaire forestier

	coordo add kobotoolbox data/all4trees/inventaire_for/20260422_InventaireForestier_DonneesK.xlsx --form data/all4trees/inventaire_for/20260519_InventaireForestier_QuestionnaireK.xlsx --package catalog/inventaire_for
	coordo add file data/all4trees/inventaire_for/20260713_InventaireForestier_DonneesExternes.xlsx --package catalog/inventaire_for

	coordo add foreignkey adu.decay for_dw.decay --package catalog/inventaire_for
	coordo add foreignkey inv_for.proj for_samp.proj --package catalog/inventaire_for
	coordo add foreignkey inv_for.typ for_pop.typ --package catalog/inventaire_for
	coordo add foreignkey inv_for.loc2 for_weath.loc2 --package catalog/inventaire_for
	coordo add foreignkey inv_for._id for_soil._index --package catalog/inventaire_for
	coordo add foreignkey adu.adu_sp for_sp.adu_sp --package catalog/inventaire_for
	coordo add foreignkey tsbf_001.tsbf_tax1 for_mf_tax1.tax1 --package catalog/inventaire_for
	coordo add foreignkey barba_001.barbA_tax1 for_mf_tax1.tax1 --package catalog/inventaire_for
	coordo add foreignkey barbb_001.barbB_tax1 for_mf_tax1.tax1 --package catalog/inventaire_for
	coordo add foreignkey barbc_001.barbC_tax1 for_mf_tax1.tax1 --package catalog/inventaire_for
	coordo add foreignkey barbd_001.barbD_tax1 for_mf_tax1.tax1 --package catalog/inventaire_for
	coordo add foreignkey tsbf_001.tsbf_tax2 for_mf_tax2.tax2 --package catalog/inventaire_for
	coordo add foreignkey barba_001.barbA_tax2 for_mf_tax2.tax2 --package catalog/inventaire_for
	coordo add foreignkey barbb_001.barbB_tax2 for_mf_tax2.tax2 --package catalog/inventaire_for
	coordo add foreignkey barbc_001.barbC_tax2 for_mf_tax2.tax2 --package catalog/inventaire_for
	coordo add foreignkey barbd_001.barbD_tax2 for_mf_tax2.tax2 --package catalog/inventaire_for
	coordo add foreignkey tsbf_001.tsbf_tax3 for_mf_tax3.tax3 --package catalog/inventaire_for
	coordo add foreignkey barba_001.barbA_tax3 for_mf_tax3.tax3 --package catalog/inventaire_for
	coordo add foreignkey barbb_001.barbB_tax3 for_mf_tax3.tax3 --package catalog/inventaire_for
	coordo add foreignkey barbc_001.barbC_tax3 for_mf_tax3.tax3 --package catalog/inventaire_for
	coordo add foreignkey barbd_001.barbD_tax3 for_mf_tax3.tax3 --package catalog/inventaire_for

	# All 4 Trees - Inventaire Biologique
	coordo add kobotoolbox data/all4trees/inventaire_bio/20260710_InventaireBiologique_DonneesK.xlsx --form data/all4trees/inventaire_bio/20260709_InventaireBiologique_QuestionnaireK.xlsx --package catalog/inventaire_bio
	coordo add file data/all4trees/inventaire_bio/20260713_InventaireBiologique_DonneesExternes.xlsx --package catalog/inventaire_bio

	coordo add foreignkey inv_bio.proj bio_samp.proj --package catalog/inventaire_bio
	coordo add foreignkey inv_bio.year bio_pop.year --package catalog/inventaire_bio

	# All 4 Trees - Enquête ménage
	coordo add kobotoolbox data/all4trees/enquete/20260422_EnqueteMenage_DonneesK.csv --form data/all4trees/enquete/20260519_EnqueteMenage_QuestionnaireK.xlsx --package catalog/enquete
	coordo add file data/all4trees/enquete/20260422_EnqueteMenage_DonneesExternes.xlsx --package catalog/enquete

	coordo add foreignkey enquete_menage.proj enq_samp.proj --package catalog/enquete
	coordo add foreignkey enquete_menage.typ enq_pop.typ --package catalog/enquete
	coordo add foreignkey enquete_menage.loc2 enq_gps.loc2 --package catalog/enquete
	coordo add foreignkey enquete_menage.fw_cod enq_fw.fw_cod --package catalog/enquete
	coordo add foreignkey enquete_menage.coal_unit enq_coal.coal_unit --package catalog/enquete

	# Seed - Survey
	coordo add file data/seed/survey.zip --package catalog/seed
	coordo add file data/seed/suivi_sites_reboises.zip --package catalog/seed
	coordo add file data/seed/ident_sites.zip --package catalog/seed
	coordo add file data/seed/reboisement_id.zip --package catalog/seed
	coordo add file data/seed/sensib_communautaire.zip --package catalog/seed

test:
	python manage.py test