import pandas as pd
import numpy as np

from . import constants

def mrp_mean(df, weights_map):
    """
    Computes cluster means, then weighted means of cluster means.
    Returns the means and the standard errors.
    Acts only on lines where data is defined.
    """

    df.rename(columns={df.columns[0]: "data", df.columns[1]: "stratum" }, inplace = True)
    df = df.dropna(axis='index', how='any')

    if len(df.index) == 0:
        return {"value": None, "error": None}

    # Computing aggregates by stratum
    df_stratums = df.groupby(by='stratum').agg(
        count=('data','count'),
        mean=('data','mean'),
        variance=('data','var'),)
    df_stratums["weight"] = df_stratums.index.map(weights_map)

    # Sample size and population size (for stratums with data only)
    sample_size = df_stratums["count"].sum()
    population_size = df_stratums["weight"].sum()
    
    # Computing the weighted mean
    mean_weighted = np.average(df_stratums["mean"], weights=df_stratums["weight"])
    
    # Computing the simple variance and the weighted variance
    variance_simple = df_stratums["variance"].sum()
    variance_weighted = np.average(df_stratums["variance"], weights=df_stratums["weight"])

    # Computing the standard error
    part1 = 1/sample_size * (1 - sample_size/population_size) * variance_weighted
    part2 = 1/sample_size**2 * (population_size - sample_size) / (population_size - 1) * (variance_simple - variance_weighted)
    std_error = np.sqrt(part1+part2)

    return {"value": mean_weighted, "error": std_error}

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

    # WORK AROUND change column name, waiting for style.json update
    df_source = df_source.rename(columns={"for": "loc2"})

    # Data Type
    df_source['loc2'] = df_source['loc2'].astype(int)

    # WORK AROUND split soil_eros_rainfall_and_wind and typage soil_eros_slope
    df_source[['soil_eros_rainfall','soil_eros_wind']] = df_source['soil_eros_rainfall_and_wind'].str.split('-', expand=True).astype(int)
    to_drop = ['soil_eros_rainfall_and_wind']
    df_source.drop(columns=to_drop, inplace=True)

    # INVENTAIRE meta data

    # Loading projects
    df_for_samp = pd.read_parquet(
        './catalog/inventaire_for/for_samp.parquet',
        columns=['proj','samp','group1','group2','group3','_index'],
    ).rename(columns={"_index": "index"}).set_index('index')
    df_for_samp['proj'] = df_for_samp['proj'].str.strip() # because project names may contain unwanted " "

    # Loading stratums details
    df_for_pop = pd.read_parquet(
        './catalog/inventaire_for/for_pop.parquet',
    ).rename(columns={"_index": "index"}).set_index('index')

    # Loading data for clustering (year, beneficiary group/control group)
    df_inv_for = pd.read_parquet(
        './catalog/inventaire_for/inv_for.parquet',
        columns=['_id','loc1','loc2','ecos','cod','typ','coh','year']
    ).rename(columns={"_id": "index"}).set_index('index')
    df_inv_for = df_inv_for.astype('Int64')

    # Control group vs Beneficiary group
    #df_inv_for['typ'] = df_inv_for['typ'].replace({'1':'beneficiary','2':'beneficiary','0':'control'})
    #df_inv_for.rename(columns={"typ": "sample"}, inplace=True)

    # Get clusters to build the result structure
    df_clusters = df_inv_for[['year','typ']].drop_duplicates(keep='first').reset_index(drop=True)
    df_clusters.sort_values(by=['year','typ'], axis=0)

    df = df_source.copy()

    # MAIN Loop

    dict_fields = constants.dict_fields_inventaire

    # Grouping fields by aggregation function
    list_fields_average_value = [key for key, value in dict_fields.items() if value == 'average-value']
    list_fields_average_dict = [key for key, value in dict_fields.items() if value == 'average-dict']
    list_fields_base = [field for field in df.columns.tolist() if field not in (list_fields_average_value + list_fields_average_dict)]

    # Loop on clusters year-sample and applying the related aggregation function
    dict_result = {}
    for project in df_for_samp['proj'].unique():
        dict_result[project] = {}
        for year in df_clusters['year'].unique():
            dict_result[project][str(year)] = {}
            for sampling in df_clusters['typ'].unique():
            
                # Selecting corresponding weights
                to_select = df_for_pop[
                    (df_for_pop['proj']=='A Kob Ale') &
                    (df_for_pop['year']==year) &
                    (df_for_pop['typ']==sampling)
                    ].index
                df_weights = df_for_pop.loc[to_select].set_index('loc2')
                weights_map = df_weights['area'].to_dict()
                
                # Selecting entries of the current cluster (with for+cod as unique id)
                idx = df_inv_for[(df_inv_for['year']==year) & (df_inv_for['typ']==sampling)].set_index(['loc2','cod']).index
                df = df_source.copy().set_index(['loc2','cod'])
                df = df.loc[idx].reset_index()
                
                # ## INCLUDE HERE a test to select the aggregation function to apply (MRP, etc.)
                # Mapping weights to values to compute MRP mean
                df["weight"] = df["loc2"].map(weights_map)
                
                # Computing means and errors on fields with unique values
                df_case = df[list_fields_base+list_fields_average_value+['weight']].copy()
                result = {
                    field: mrp_mean(df_case[[field, "loc2"]], weights_map)
                    for field in list_fields_average_value
                }
                
                # Computing means and errors on fields with values within dictionnaries
                df_case = df[list_fields_base+list_fields_average_dict+['weight']].copy()
                result = result | {
                    field: mrp_mean_dict(df_case[field], df_case["weight"])
                    for field in list_fields_average_dict
                }
                
                dict_result[project][str(year)][sampling] = result

    print(dict_result)
    return dict_result