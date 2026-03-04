from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField
from wagtail.fields import StreamField
from wagtail.models import Page

from .blocks import HeroBlock, IntroBlock, SectionToggleBlock


class HomePage(Page):
    body = StreamField(
        [
            ("hero", HeroBlock()),
            ("intro", IntroBlock()),
            ("property_listing", SectionToggleBlock(label="Property Listing")),
            ("service_selection", SectionToggleBlock(label="Service Selection")),
            ("philosophy_pillars", SectionToggleBlock(label="Philosophy Pillars")),
            ("portfolio_showcase", SectionToggleBlock(label="Portfolio Showcase")),
        ],
        use_json_field=True,
        blank=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]

    api_fields = [
        APIField("body"),
    ]

    parent_page_types = ["wagtailcore.Page"]
    subpage_types = []
