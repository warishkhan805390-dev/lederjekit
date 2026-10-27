import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { HERO_CAMPAIGN_IMAGE } from '../data/products';

interface HeroBannerProps {
  onShopCollection: () => void;
  onExploreNewArrivals: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopCollection,
  onExploreNewArrivals,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      aria-label="The Leather Collection Promotional Campaign"
      className="w-full bg-[#3A0E15] border-b border-[#2A090E]"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Side: Fashion Campaign Photography */}
        <div className="lg:col-span-7 relative min-h-[240px] sm:min-h-[360px] lg:min-h-[460px] bg-[#241614] overflow-hidden">
          {!imgError ? (
            <img
              src={HERO_CAMPAIGN_IMAGE}
              alt="Three fashion models wearing tailored black biker, deep burgundy cafe racer, and cognac brown full-grain leather jackets in studio lighting"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center lg:h-full transition-transform duration-700 hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2B1216] via-[#3E161C] to-[#1A1312] p-8 text-center">
              <p className="font-serif-display text-2xl text-[#E8DFD9] tracking-widest">
                VALMONT &amp; CO. AUTELIER
              </p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-[#3A0E15]/40 pointer-events-none hidden lg:block" />
        </div>

        {/* Right Side: Dark Burgundy Editorial Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#47111A] via-[#3B0D14] to-[#2B080E] text-[#FAF8F5] px-4 sm:px-10 lg:px-12 py-7 sm:py-12 lg:py-14 flex flex-col justify-center">
          <p className="text-[10px] sm:text-xs tracking-[0.2em] text-[#E5C39C] font-medium mb-2.5 sm:mb-3">
            ITALIAN FULL-GRAIN ATELIER · AUTUMN / WINTER
          </p>

          <h1
            style={{ textWrap: 'balance' }}
            className="font-serif-display text-2xl sm:text-4xl xl:text-[44px] font-semibold leading-[1.12] tracking-[0.04em] text-white mb-3 sm:mb-4"
          >
            THE LEATHER COLLECTION
          </h1>

          <p className="text-xs sm:text-[15px] leading-relaxed text-[#E8DFD9] mb-3 sm:mb-4 max-w-md">
            Architectural silhouettes crafted from hand-selected Tuscan calfskin,
            butter-soft nappa lambskin, and weather-resistant velour suede.
          </p>

          <p className="text-[11px] sm:text-[13px] leading-relaxed text-[#C9B8B0] mb-5 sm:mb-7 max-w-md">
            Every jacket is cut one hide at a time for enduring comfort, supple mobility,
            and a rich natural patina that deepens over decades of wear.
          </p>

          <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onShopCollection}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-[#FAF8F5] text-[#2B080E] text-xs font-semibold tracking-[0.14em] rounded-xs hover:bg-[#E5C39C] transition-colors duration-150 cursor-pointer whitespace-nowrap"
            >
              SHOP COLLECTION
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onExploreNewArrivals}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 border border-[#E8DFD9]/35 text-[#FAF8F5] text-xs font-medium tracking-[0.12em] rounded-xs hover:border-white hover:bg-white/10 transition-colors duration-150 cursor-pointer whitespace-nowrap"
            >
              EXPLORE NEW ARRIVALS
            </button>
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-white/10 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-[12px] text-[#D8C7BF]">
            <span>100% Full-Grain Hide</span>
            <span aria-hidden="true">·</span>
            <span>YKK Excella Hardware</span>
            <span aria-hidden="true">·</span>
            <span>Global Express Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
};
