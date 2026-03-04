from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock


class HeroBlock(blocks.StructBlock):
    title = blocks.CharBlock(
        required=False,
        help_text="Single line. Use | to split into two lines. Use {gold}text{/gold} or {amber}text{/amber} for highlight.",
    )
    subtitle = blocks.TextBlock(required=False)
    cta_label = blocks.CharBlock(required=False)
    cta_url = blocks.URLBlock(required=False)
    show_cta = blocks.BooleanBlock(required=False, default=True)
    show_video = blocks.BooleanBlock(required=False, default=True)
    bg_image = ImageChooserBlock(required=False)
    bg_video_url = blocks.URLBlock(required=False)
    bg_video_poster = ImageChooserBlock(required=False)

    class Meta:
        icon = "image"
        label = "Hero"


class StatBlock(blocks.StructBlock):
    value = blocks.CharBlock(required=True)
    label = blocks.CharBlock(required=True)

    class Meta:
        icon = "list-ul"
        label = "Stat"


class IntroBlock(blocks.StructBlock):
    label = blocks.CharBlock(required=False)
    headline = blocks.RichTextBlock(required=False, features=["bold", "italic", "link"])
    body = blocks.RichTextBlock(required=False, features=["bold", "italic", "link"])
    image = ImageChooserBlock(required=False)
    cta_primary_label = blocks.CharBlock(required=False)
    cta_primary_url = blocks.URLBlock(required=False)
    cta_secondary_label = blocks.CharBlock(required=False)
    cta_secondary_url = blocks.URLBlock(required=False)
    stats = blocks.ListBlock(StatBlock(), required=False)

    class Meta:
        icon = "user"
        label = "Intro"


class SectionToggleBlock(blocks.StructBlock):
    enabled = blocks.BooleanBlock(required=False, default=True)

    class Meta:
        icon = "placeholder"
        label = "Section Toggle"
