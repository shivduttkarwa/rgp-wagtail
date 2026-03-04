export type StreamFieldBlock<T = unknown> = {
  id?: string;
  type: string;
  value: T;
};

type WagtailApiResponse<T> = {
  items: T[];
};

type WagtailImageValue = WagtailImage | number | null | undefined;

export type HeroBlockValue = {
  title?: string;
  title_line_1?: string;
  title_line_2?: string;
  subtitle?: string;
  cta_label?: string;
  cta_url?: string;
  show_cta?: boolean;
  show_video?: boolean;
  bg_image?: WagtailImageValue;
  bg_video_url?: string;
  bg_video_poster?: WagtailImageValue;
};

export type IntroBlockValue = {
  label?: string;
  headline?: string;
  body?: string;
  image?: WagtailImageValue;
  cta_primary_label?: string;
  cta_primary_url?: string;
  cta_secondary_label?: string;
  cta_secondary_url?: string;
  stats?: Array<{
    value?: string;
    label?: string;
  }>;
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

export function getImageUrl(image?: WagtailImageValue): string | undefined {
  if (!image || typeof image === "number") return undefined;
  const url = image.meta?.download_url;
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url) || url.startsWith("//")) return url;
  return baseUrl ? `${baseUrl}${url}` : url;
}

async function fetchImageById(id: number): Promise<WagtailImage | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${apiBase}/images/${id}/`, {
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as WagtailImage;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function getImageId(value: WagtailImageValue): number | null {
  if (!value) return null;
  if (typeof value === "number") return value;
  return value.id ?? null;
}

export async function fetchHomePage(): Promise<HomePageApi | null> {
  const url = `${apiBase}/pages/?type=home.HomePage&fields=title,slug,body&limit=1`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as WagtailApiResponse<HomePageApi>;
    const page = data.items?.[0] ?? null;
    if (!page?.body) return page;

    const imageIds = new Set<number>();
    page.body.forEach((block) => {
      if (block.type === "hero") {
        const hero = block.value as HeroBlockValue;
        const bgImageId = getImageId(hero.bg_image);
        const bgPosterId = getImageId(hero.bg_video_poster);
        if (bgImageId) imageIds.add(bgImageId);
        if (bgPosterId) imageIds.add(bgPosterId);
      }
      if (block.type === "intro") {
        const intro = block.value as IntroBlockValue;
        const introImageId = getImageId(intro.image);
        if (introImageId) imageIds.add(introImageId);
      }
    });

    const imageMap = new Map<number, WagtailImage>();
    await Promise.all(
      Array.from(imageIds).map(async (id) => {
        const image = await fetchImageById(id);
        if (image) imageMap.set(id, image);
      }),
    );

    const hydratedBody = page.body.map((block) => {
      if (block.type === "hero") {
        const hero = block.value as HeroBlockValue;
        const bgImageId = getImageId(hero.bg_image);
        const bgPosterId = getImageId(hero.bg_video_poster);
        return {
          ...block,
          value: {
            ...hero,
            bg_image: bgImageId ? imageMap.get(bgImageId) ?? hero.bg_image : hero.bg_image,
            bg_video_poster: bgPosterId
              ? imageMap.get(bgPosterId) ?? hero.bg_video_poster
              : hero.bg_video_poster,
          },
        } as StreamFieldBlock;
      }
      if (block.type === "intro") {
        const intro = block.value as IntroBlockValue;
        const introImageId = getImageId(intro.image);
        return {
          ...block,
          value: {
            ...intro,
            image: introImageId ? imageMap.get(introImageId) ?? intro.image : intro.image,
          },
        } as StreamFieldBlock;
      }
      return block;
    });

    return { ...page, body: hydratedBody };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
