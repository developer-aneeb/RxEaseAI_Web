import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Navbar from '../../components/layout/Navbar';
import Spinner from '../../components/ui/Spinner';
import {
  Search as SearchIcon, Eye, Download, Star, Filter, Info,
  HelpCircle, Settings, ChevronRight, CheckCircle2,
  TrendingDown, Check, X, ShieldAlert, ArrowRight, ChevronDown
} from 'lucide-react';
import { searchService } from '../../services/searchService';

export default function SearchPage() {
  const user = useAuthStore((state) => state.user);
  const showToast = useAppStore((state) => state.showToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedMed, setSelectedMed] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterBrand, setFilterBrand] = useState('All');

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

  const handleSearch = async (queryVal = '', categoryVal = 'All', brandVal = 'All') => {
    setIsLoading(true);
    try {
      const params = {};
      if (queryVal) params.query = queryVal;
      if (categoryVal !== 'All') params.category = categoryVal;
      if (brandVal !== 'All') params.brand = brandVal;

      const response = await searchService.searchMedicines(params);
      const list = response?.data || [];
      setMedicines(list);
      
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
    handleSearch('', 'All', 'All');
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    handleSearch(searchQuery, filterCategory, filterBrand);
  };

  const handleCategoryChange = (catName) => {
    setFilterCategory(catName);
    handleSearch(searchQuery, catName, filterBrand);
  };

  const handleBrandChange = (brandName) => {
    setFilterBrand(brandName);
    handleSearch(searchQuery, filterCategory, brandName);
  };

  const getInitials = (name) => {
    if (!name) return 'CU';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'New Upload', href: '#upload' },
    { name: 'History', href: '#history' },
    { name: 'Recommendations', href: '#recommendations' },
    { name: 'Search', href: '#search' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Reminders', href: '#reminders' },
    { name: 'Notifications', href: '#notifications' },
    { name: 'Dashboard', href: '#history-dashboard' },
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-left">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-6">

            {/* Page Header */}
            <div className="flex flex-col gap-stack-sm items-center md:items-start text-center md:text-left animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-semibold w-fit text-xs mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span>Medicine Information & Search</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-850 dark:text-white leading-tight">
                Search <span className="bg-gradient-to-r from-primary via-indigo-655 to-emerald-500 bg-clip-text text-transparent">Medicine Information</span> Instantly
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-450 mt-2 max-w-2xl leading-relaxed">
                Search medicine names, generic names, brands, strengths, uses, warnings, and pricing information from RxEaseAI’s verified medical database.
              </p>
            </div>

            {/* Search & Filters Section */}
            <div className="space-y-4 animate-fade-up">
              <form onSubmit={handleSearchSubmit} className="relative max-w-4xl">
                <input
                  type="text"
                  placeholder="e.g. Amoxicillin, Lipitor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-xl py-4 pl-12 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-md placeholder:text-slate-400 text-slate-950 dark:text-white"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-surface-tint text-on-primary p-2.5 rounded-lg transition-colors shadow-sm cursor-pointer flex items-center justify-center border-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </form>

              {/* Filter Chips row */}
              <div className="flex flex-wrap items-center gap-2 max-w-4xl">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-2">Filters:</span>

                {/* Category Filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>

                {/* Brand Filter */}
                <select
                  value={filterBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="All">All Brands</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main Content Split: Selected Overview + Results */}
            {isLoading ? (
              <div className="py-24 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* Left Panel (Selected Overview) 35% */}
                <div className="w-full lg:w-[35%] flex flex-col gap-6 shrink-0">
                  {selectedMed ? (
                    <Card variant="glass" className="p-5 shadow-lg border-l-4 border-l-tertiary relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                      <div className="flex justify-between items-start mb-4 gap-2 text-left">
                        <div>
                          <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight">{selectedMed.name}</h3>
                          <p className="text-xs font-semibold text-slate-450 dark:text-slate-500 mt-0.5">{selectedMed.composition?.generic_name || 'Generic formulation'}</p>
                        </div>
                        <div className="flex flex-col gap-1 items-end shrink-0">
                          {selectedMed.prescription_required && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10 shrink-0">
                              Rx Required
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 mb-6 border-y border-slate-100 dark:border-slate-850 py-4 mt-4 text-left">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current Market Price</p>
                          <p className="text-xl font-black text-slate-850 dark:text-white mt-1">
                            {selectedMed.price?.total_price ? `Rs. ${selectedMed.price.total_price}` : 'Rs. 0'}
                            <span className="text-xs text-slate-500 font-normal"> / {selectedMed.price?.pack_size || 'unit'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-left">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Composition Strength</p>
                        <p className="text-xs text-slate-700 dark:text-slate-350 font-medium mb-4">{selectedMed.composition?.strength || 'Standard formulation'}</p>

                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Primary Uses</p>
                        <ul className="list-disc list-inside text-xs text-slate-650 dark:text-slate-400 space-y-1.5 ml-1 marker:text-tertiary leading-relaxed">
                          {selectedMed.primary_uses?.map((use, idx) => (
                            <li key={idx}>{use}</li>
                          )) || <p className="text-xs italic text-slate-500">No primary uses documented.</p>}
                        </ul>
                      </div>
                    </Card>
                  ) : (
                    <div className="p-8 text-center text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl">
                      Select a medicine to view details.
                    </div>
                  )}
                </div>

                {/* Right Panel (Search Results Grid) 65% */}
                <div className="w-full lg:w-[65%]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-450 dark:text-slate-555 uppercase tracking-wider">
                      Search Results
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medicines.map((item) => (
                      <div
                        key={item.id}
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
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-primary transition-colors">
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
                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 leading-none">
                              {item.brand || 'Brand'}
                            </p>
                          </div>
                        </div>

                        {/* Info tags and ratings row */}
                        <div className="pt-3 border-t border-slate-105 dark:border-slate-850/80 flex items-center justify-between flex-wrap gap-2">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-2 py-0.5 rounded-lg">
                            {item.categories?.[0] || 'General'}
                          </span>
                        </div>
                      </div>
                    ))}

                    {medicines.length === 0 && (
                      <div className="col-span-2 py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-202/50 dark:border-slate-800 shadow-md">
                        <span className="material-symbols-outlined text-[36px] text-slate-350 mb-2">search_off</span>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No medicines found</h3>
                        <p className="text-xs text-slate-450 mt-1">Try adjusting your filters or search terms.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
