import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Navbar from '../../components/layout/Navbar';
import Spinner from '../../components/ui/Spinner';
import { Search as SearchIcon, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { searchService } from '../../services/searchService';

import FilterSort from './FilterSort';
import AutocompleteSuggestion from './AutocompleteSuggestion';
import MedicineInfo from './MedicineInfo';

export default function SearchPage() {
  const user = useAuthStore((state) => state.user);
  const showToast = useAppStore((state) => state.showToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedMed, setSelectedMed] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Autocomplete suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  // Filters and Sorting States
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterBrand, setFilterBrand] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [orderDir, setOrderDir] = useState('asc');

  // Pagination
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const fetchFilters = async () => {
    try {
      const catRes = await searchService.getCategories();
      setCategories(catRes?.data || []);

      const brandRes = await searchService.getBrands();
      setBrands(brandRes?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (
    queryVal = searchQuery,
    categoryVal = filterCategory,
    brandVal = filterBrand,
    minP = minPrice,
    maxP = maxPrice,
    orderB = orderBy,
    orderD = orderDir,
    currentOffset = offset
  ) => {
    setIsLoading(true);
    try {
      const params = {
        limit,
        offset: currentOffset,
        orderBy: orderB,
        orderDir: orderD
      };
      if (queryVal) params.query = queryVal;
      if (categoryVal !== 'All') params.category = categoryVal;
      if (brandVal !== 'All') params.brand = brandVal;
      if (minP !== '') params.minPrice = Number(minP);
      if (maxP !== '') params.maxPrice = Number(maxP);

      const response = await searchService.searchMedicines(params);
      const list = response?.data || [];
      setMedicines(list);
      setTotalResults(response?.pagination?.total || list.length);
      
      if (list.length > 0) {
        setSelectedMed(list[0]);
      } else {
        setSelectedMed(null);
      }
    } catch (error) {
      console.error(error);
      showToast('Search query failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
    handleSearch('', 'All', 'All', '', '', 'name', 'asc', 0);

    // Click outside handler for autocomplete suggestions
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    setOffset(0);
    handleSearch(searchQuery, filterCategory, filterBrand, minPrice, maxPrice, orderBy, orderDir, 0);
  };

  const handleInputChange = async (val) => {
    setSearchQuery(val);
    if (val.trim().length >= 1) {
      try {
        const res = await searchService.autocomplete(val);
        setSuggestions(res?.data || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setOffset(0);
    handleSearch(suggestion, filterCategory, filterBrand, minPrice, maxPrice, orderBy, orderDir, 0);
  };

  const handleCategoryChange = (catName) => {
    setFilterCategory(catName);
    setOffset(0);
    handleSearch(searchQuery, catName, filterBrand, minPrice, maxPrice, orderBy, orderDir, 0);
  };

  const handleBrandChange = (brandName) => {
    setFilterBrand(brandName);
    setOffset(0);
    handleSearch(searchQuery, filterCategory, brandName, minPrice, maxPrice, orderBy, orderDir, 0);
  };

  const handlePriceFilterChange = () => {
    setOffset(0);
    handleSearch(searchQuery, filterCategory, filterBrand, minPrice, maxPrice, orderBy, orderDir, 0);
  };

  const handleSortChange = (newOrderBy, newOrderDir) => {
    setOrderBy(newOrderBy);
    setOrderDir(newOrderDir);
    setOffset(0);
    handleSearch(searchQuery, filterCategory, filterBrand, minPrice, maxPrice, newOrderBy, newOrderDir, 0);
  };

  const handlePageChange = (newOffset) => {
    setOffset(newOffset);
    handleSearch(searchQuery, filterCategory, filterBrand, minPrice, maxPrice, orderBy, orderDir, newOffset);
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Upload', href: '#upload' },
    { name: 'History', href: '#history' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Reminders', href: '#reminders' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden pt-24 pb-16">
      <Navbar links={navLinks} />

      {/* Grid background & ambient glow */}
      <div className="absolute inset-0 grid-bg z-0 pointer-events-none opacity-50 dark:opacity-30"></div>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary-container/10 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-left font-geist">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-6">

            {/* Page Header */}
            <div className="flex flex-col gap-stack-sm items-center md:items-start text-center md:text-left animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-semibold w-fit text-xs mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span>Medicine Information & Search</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-855 dark:text-white leading-tight">
                Search <span className="bg-gradient-to-r from-primary via-indigo-655 to-emerald-500 bg-clip-text text-transparent">Medicine Information</span> Instantly
              </h2>
              <p className="text-xs md:text-sm text-slate-550 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                Search medicine names, generic names, brands, strengths, uses, warnings, and pricing information from RxEaseAI’s verified database.
              </p>
            </div>

            {/* Search & Filters Section */}
            <div className="space-y-4 animate-fade-up relative z-30">
              <form onSubmit={handleSearchSubmit} className="relative max-w-4xl" ref={suggestionRef}>
                <input
                  type="text"
                  placeholder="e.g. Amoxicillin, Lipitor..."
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-md placeholder:text-slate-400 text-slate-955 dark:text-white font-sans"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-surface-tint text-on-primary p-2.5 rounded-lg transition-colors shadow-sm cursor-pointer flex items-center justify-center border-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                {/* Autocomplete Suggestions Dropdown */}
                <AutocompleteSuggestion
                  showSuggestions={showSuggestions}
                  suggestions={suggestions}
                  onSuggestionClick={handleSuggestionClick}
                />
              </form>

              {/* Filter Chips & Advanced Sorting Component */}
              <FilterSort
                categories={categories}
                brands={brands}
                filterCategory={filterCategory}
                filterBrand={filterBrand}
                minPrice={minPrice}
                maxPrice={maxPrice}
                orderBy={orderBy}
                orderDir={orderDir}
                onCategoryChange={handleCategoryChange}
                onBrandChange={handleBrandChange}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                onPriceFilterChange={handlePriceFilterChange}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Main Content Split: Results (60%) + Selected Overview (40%) */}
            {isLoading ? (
              <div className="py-24 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6 items-start relative z-10">

                {/* Left Panel (Search Results Grid) 60% */}
                <div className="w-full lg:w-[60%] order-2 lg:order-1 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                      Search Results ({totalResults} found)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medicines.map((item) => (
                      <div
                        key={item.name}
                        onClick={() => setSelectedMed(item)}
                        className={`p-5 flex flex-col gap-3.5 hover:shadow-md hover:border-indigo-500/30 hover:-translate-y-0.5 transition-all bg-white dark:bg-slate-900/90 shadow-sm border rounded-2xl cursor-pointer text-left ${
                          selectedMed?.name === item.name
                            ? 'border-indigo-500/50 dark:border-indigo-500/50 shadow-indigo-500/5 shadow-lg bg-indigo-50/10 dark:bg-indigo-950/10'
                            : 'border-slate-200/50 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-slate-850 dark:text-slate-100 hover:text-primary transition-colors">
                                {item.name}
                              </h4>
                              <span className="material-symbols-outlined text-emerald-500 text-[14px]" title="Verified Authentic">
                                verified
                              </span>
                            </div>
                            <p className="text-[10px] font-semibold text-slate-450 mt-0.5 leading-none">{item.composition?.generic_name || 'Generic active ingredient'}</p>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-sm font-black text-slate-800 dark:text-white">Rs. {item.price?.total_price || 0}</p>
                            <p className="text-[9px] font-bold text-slate-450 uppercase mt-0.5 leading-none">
                              {item.brand || 'Brand'}
                            </p>
                          </div>
                        </div>

                        {/* Info tags and ratings row */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-850/80 flex items-center justify-between flex-wrap gap-2">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 px-2 py-0.5 rounded-lg">
                            {item.categories?.[0] || 'General'}
                          </span>
                        </div>
                      </div>
                    ))}

                    {medicines.length === 0 && (
                      <div className="col-span-2 py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-md">
                        <span className="material-symbols-outlined text-[36px] text-slate-350 mb-2">search_off</span>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-205">No medicines found</h3>
                        <p className="text-xs text-slate-450 mt-1">Try adjusting your filters or search terms.</p>
                      </div>
                    )}
                  </div>

                  {/* Pagination Controls */}
                  {totalResults > limit && (
                    <div className="flex items-center justify-center gap-4 pt-6">
                      <button
                        onClick={() => handlePageChange(Math.max(0, offset - limit))}
                        disabled={offset === 0}
                        className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-xs font-semibold text-slate-500">
                        Page {Math.floor(offset / limit) + 1} of {Math.ceil(totalResults / limit)}
                      </span>
                      <button
                        onClick={() => handlePageChange(offset + limit)}
                        disabled={offset + limit >= totalResults}
                        className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Panel (Selected Overview Component) 40% */}
                <div className="w-full lg:w-[40%] flex flex-col gap-6 shrink-0 order-1 lg:order-2">
                  <MedicineInfo selectedMed={selectedMed} />
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
