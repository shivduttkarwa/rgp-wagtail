import { type ReactNode, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import BtnSecondary from "../components/BtnSecondary";
import "./HeroSection.css";

type HeroSectionProps = {
  ready?: boolean;
  titleLine1?: ReactNode;
  titleLine2?: ReactNode;
  subtitle?: ReactNode;
  ctaLabel?: string;
  ctaOnClick?: () => void;
  showCta?: boolean;
  showVideo?: boolean;
  bgImage?: string;
  bgVideo?: string;
  bgPoster?: string;
  footer?: ReactNode;
};

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */
export default function HeroSection({
  ready = false,
  titleLine1 = (
    <>
      Your <span className="rg-gold">Dream</span> Home
    </>
  ),
  titleLine2 = (
    <>
      <span className="rg-amber">Perfectly</span> Delivered
    </>
  ),
  subtitle =
    "350+ premium properties delivered — luxury villas, penthouses & exclusive estates crafted for those who demand the extraordinary.",
  ctaLabel = "Explore Properties",
  ctaOnClick,
  showCta = true,
  showVideo = true,
  bgImage = "images/hero-rpg-brisbane.jpg",
  bgVideo = "vids/hero-rgp.mp4",
  bgPoster,
  footer,
}: HeroSectionProps) {
  const publicUrl = import.meta.env.BASE_URL || "/";
  const resolveUrl = (path?: string) => {
    if (!path) return path;
    if (/^https?:\/\//i.test(path) || path.startsWith("//")) return path;
    return `${publicUrl}${path}`;
  };
  const extractYouTubeId = (url?: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    );
    return match?.[1] ?? null;
  };
  const bgRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const titleOneRef = useRef<HTMLDivElement>(null);
  const titleTwoRef = useRef<HTMLDivElement>(null);
  const revealSubRef = useRef<HTMLDivElement>(null);
  const revealCtaRef = useRef<HTMLDivElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const resolvedVideoUrl = resolveUrl(bgVideo);
  const youTubeId = extractYouTubeId(resolvedVideoUrl);
  const youTubeEmbedUrl = youTubeId
    ? `https://www.youtube.com/embed/${youTubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youTubeId}&playsinline=1&modestbranding=1&rel=0`
    : null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");

    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        // Autoplay can still be blocked on some devices; fallback keeps poster.
      }
    };

    void tryPlay();
    const handlePlaying = () => setVideoReady(true);
    video.addEventListener("playing", handlePlaying);
    return () => {
      video.removeEventListener("playing", handlePlaying);
    };
  }, []);

  // Set initial states on mount — bg fully visible, only content hidden
  useEffect(() => {
    const bg = bgRef.current;
    const vignette = vignetteRef.current;
    const titleOne = titleOneRef.current;
    const titleTwo = titleTwoRef.current;
    const revealSub = revealSubRef.current;
    const revealCta = revealCtaRef.current;

    if (!bg || !vignette || !titleOne || !titleTwo || !revealSub) return;

    gsap.set(bg, { opacity: 1, scale: 1 });
    gsap.set(vignette, { opacity: 0.5 });
    gsap.set([titleOne, titleTwo], { y: 50, opacity: 0 });
    gsap.set([revealSub, revealCta], { x: -60, opacity: 0 });
    if (revealCta) gsap.set(revealCta, { scale: 0.9 });
  }, []);

  // Animate titles + subtitle + CTA after ready
  useEffect(() => {
    if (!ready) return;

    const titleOne = titleOneRef.current;
    const titleTwo = titleTwoRef.current;
    const revealSub = revealSubRef.current;
    const revealCta = revealCtaRef.current;

    if (!titleOne || !titleTwo || !revealSub) return;

    const tl = gsap.timeline({ delay: 0.9 });
    tl.to(titleOne, {
      y: 0,
      opacity: 1,
      duration: 1.1,
      ease: "power3.out",
    });
    tl.to(
      titleTwo,
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power3.out",
      },
      0.25,
    );
    tl.to(
      revealSub,
      { x: 0, opacity: 1, duration: 0.9, ease: "power4.out" },
      0.9,
    );
    if (revealCta) {
      tl.to(
        revealCta,
        { x: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power4.out" },
        1,
      );
    }

    return () => {
      tl.kill();
    };
  }, [ready]);

  /* ═══════════════════════════════════════════════════
     JSX
     ═══════════════════════════════════════════════════ */
  return (
    <div className="rgp-hero-wrap">
      <section className="rgp-hero">
        {/* ── BACKGROUND ── */}
        <div
          className={`rgp-hero__bg ${videoReady ? "rgp-hero__bg--ready" : ""}`}
          ref={bgRef}
          aria-hidden="true"
        >
          <img
            className="rgp-hero__bg-poster"
            src={resolveUrl(bgPoster || bgImage)}
            alt=""
            loading="eager"
            fetchPriority="high"
          />
          {showVideo && youTubeEmbedUrl && (
            <iframe
              className="rgp-hero__bg-video"
              src={youTubeEmbedUrl}
              title="Hero background video"
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setVideoReady(true)}
            />
          )}
          {showVideo && bgVideo && !youTubeEmbedUrl && (
            <video
              className="rgp-hero__bg-video"
              ref={videoRef}
              src={resolvedVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              disablePictureInPicture
              preload="auto"
              poster={resolveUrl(bgPoster || bgImage)}
              onLoadedMetadata={() => {
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => setVideoReady(true));
                });
              }}
              onCanPlay={() => {
                setVideoReady(true);
                void videoRef.current?.play();
              }}
            />
          )}
        </div>

        {/* ── VIGNETTE ── */}
        <div
          className="rgp-hero__vignette"
          ref={vignetteRef}
          aria-hidden="true"
        />

        {/* ── CONTENT ── */}
        <div className="rgp-hero__content">
          <div className="rgp-hero__title">
            <div className="rgp-hero__title-line">
              <div className="rgp-hero__title-text" ref={titleOneRef}>
                {titleLine1}
              </div>
            </div>
            <div className="rgp-hero__title-line">
              <div className="rgp-hero__title-text" ref={titleTwoRef}>
                {titleLine2}
              </div>
            </div>
          </div>

          <div className="rgp-hero__subtitle" ref={revealSubRef}>
            {subtitle}
          </div>

          {showCta && (
            <div className="rgp-hero__cta" ref={revealCtaRef}>
              <BtnSecondary label={ctaLabel} onClick={ctaOnClick} />
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        {footer && <div className="rgp-hero__footer">{footer}</div>}
      </section>
    </div>
  );
}
