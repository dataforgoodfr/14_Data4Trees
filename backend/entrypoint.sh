#!/usr/bin/env bash

AWS_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY aws s3 sync s3://coordonnees-upload ./data --delete --endpoint-url https://s3.fr-par.scw.cloud --region fr-par

coordo load kobotoolbox data/20250213_Inventaire_ID_QuestionnaireK.xlsx data/20251017_Inventaire_ID_Donnees.xlsx --package catalog/inventaire
coordo load file data/dens_bois.csv --package catalog/inventaire
coordo add-foreignkey ind.ess_arb dens_bois.ess_arb --package catalog/inventaire
coordo load kobotoolbox data/20240808_EnqueteMenage_CDF_QuestionnaireK.xlsx data/20241007_EnqueteMenage_CDF_Donnees.csv --package catalog/enquete

python manage.py migrate
python manage.py createsuperuser --noinput
python manage.py collectstatic
python manage.py runserver 0.0.0.0:8000
