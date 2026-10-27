import { Product, SizeOption } from '../types/store';

export const getStoreWhatsAppNumber = (): string => {
  return import.meta.env.VITE_STORE_WHATSAPP || '18005550194';
};

export const buildWhatsAppBookingUrl = (
  product: Product,
  size?: SizeOption | null,
  color?: string,
  quantity: number = 1
): string => {
  const number = getStoreWhatsAppNumber();
  const details = [
    `Hello VALMONT & CO., I want to book this leather jacket:`,
    `• Style: ${product.name}`,
    `• Category: ${product.category}`,
    size ? `• Size: ${size}` : null,
    color ? `• Leather Finish: ${color}` : null,
    quantity > 1 ? `• Quantity: ${quantity}` : null,
    `Please share availability and booking confirmation details.`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${number}?text=${encodeURIComponent(details)}`;
};
