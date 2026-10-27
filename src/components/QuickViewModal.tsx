import React, { useState } from 'react';
import { X, Star, MessageCircle, ArrowRight } from 'lucide-react';
import { Product, SizeOption } from '../types/store';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetails: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onViewFullDetails,
}) => {
  const [selectedSize, setSelectedSize] = useState<SizeOption>(
    product?.sizes.includes('M') ? 'M' : product?.sizes[0] || 'M'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors[0]?.name || 'Obsidian Black'
  );

  if (!product) return null;

  const whatsappHref = buildWhatsAppBookingUrl(product, selectedSize, selectedColor, 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-white border border-[#E6DFD6] rounded-sm max-w-2xl w-full overflow-hidden shadow-2xl grid grid-cols-1 sm:grid-cols-12">
        <div className="sm:col-span-5 aspect-[3/4] bg-[#F5F1EB]">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            style={product.imageVisualFilter ? { filter: product.imageVisualFilter } : undefined}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="sm:col-span-7 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs text-[#6E625C]">{product.category}</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close quick view"
                className="p-1 text-[#6E625C] hover:text-[#1A1615] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-serif-display text-2xl font-semibold text-[#1A1615] mb-2">
              {product.name}
            </h3>

            <div className="flex items-center justify-between gap-3 mb-3 tabular-nums">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#58161E]">
                Bespoke Atelier Inquiry
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#3B2318]">
                <Star className="w-3.5 h-3.5 fill-[#B8860B] text-[#B8860B]" />
                {product.rating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>

            <p className="text-xs text-[#4A403B] leading-relaxed mb-4">
              {product.shortDescription}
            </p>

            {/* Color */}
            <div className="mb-4">
              <span className="block text-xs font-semibold text-[#1A1615] mb-1.5">
                Color: {selectedColor}
              </span>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full border cursor-pointer ${
                      selectedColor === c.name
                        ? 'ring-2 ring-offset-1 ring-[#4A1219] border-white'
                        : 'border-black/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-5">
              <span className="block text-xs font-semibold text-[#1A1615] mb-1.5">Size</span>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xs border cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#3B0D14] text-white border-[#3B0D14]'
                        : 'bg-white text-[#1A1615] border-[#D8CFC5]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-[#EFEAE2]">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-semibold tracking-wider rounded-xs bg-[#1E6B43] text-white hover:bg-[#175636] transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              BOOK NOW ON WHATSAPP
            </a>

            <button
              type="button"
              onClick={() => {
                onClose();
                onViewFullDetails(product);
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#3B0D14] hover:underline cursor-pointer"
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
