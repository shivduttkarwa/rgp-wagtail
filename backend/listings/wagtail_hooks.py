from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

from .models import Listing


class ListingViewSet(SnippetViewSet):
    model = Listing
    icon = "home"
    menu_label = "Listings"
    menu_name = "listings"
    menu_order = 150
    add_to_admin_menu = True
    list_display = [
        "title",
        "category",
        "status",
        "price",
        "show_in_property_listing",
        "is_active",
    ]
    search_fields = ["title", "location", "slug", "address"]


register_snippet(ListingViewSet)
