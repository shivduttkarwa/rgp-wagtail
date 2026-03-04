from django.db import models
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.models import Orderable


class Listing(ClusterableModel):
    CATEGORY_CHOICES = [
        ("for-sale", "For Sale"),
        ("sold", "Sold"),
        ("for-rent", "For Rent"),
    ]
    STATUS_CHOICES = [
        ("For Sale", "For Sale"),
        ("For Rent", "For Rent"),
        ("Sold", "Sold"),
        ("Pending", "Pending"),
    ]

    # Card + detail shared fields
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="For Sale")
    location = models.CharField(max_length=255, help_text="Short location shown on cards")

    # Pricing
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sold_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    price_label = models.CharField(max_length=100, blank=True)

    # Card visuals
    card_image = models.ForeignKey(
        "wagtailimages.Image",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="listing_card_images",
    )
    badge = models.CharField(max_length=100, blank=True)
    is_new = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)

    # Card stats/meta
    beds = models.PositiveIntegerField(default=0)
    baths = models.PositiveIntegerField(default=0)
    sqft = models.PositiveIntegerField(default=0)
    garage = models.PositiveIntegerField(default=0)
    sold_date = models.CharField(max_length=80, blank=True)
    days_on_market = models.PositiveIntegerField(null=True, blank=True)
    deposit = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    min_lease = models.CharField(max_length=100, blank=True)

    # Detail page fields
    property_id = models.CharField(max_length=80, blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=120, blank=True)
    state = models.CharField(max_length=120, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    featured = models.BooleanField(default=False)
    map_embed_url = models.URLField(blank=True)
    video_tour_url = models.URLField(blank=True)
    video_thumbnail = models.ForeignKey(
        "wagtailimages.Image",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="listing_video_thumbnails",
    )

    # Agent
    agent_name = models.CharField(max_length=255, blank=True)
    agent_title = models.CharField(max_length=255, blank=True)
    agent_image = models.ForeignKey(
        "wagtailimages.Image",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="listing_agent_images",
    )
    agent_phone = models.CharField(max_length=40, blank=True)
    agent_email = models.EmailField(blank=True)
    agent_rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    agent_review_count = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    panels = [
        MultiFieldPanel(
            [
                FieldPanel("title"),
                FieldPanel("slug"),
                FieldPanel("category"),
                FieldPanel("status"),
                FieldPanel("location"),
                FieldPanel("is_active"),
                FieldPanel("sort_order"),
            ],
            heading="Basics",
        ),
        MultiFieldPanel(
            [
                FieldPanel("price"),
                FieldPanel("sold_price"),
                FieldPanel("price_label"),
                FieldPanel("badge"),
                FieldPanel("is_new"),
                FieldPanel("views"),
            ],
            heading="Pricing & Badges",
        ),
        MultiFieldPanel(
            [
                FieldPanel("card_image"),
                FieldPanel("beds"),
                FieldPanel("baths"),
                FieldPanel("sqft"),
                FieldPanel("garage"),
                FieldPanel("sold_date"),
                FieldPanel("days_on_market"),
                FieldPanel("deposit"),
                FieldPanel("min_lease"),
            ],
            heading="Card Fields",
        ),
        MultiFieldPanel(
            [
                FieldPanel("property_id"),
                FieldPanel("address"),
                FieldPanel("city"),
                FieldPanel("state"),
                FieldPanel("zip_code"),
                FieldPanel("featured"),
                FieldPanel("map_embed_url"),
                FieldPanel("video_tour_url"),
                FieldPanel("video_thumbnail"),
            ],
            heading="Detail Fields",
        ),
        MultiFieldPanel(
            [
                FieldPanel("agent_name"),
                FieldPanel("agent_title"),
                FieldPanel("agent_image"),
                FieldPanel("agent_phone"),
                FieldPanel("agent_email"),
                FieldPanel("agent_rating"),
                FieldPanel("agent_review_count"),
            ],
            heading="Agent",
        ),
        InlinePanel("images", label="Gallery Images"),
        InlinePanel("features", label="Card Feature Tags"),
        InlinePanel("overview_items", label="Overview Paragraphs"),
        InlinePanel("amenities", label="Detail Amenities"),
        InlinePanel("details", label="Specification Rows"),
        InlinePanel("stats", label="Detail Quick Stats"),
        InlinePanel("nearby_locations", label="Nearby Locations"),
    ]

    class Meta:
        ordering = ["sort_order", "title"]

    def __str__(self) -> str:
        return self.title


class ListingImage(Orderable):
    listing = ParentalKey(Listing, related_name="images", on_delete=models.CASCADE)
    image = models.ForeignKey("wagtailimages.Image", on_delete=models.CASCADE, related_name="+")
    alt_text = models.CharField(max_length=255, blank=True)

    panels = [FieldPanel("image"), FieldPanel("alt_text")]


class ListingFeature(Orderable):
    listing = ParentalKey(Listing, related_name="features", on_delete=models.CASCADE)
    text = models.CharField(max_length=120)

    panels = [FieldPanel("text")]


class ListingOverviewItem(Orderable):
    listing = ParentalKey(Listing, related_name="overview_items", on_delete=models.CASCADE)
    text = models.TextField()

    panels = [FieldPanel("text")]


class ListingAmenity(Orderable):
    ICON_CHOICES = [
        ("smart-home", "Smart Home"),
        ("kitchen", "Kitchen"),
        ("ocean", "Ocean"),
        ("wine", "Wine"),
        ("pool", "Pool"),
        ("dock", "Dock"),
        ("theater", "Theater"),
        ("gym", "Gym"),
        ("security", "Security"),
        ("garden", "Garden"),
        ("spa", "Spa"),
        ("garage", "Garage"),
    ]

    listing = ParentalKey(Listing, related_name="amenities", on_delete=models.CASCADE)
    icon = models.CharField(max_length=20, choices=ICON_CHOICES)
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)

    panels = [FieldPanel("icon"), FieldPanel("title"), FieldPanel("description")]


class ListingDetailRow(Orderable):
    listing = ParentalKey(Listing, related_name="details", on_delete=models.CASCADE)
    label = models.CharField(max_length=120)
    value = models.CharField(max_length=255)

    panels = [FieldPanel("label"), FieldPanel("value")]


class ListingStat(Orderable):
    ICON_CHOICES = [
        ("bed", "Bed"),
        ("bath", "Bath"),
        ("area", "Area"),
        ("garage", "Garage"),
        ("year", "Year"),
        ("lot", "Lot"),
    ]

    listing = ParentalKey(Listing, related_name="stats", on_delete=models.CASCADE)
    icon = models.CharField(max_length=20, choices=ICON_CHOICES)
    value = models.CharField(max_length=120)
    label = models.CharField(max_length=120)

    panels = [FieldPanel("icon"), FieldPanel("value"), FieldPanel("label")]


class ListingNearbyLocation(Orderable):
    TYPE_CHOICES = [
        ("shopping", "Shopping"),
        ("airport", "Airport"),
        ("dining", "Dining"),
        ("golf", "Golf"),
        ("beach", "Beach"),
        ("school", "School"),
        ("hospital", "Hospital"),
    ]

    listing = ParentalKey(Listing, related_name="nearby_locations", on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    distance = models.CharField(max_length=80)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    panels = [FieldPanel("name"), FieldPanel("distance"), FieldPanel("type")]
