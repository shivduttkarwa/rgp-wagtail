import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  Home,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Tag,
  Key,
  Building2,
} from "lucide-react";
import {
  PropertyCard,
  type Category,
  type Property,
} from "../components/reusable/PropertyCard";
import { fetchHomepageListings, fetchListingsByIds } from "@/lib/listingsApi";
import "./PropertyListingsection.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const filterTabs = [
  { id: "for-sale", label: "For Sale", icon: Tag },
  { id: "sold", label: "Sold", icon: CheckCircle },
  { id: "for-rent", label: "For Rent", icon: Key },
];

const limitPerCategory = (items: Property[], limit: number) => {
  const counts: Record<Category, number> = {
    "for-sale": 0,
    sold: 0,
    "for-rent": 0,
  };
  return items.filter((item) => {
    if (counts[item.category] >= limit) return false;
    counts[item.category] += 1;
    return true;
  });
};

type PropertyListingSectionProps = {
  listingIds?: number[];
};

const PropertyListingSection = ({ listingIds = [] }: PropertyListingSectionProps) => {
  const [activeFilter, setActiveFilter] = useState<Category | "*">("for-sale");
  const [displayedFilter, setDisplayedFilter] = useState<Category | "*">(
    "for-sale",
  );
  const [isExiting, setIsExiting] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const filterExitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const filterTabsRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const pillInitialized = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const cmsListings = listingIds.length
        ? await fetchListingsByIds(listingIds)
        : await fetchHomepageListings();
      if (cancelled) return;
      const next = cmsListings ?? [];
      if (listingIds.length) {
        const order = new Map(listingIds.map((id, index) => [id, index]));
        next.sort((a, b) => (order.get(a.id) ?? 9999) - (order.get(b.id) ?? 9999));
      }
      setProperties(next);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [listingIds]);

  useLayoutEffect(() => {
    const container = filterTabsRef.current;
    const pill = pillRef.current;
    if (!container || !pill) return;
    const activeBtn =
      container.querySelector<HTMLElement>(".filter-tab.active");
    if (!activeBtn) return;

    if (!pillInitialized.current) {
      gsap.set(pill, {
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
      pillInitialized.current = true;
    } else {
      gsap.to(pill, {
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        duration: 0.38,
        ease: "expo.out",
        overwrite: "auto",
      });
    }
  }, [activeFilter]);

  useEffect(() => {
    const cards =
      gridRef.current?.querySelectorAll<HTMLElement>(".property-card");
    if (!cards?.length) return;

    gsap.set(cards, { clipPath: "inset(100% 0 0 0)", willChange: "clip-path" });

    ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power3.inOut",
          stagger: 0.12,
          onComplete: () => {
            gsap.set(cards, { clearProps: "will-change,clip-path" });
          },
        });
      },
    });
  }, [displayedFilter, properties]);

  const displayed = useMemo(() => {
    if (displayedFilter === "*") {
      return limitPerCategory(properties, 3);
    }
    return properties.filter((p) => p.category === displayedFilter).slice(0, 3);
  }, [displayedFilter, properties]);

  const handleFilterChange = (filter: Category | "*") => {
    if (filter === activeFilter || isExiting) return;
    setActiveFilter(filter);
    setIsExiting(true);
    if (filterExitTimerRef.current) {
      clearTimeout(filterExitTimerRef.current);
    }
    filterExitTimerRef.current = setTimeout(() => {
      setDisplayedFilter(filter);
      setIsExiting(false);
    }, 280);
  };

  useEffect(() => {
    return () => {
      if (filterExitTimerRef.current) {
        clearTimeout(filterExitTimerRef.current);
      }
    };
  }, []);

  return (
    <section className="property-section">
      <div className="property-container">
        <header className="section-header">
          <div className="section-badge" data-gsap="fade-up">
            <Building2 size={16} />
            <span>Prime Listings</span>
          </div>
          <h2
            className="section-title"
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
          >
            Discover Your <em>Dream Home</em>
          </h2>
          <p
            className="section-subtitle"
            data-gsap="fade-up"
            data-gsap-delay="0.15"
          >
            Explore our handpicked collection of premium properties designed for
            modern living
          </p>
        </header>

        <div
          className="filter-wrapper"
          data-gsap="fade-up"
          data-gsap-delay="0.1"
        >
          <div
            ref={filterTabsRef}
            className="filter-tabs"
            data-gsap="fade-right"
            data-gsap-stagger="0.09"
            data-gsap-delay="0.25"
          >
            <div ref={pillRef} className="filter-pill" />
            <button
              onClick={() => handleFilterChange("*")}
              className={`filter-tab ${activeFilter === "*" ? "active" : ""}`}
            >
              <span>All</span>
            </button>
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id as Category)}
                className={`filter-tab ${activeFilter === tab.id ? "active" : ""}`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          ref={gridRef}
          key={displayedFilter}
          className={`property-grid ${isExiting ? "grid-exiting" : "grid-entering"}`}
        >
          {displayed.map((property, index) => (
            <div key={property.id} className="property-card-wrap">
              <PropertyCard property={property} cardIndex={index} />
            </div>
          ))}
        </div>

        <div
          key={`swiper-${displayedFilter}`}
          className={`property-swiper-wrapper ${isExiting ? "swiper-exiting" : "swiper-entering"}`}
        >
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1.15}
            centeredSlides={false}
            grabCursor={true}
            speed={420}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{
              prevEl: ".swiper-btn-prev",
              nextEl: ".swiper-btn-next",
            }}
            breakpoints={{
              480: { slidesPerView: 1.3, spaceBetween: 20 },
              640: { slidesPerView: 1.8, spaceBetween: 24 },
            }}
            className="property-swiper"
          >
            {displayed.map((property, index) => (
              <SwiperSlide key={property.id}>
                <div
                  className="property-card-wrap"
                  data-gsap-mobile="slide-right"
                  data-gsap-start="top 70%"
                  data-gsap-duration="0.5"
                  data-gsap-ease="none"
                >
                  <PropertyCard property={property} cardIndex={index} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-nav" data-gsap-mobile="fade-up">
            <button
              className="swiper-btn swiper-btn-prev"
              aria-label="Previous"
            >
              <ArrowLeft size={20} />
            </button>
            <button className="swiper-btn swiper-btn-next" aria-label="Next">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="view-all-wrapper">
          <Link
            to="/properties"
            className="view-all-btn"
            data-gsap="btn-clip-reveal"
          >
            <span>View All Properties</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {!displayed.length && (
          <p className="section-subtitle">No listings selected for homepage yet.</p>
        )}

        <div className="stats-bar" data-gsap="fade-up">
          <div
            className="stats-grid"
            data-gsap="zoom-in"
            data-gsap-stagger="0.22"
            data-gsap-delay="0.2"
          >
            <div className="stat-card">
              <div className="stat-card-icon">
                <Home size={24} />
              </div>
              <div className="stat-card-content">
                <span className="stat-card-value">150+</span>
                <span className="stat-card-label">Properties Listed</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-card-content">
                <span className="stat-card-value">200+</span>
                <span className="stat-card-label">Happy Clients</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">
                <MapPin size={24} />
              </div>
              <div className="stat-card-content">
                <span className="stat-card-value">5+</span>
                <span className="stat-card-label">Cities Covered</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">
                <Building2 size={24} />
              </div>
              <div className="stat-card-content">
                <span className="stat-card-value">10+</span>
                <span className="stat-card-label">Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyListingSection;
