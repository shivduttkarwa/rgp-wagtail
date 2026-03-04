import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  type IntroBlockValue,
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

  const introContent = useMemo<IntroBlockValue | undefined>(() => {
    const intro = cmsBlocks.find((block) => block.type === "intro");
    return intro?.value as IntroBlockValue | undefined;
  }, [cmsBlocks]);

  const parseTitleMarkup = (value?: string): ReactNode => {
    if (!value) return "";
    const normalized = value
      .replace(/\[(gold|amber)\]/gi, (_m, c) => `{${String(c).toLowerCase()}}`)
      .replace(/\[\/(gold|amber)\]/gi, (_m, c) => `{/${String(c).toLowerCase()}}`)
      .replace(/<(gold|amber)>/gi, (_m, c) => `{${String(c).toLowerCase()}}`)
      .replace(/<\/(gold|amber)>/gi, (_m, c) => `{/${String(c).toLowerCase()}}`);
    const parts = normalized.split(
      /(\{gold\}.*?\{\/gold\}|\{amber\}.*?\{\/amber\})/gi,
    );
    return parts.map((part, index) => {
      const token = part.trim();
      if (/^\{gold\}.*\{\/gold\}$/i.test(token)) {
        return (
          <span className="rg-gold" key={`gold-${index}`}>
            {token.replace(/^\{gold\}|\{\/gold\}$/gi, "")}
          </span>
        );
      }
      if (/^\{amber\}.*\{\/amber\}$/i.test(token)) {
        return (
          <span className="rg-amber" key={`amber-${index}`}>
            {token.replace(/^\{amber\}|\{\/amber\}$/gi, "")}
          </span>
        );
      }
      return <span key={`text-${index}`}>{part}</span>;
    });
  };

  const splitHeroTitle = (raw?: string): [string, string] => {
    if (!raw) return ["", ""];
    const normalized = raw.replace(/<br\s*\/?>/gi, "|").replace(/\n/g, "|").trim();
    if (normalized.includes("|")) {
      const [line1, line2] = normalized.split("|", 2);
      return [line1?.trim() || "", line2?.trim() || ""];
    }
    const sentenceParts = normalized
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (sentenceParts.length >= 2) {
      return [sentenceParts[0], sentenceParts.slice(1).join(" ")];
    }
    if (normalized.includes(",")) {
      const commaIdx = normalized.indexOf(",");
      return [
        normalized.slice(0, commaIdx + 1).trim(),
        normalized.slice(commaIdx + 1).trim(),
      ];
    }
    const words = normalized.split(/\s+/).filter(Boolean);
    if (words.length >= 4) {
      const splitAt = Math.ceil(words.length / 2);
      return [words.slice(0, splitAt).join(" "), words.slice(splitAt).join(" ")];
    }
    return [normalized, ""];
  };

  const applyGoldToLastTwoWords = (line: string) => {
    if (!line || /\{(gold|amber)\}/i.test(line)) return line;
    const words = line.trim().split(/\s+/).filter(Boolean);
    if (words.length < 2) return line;
    const keep = words.slice(0, -2).join(" ");
    const lastTwo = words.slice(-2).join(" ");
    return `${keep ? `${keep} ` : ""}{gold}${lastTwo}{/gold}`;
  };

  const resolvedHeroLines = (() => {
    if (heroContent?.title) {
      const [line1Raw, line2Raw] = splitHeroTitle(heroContent.title);
      const titleLine1 = line1Raw;
      const titleLine2 = line2Raw || "";
      const finalLine2 = titleLine2 ? applyGoldToLastTwoWords(titleLine2) : "";
      const finalLine1 = titleLine2 ? titleLine1 : applyGoldToLastTwoWords(titleLine1);
      return {
        line1: parseTitleMarkup(finalLine1),
        line2: parseTitleMarkup(finalLine2),
      };
    }
    if (heroContent?.title_line_1 && !heroContent?.title_line_2) {
      const [line1Raw, line2Raw] = splitHeroTitle(heroContent.title_line_1);
      const titleLine1 = line1Raw;
      const titleLine2 = line2Raw || "";
      const finalLine2 = titleLine2 ? applyGoldToLastTwoWords(titleLine2) : "";
      const finalLine1 = titleLine2 ? titleLine1 : applyGoldToLastTwoWords(titleLine1);
      return {
        line1: parseTitleMarkup(finalLine1),
        line2: parseTitleMarkup(finalLine2),
      };
    }
    return {
      line1: parseTitleMarkup(heroContent?.title_line_1),
      line2: parseTitleMarkup(heroContent?.title_line_2),
    };
  })();

  return (
    <div ref={pageRef}>
      <HeroSection
        ready={ready}
        titleLine1={resolvedHeroLines.line1}
        titleLine2={resolvedHeroLines.line2}
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

      <Intro
        label={introContent?.label}
        headlineHtml={introContent?.headline}
        bodyHtml={introContent?.body}
        imageUrl={getImageUrl(introContent?.image)}
        ctaPrimaryLabel={introContent?.cta_primary_label}
        ctaPrimaryUrl={introContent?.cta_primary_url}
        ctaSecondaryLabel={introContent?.cta_secondary_label}
        ctaSecondaryUrl={introContent?.cta_secondary_url}
        stats={introContent?.stats}
      />

      <PropertyListingSection />

      <ServiceSelection />
      <PhilosophyPillars />

      <PortfolioShowcase />
    </div>
  );
}
