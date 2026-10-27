import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
} from 'lucide-react';
import { NavSection } from '../types/store';

interface HeaderProps {
  activeNav: NavSection;
  onSelectNav: (nav: NavSection) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  wishlistCount: number;
  isLoggedIn: boolean;
  userName?: string;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onGoHome: () => void;
}

const NAV_LINKS: NavSection[] = [
  'Home',
  'Men',
  'Women',
  'New Arrivals',
  'Best Sellers',
  'Leather Jackets',
  'Sale',
];

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  onSelectNav,
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  isLoggedIn,
  userName,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onGoHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  return (
    <header className="sticky top-0 z-40 bg-[#3B0D14] text-[#FAF8F5] border-b border-white/10 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden p-1.5 -ml-1 text-[#FAF8F5]/90 hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="font-serif-display text-base min-[375px]:text-lg sm:text-2xl font-semibold tracking-[0.1em] sm:tracking-[0.14em] text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
          >
            VALMONT &amp; CO.
          </button>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13px] font-medium tracking-wide"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onSelectNav(item)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? 'text-white font-semibold'
                    : item === 'Sale'
                    ? 'text-[#F3C6B8] hover:text-white'
                    : 'text-[#E8DFD9] hover:text-white'
                }`}
              >
                {item}
                <span
                  className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#E5C39C] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Search, Account, Wishlist, Book Now */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Search Input Desktop / Toggle */}
          <div className="relative hidden sm:flex items-center">
            {searchExpanded ? (
              <div className="flex items-center bg-[#29080D] border border-white/20 rounded-md px-2.5 py-1.5 w-48 sm:w-64 transition-opacity duration-150">
                <Search className="w-4 h-4 text-[#D9CBC2] shrink-0 mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search style, color, suede..."
                  aria-label="Search leather jackets"
                  className="bg-transparent text-xs sm:text-[13px] text-white placeholder-[#B8A59C] focus:outline-none w-full"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    aria-label="Clear search query"
                    className="text-[#D9CBC2] hover:text-white ml-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSearchExpanded(false)}
                  aria-label="Close search bar"
                  className="text-[11px] text-[#D9CBC2] hover:text-white ml-2 pl-2 border-l border-white/15 whitespace-nowrap cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchExpanded(true)}
                aria-label="Open product search"
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-md text-[#E8DFD9] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Search className="w-[18px] h-[18px]" />
                <span className="hidden xl:inline text-xs tracking-wide whitespace-nowrap">
                  {searchQuery ? `"${searchQuery.slice(0, 12)}"` : 'Search'}
                </span>
              </button>
            )}
          </div>

          {/* Mobile Search Icon opens Mobile Drawer with Search Bar */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Search leather jackets"
            className="sm:hidden p-1.5 rounded-md text-[#E8DFD9] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Search className="w-[17px] h-[17px]" />
          </button>

          {/* Account */}
          <button
            type="button"
            onClick={onOpenAccount}
            aria-label="Customer account"
            className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-md text-[#E8DFD9] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <User className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" />
            {isLoggedIn && userName && (
              <span className="hidden xl:inline text-xs font-medium max-w-[84px] truncate">
                {userName.split(' ')[0]}
              </span>
            )}
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={onOpenWishlist}
            aria-label={`Wishlist (${wishlistCount} saved items)`}
            className="relative p-1.5 sm:p-2 rounded-md text-[#E8DFD9] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Heart className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#D4A373] text-[#1A1615] text-[10px] font-bold flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Direct WhatsApp Book Now CTA */}
          <a
            href={`https://wa.me/${import.meta.env.VITE_STORE_WHATSAPP || '18005550194'}?text=${encodeURIComponent(
              'Hello VALMONT & CO., I would like to inquire and book a leather jacket.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book Now on WhatsApp"
            className="relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md bg-[#1E6B43] hover:bg-[#175636] border border-white/15 text-white transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-[16px] sm:h-[16px]" />
            <span className="text-[11px] sm:text-xs font-semibold whitespace-nowrap">
              Book Now
            </span>
          </a>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#2C090E] border-t border-white/10 px-4 pt-3 pb-5 space-y-3">
          <div className="flex items-center bg-[#1D0609] border border-white/15 rounded-md px-3 py-2">
            <Search className="w-4 h-4 text-[#D9CBC2] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search jackets by style, color, gender..."
              aria-label="Mobile search leather jackets"
              className="bg-transparent text-sm text-white placeholder-[#B8A59C] focus:outline-none w-full"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-[#D9CBC2] hover:text-white ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <nav className="grid grid-cols-2 gap-1.5 pt-1">
            {NAV_LINKS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  onSelectNav(item);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeNav === item
                    ? 'bg-[#58161E] text-white'
                    : 'text-[#E8DFD9] hover:bg-white/5 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
