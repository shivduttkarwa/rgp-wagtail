import type { Property } from "@/components/reusable/PropertyCard";
import type { PropertyData } from "@/components/reusable/PropDetails";

const baseUrl = (import.meta.env.VITE_WAGTAIL_API_BASE_URL || "").replace(/\/$/, "");
const apiBase = baseUrl ? `${baseUrl}/api/v2` : "/api/v2";

async function fetchJson<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchListings(): Promise<Property[] | null> {
  return fetchJson<Property[]>(`${apiBase}/listings/`);
}

export async function fetchHomepageListings(): Promise<Property[] | null> {
  return fetchJson<Property[]>(
    `${apiBase}/listings/?show_in_property_listing=true`,
  );
}

export async function fetchListingsByIds(ids: number[]): Promise<Property[] | null> {
  const normalized = ids.filter((id) => Number.isInteger(id) && id > 0);
  if (!normalized.length) return [];
  return fetchJson<Property[]>(`${apiBase}/listings/?ids=${normalized.join(",")}`);
}

export async function fetchListingDetail(slug: string): Promise<PropertyData | null> {
  return fetchJson<PropertyData>(`${apiBase}/listings/${slug}/`);
}
