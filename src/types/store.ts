export type GenderCategory = 'Men' | 'Women' | 'Unisex';

export type JacketCategory =
  | 'Black Biker Leather Jackets'
  | 'Classic Black Leather Jackets'
  | 'Brown Leather Jackets'
  | 'Vintage Leather Jackets'
  | 'Suede Jackets'
  | 'Bomber Leather Jackets'
  | 'Cafe Racer Jackets'
  | 'Distressed Leather Jackets'
  | 'Slim-Fit Leather Jackets'
  | 'Winter Leather Jackets'
  | "Women's Leather Jackets"
  | "Men's Leather Jackets"
  | 'Hooded Leather Jackets'
  | 'Designer Leather Jackets'
  | 'Plaid and Patterned Jackets';

export type SizeOption = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ColorVariant {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: JacketCategory;
  gender: GenderCategory;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  imageVisualFilter?: string;
  colors: ColorVariant[];
  sizes: SizeOption[];
  inStock: boolean;
  stockCount: number;
  isNewArrival: boolean;
  isBestSeller: boolean;
  shortDescription: string;
  description: string;
  material: string;
  lining: string;
  hardware: string;
  careInstructions: string;
  deliveryEstimate: string;
}

export interface CartItem {
  productId: string;
  size: SizeOption;
  color: string;
  quantity: number;
}

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'Confirmed' | 'In Atelier Inspection' | 'Shipped' | 'Delivered';
  items: {
    productId: string;
    name: string;
    image: string;
    size: SizeOption;
    color: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
  shippingAddress: Omit<SavedAddress, 'id' | 'label' | 'isDefault'> & { email: string };
}

export interface CustomerUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addresses: SavedAddress[];
  orders: OrderRecord[];
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

export type NavSection =
  | 'Home'
  | 'Men'
  | 'Women'
  | 'New Arrivals'
  | 'Best Sellers'
  | 'Leather Jackets'
  | 'Sale';
