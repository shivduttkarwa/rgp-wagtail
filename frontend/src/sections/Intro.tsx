import { Link } from "react-router-dom";
import "./Intro.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

type IntroProps = {
  label?: string;
  headlineHtml?: string;
  bodyHtml?: string;
  imageUrl?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryUrl?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryUrl?: string;
  stats?: Array<{
    value?: string;
    label?: string;
  }>;
};

const Intro = ({
  label,
  headlineHtml,
  bodyHtml,
  imageUrl,
  ctaPrimaryLabel,
  ctaPrimaryUrl,
  ctaSecondaryLabel,
  ctaSecondaryUrl,
  stats,
}: IntroProps) => {
  const richTextToPlain = (html?: string) => {
    if (!html) return "";
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>\s*<p>/gi, "\n\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .trim();
  };

  const resolveUrl = (value?: string) => {
    if (!value) return "";
    if (/^https?:\/\//i.test(value) || value.startsWith("//")) return value;
    return `${base}${value.replace(/^\//, "")}`;
  };

  const primaryTarget = ctaPrimaryUrl?.trim() || "/contact";
  const secondaryTarget = ctaSecondaryUrl?.trim() || "/about";
  const introImage = resolveUrl(imageUrl) || `${base}images/rahul-singh.jpg`;
  const normalizedHeadline = richTextToPlain(headlineHtml);
  const normalizedBody = richTextToPlain(bodyHtml);
  const renderHeadlineLine = (line: string) => {
    const founderMatch = line.match(/^(.*?)(\s*[-—]\s*Rahul Singh)\s*$/i);
    if (!founderMatch) return line;
    return (
      <>
        {founderMatch[1]}
        <span className="founder">{founderMatch[2]}</span>
      </>
    );
  };
  const statItems =
    stats?.filter((item) => item.value || item.label) ?? [
      { value: "$885k", label: "Median sold price" },
      { value: "21", label: "Median days advertised" },
      { value: "14", label: "Properties sold (as lead agent)" },
    ];

  const renderCta = (
    href: string,
    className: string,
    delay: string,
    text: string,
    withArrow = false,
  ) => {
    if (/^https?:\/\//i.test(href)) {
      return (
        <a
          href={href}
          className={className}
          data-gsap="btn-clip-reveal"
          data-gsap-delay={delay}
        >
          <span>{text}</span>
          {withArrow ? (
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          ) : null}
        </a>
      );
    }

    return (
      <Link
        to={href}
        className={className}
        data-gsap="btn-clip-reveal"
        data-gsap-delay={delay}
      >
        <span>{text}</span>
        {withArrow ? (
          <svg viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        ) : null}
      </Link>
    );
  };

  return (
    <section className="intro">
      {/* Left: Content */}
      <div className="intro-content">
        <span className="intro-label" data-gsap="fade-up">
          {label || "About the Founder"}
        </span>

        {normalizedHeadline ? (
          <h1
            className="intro-headline"
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
          >
            {normalizedHeadline.split("\n").map((line, i, arr) => (
              <span key={`headline-line-${i}`}>
                {renderHeadlineLine(line)}
                {i < arr.length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>
        ) : (
          <h1
            className="intro-headline"
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
          >
            Building Wealth
            <br />
            Through Property,
            <span className="founder">- Rahul Singh</span>
          </h1>
        )}

        {normalizedBody ? (
          <div className="intro-text" data-gsap="fade-up" data-gsap-delay="0.2">
            {normalizedBody.split("\n\n").map((paragraph, index) => (
              <span key={`body-paragraph-${index}`}>
                {paragraph}
                {index < normalizedBody.split("\n\n").length - 1 ? (
                  <>
                    <br />
                    <br />
                  </>
                ) : null}
              </span>
            ))}
          </div>
        ) : (
          <div className="intro-text" data-gsap="fade-up" data-gsap-delay="0.2">
            Real Gold Properties is a vision turned reality - a private equity
            approach to multi-family real estate. Founded by Rahul Singh, we
            focus on disciplined acquisitions that deliver consistent returns.
          </div>
        )}

        <div className="intro-cta-group">
          {renderCta(
            primaryTarget,
            "intro-cta intro-cta--primary",
            "0.2",
            ctaPrimaryLabel || "Book a Free Appraisal",
            true,
          )}
          {renderCta(
            secondaryTarget,
            "intro-cta intro-cta--ghost",
            "0.3",
            ctaSecondaryLabel || "Meet Rahul",
          )}
        </div>
      </div>

      {/* Right: Image */}
      <div
        className="intro-image"
        data-gsap="clip-reveal-right"
        data-gsap-start="top 60%"
      >
        <img src={introImage} alt="Rahul Singh - Real Gold Properties" />

        {/* Bottom gradient */}
        <div className="intro-img-gradient" />

        {/* Corner brackets */}
        <div className="intro-img-corner intro-img-corner--tl" />
        <div className="intro-img-corner intro-img-corner--br" />
      </div>

      {/* Stats — spans full width on mobile, sits at bottom */}
      <div className="intro-stats" data-gsap="zoom-in" data-gsap-stagger="0.3">
        {statItems.map((item, index) => (
          <div className="stat-item" key={`${item.value || "value"}-${index}`}>
            <span className="stat-value">{item.value || "-"}</span>
            <span className="stat-label">{item.label || ""}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Intro;
