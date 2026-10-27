import React, { useState } from 'react';
import { SlidersHorizontal, X, RotateCcw, ChevronDown } from 'lucide-react';
import { ALL_CATEGORIES, ALL_SIZES, COLOR_PALETTE } from '../data/products';
import { GenderCategory, JacketCategory, SizeOption, SortOption } from '../types/store';

export interface FilterState {
  category: JacketCategory | 'All';
  gender: GenderCategory | 'All';
  color: string | 'All';
  size: SizeOption | 'All';
  maxPrice: number;
  onlyDiscounted: boolean;
  onlyInStock: boolean;
  sortBy: SortOption;
}

interface FilterToolbarProps {
  filters: FilterState;
  onChangeFilters: (next: FilterState) => void;
  onResetAll: () => void;
  totalMatching: number;
  searchQuery: string;
  onClearSearch: () => void;
}

const COLOR_OPTIONS = Object.values(COLOR_PALETTE);

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onChangeFilters,
  onResetAll,
  totalMatching,
  searchQuery,
  onClearSearch,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const activeFilterCount = [
    filters.category !== 'All',
    filters.gender !== 'All',
    filters.color !== 'All',
    filters.size !== 'All',
    filters.maxPrice < 750,
    filters.onlyDiscounted,
    filters.onlyInStock,
    Boolean(searchQuery.trim()),
  ].filter(Boolean).length;

  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChangeFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white border border-[#E6DFD6] rounded-sm p-4 mb-6 shadow-2xs">
      {/* Top Row: Matching Count, Mobile Filter Button, Sort Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 bg-[#3B0D14] text-white text-xs font-semibold rounded-xs cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </button>

          <p className="text-xs sm:text-sm text-[#4A403B] font-medium tabular-nums">
            Showing <span className="font-bold text-[#1A1615]">{totalMatching}</span> handcrafted styles
            {searchQuery.trim() && (
              <span className="ml-1.5 text-[#58161E]">
                for &ldquo;{searchQuery.trim()}&rdquo;
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="ml-1.5 underline text-xs hover:text-[#1A1615] cursor-pointer"
                >
                  Clear search
                </button>
              </span>
            )}
          </p>
        </div>

        {/* Sort Control & Clear All */}
        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#58161E] hover:text-[#1A1615] transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear All Filters
            </button>
          )}

          <div className="relative flex items-center">
            <label htmlFor="sort-select" className="sr-only">
              Sort products
            </label>
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) => update('sortBy', e.target.value as SortOption)}
              className="appearance-none bg-[#FAF8F5] border border-[#D8CFC5] text-[#1A1615] text-xs font-medium rounded-xs pl-3 pr-8 py-2 focus:outline-none focus:border-[#4A1219] cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="newest">Newest Arrivals</option>
              <option value="rating">Best Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#6E625C] absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Desktop Filter Controls Row */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-3 pt-4 mt-4 border-t border-[#EFEAE2] items-center">
        {/* Category */}
        <div className="col-span-4">
          <label className="block text-[11px] font-medium text-[#6E625C] mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => update('category', e.target.value as JacketCategory | 'All')}
            className="w-full bg-[#FAF8F5] border border-[#DED5CB] rounded-xs px-2.5 py-1.5 text-xs text-[#1A1615] focus:outline-none focus:border-[#4A1219] cursor-pointer"
          >
            <option value="All">All 15 Leather Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div className="col-span-2">
          <label className="block text-[11px] font-medium text-[#6E625C] mb-1">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => update('gender', e.target.value as GenderCategory | 'All')}
            className="w-full bg-[#FAF8F5] border border-[#DED5CB] rounded-xs px-2.5 py-1.5 text-xs text-[#1A1615] focus:outline-none focus:border-[#4A1219] cursor-pointer"
          >
            <option value="All">All Genders</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* Color */}
        <div className="col-span-3">
          <label className="block text-[11px] font-medium text-[#6E625C] mb-1">Leather Tone</label>
          <select
            value={filters.color}
            onChange={(e) => update('color', e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#DED5CB] rounded-xs px-2.5 py-1.5 text-xs text-[#1A1615] focus:outline-none focus:border-[#4A1219] cursor-pointer"
          >
            <option value="All">All Colors</option>
            {COLOR_OPTIONS.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div className="col-span-3">
          <label className="block text-[11px] font-medium text-[#6E625C] mb-1">Size</label>
          <div className="flex items-center gap-1">
            {ALL_SIZES.map((sz) => {
              const active = filters.size === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => update('size', active ? 'All' : sz)}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-xs border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#3B0D14] text-white border-[#3B0D14]'
                      : 'bg-[#FAF8F5] text-[#3B2318] border-[#DED5CB] hover:border-[#4A1219]'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Expandable Filter Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-sm bg-[#FAF8F5] h-full overflow-y-auto p-5 flex flex-col justify-between z-10 shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2D9CE]">
                <h3 className="font-serif-display text-xl font-semibold text-[#1A1615]">
                  Refine Collection
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label="Close filter drawer"
                  className="p-1.5 text-[#4A403B] hover:text-[#1A1615]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B2318] mb-1.5">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => update('category', e.target.value as JacketCategory | 'All')}
                  className="w-full bg-white border border-[#D8CFC5] rounded-xs px-3 py-2 text-sm"
                >
                  <option value="All">All Categories</option>
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B2318] mb-1.5">Gender</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['All', 'Men', 'Women', 'Unisex'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => update('gender', g)}
                      className={`py-2 text-xs font-medium rounded-xs border ${
                        filters.gender === g
                          ? 'bg-[#3B0D14] text-white border-[#3B0D14]'
                          : 'bg-white text-[#3B2318] border-[#D8CFC5]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B2318] mb-1.5">Size</label>
                <div className="grid grid-cols-6 gap-1.5">
                  {ALL_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => update('size', filters.size === sz ? 'All' : sz)}
                      className={`py-2 text-xs font-semibold rounded-xs border ${
                        filters.size === sz
                          ? 'bg-[#3B0D14] text-white border-[#3B0D14]'
                          : 'bg-white text-[#3B2318] border-[#D8CFC5]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B2318] mb-1.5">Color</label>
                <select
                  value={filters.color}
                  onChange={(e) => update('color', e.target.value)}
                  className="w-full bg-white border border-[#D8CFC5] rounded-xs px-3 py-2 text-sm"
                >
                  <option value="All">All Leather Tones</option>
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2D9CE] grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={onResetAll}
                className="py-2.5 border border-[#3B0D14] text-[#3B0D14] text-xs font-semibold rounded-xs"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="py-2.5 bg-[#3B0D14] text-white text-xs font-semibold rounded-xs"
              >
                Show {totalMatching} Styles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
