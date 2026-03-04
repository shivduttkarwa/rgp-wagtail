from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("listings", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="listing",
            name="show_in_property_listing",
            field=models.BooleanField(
                default=False,
                help_text="Show this listing in the homepage property listing section.",
            ),
        ),
    ]
