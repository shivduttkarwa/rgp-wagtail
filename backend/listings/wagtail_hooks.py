from wagtail.admin.viewsets.model import ModelViewSet
from wagtail.snippets.models import register_snippet

from .models import Listing


class ListingViewSet(ModelViewSet):
    model = Listing
    icon = "home"
    menu_label = "Listings"
    menu_name = "listings"
    menu_order = 150
    add_to_admin_menu = True
    list_display = ["title", "category", "status", "price", "is_active"]
    search_fields = ["title", "location", "slug", "address"]


register_snippet(ListingViewSet)
