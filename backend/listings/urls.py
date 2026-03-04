from django.urls import path

from .api import ListingDetailApiView, ListingListApiView

urlpatterns = [
    path("", ListingListApiView.as_view(), name="listings-list"),
    path("<slug:slug>/", ListingDetailApiView.as_view(), name="listings-detail"),
]
