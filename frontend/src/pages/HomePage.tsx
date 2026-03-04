import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../sections/HeroSection";
import Intro from "../sections/Intro";

import PortfolioShowcase from "../sections/PortfolioShowcase";
import PropertyListingSection from "@/sections/PropertyListingSection";
import ServiceSelection from "@/sections/ServiceSelection";
import PhilosophyPillars from "@/sections/Philosophy";

import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import {
  fetchHomePage,
  getImageUrl,
  type HeroBlockValue,
  type StreamFieldBlock,
} from "@/lib/wagtailApi";
export default function HomePage({ ready = false }: { ready?: boolean }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [cmsBlocks, setCmsBlocks] = useState<StreamFieldBlock[]>([]);

  useEffect(() => {
    // Clear one-time init guards so StrictMode's double-invoke doesn't skip animations
    const guards = [
      "clipRevealInit",
      "clipRevealRtlInit",
      "clipRevealTopInit",
      "clipRevealLeftInit",
      "clipRevealRightInit",
      "wordRevealInit",
      "wordWriteInit",
      "clipSmoothInit",
      "clipSmoothDownInit",
      "charRevealInit",
    ];
    guards.forEach((key) => {
      pageRef.current
        ?.querySelectorAll<HTMLElement>(
          `[data-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}]`,
        )
        .forEach((el) => delete el.dataset[key]);
    });

    const cleanup = initGsapSwitchAnimations(pageRef.current);
    return cleanup;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const page = await fetchHomePage();
      if (!cancelled && page?.body) {
        setCmsBlocks(page.body);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const heroContent = useMemo<HeroBlockValue | undefined>(() => {
    const hero = cmsBlocks.find((block) => block.type === "hero");
    return hero?.value as HeroBlockValue | undefined;
  }, [cmsBlocks]);

  return (
    <div ref={pageRef}>
      <HeroSection
        ready={ready}
        titleLine1={heroContent?.title_line_1}
        titleLine2={heroContent?.title_line_2}
        subtitle={heroContent?.subtitle}
        ctaLabel={heroContent?.cta_label}
        showCta={heroContent?.show_cta}
        showVideo={heroContent?.show_video}
        bgImage={getImageUrl(heroContent?.bg_image)}
        bgVideo={heroContent?.bg_video_url}
        bgPoster={getImageUrl(heroContent?.bg_video_poster)}
        ctaOnClick={() => {
          const target = heroContent?.cta_url?.trim();
          const fallback = "/properties";
          if (target && /^https?:\/\//i.test(target)) {
            window.location.href = target;
            return;
          }
          navigate(target || fallback);
        }}
      />

      <Intro />

      <PropertyListingSection />

      <ServiceSelection />
      <PhilosophyPillars />

      <PortfolioShowcase />
    </div>
  );
}
