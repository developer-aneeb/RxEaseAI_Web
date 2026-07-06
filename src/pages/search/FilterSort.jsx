import React from 'react';
import { ArrowUpDown, Tag, Milestone, Landmark } from 'lucide-react';

export default function FilterSort({
  categories,
  brands,
  filterCategory,
  filterBrand,
  minPrice,
  maxPrice,
  orderBy,
  orderDir,
  onCategoryChange,
  onBrandChange,
  setMinPrice,
  setMaxPrice,
  onPriceFilterChange,
  onSortChange
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl w-full">
      
      {/* Category Dropdown */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 min-w-[170px] flex-1 sm:flex-initial">
        <Tag className="w-3.5 h-3.5 text-primary shrink-0" />
        <div className="flex-1 text-left">
          <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-0.5">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-transparent border-0 text-xs font-bold text-slate-800 dark:text-white outline-none cursor-pointer p-0 h-[18px]"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Brand Dropdown */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-955 px-3 py-1.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 min-w-[170px] flex-1 sm:flex-initial">
        <Landmark className="w-3.5 h-3.5 text-primary shrink-0" />
        <div className="flex-1 text-left">
          <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-0.5">Brand</label>
          <select
            value={filterBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="w-full bg-transparent border-0 text-xs font-bold text-slate-850 dark:text-white outline-none cursor-pointer p-0 h-[18px]"
          >
            <option value="All">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex-1 sm:flex-initial min-w-[210px]">
        <Milestone className="w-3.5 h-3.5 text-primary shrink-0" />
        <div className="flex-1 text-left">
          <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-0.5">Price Range (Rs)</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-12 bg-transparent border-0 text-xs font-bold text-slate-800 dark:text-white outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-slate-300">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-12 bg-transparent border-0 text-xs font-bold text-slate-800 dark:text-white outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
        <button
          onClick={onPriceFilterChange}
          className="bg-primary hover:bg-primary/90 text-white text-[10px] font-extrabold py-1 px-2.5 rounded-lg border-0 cursor-pointer transition-colors shadow-sm"
        >
          Apply
        </button>
      </div>

      {/* Sorting Controls */}
      <div className="flex items-center gap-3 ml-auto shrink-0 flex-1 sm:flex-initial justify-end">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <div className="text-left">
            <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-0.5">Sort By</label>
            <select
              value={orderBy}
              onChange={(e) => onSortChange(e.target.value, orderDir)}
              className="bg-transparent border-0 text-xs font-bold text-slate-850 dark:text-white outline-none cursor-pointer p-0 h-[18px] min-w-[70px]"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="brand">Brand</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSortChange(orderBy, orderDir === 'asc' ? 'desc' : 'asc')}
          className="w-10 h-10 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center text-slate-550 dark:text-slate-400 transition-colors shrink-0"
          title={orderDir === 'asc' ? 'Ascending Order' : 'Descending Order'}
        >
          <ArrowUpDown className={`w-4 h-4 transition-transform duration-300 ${orderDir === 'desc' ? 'rotate-180 text-primary' : ''}`} />
        </button>
      </div>
    </div>
  );
}
