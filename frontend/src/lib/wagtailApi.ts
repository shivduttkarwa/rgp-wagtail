export type StreamFieldBlock<T = unknown> = {
  id?: string;
  type: string;
  value: T;
};

type WagtailApiResponse<T> = {
  items: T[];
};

export type HeroBlockValue = {
  title_line_1?: string;
  title_line_2?: string;
  subtitle?: string;
  cta_label?: string;
  cta_url?: string;
  show_cta?: boolean;
  show_video?: boolean;
  bg_image?: WagtailImage;
  bg_video_url?: string;
  bg_video_poster?: WagtailImage;
};

export type HomePageApi = {
  id: number;
  title: string;
  slug: string;
  body: StreamFieldBlock[];
};

type WagtailImage = {
  id: number;
  title: string;
  meta?: {
    download_url?: string;
  };
};

const baseUrl = (import.meta.env.VITE_WAGTAIL_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

const apiBase = baseUrl
  ? `${baseUrl}/api/v2`
  : "/api/v2";

export function getImageUrl(image?: WagtailImage): string | undefined {
  return image?.meta?.download_url;
}

export async function fetchHomePage(): Promise<HomePageApi | null> {
  const url = `${apiBase}/pages/?type=home.HomePage&fields=title,slug,body&limit=1`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    return null;
  }
  const data = (await res.json()) as WagtailApiResponse<HomePageApi>;
  return data.items?.[0] ?? null;
}
