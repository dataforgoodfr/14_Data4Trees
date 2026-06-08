# Configuration of Proportion / Average / Total on value or dict of values
dict_fields_inventaire = {
    # Biodiversity
    'biomass_volume': 'average-value',
    'tree_density': 'average-value',
    'tree_pop': 'average-value',
    'richness': 'average-value',
    'relative_abundance': 'average-dict',

    # Biodiversity - Indirect indicators
    'epf_tree_density': 'average-value',
    'epf_deadWood': 'average-value',
    'epf_tree_diversity': 'average-value',
    'epf_necromass_pied': 'average-value',
    'epf_necromass_sol': 'average-value',
    'epf_spatial_distribution': 'average-value',
    'epf_diameter_distribution': 'average-value',
    'epf_vertical_distribution': 'average-value',
    'epf_dominant_height': 'average-value',
    'epf_microhabitats': 'average-value',

    # Soil
    'soil_structure': 'average-value',
    'soil_composition': 'average-value',

    # Soil erosion
    'ero_rainfall': 'average-value',
    'ero_wind': 'average-value',
    'ero_couv_slope': 'average-value',
    'ero_couv_cover': 'average-value',
    'ero_soil_stability': 'average-value',
    'ero_water_seepage': 'average-value',

    # Soil macrofauna
    'soil_fauna_density': 'average-value',
    'soil_fauna_diversity': 'average-value',
    'soil_fauna_abundance': 'average-dict',
    'soil_fauna_abundance_tax1': 'average-dict',
    'soil_fauna_abundance_tax2': 'average-dict',
    'soil_fauna_abundance_tax3': 'average-dict',

    # Missing density and diversity per taxon

    # Surface macrofauna
    'surface_fauna_density': 'average-value',
    'surface_fauna_diversity': 'average-value',
    'surface_fauna_abundance': 'average-dict',
    'surface_fauna_abundance_tax1': 'average-dict',
    'surface_fauna_abundance_tax2': 'average-dict',
    'surface_fauna_abundance_tax3': 'average-dict',
}