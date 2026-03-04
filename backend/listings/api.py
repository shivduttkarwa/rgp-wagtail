from decimal import Decimal

from django.shortcuts import get_object_or_404
from rest_framework import generics, serializers
from rest_framework.response import Response

from .models import Listing


def image_url(request, image):
    if not image:
        return ""
    if request is None:
        return image.file.url
    return request.build_absolute_uri(image.file.url)


def decimal_to_number(value: Decimal | None) -> float:
    if value is None:
        return 0.0
    return float(value)


class ListingCardSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    slug = serializers.CharField()
    category = serializers.CharField()
    title = serializers.CharField()
    location = serializers.CharField()
    price = serializers.FloatField()
    soldPrice = serializers.FloatField(required=False)
    image = serializers.CharField()
    beds = serializers.IntegerField()
    baths = serializers.IntegerField()
    sqft = serializers.IntegerField()
    garage = serializers.IntegerField()
    features = serializers.ListField(child=serializers.CharField())
    badge = serializers.CharField(required=False, allow_blank=True)
    isNew = serializers.BooleanField(required=False)
    views = serializers.IntegerField(required=False)
    soldDate = serializers.CharField(required=False, allow_blank=True)
    daysOnMarket = serializers.IntegerField(required=False)
    deposit = serializers.FloatField(required=False)
    minLease = serializers.CharField(required=False, allow_blank=True)


class ListingDetailSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    address = serializers.CharField()
    city = serializers.CharField()
    state = serializers.CharField()
    zipCode = serializers.CharField()
    price = serializers.FloatField()
    priceLabel = serializers.CharField(required=False, allow_blank=True)
    status = serializers.CharField()
    featured = serializers.BooleanField(required=False)
    images = serializers.ListField(child=serializers.DictField())
    stats = serializers.ListField(child=serializers.DictField())
    overview = serializers.ListField(child=serializers.CharField())
    features = serializers.ListField(child=serializers.DictField())
    details = serializers.ListField(child=serializers.DictField())
    mapEmbedUrl = serializers.CharField(required=False, allow_blank=True)
    nearbyLocations = serializers.ListField(child=serializers.DictField())
    videoTourUrl = serializers.CharField(required=False, allow_blank=True)
    videoThumbnail = serializers.CharField(required=False, allow_blank=True)
    agent = serializers.DictField()


class ListingListApiView(generics.ListAPIView):
    serializer_class = ListingCardSerializer

    def get_queryset(self):
        queryset = Listing.objects.filter(is_active=True).prefetch_related("features")
        show_in_home = self.request.query_params.get("show_in_property_listing")
        ids_raw = self.request.query_params.get("ids")
        if ids_raw:
            parsed_ids = []
            for chunk in ids_raw.split(","):
                chunk = chunk.strip()
                if chunk.isdigit():
                    parsed_ids.append(int(chunk))
            if parsed_ids:
                queryset = queryset.filter(id__in=parsed_ids)
        if show_in_home and show_in_home.lower() in {"1", "true", "yes", "on"}:
            queryset = queryset.filter(show_in_property_listing=True)
        return queryset.order_by("sort_order", "id")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        items = []
        for listing in queryset:
            features = [item.text for item in listing.features.all()]
            row = {
                "id": listing.id,
                "slug": listing.slug,
                "category": listing.category,
                "title": listing.title,
                "location": listing.location,
                "price": decimal_to_number(listing.price),
                "image": image_url(request, listing.card_image),
                "beds": listing.beds,
                "baths": listing.baths,
                "sqft": listing.sqft,
                "garage": listing.garage,
                "features": features,
                "badge": listing.badge,
                "isNew": listing.is_new,
                "views": listing.views,
                "soldDate": listing.sold_date,
                "minLease": listing.min_lease,
            }
            if listing.sold_price is not None:
                row["soldPrice"] = decimal_to_number(listing.sold_price)
            if listing.days_on_market is not None:
                row["daysOnMarket"] = listing.days_on_market
            if listing.deposit is not None:
                row["deposit"] = decimal_to_number(listing.deposit)
            items.append(row)

        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)


class ListingDetailApiView(generics.RetrieveAPIView):
    serializer_class = ListingDetailSerializer
    lookup_field = "slug"

    def get_object(self):
        return get_object_or_404(
            Listing.objects.prefetch_related(
                "images",
                "stats",
                "overview_items",
                "amenities",
                "details",
                "nearby_locations",
            ),
            slug=self.kwargs["slug"],
            is_active=True,
        )

    def retrieve(self, request, *args, **kwargs):
        listing = self.get_object()
        payload = {
            "id": listing.property_id or str(listing.id),
            "title": listing.title,
            "address": listing.address,
            "city": listing.city,
            "state": listing.state,
            "zipCode": listing.zip_code,
            "price": decimal_to_number(listing.price),
            "priceLabel": listing.price_label,
            "status": listing.status,
            "featured": listing.featured,
            "images": [
                {
                    "url": image_url(request, item.image),
                    "alt": item.alt_text or listing.title,
                }
                for item in listing.images.all()
            ],
            "stats": [
                {"icon": item.icon, "value": item.value, "label": item.label}
                for item in listing.stats.all()
            ],
            "overview": [item.text for item in listing.overview_items.all()],
            "features": [
                {
                    "icon": item.icon,
                    "title": item.title,
                    "description": item.description,
                }
                for item in listing.amenities.all()
            ],
            "details": [
                {"label": item.label, "value": item.value}
                for item in listing.details.all()
            ],
            "mapEmbedUrl": listing.map_embed_url,
            "nearbyLocations": [
                {
                    "name": item.name,
                    "distance": item.distance,
                    "type": item.type,
                }
                for item in listing.nearby_locations.all()
            ],
            "videoTourUrl": listing.video_tour_url,
            "videoThumbnail": image_url(request, listing.video_thumbnail),
            "agent": {
                "name": listing.agent_name,
                "title": listing.agent_title,
                "image": image_url(request, listing.agent_image),
                "phone": listing.agent_phone,
                "email": listing.agent_email,
                "rating": float(listing.agent_rating),
                "reviewCount": listing.agent_review_count,
            },
        }

        # Fallbacks to keep the frontend stable.
        if not payload["images"] and listing.card_image:
            payload["images"] = [
                {"url": image_url(request, listing.card_image), "alt": listing.title}
            ]
        if not payload["overview"]:
            payload["overview"] = ["Overview coming soon."]

        serializer = self.get_serializer(payload)
        return Response(serializer.data)
