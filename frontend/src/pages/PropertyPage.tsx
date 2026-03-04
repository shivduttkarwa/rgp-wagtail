import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import PropDetail, { type PropertyData } from "../components/reusable/PropDetails";
import { getPropertyById } from "../data/properties";
import { fetchListingDetail } from "@/lib/listingsApi";

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) {
        setLoaded(true);
        return;
      }
      const fromCms = await fetchListingDetail(id);
      if (cancelled) return;
      if (fromCms) {
        setProperty(fromCms);
      } else {
        setProperty(getPropertyById(id) ?? null);
      }
      setLoaded(true);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!loaded) return null;
  if (!property) return <Navigate to="/" replace />;

  return (
    <>
      <PropDetail
        property={property}
        onContactSubmit={(data) => console.log("Contact:", data)}
        onSaveProperty={() => {}}
        onShareProperty={() => {}}
        onScheduleViewing={() => {}}
        onDownloadBrochure={() => {}}
      />
    </>
  );
}
