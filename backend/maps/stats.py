import pandas as pd
import numpy as np

def weighted_mean_std(series, weights):
    """
    Computes means using weights.
    Returns the means and the standard errors.
    Acts only on lines where both values and weights are defined and contain proper values.
    """
    mask = series.notna() & weights.notna()
    x = series[mask].astype(float)
    w = weights[mask].astype(float)

    if len(x) == 0:
        return {"value": None, "error": None}

    mean = np.average(x, weights=w) # equivalent to sum(x * weights) / sum(weights)
    variance = np.average((x - mean) ** 2, weights=w) # still TODO because the formula expected for MRP is much more complex
    std_error = np.sqrt(variance)

    return {"value": mean, "error": std_error}


def compute_aggregation(data):

    df_source = pd.DataFrame([feat.get("properties", {}) for feat in data["features"]])
    df_source['for'] = df_source['for'].astype(int)


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

    print(df_inventaire_meta)
    print(df_clusters)

    df = df_source.copy()

    # Loading weights from external data
    # Weights are Mh (for now) /!\ Years are not taken into account
    df_weights = pd.read_csv(
        './catalog/inventaire/meteo.csv',
        usecols=['strat','Mh'],
        index_col='strat')
    weights_map = df_weights['Mh'].to_dict()

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
            # Computing means and errors
            fields_to_drop = ["for", "cod", "weight"]
            df_numeric = df.drop(columns=fields_to_drop, errors="ignore").apply(pd.to_numeric, errors="coerce")
            result = {
                col: weighted_mean_std(df_numeric[col], df["weight"])
                for col in df_numeric.columns
            }
            dict_result[str(year)][sampling] = result

    print(dict_result)
    return dict_result