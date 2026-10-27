import React, { useState } from 'react';
import { Heart, Eye, MessageCircle, Star, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types/store';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onSelectProduct,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Obsidian Black');
  const defaultSize = product.sizes.includes('M') ? 'M' : product.sizes[0];
  const whatsappHref = buildWhatsAppBookingUrl(product, defaultSize, selectedColor, 1);

  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="group bg-white border border-[#E8E2DA] rounded-sm flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer overflow-hidden min-w-0"
    >
      {/* Product Image Container (Large 3:4 Catalog Proportion) */}
      <div>
        <div className="relative aspect-[3/4] w-full bg-[#F5F1EB] overflow-hidden">
          {!imgFailed ? (
            <img
              src={product.image}
              alt={`${product.name} — ${product.category}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              style={product.imageVisualFilter ? { filter: product.imageVisualFilter } : undefined}
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#EFEAE2] to-[#E3DCD2] p-3 text-center">
              <ShoppingBag className="w-7 h-7 text-[#58161E]/60 mb-1.5" />
              <span className="text-[11px] font-medium text-[#3B2318] line-clamp-2">{product.name}</span>
            </div>
          )}

          {/* Top Left Single Subtle Editorial Tag */}
          {product.isNewArrival ? (
            <span className="absolute top-2 left-2 bg-[#1A1615] text-white text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 tracking-widest">
              NEW
            </span>
          ) : product.isBestSeller ? (
            <span className="absolute top-2 left-2 bg-[#4A1219] text-white text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 tracking-wider">
              SIGNATURE
            </span>
          ) : null}

          {/* Top Right Action Icons: Wishlist & Quick View */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors duration-150 shadow-xs cursor-pointer ${
                isWishlisted
                  ? 'bg-[#4A1219] text-white'
                  : 'bg-white/90 text-[#1A1615] hover:bg-[#4A1219] hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label={`Quick view ${product.name}`}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 text-[#1A1615] hover:bg-[#1A1615] hover:text-white flex items-center justify-center transition-colors duration-150 shadow-xs opacity-100 lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-2.5 sm:p-3.5 pb-1.5 sm:pb-2">
          {/* Clean unboxed category + rating row */}
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#6E625C] mb-1">
            <span className="truncate">
              {product.category.replace(' Leather Jackets', '').replace(' Jackets', '')}
            </span>
            <span className="inline-flex items-center gap-0.5 shrink-0 tabular-nums text-[#3B2318] font-medium">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#B8860B] text-[#B8860B]" />
              {product.rating.toFixed(1)}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-sans text-[12px] sm:text-[14px] font-semibold text-[#1A1615] leading-snug line-clamp-1 group-hover:text-[#58161E] transition-colors">
            {product.name}
          </h3>

          {/* Color Swatches & Size Availability */}
          <div className="mt-1.5 sm:mt-2 flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 sm:gap-1.5" onClick={(e) => e.stopPropagation()}>
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  aria-label={`Select color ${c.name}`}
                  onClick={() => setSelectedColor(c.name)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition-transform cursor-pointer ${
                    selectedColor === c.name
                      ? 'ring-1 ring-offset-1 ring-[#4A1219] scale-110 border-white'
                      : 'border-black/20 hover:scale-110'
                  }`}
                />
              ))}
            </div>

            <span className="text-[10px] sm:text-[11px] text-[#7A6F69] truncate">
              {product.sizes[0]}–{product.sizes[product.sizes.length - 1]}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Responsive 2-Card Mobile Safe Layout (View Details + Book Now WhatsApp) */}
      <div className="px-2 sm:px-3.5 pb-2.5 sm:pb-3.5 pt-1.5 sm:pt-2 flex items-center justify-between gap-1.5 border-t border-[#F2ECE4] mt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct(product);
          }}
          className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold text-[#3B0D14] hover:text-[#1A1615] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3 h-3 hidden min-[375px]:inline" />
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Book ${product.name} on WhatsApp`}
          className="inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-semibold rounded-xs bg-[#1E6B43] text-white hover:bg-[#175636] transition-colors duration-150 whitespace-nowrap shrink-0 shadow-2xs"
        >
          <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span>Book Now</span>
        </a>
      </div>
    </article>
  );
};
