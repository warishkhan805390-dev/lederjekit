import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Truck,
  RefreshCw,
  MessageCircle,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../types/store';
import { STORE_REVIEWS } from '../data/products';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';

interface HomepageSectionsProps {
  bestSellers: Product[];
  onSelectCollection: (filterType: 'Men' | 'Women' | 'Vintage' | 'New') => void;
  onShopPromo: () => void;
  onSelectProduct: (product: Product) => void;
}

export const HomepageSections: React.FC<HomepageSectionsProps> = ({
  bestSellers,
  onSelectCollection,
  onShopPromo,
  onSelectProduct,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const distance = dir === 'left' ? -340 : 340;
    carouselRef.current.scrollBy({ left: distance, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setNewsletterStatus({
        type: 'error',
        message: 'Please enter a valid email address to receive private collection invitations.',
      });
      return;
    }
    const existing = JSON.parse(localStorage.getItem('valmont_newsletter_subs') || '[]');
    if (!existing.includes(trimmed.toLowerCase())) {
      localStorage.setItem(
        'valmont_newsletter_subs',
        JSON.stringify([...existing, trimmed.toLowerCase()])
      );
    }
    setNewsletterEmail('');
    setNewsletterStatus({
      type: 'success',
      message: 'Welcome to the Valmont Atelier List. Our concierge will share early lookbooks with you.',
    });
  };

  const collections = [
    {
      key: 'Men' as const,
      title: "Men's Collection",
      subtitle: 'Biker, Racer & Aviator Silhouettes',
      image: bestSellers[0]?.image,
    },
    {
      key: 'Women' as const,
      title: "Women's Collection",
      subtitle: 'Sculpted Nappa & Belted Couture',
      image: bestSellers[2]?.image || bestSellers[0]?.image,
    },
    {
      key: 'Vintage' as const,
      title: 'Vintage Collection',
      subtitle: 'Hand-Burnished 1960s Patina Hides',
      image: bestSellers[3]?.image || bestSellers[0]?.image,
    },
    {
      key: 'New' as const,
      title: 'New Arrivals',
      subtitle: 'Autumn / Winter Limited Editions',
      image: bestSellers[1]?.image || bestSellers[0]?.image,
    },
  ];

  return (
    <div className="space-y-20 py-14">
      {/* 1. Featured Collections */}
      <section className="max-w-[1440px] mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-8 gap-2">
          <div>
            <p className="text-[11px] sm:text-xs tracking-[0.2em] text-[#58161E] font-semibold uppercase mb-1">
              Curated Capsules
            </p>
            <h2 className="font-serif-display text-2xl sm:text-4xl font-semibold text-[#1A1615]">
              Featured Collections
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6E625C] max-w-md">
            Explore distinct expressions of full-grain leatherwork tailored for longevity.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {collections.map((col) => (
            <button
              key={col.key}
              type="button"
              onClick={() => onSelectCollection(col.key)}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-[#241614] text-left cursor-pointer"
            >
              <img
                src={col.image}
                alt={col.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 text-white">
                <p className="text-[9px] sm:text-[11px] text-[#E5C39C] tracking-wider uppercase mb-0.5 sm:mb-1 line-clamp-1">
                  {col.subtitle}
                </p>
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-serif-display text-base sm:text-2xl font-semibold leading-tight">
                    {col.title}
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Promotional Banner */}
      <section className="bg-gradient-to-r from-[#3B0D14] via-[#4D131C] to-[#26080C] text-[#FAF8F5] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-[#58161E]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] sm:text-xs tracking-[0.24em] text-[#E5C39C] uppercase mb-3">
            VALMONT HERITAGE STANDARD
          </p>
          <h2
            style={{ textWrap: 'balance' }}
            className="font-serif-display text-2xl sm:text-5xl font-semibold tracking-wide text-white mb-4"
          >
            TIMELESS STYLE. LASTING QUALITY.
          </h2>
          <p className="text-xs sm:text-base text-[#E8DFD9] max-w-2xl mx-auto leading-relaxed mb-7 sm:mb-8">
            Crafted from ethically sourced full-grain hides tanned in small wooden drums, reinforced
            with bonded nylon stitching and solid metal zippers built to outlast fleeting trends.
          </p>
          <button
            type="button"
            onClick={onShopPromo}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#FAF8F5] text-[#2B080E] text-xs font-semibold tracking-[0.16em] rounded-xs hover:bg-[#E5C39C] transition-colors cursor-pointer"
          >
            EXPLORE COLLECTION
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3. Best Sellers Horizontal Carousel */}
      <section className="max-w-[1440px] mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-5 sm:mb-7">
          <div>
            <p className="text-[11px] sm:text-xs tracking-[0.2em] text-[#58161E] font-semibold uppercase mb-1">
              Most Requested
            </p>
            <h2 className="font-serif-display text-2xl sm:text-4xl font-semibold text-[#1A1615]">
              Atelier Best Sellers
            </h2>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => scrollCarousel('left')}
              aria-label="Scroll best sellers left"
              className="p-2 sm:p-2.5 border border-[#D8CFC5] bg-white text-[#1A1615] hover:border-[#3B0D14] rounded-xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel('right')}
              aria-label="Scroll best sellers right"
              className="p-2 sm:p-2.5 border border-[#D8CFC5] bg-white text-[#1A1615] hover:border-[#3B0D14] rounded-xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
        >
          {bestSellers.map((item) => {
            const defaultSize = item.sizes.includes('M') ? 'M' : item.sizes[0];
            const whatsappUrl = buildWhatsAppBookingUrl(
              item,
              defaultSize,
              item.colors[0]?.name || 'Obsidian Black',
              1
            );
            return (
              <div
                key={item.id}
                onClick={() => onSelectProduct(item)}
                className="w-[46vw] min-w-[162px] sm:w-[270px] sm:min-w-[270px] max-w-[275px] snap-start bg-white border border-[#E6DFD6] rounded-sm overflow-hidden flex flex-col justify-between shrink-0 cursor-pointer group hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="aspect-[3/4] bg-[#F5F1EB] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      style={item.imageVisualFilter ? { filter: item.imageVisualFilter } : undefined}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2.5 sm:p-4 pb-1.5 sm:pb-2">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#6E625C] mb-1 tabular-nums">
                      <span>{item.gender}</span>
                      <span className="inline-flex items-center gap-0.5 font-medium text-[#1A1615]">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#B8860B] text-[#B8860B]" />
                        {item.rating.toFixed(1)}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-[#1A1615] truncate group-hover:text-[#58161E]">
                      {item.name}
                    </h3>
                  </div>
                </div>

                <div className="px-2.5 sm:px-4 pb-2.5 sm:pb-4 pt-1.5 sm:pt-2 border-t border-[#F2ECE4] mt-1 flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(item);
                    }}
                    className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold text-[#3B0D14] hover:underline whitespace-nowrap cursor-pointer"
                  >
                    <span>View Details</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#1E6B43] text-white text-[10px] sm:text-xs font-semibold rounded-xs hover:bg-[#175636] whitespace-nowrap"
                  >
                    <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Book Now
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Brand Benefits */}
      <section className="bg-white border-y border-[#E6DFD6] py-14">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-2">
            <Award className="w-6 h-6 text-[#58161E]" />
            <h3 className="text-sm font-semibold text-[#1A1615]">Single-Bench Craftsmanship</h3>
            <p className="text-xs text-[#6E625C] leading-relaxed">
              Cut and stitched individually by master leatherworkers rather than mass assembly lines.
            </p>
          </div>
          <div className="space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#58161E]" />
            <h3 className="text-sm font-semibold text-[#1A1615]">100% Full-Grain Hides</h3>
            <p className="text-xs text-[#6E625C] leading-relaxed">
              Top-tier aniline calfskin, plonge lambskin, and water-repellent goat suede—never bonded leather.
            </p>
          </div>
          <div className="space-y-2">
            <MessageCircle className="w-6 h-6 text-[#58161E]" />
            <h3 className="text-sm font-semibold text-[#1A1615]">Direct WhatsApp Booking</h3>
            <p className="text-xs text-[#6E625C] leading-relaxed">
              Instant personal sizing guidance and direct booking confirmation with our leather concierge.
            </p>
          </div>
          <div className="space-y-2">
            <Truck className="w-6 h-6 text-[#58161E]" />
            <h3 className="text-sm font-semibold text-[#1A1615]">Insured Global Delivery</h3>
            <p className="text-xs text-[#6E625C] leading-relaxed">
              Tracked courier delivery worldwide, shipped on a contoured hanger inside a breathable garment bag.
            </p>
          </div>
          <div className="space-y-2">
            <RefreshCw className="w-6 h-6 text-[#58161E]" />
            <h3 className="text-sm font-semibold text-[#1A1615]">30-Day Easy Exchange</h3>
            <p className="text-xs text-[#6E625C] leading-relaxed">
              Complimentary size exchanges within 30 days on unworn garments with original tags.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Customer Reviews */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs tracking-[0.2em] text-[#58161E] font-semibold uppercase mb-1">
            Client Patronage
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1A1615]">
            Worn Across Capitals Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STORE_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#E6DFD6] p-6 rounded-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5 text-[#B8860B]">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8C7F78]">{rev.date}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#1A1615] mb-2">{rev.title}</h3>
                <p className="text-xs text-[#4A403B] leading-relaxed mb-4">{rev.comment}</p>
              </div>

              <div className="pt-3 border-t border-[#F2ECE4] text-xs">
                <p className="font-semibold text-[#1A1615]">{rev.author}</p>
                <p className="text-[#6E625C]">{rev.role}</p>
                {rev.verifiedPurchase && (
                  <p className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-medium mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Newsletter Subscription */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#231917] text-[#FAF8F5] rounded-sm p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <p className="text-xs tracking-[0.2em] text-[#E5C39C] uppercase mb-2">
              Private Archive Access
            </p>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-white mb-2">
              Join the Valmont Atelier Society
            </h2>
            <p className="text-xs sm:text-sm text-[#D6C7BF]">
              Receive early invitations to numbered calfskin releases, bespoke fitting events, and seasonal leather care guides.
            </p>
          </div>

          <div className="w-full max-w-md">
            <form onSubmit={handleNewsletterSubmit} noValidate className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address for newsletter"
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-[#B8A59C] px-4 py-3 text-xs sm:text-sm rounded-xs focus:outline-none focus:border-[#E5C39C]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#E5C39C] text-[#1A1615] text-xs font-bold tracking-[0.14em] uppercase rounded-xs hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            {newsletterStatus && (
              <p
                role="status"
                className={`text-xs mt-2.5 ${
                  newsletterStatus.type === 'success' ? 'text-[#E5C39C]' : 'text-rose-300'
                }`}
              >
                {newsletterStatus.message}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
