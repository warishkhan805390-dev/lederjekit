/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS, ALL_CATEGORIES } from './data/products';
import {
  CustomerUser,
  JacketCategory,
  NavSection,
  OrderRecord,
  Product,
} from './types/store';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FilterToolbar, FilterState } from './components/FilterToolbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { QuickViewModal } from './components/QuickViewModal';
import { WishlistDrawer, AccountModal } from './components/WishlistAndAccount';
import { HomepageSections } from './components/HomepageSections';
import { Footer, FloatingConciergeButtons } from './components/FooterAndFloatingActions';
import { CheckCircle2, RotateCcw } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  category: 'All',
  gender: 'All',
  color: 'All',
  size: 'All',
  maxPrice: 9999,
  onlyDiscounted: false,
  onlyInStock: false,
  sortBy: 'featured',
};

const WISHLIST_STORAGE_KEY = 'valmont_wishlist_v1';
const RECENT_STORAGE_KEY = 'valmont_recent_v1';
const SESSION_USER_KEY = 'valmont_active_user_v1';
const GUEST_ORDERS_KEY = 'valmont_guest_orders_v1';

export default function App() {
  const catalogRef = useRef<HTMLElement>(null);

  // Navigation & Active Product View (SEO-friendly URL sync)
  const [activeNav, setActiveNav] = useState<NavSection>('Home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('product');
    return slug ? PRODUCTS.find((p) => p.slug === slug) || null : null;
  });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Persistent Wishlist & Recently Viewed
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['vl-001', 'vl-005'];
    } catch {
      return [];
    }
  });
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent Customer Account
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [guestOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(GUEST_ORDERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [accountOpen, setAccountOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentIds));
  }, [recentIds]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(SESSION_USER_KEY);
    }
  }, [currentUser]);

  // Dynamic SEO Title & URL parameter sync
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedProduct) {
      document.title = `${selectedProduct.name} | VALMONT & CO. Luxury Leather`;
      url.searchParams.set('product', selectedProduct.slug);
    } else {
      document.title = 'VALMONT & CO. — Luxury Leather Outerwear & Heritage Jackets';
      url.searchParams.delete('product');
    }
    window.history.replaceState({}, '', url.toString());
  }, [selectedProduct]);

  const scrollToCatalog = () => {
    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  // Top Bar Navigation Handler
  const handleSelectNav = (nav: NavSection) => {
    setActiveNav(nav);
    setSelectedProduct(null);
    setSearchQuery('');

    switch (nav) {
      case 'Home':
        setFilters(INITIAL_FILTERS);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'Men':
        setFilters({ ...INITIAL_FILTERS, gender: 'Men' });
        scrollToCatalog();
        break;
      case 'Women':
        setFilters({ ...INITIAL_FILTERS, gender: 'Women' });
        scrollToCatalog();
        break;
      case 'New Arrivals':
        setFilters({ ...INITIAL_FILTERS, sortBy: 'newest' });
        scrollToCatalog();
        break;
      case 'Best Sellers':
        setFilters({ ...INITIAL_FILTERS, sortBy: 'rating' });
        scrollToCatalog();
        break;
      case 'Leather Jackets':
        setFilters(INITIAL_FILTERS);
        scrollToCatalog();
        break;
      case 'Sale':
        setFilters({ ...INITIAL_FILTERS, onlyDiscounted: true });
        scrollToCatalog();
        break;
    }
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setRecentIds((prev) => [product.id, ...prev.filter((id) => id !== product.id)].slice(0, 8));
  };

  // Search + Filter + Sort Computation
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = PRODUCTS.filter((p) => {
      if (filters.category !== 'All' && p.category !== filters.category) return false;
      if (filters.gender !== 'All' && p.gender !== filters.gender && p.gender !== 'Unisex') {
        return false;
      }
      if (filters.color !== 'All' && !p.colors.some((c) => c.name === filters.color)) {
        return false;
      }
      if (filters.size !== 'All' && !p.sizes.includes(filters.size)) return false;
      if (filters.onlyDiscounted && !p.discountPercent) return false;

      if (q) {
        const searchableBlob = [
          p.name,
          p.category,
          p.gender,
          p.shortDescription,
          p.material,
          ...p.colors.map((c) => c.name),
        ]
          .join(' ')
          .toLowerCase();

        if (!searchableBlob.includes(q)) {
          return false;
        }
      }

      return true;
    });

    const sorted = [...list];
    switch (filters.sortBy) {
      case 'newest':
        sorted.sort((a, b) => Number(b.isNewArrival) - Number(a.isNewArrival));
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'featured':
      default:
        sorted.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
        break;
    }

    return sorted;
  }, [filters, searchQuery]);

  // Wishlist Toggle
  const handleToggleWishlist = (productId: string) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Removed ${prod?.name || 'item'} from Wishlist`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved ${prod?.name || 'item'} to Wishlist`);
        return [...prev, productId];
      }
    });
  };

  const bestSellerProducts = useMemo(() => PRODUCTS.filter((p) => p.isBestSeller), []);
  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return PRODUCTS.filter(
      (p) =>
        p.id !== selectedProduct.id &&
        (p.category === selectedProduct.category || p.gender === selectedProduct.gender)
    );
  }, [selectedProduct]);

  const recentlyViewedProducts = useMemo(() => {
    return recentIds
      .filter((id) => id !== selectedProduct?.id)
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [recentIds, selectedProduct]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1615]">
      {/* Slim Top Atelier Announcement Bar */}
      <div className="bg-[#23070B] text-[#E8DFD9] text-[11px] tracking-wider py-2 px-4 text-center border-b border-white/10">
        <span>HANDCRAFTED FULL-GRAIN LEATHER OUTERWEAR</span>
        <span className="mx-2 text-[#E5C39C]">·</span>
        <span>INSTANT WHATSAPP BOOKING &amp; BESPOKE SIZING ASSISTANCE</span>
      </div>

      {/* Sticky Header */}
      <Header
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (selectedProduct) setSelectedProduct(null);
        }}
        cartCount={0}
        wishlistCount={wishlistIds.length}
        isLoggedIn={Boolean(currentUser)}
        userName={currentUser?.fullName}
        onOpenCart={() => {}}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        onGoHome={() => handleSelectNav('Home')}
      />

      {/* Main Content */}
      <main className="flex-1">
        {selectedProduct ? (
          <motion.div
            key={selectedProduct.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ProductDetailPage
              product={selectedProduct}
              relatedProducts={relatedProducts}
              recentlyViewed={recentlyViewedProducts}
              isWishlisted={wishlistIds.includes(selectedProduct.id)}
              wishlistIds={wishlistIds}
              onBack={() => setSelectedProduct(null)}
              onToggleWishlist={handleToggleWishlist}
              onSelectProduct={handleOpenProduct}
              onQuickView={setQuickViewProduct}
            />
          </motion.div>
        ) : (
          <>
            {/* Promotional Hero Banner */}
            <HeroBanner
              onShopCollection={scrollToCatalog}
              onExploreNewArrivals={() => handleSelectNav('New Arrivals')}
            />

            {/* Quick Category Selector Bar */}
            <section
              ref={catalogRef}
              aria-label="Leather Jacket Catalog"
              className="max-w-[1440px] mx-auto px-2.5 sm:px-6 lg:px-8 pt-7 sm:pt-10 pb-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 mb-4 sm:mb-5">
                <div>
                  <p className="text-[11px] sm:text-xs tracking-[0.2em] text-[#58161E] font-semibold uppercase mb-1">
                    {activeNav === 'Home' ? 'Complete Archive' : activeNav}
                  </p>
                  <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#1A1615]">
                    Handcrafted Leather Outerwear
                  </h2>
                </div>

                {/* Horizontal Scrollable Category Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-2xl">
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, category: 'All' })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-xs border whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      filters.category === 'All'
                        ? 'bg-[#3B0D14] text-white border-[#3B0D14]'
                        : 'bg-white text-[#4A403B] border-[#DED5CB] hover:border-[#3B0D14]'
                    }`}
                  >
                    All Styles ({PRODUCTS.length})
                  </button>
                  {ALL_CATEGORIES.slice(0, 7).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFilters({ ...filters, category: cat })}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xs border whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        filters.category === cat
                          ? 'bg-[#3B0D14] text-white border-[#3B0D14]'
                          : 'bg-white text-[#4A403B] border-[#DED5CB] hover:border-[#3B0D14]'
                      }`}
                    >
                      {cat.replace(' Leather Jackets', '').replace(' Jackets', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Functional Filtering & Sorting Toolbar */}
              <FilterToolbar
                filters={filters}
                onChangeFilters={setFilters}
                onResetAll={() => {
                  setFilters(INITIAL_FILTERS);
                  setSearchQuery('');
                  setActiveNav('Home');
                }}
                totalMatching={filteredProducts.length}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
              />

              {/* Strict 2-Column Mobile Grid -> 3 Tablet -> 4 Laptop -> 5 Wide Desktop */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-[#E6DFD6] rounded-sm py-16 px-6 text-center">
                  <h3 className="font-serif-display text-2xl font-semibold text-[#1A1615] mb-2">
                    No Matching Leather Silhouettes Found
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E625C] max-w-md mx-auto mb-6">
                    We couldn&rsquo;t find any jackets matching your current search or filter combination. Reset filters to view all 36 handcrafted styles.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFilters(INITIAL_FILTERS);
                      setSearchQuery('');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B0D14] text-white text-xs font-semibold tracking-wider rounded-xs hover:bg-[#58161E] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    RESET ALL FILTERS &amp; SEARCH
                  </button>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlistIds.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onQuickView={setQuickViewProduct}
                      onSelectProduct={handleOpenProduct}
                    />
                  ))}
                </motion.div>
              )}
            </section>

            {/* Additional Editorial Homepage Sections */}
            <HomepageSections
              bestSellers={bestSellerProducts}
              onSelectCollection={(col) => {
                if (col === 'Men') {
                  setFilters({ ...INITIAL_FILTERS, gender: 'Men' });
                } else if (col === 'Women') {
                  setFilters({ ...INITIAL_FILTERS, gender: 'Women' });
                } else if (col === 'Vintage') {
                  setFilters({ ...INITIAL_FILTERS, category: 'Vintage Leather Jackets' });
                } else {
                  setFilters({ ...INITIAL_FILTERS, sortBy: 'newest' });
                }
                scrollToCatalog();
              }}
              onShopPromo={scrollToCatalog}
              onSelectProduct={handleOpenProduct}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onFilterCategory={(cat) => {
          setSelectedProduct(null);
          setFilters({ ...INITIAL_FILTERS, category: cat as JacketCategory });
          scrollToCatalog();
        }}
      />

      {/* Left-Side Call Button & Right-Side WhatsApp Button */}
      <FloatingConciergeButtons />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={(p) => handleOpenProduct(p)}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistIds={wishlistIds}
        products={PRODUCTS}
        onRemoveWishlist={handleToggleWishlist}
        onMoveToCart={() => {}}
        onSelectProduct={handleOpenProduct}
      />

      {/* Customer Account Modal */}
      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        currentUser={currentUser}
        guestOrders={guestOrders}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Signed in as ${user.fullName}`);
        }}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Signed out of your Valmont account');
        }}
        onUpdateUser={setCurrentUser}
      />

      {/* Smooth Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.18 }}
            role="status"
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1A1615] text-white px-4 py-2.5 rounded-sm shadow-xl border border-white/15 flex items-center gap-2 text-xs font-medium whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4 text-[#E5C39C] shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
