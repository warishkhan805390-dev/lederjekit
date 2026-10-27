import React, { useState } from 'react';
import { Phone, MessageCircle, X, CreditCard, ShieldCheck, Globe } from 'lucide-react';

type PolicyKey =
  | 'about'
  | 'contact'
  | 'faq'
  | 'shipping'
  | 'returns'
  | 'privacy'
  | 'terms';

const POLICY_CONTENT: Record<PolicyKey, { title: string; body: string[] }> = {
  about: {
    title: 'About Valmont & Co.',
    body: [
      'Founded on European outerwear tailoring traditions, Valmont & Co. crafts full-grain lambskin, steerhide, calfskin, and velour suede jackets designed to mature gracefully across decades.',
      'Every hide is selected for natural tensile strength and drum-dyed in small batches before being cut and stitched by single-bench leather artisans.',
    ],
  },
  contact: {
    title: 'Client Concierge & Sizing Desk',
    body: [
      'Telephone Concierge: +1 (800) 555-0194 — Available Monday through Saturday, 9:00 AM to 8:00 PM.',
      'WhatsApp Direct Stylist: Instant chest/shoulder sizing consultations and bespoke order assistance via the floating WhatsApp button on the bottom-right of your screen.',
      'Email: concierge@valmontleather.example',
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    body: [
      'How should a leather jacket fit initially? Full-grain leather should feel comfortably snug across the shoulders on day one; within 10–15 wears, natural body warmth molds the hide to your exact contours.',
      'Are your hides genuine full-grain? Yes—100% of our collection uses full-grain or top-selection velour suede, never corrected plastic-coated or faux blends.',
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    body: [
      'Orders above $350 qualify for Complimentary Insured Standard Courier (3–5 business days).',
      'DHL Express Priority Air (1–2 business days) is available at a flat $25 rate. Every jacket ships on a contoured hanger inside a breathable cotton garment cover.',
    ],
  },
  returns: {
    title: 'Return & Exchange Policy',
    body: [
      'We accept returns and complimentary size exchanges within 30 days of delivery, provided the jacket remains unworn, unaltered, and has all original atelier tags attached.',
      'Refunds are issued to the original payment method within 3–5 business days of warehouse inspection.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: [
      'We collect only the contact and delivery details required to fulfill your order and provide sizing support. Client records are never sold or shared with third-party advertisers.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    body: [
      'All prices are listed in USD. Promotional privilege codes apply to eligible full-price and seasonal archive styles and cannot be combined with multiple codes.',
    ],
  },
};

export const Footer: React.FC<{ onFilterCategory: (label: string) => void }> = ({
  onFilterCategory,
}) => {
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);

  return (
    <>
      <footer className="bg-[#1A1211] text-[#D8C7BF] border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <p className="font-serif-display text-2xl font-semibold tracking-[0.14em] text-white">
              VALMONT &amp; CO.
            </p>
            <p className="text-xs leading-relaxed text-[#B8A59C] max-w-sm">
              International luxury leather outerwear house. Handcrafted biker, cafe racer, aviator
              bomber, and Italian suede silhouettes built for permanence.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-[#E5C39C]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Instagram
              </a>
              <span>·</span>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Pinterest
              </a>
              <span>·</span>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Lookbook Film
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white mb-3">
              Signature Styles
            </h3>
            {[
              'Black Biker Leather Jackets',
              'Cafe Racer Jackets',
              'Bomber Leather Jackets',
              'Suede Jackets',
              'Vintage Leather Jackets',
              "Women's Leather Jackets",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterCategory(cat)}
                className="block text-xs text-[#B8A59C] hover:text-white transition-colors cursor-pointer text-left"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Client Care & Policies */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white mb-3">
              Client Care &amp; Legal
            </h3>
            {(
              [
                ['about', 'About Us'],
                ['contact', 'Contact Us'],
                ['faq', 'FAQ & Sizing Advice'],
                ['shipping', 'Shipping Policy'],
                ['returns', 'Return Policy'],
                ['privacy', 'Privacy Policy'],
                ['terms', 'Terms and Conditions'],
              ] as [PolicyKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActivePolicy(key)}
                className="block text-xs text-[#B8A59C] hover:text-white transition-colors cursor-pointer text-left"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Concierge & Payment Assurance */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white mb-3">
              Payment &amp; Trust
            </h3>
            <div className="flex flex-wrap gap-2 text-[11px] text-[#E8DFD9]">
              <span className="inline-flex items-center gap-1 border border-white/15 px-2 py-1 rounded-xs">
                <CreditCard className="w-3 h-3 text-[#E5C39C]" /> Visa / MC
              </span>
              <span className="inline-flex items-center gap-1 border border-white/15 px-2 py-1 rounded-xs">
                <ShieldCheck className="w-3 h-3 text-[#E5C39C]" /> Pay on Arrival
              </span>
              <span className="inline-flex items-center gap-1 border border-white/15 px-2 py-1 rounded-xs">
                <Globe className="w-3 h-3 text-[#E5C39C]" /> DHL Insured
              </span>
            </div>
            <p className="text-[11px] text-[#9E8C84] leading-relaxed pt-1">
              Direct Stylist Line: <br />
              <span className="text-white font-medium">+1 (800) 555-0194</span>
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 pb-20 sm:pb-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#9E8C84] text-center sm:text-left">
            <p>© {new Date().getFullYear()} VALMONT &amp; CO. ATELIER. All rights reserved.</p>
            <p>Full-Grain Heritage Outerwear · Crafted for Permanence</p>
          </div>
        </div>
      </footer>

      {/* Policy Information Modal */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="bg-white border border-[#E6DFD6] rounded-sm max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EFEAE2]">
              <h3 className="font-serif-display text-2xl font-semibold text-[#1A1615]">
                {POLICY_CONTENT[activePolicy].title}
              </h3>
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="p-1 text-[#6E625C] hover:text-[#1A1615] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-[#4A403B] leading-relaxed">
              {POLICY_CONTENT[activePolicy].body.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Floating Contact Buttons specifically requested by user:
 * - Left side: Premium Call Concierge icon button
 * - Right side: Premium WhatsApp Stylist button
 */
export const FloatingConciergeButtons: React.FC = () => {
  const phoneNumber = import.meta.env.VITE_STORE_PHONE || '+18005550194';
  const whatsappNumber = import.meta.env.VITE_STORE_WHATSAPP || '18005550194';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Valmont & Co. Concierge, I would like assistance choosing a leather jacket size and style.'
  )}`;

  return (
    <>
      {/* Left Side: Floating Call Button */}
      <a
        href={`tel:${phoneNumber}`}
        aria-label="Call Valmont & Co. Leather Concierge"
        className="fixed bottom-4 left-3.5 sm:bottom-5 sm:left-5 z-40 group flex items-center justify-center sm:justify-start gap-2.5 bg-[#3B0D14] text-white p-3 sm:pl-3.5 sm:pr-4 sm:py-3 rounded-full shadow-lg border border-[#E5C39C]/35 transition-transform duration-200 hover:-translate-y-1 hover:bg-[#58161E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B0D14]"
      >
        <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#E5C39C]/20 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
          <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5C39C]" />
        </span>
        <span className="text-xs font-semibold tracking-wider whitespace-nowrap hidden sm:inline">
          Call Stylist
        </span>
      </a>

      {/* Right Side: Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Valmont & Co."
        className="fixed bottom-4 right-3.5 sm:bottom-5 sm:right-5 z-40 group flex items-center justify-center sm:justify-start gap-2.5 bg-[#1E6B43] text-white p-3 sm:pl-3.5 sm:pr-4 sm:py-3 rounded-full shadow-lg border border-white/20 transition-transform duration-200 hover:-translate-y-1 hover:bg-[#175636] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6B43]"
      >
        <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
          <MessageCircle className="w-4 h-4 text-white fill-white/15" />
        </span>
        <span className="text-xs font-semibold tracking-wider whitespace-nowrap hidden sm:inline">
          WhatsApp Us
        </span>
      </a>
    </>
  );
};
