from coordo.map import Map
from users.models import ADMIN_PROJECT
from django.conf import settings

from ..constants import ALL4TREES_LAYERS

config_path = settings.BASE_DIR / "configs" / "all4trees_config.json"
map = Map.from_file(config_path)

def get_user_map(user):
    # Deep copy: a shallow copy shares the layer objects with the module-level map,
    # so set_filters would write each request's restriction into global state and
    # concurrent requests could be served another user's restriction.
    user_map = map.model_copy(deep=True)
    filter = ''
    if user.is_authenticated and bool(user.project):
        project = user.project
        if (project.lower() != ADMIN_PROJECT):
            filter = f"proj = '{project}' or conf = 1"
    else:
        filter = 'conf = 1'

    user_map.set_filters(ALL4TREES_LAYERS, filter)
    return user_map
