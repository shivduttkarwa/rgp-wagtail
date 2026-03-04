from django.db import migrations
import wagtail.fields

import home.blocks


class Migration(migrations.Migration):

    dependencies = [
        ("home", "0001_initial"),
        ("listings", "0002_listing_show_in_property_listing"),
    ]

    operations = [
        migrations.AlterField(
            model_name="homepage",
            name="body",
            field=wagtail.fields.StreamField(
                [
                    ("hero", home.blocks.HeroBlock()),
                    ("intro", home.blocks.IntroBlock()),
                    ("property_listing", home.blocks.PropertyListingBlock()),
                    (
                        "service_selection",
                        home.blocks.SectionToggleBlock(label="Service Selection"),
                    ),
                    (
                        "philosophy_pillars",
                        home.blocks.SectionToggleBlock(label="Philosophy Pillars"),
                    ),
                    (
                        "portfolio_showcase",
                        home.blocks.SectionToggleBlock(label="Portfolio Showcase"),
                    ),
                ],
                blank=True,
                use_json_field=True,
            ),
        ),
    ]
