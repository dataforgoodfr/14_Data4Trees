import pandas as pd
import numpy as np

from . import constants

def mrp_mean(series, weights, population_size):
    """
    Computes means using weights.
    Returns the means and the standard errors.
    Acts only on lines where both values and weights are defined and contain proper values.
    """
    mask = series.notna() & weights.notna()
    x = series[mask].astype(float)
    w = weights[mask].astype(float)

    sample_size = len(x)

    if sample_size == 0:
        return {"value": None, "error": None}

    # Computing the weighted mean
    mean = np.average(x, weights=w) # equivalent to sum(x * weights) / sum(weights)
    
    # Computing the standard error
    variance_simple = np.average((x - mean) ** 2)
    variance_weighted = np.average((x - mean) ** 2, weights=w)
    part1 = 1/sample_size * (1 - sample_size/population_size) * variance_weighted
    part2 = 1/sample_size**2 * (population_size - sample_size) / (population_size - 1) * (variance_simple - variance_weighted)
    std_error = np.sqrt(part1+part2)

    return {"value": mean, "error": std_error}

def mrp_mean_dict(series, weights):
    """
    Computes means using weights on a serie of dictionnaries.
    Returns the means and the standard errors.
    Acts only on lines where both values and weights are defined and contain proper values.
    """
    df = pd.concat([series,weights], axis=1)
    df.rename(columns={df.columns[0]: "dicts", df.columns[1]: "weights" }, inplace = True)
    df = df.dropna(axis='index', how='any')

    if len(df.index) == 0:
        return {"value": None, "error": None}

    # Applying weights on each dict
    df['weighted_dicts'] = df.apply(lambda row: {k: v*row['weights'] for k, v in row['dicts'].items()}, axis=1)

    # Concatenating dicts by sum
    list_dicts = df['weighted_dicts'].to_list()
    dict_result = {k: sum(d[k] for d in list_dicts if k in d) for k in set(k for d in list_dicts for k in d)}
    
    # Dividing by the sum of weights
    sum_weights = df['weights'].sum()
    dict_result = {k: v/sum_weights for k, v in dict_result.items()}

    # TODO
    std_error = np.nan

    return {"value": dict_result, "error": std_error}

def compute_aggregation(data):

    df_source = pd.DataFrame([feat.get("properties", {}) for feat in data["features"]])
    df_source['for'] = df_source['for'].astype(int)

    # WORK AROUND split ero_rainfall_and_wind and ero_couv_slope_and_cover
    df_source[['ero_rainfall','ero_wind']] = df_source['ero_rainfall_and_wind'].str.split('-', expand=True).astype(int)
    df_source[['ero_couv_slope','ero_couv_cover']] = df_source['ero_couv_slope_and_cover'].str.split('-', expand=True).astype(int)
    to_drop = ['ero_rainfall_and_wind','ero_couv_slope_and_cover']
    df_source.drop(columns=to_drop, inplace=True)

    # INVENTAIRE meta data

    # Loading data for clustering (year, beneficiary group/control group, aggregation methods)
    df_inventaire_meta = pd.read_csv(
        './catalog/inventaire/inventaire_external.csv',
        usecols=['index','loc','num','typ','coh','echant']).set_index('index')
    df_inventaire_meta.rename(columns={"typ": "sample", "loc":"for", "num":"cod", "coh": "year", "echant":"method"}, inplace=True) # BEWARE loc:for and num:cod will be changed in the next data update

    # Control group vs Beneficiary group
    df_inventaire_meta.replace({'Restauration':'beneficiary','Préservation':'beneficiary','Témoin':'control'}, inplace=True)

    # Get clusters to build the result structure
    df_clusters = df_inventaire_meta[['year','sample','method']].drop_duplicates(keep='first').reset_index(drop=True)
    df_clusters.sort_values(by=['year','sample'], axis=0)

    df = df_source.copy()

    # Loading weights from external data
    # Weights are Mh (for now) /!\ Years are not taken into account
    df_weights = pd.read_csv(
        './catalog/inventaire/meteo.csv',
        usecols=['strat','Mh'],
        index_col='strat')
    weights_map = df_weights['Mh'].to_dict()
    population_size = df_weights['Mh'].sum()

    dict_fields = constants.dict_fields_inventaire

    # Grouping fields by aggregation function
    list_fields_average_value = [key for key, value in dict_fields.items() if value == 'average-value']
    list_fields_average_dict = [key for key, value in dict_fields.items() if value == 'average-dict']
    list_fields_base = [field for field in df.columns.tolist() if field not in (list_fields_average_value + list_fields_average_dict)]

    # Loop on clusters year-sample and applying the related aggregation function
    dict_result = {}
    for year in df_clusters['year'].unique():
        dict_result[str(year)] = {}
        for sampling in ['beneficiary','control']: # also possible to loop on df_clusters['sample'] instead
        
            # Selecting entries of the current cluster
            idx = df_inventaire_meta[(df_inventaire_meta['year']==year) & (df_inventaire_meta['sample']==sampling)].set_index(['for','cod']).index
            df = df_source.copy().set_index(['for','cod'])
            df = df.loc[idx].reset_index()
            
            # ## INCLUDE HERE a test to select the aggregation function to apply (MRP, etc.)
            # Mapping weights to values to compute MRP mean
            df["weight"] = df["for"].map(weights_map)
            
            # Computing means and errors on fields with unique values
            df_case = df[list_fields_base+list_fields_average_value+['weight']].copy()
            result = {
                field: mrp_mean(df_case[field], df_case["weight"], population_size)
                for field in list_fields_average_value
            }
            
            # Computing means and errors on fields with values within dictionnaries
            df_case = df[list_fields_base+list_fields_average_dict+['weight']].copy()
            result = result | {
                field: mrp_mean_dict(df_case[field], df_case["weight"])
                for field in list_fields_average_dict
            }
            
            dict_result[str(year)][sampling] = result

    print(dict_result)
    return dict_result