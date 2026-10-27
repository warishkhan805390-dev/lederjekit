import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  Heart,
  MessageCircle,
  Phone,
  Truck,
  ShieldCheck,
  RefreshCw,
  Ruler,
  ZoomIn,
  Check,
  X,
} from 'lucide-react';
import { Product, SizeOption } from '../types/store';
import { STORE_REVIEWS } from '../data/products';
import { ProductCard } from './ProductCard';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';

interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Product[];
  recentlyViewed: Product[];
  isWishlisted: boolean;
  wishlistIds: string[];
  onBack: () => void;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  relatedProducts,
  recentlyViewed,
  isWishlisted,
  wishlistIds,
  onBack,
  onToggleWishlist,
  onSelectProduct,
  onQuickView,
}) => {
  const [activeImage, setActiveImage] = useState(product.gallery[0] || product.image);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [selectedSize, setSelectedSize] = useState<SizeOption>(
    product.sizes.includes('M') ? 'M' : product.sizes[0] || 'M'
  );
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    setActiveImage(product.gallery[0] || product.image);
    setSelectedSize(product.sizes.includes('M') ? 'M' : product.sizes[0] || 'M');
    setSelectedColor(product.colors[0]?.name || '');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const whatsappBookingHref = buildWhatsAppBookingUrl(
    product,
    selectedSize,
    selectedColor,
    quantity
  );
  const storePhone = import.meta.env.VITE_STORE_PHONE || '+18005550194';

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#3B0D14] hover:text-[#1A1615] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO COLLECTION
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#7A6F69]">
          <span>Home</span>
          <span>/</span>
          <span>{product.gender}</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-[#1A1615] font-medium">{product.name}</span>
        </div>
      </div>

      {/* Main PDP Split: Sticky Gallery Left + Contiguous Booking Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Product Gallery with Interactive Zoom */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:w-20 shrink-0">
            {product.gallery.map((imgUrl, idx) => (
              <button
                key={`${imgUrl}-${idx}`}
                type="button"
                onClick={() => setActiveImage(imgUrl)}
                className={`w-16 sm:w-20 aspect-[3/4] rounded-xs overflow-hidden border-2 transition-colors shrink-0 cursor-pointer bg-[#F5F1EB] ${
                  activeImage === imgUrl ? 'border-[#4A1219]' : 'border-transparent hover:border-[#C5B9AE]'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${product.name} view ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Primary Zoomable Image */}
          <div
            onClick={() => setZoomActive(!zoomActive)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomActive(false)}
            className={`relative flex-1 aspect-[3/4] bg-[#F5F1EB] border border-[#E6DFD6] rounded-sm overflow-hidden ${
              zoomActive ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
          >
            <img
              src={activeImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              style={{
                ...(product.imageVisualFilter && activeImage === product.image
                  ? { filter: product.imageVisualFilter }
                  : {}),
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: zoomActive ? 'scale(1.85)' : 'scale(1)',
              }}
              className="w-full h-full object-cover transition-transform duration-150"
            />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-3 py-1.5 text-[11px] font-medium text-[#1A1615] rounded-xs pointer-events-none shadow-xs">
              <ZoomIn className="w-3.5 h-3.5" />
              {zoomActive ? 'Click to reset zoom' : 'Click & hover to inspect grain'}
            </span>
          </div>
        </div>

        {/* Right: Contiguous Inquiry & WhatsApp Booking Module */}
        <div className="lg:col-span-5 bg-white border border-[#E6DFD6] rounded-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs text-[#6E625C] mb-2">
            <span>{product.gender}&rsquo;s Outerwear</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>

          <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#1A1615] leading-tight mb-3">
            {product.name}
          </h1>

          {/* Rating & Availability */}
          <div className="flex flex-wrap items-center gap-4 pb-4 mb-5 border-b border-[#EFEAE2] text-xs">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-[#B8860B]">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-3.5 h-3.5 ${
                      idx < Math.round(product.rating) ? 'fill-current' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-[#1A1615] tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-[#7A6F69]">({product.reviewCount} verified reviews)</span>
            </div>

            <span className="text-[#D8CFC5]">|</span>

            <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
              <Check className="w-3.5 h-3.5" />
              Available for Direct Booking
            </span>
          </div>

          <p className="text-sm text-[#4A403B] leading-relaxed mb-6">{product.description}</p>

          {/* Color Selector */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#1A1615]">Leather Finish:</span>
              <span className="text-[#58161E] font-medium">{selectedColor}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xs border text-xs font-medium transition-colors cursor-pointer ${
                    selectedColor === c.name
                      ? 'border-[#4A1219] bg-[#FAF6F4] text-[#1A1615]'
                      : 'border-[#DED5CB] bg-white text-[#6E625C] hover:border-[#1A1615]'
                  }`}
                >
                  <span
                    style={{ backgroundColor: c.hex }}
                    className="w-4 h-4 rounded-full border border-black/20"
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector + Size Guide Modal Trigger */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#1A1615]">Select Size:</span>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="inline-flex items-center gap-1 text-[#58161E] hover:underline font-medium cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as SizeOption[]).map((sz) => {
                const available = product.sizes.includes(sz);
                const selected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    disabled={!available}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2.5 text-xs font-semibold rounded-xs border transition-colors cursor-pointer ${
                      !available
                        ? 'bg-stone-100 text-stone-400 border-stone-200 line-through cursor-not-allowed'
                        : selected
                        ? 'bg-[#3B0D14] text-white border-[#3B0D14]'
                        : 'bg-white text-[#1A1615] border-[#D8CFC5] hover:border-[#3B0D14]'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <span className="block text-xs font-semibold text-[#1A1615] mb-2">Quantity</span>
            <div className="inline-flex items-center border border-[#D8CFC5] rounded-xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3.5 py-2 text-sm font-semibold text-[#1A1615] hover:bg-[#FAF8F5] cursor-pointer"
              >
                -
              </button>
              <span className="px-4 py-2 text-sm font-semibold tabular-nums border-x border-[#D8CFC5]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="px-3.5 py-2 text-sm font-semibold text-[#1A1615] hover:bg-[#FAF8F5] cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Primary Actions: Book Now on WhatsApp, Wishlist, Call Stylist */}
          <div className="space-y-3 mb-6">
            <div className="flex gap-2.5">
              <a
                href={whatsappBookingHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 text-xs font-semibold tracking-[0.14em] rounded-xs bg-[#1E6B43] text-white hover:bg-[#175636] transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                BOOK NOW ON WHATSAPP
              </a>

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label="Save to Wishlist"
                className={`px-4 py-3.5 rounded-xs border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-[#4A1219] text-white border-[#4A1219]'
                    : 'border-[#D8CFC5] text-[#1A1615] hover:border-[#4A1219]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <a
              href={`tel:${storePhone}`}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 text-xs font-semibold tracking-[0.14em] rounded-xs border bg-[#3B0D14] text-white border-[#3B0D14] hover:bg-[#58161E] transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              CALL STYLIST FOR DIRECT ORDER
            </a>
          </div>

          {/* Craftsmanship & Material Specifications */}
          <div className="border-t border-[#EFEAE2] pt-5 space-y-2.5 text-xs text-[#4A403B]">
            <div>
              <span className="font-semibold text-[#1A1615]">Outer Leather: </span>
              {product.material}
            </div>
            <div>
              <span className="font-semibold text-[#1A1615]">Interior Lining: </span>
              {product.lining}
            </div>
            <div>
              <span className="font-semibold text-[#1A1615]">Hardware: </span>
              {product.hardware}
            </div>
            <div>
              <span className="font-semibold text-[#1A1615]">Leather Care: </span>
              {product.careInstructions}
            </div>
          </div>

          {/* Delivery & Return Promises */}
          <div className="mt-6 pt-5 border-t border-[#EFEAE2] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-[#58161E] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1A1615]">Estimated Delivery</p>
                <p className="text-[#6E625C]">{product.deliveryEstimate}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <RefreshCw className="w-4 h-4 text-[#58161E] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1A1615]">30-Day Exchange</p>
                <p className="text-[#6E625C]">Unworn with tags attached</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#58161E] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1A1615]">Lifetime Seam Care</p>
                <p className="text-[#6E625C]">Atelier hardware warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-16 pt-12 border-t border-[#E6DFD6]">
        <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#1A1615] mb-6">
          Verified Client Impressions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STORE_REVIEWS.slice(0, 2).map((rev) => (
            <div key={rev.id} className="bg-white border border-[#E6DFD6] p-6 rounded-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-[#B8860B]">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-[#7A6F69]">{rev.date}</span>
              </div>
              <h3 className="text-sm font-semibold text-[#1A1615] mb-2">{rev.title}</h3>
              <p className="text-xs sm:text-sm text-[#4A403B] leading-relaxed mb-4">{rev.comment}</p>
              <div className="text-xs text-[#6E625C]">
                <span className="font-semibold text-[#1A1615]">{rev.author}</span> · {rev.role}
                {rev.verifiedPurchase && (
                  <span className="ml-2 text-emerald-800 font-medium">· Verified Purchase</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-[#E6DFD6]">
          <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#1A1615] mb-5 sm:mb-6">
            You May Also Appreciate
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-5">
            {relatedProducts.slice(0, 5).map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                isWishlisted={wishlistIds.includes(rel.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <section className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-[#E6DFD6]">
          <h2 className="font-serif-display text-xl sm:text-2xl font-semibold text-[#1A1615] mb-5 sm:mb-6">
            Recently Viewed Silhouettes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-5">
            {recentlyViewed.slice(0, 5).map((rv) => (
              <ProductCard
                key={rv.id}
                product={rv}
                isWishlisted={wishlistIds.includes(rv.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E6DFD6] rounded-sm max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EFEAE2]">
              <h3 className="font-serif-display text-2xl font-semibold text-[#1A1615]">
                International Leather Outerwear Sizing
              </h3>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className="p-1 text-[#6E625C] hover:text-[#1A1615] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#6E625C] mb-4">
              Measurements reflect body chest circumference in inches and centimeters. For layering heavy knitwear, select one size up.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse tabular-nums">
                <thead>
                  <tr className="bg-[#FAF8F5] border-y border-[#E6DFD6] text-[#1A1615]">
                    <th className="py-2.5 px-3 font-semibold">Size</th>
                    <th className="py-2.5 px-3 font-semibold">Chest (in)</th>
                    <th className="py-2.5 px-3 font-semibold">Chest (cm)</th>
                    <th className="py-2.5 px-3 font-semibold">Sleeve (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEAE2] text-[#4A403B]">
                  <tr><td className="py-2 px-3 font-semibold">XS</td><td className="py-2 px-3">34–36</td><td className="py-2 px-3">86–91</td><td className="py-2 px-3">32.0</td></tr>
                  <tr><td className="py-2 px-3 font-semibold">S</td><td className="py-2 px-3">36–38</td><td className="py-2 px-3">91–97</td><td className="py-2 px-3">33.0</td></tr>
                  <tr><td className="py-2 px-3 font-semibold">M</td><td className="py-2 px-3">38–40</td><td className="py-2 px-3">97–102</td><td className="py-2 px-3">34.0</td></tr>
                  <tr><td className="py-2 px-3 font-semibold">L</td><td className="py-2 px-3">41–43</td><td className="py-2 px-3">104–109</td><td className="py-2 px-3">35.0</td></tr>
                  <tr><td className="py-2 px-3 font-semibold">XL</td><td className="py-2 px-3">44–46</td><td className="py-2 px-3">112–117</td><td className="py-2 px-3">35.5</td></tr>
                  <tr><td className="py-2 px-3 font-semibold">XXL</td><td className="py-2 px-3">47–49</td><td className="py-2 px-3">119–124</td><td className="py-2 px-3">36.0</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
