# Configuration of Proportion / Average / Total on value or dict of values
dict_fields_inventaire = {
    # Biodiversity
    'biomass_volume': 'average-value',
    'tree_density': 'average-value',
    'tree_pop': 'average-value',
    'richness': 'average-value',
    'relative_abundance': 'average-dict',

    # Biodiversity - Indirect indicators
    'bio_idx_tree_density': 'average-value',
    'bio_idx_deadWood': 'average-value',
    'bio_idx_tree_diversity': 'average-value',
    'bio_idx_spatial_distribution': 'average-value',
    'bio_idx_diametric_distribution': 'average-value',
    'bio_idx_vertical_distribution': 'average-value',
    'bio_idx_dominant_height': 'average-value',
    'bio_idx_microhabitats': 'average-value',

    # Soil
    'soil_structure_idx': 'average-value',
    'soil_composition': 'average-value',

    # Soil erosion
    'soil_eros_rainfall': 'average-value',
    'soil_eros_wind': 'average-value',
    'soil_eros_slope': 'average-value',
    'soil_eros_cover': 'average-value',
    'soil_eros_stability': 'average-value',
    'soil_eros_water_infiltration': 'average-value',

    # Soil macrofauna
    'soil_fauna_density': 'average-value',
    'soil_fauna_diversity': 'average-value',
    'soil_fauna_abundance': 'average-dict',

    # Surface macrofauna
    'soil_surface_fauna_density': 'average-value',
    'soil_surface_fauna_diversity': 'average-value',
    'soil_surface_fauna_abundance': 'average-dict',
}