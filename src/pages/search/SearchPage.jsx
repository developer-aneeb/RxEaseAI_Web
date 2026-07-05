import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Navbar from '../../components/layout/Navbar';
import SideNavbar from '../../components/layout/SideNavbar';
import {
  Search, Eye, Download, Star, Filter, Info,
  HelpCircle, Settings, ChevronRight, CheckCircle2,
  TrendingDown, Check, X, ShieldAlert, ArrowRight, ChevronDown
} from 'lucide-react';

const MEDICINES_DATA = [
  {
    id: 'm1',
    name: 'Myteka',
    generic: 'Montelukast Sodium 10mg',
    brandName: 'Myteka',
    type: 'Anti-Asthmatic / Allergy',
    category: 'Respiratory',
    isBrand: true,
    price: 45.00,
    tabsCount: '30 tabs',
    lowestGeneric: 12.50,
    rxRequired: true,
    inStock: true,
    rating: 4.8,
    trend: '+12% Search Interest',
    uses: [
      'Asthma maintenance (adults & children >15 yrs)',
      'Allergic rhinitis symptom relief',
      'Exercise-induced bronchoconstriction prevention'
    ],
    standardDose: '10mg once daily in the evening.'
  },
  {
    id: 'm2',
    name: 'Singulair',
    generic: 'Montelukast Sodium 10mg',
    brandName: 'Singulair',
    type: 'Anti-Asthmatic / Allergy',
    category: 'Respiratory',
    isBrand: true,
    price: 240.00,
    tabsCount: '28 tabs',
    lowestGeneric: 12.50,
    rxRequired: true,
    inStock: true,
    rating: 4.9,
    trend: '+3% Search Interest',
    uses: [
      'Asthma prophylaxis and chronic treatment',
      'Seasonal allergic rhinitis relief'
    ],
    standardDose: '10mg once daily in the evening.'
  },
  {
    id: 'm3',
    name: 'Panadol Extra',
    generic: 'Paracetamol / Caffeine 500mg/65mg',
    brandName: 'Panadol',
    type: 'Analgesic / Antipyretic',
    category: 'Pain Relief',
    isBrand: true,
    price: 15.00,
    tabsCount: '30 tabs',
    lowestGeneric: 4.50,
    rxRequired: false,
    inStock: true,
    rating: 4.7,
    trend: '+8% Search Interest',
    uses: [
      'Mild to moderate pain relief (headache, toothache)',
      'Fever reduction'
    ],
    standardDose: '1-2 tablets every 4-6 hours as needed.'
  },
  {
    id: 'm4',
    name: 'Lipitor',
    generic: 'Atorvastatin Calcium 20mg',
    brandName: 'Lipitor',
    type: 'Lipid-Lowering Agent',
    category: 'Cardiovascular',
    isBrand: true,
    price: 85.00,
    tabsCount: '30 tabs',
    lowestGeneric: 22.00,
    rxRequired: true,
    inStock: true,
    rating: 4.8,
    trend: '+15% Search Interest',
    uses: [
      'Reduction of elevated total cholesterol, LDL-C',
      'Prevention of cardiovascular disease'
    ],
    standardDose: '10-20mg once daily, any time of day.'
  },
  {
    id: 'm5',
    name: 'Calpol',
    generic: 'Paracetamol 500mg',
    brandName: 'Calpol',
    type: 'Analgesic / Antipyretic',
    category: 'Pain Relief',
    isBrand: false,
    price: 8.00,
    tabsCount: '20 tabs',
    lowestGeneric: 4.50,
    rxRequired: false,
    inStock: true,
    rating: 4.5,
    trend: '+2% Search Interest',
    uses: [
      'Relief of mild pain and fever',
      'Teething pain in children (liquids)'
    ],
    standardDose: '500mg-1g every 4-6 hours as needed.'
  },
  {
    id: 'm6',
    name: 'Augmentin',
    generic: 'Co-Amoxiclav 625mg',
    brandName: 'Augmentin',
    type: 'Penicillin Antibiotic',
    category: 'Antibiotics',
    isBrand: true,
    price: 75.00,
    tabsCount: '14 tabs',
    lowestGeneric: 18.00,
    rxRequired: true,
    inStock: false,
    rating: 4.6,
    trend: '+22% Search Interest',
    uses: [
      'Lower respiratory tract infections',
      'Otitis media, sinusitis',
      'Skin infections'
    ],
    standardDose: '625mg twice daily or 375mg three times daily.'
  }
];

export default function SearchPage() {
  const user = useAuthStore((state) => state.user);
  const showToast = useAppStore((state) => state.showToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedId, setSelectedMedId] = useState('m1');
  const [filterCategory, setFilterCategory] = useState('All'); // 'All' | 'Respiratory' | 'Pain Relief' | 'Cardiovascular' | 'Antibiotics'
  const [filterBrand, setFilterBrand] = useState('All'); // 'All' | 'Brand' | 'Generic'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'CU';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const selectedMed = MEDICINES_DATA.find(m => m.id === selectedMedId) || MEDICINES_DATA[0];

  // Filtering Logic
  const filteredMeds = MEDICINES_DATA.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.generic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.uses.some(u => u.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = filterCategory === 'All' || med.category === filterCategory;

    let matchesBrand = true;
    if (filterBrand === 'Brand') {
      matchesBrand = med.isBrand;
    } else if (filterBrand === 'Generic') {
      matchesBrand = !med.isBrand;
    }

    return matchesSearch && matchesCategory && matchesBrand;
  });

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* SideNavBar - Desktop only (matches Stitch Layout style) */}
          {/* <SideNavbar activeRoute="#search" /> */}

          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-6">

            {/* Page Header */}
            <div className="flex flex-col gap-stack-sm items-center md:items-start text-center md:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-label-sm text-label-sm font-semibold w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span>Medicine Information & Search</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-850 dark:text-white leading-tight">
                Search <span className="bg-gradient-to-r from-primary via-indigo-650 to-emerald-500 bg-clip-text text-transparent">Medicine Information</span> Instantly
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                Search medicine names, generic names, brands, strengths, uses, warnings, and pricing information from RxEaseAI’s verified medical database.
              </p>
            </div>

            {/* Search & Filters Section */}
            <div className="space-y-4 animate-fade-in-up delay-100">
              <div className="relative max-w-4xl">
                <input
                  type="text"
                  placeholder="e.g. Amoxicillin, Lipitor, Headaches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl py-4 pl-12 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-md placeholder:text-slate-400"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-xl material-symbols-outlined select-none pointer-events-none">
                  manage_search
                </span>
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-surface-tint text-on-primary p-2.5 rounded-lg transition-colors shadow-sm cursor-pointer flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Filter Chips row */}
              <div className="flex flex-wrap items-center gap-2 max-w-4xl">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-2">Filters:</span>

                {/* Category Filter */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setFilterCategory(filterCategory === 'All' ? 'Respiratory' : filterCategory === 'Respiratory' ? 'Pain Relief' : filterCategory === 'Pain Relief' ? 'Cardiovascular' : filterCategory === 'Cardiovascular' ? 'Antibiotics' : 'All');
                      setShowFilterDropdown(false);
                    }}
                    className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Category: {filterCategory}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Brand / Generic Filter */}
                <div className="relative">
                  <button
                    onClick={() => setFilterBrand(filterBrand === 'All' ? 'Brand' : filterBrand === 'Brand' ? 'Generic' : 'All')}
                    className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Type: {filterBrand}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Split: Selected Overview + Results */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">

              {/* Left Panel (Selected Overview) 35% */}
              <div className="w-full lg:w-[35%] flex flex-col gap-6 shrink-0 animate-fade-in-up delay-200">
                <Card variant="glass" className="p-5 shadow-lg border-l-4 border-l-tertiary relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight">{selectedMed.name}</h3>
                      <p className="text-xs font-semibold text-slate-450 dark:text-slate-500 mt-0.5">{selectedMed.generic}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-end shrink-0">
                      {selectedMed.rxRequired && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10 shrink-0">
                          Rx Required
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border shrink-0 ${selectedMed.inStock
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10'
                        }`}>
                        {selectedMed.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 border-y border-slate-100 dark:border-slate-850 py-4 mt-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current Price</p>
                      <p className="text-xl font-black text-slate-800 dark:text-white mt-1">
                        Rs. {selectedMed.price}
                        <span className="text-xs text-slate-450 dark:text-slate-500 font-normal"> /{selectedMed.tabsCount}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Lowest Generic</p>
                      <p className="text-xl font-black text-emerald-500 mt-1 flex items-center gap-0.5">
                        <span>Rs. {selectedMed.lowestGeneric}</span>
                        <MaterialIcon name="trending_down" size="sm" className="text-emerald-500 align-middle mt-0.5" />
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <MaterialIcon name="insights" size="xs" className="text-tertiary" />
                        <span>Trend Insights</span>
                      </p>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-lg">
                        {selectedMed.trend.split(' ')[0]} Interest
                      </span>
                    </div>

                    {/* CSS Sparkline */}
                    <div className="h-10 w-full flex items-end gap-1 opacity-80 mt-3 px-1">
                      <div className="w-full bg-indigo-500/20 dark:bg-indigo-500/10 rounded-t h-[20%]"></div>
                      <div className="w-full bg-indigo-500/30 dark:bg-indigo-500/20 rounded-t h-[40%]"></div>
                      <div className="w-full bg-indigo-500/25 dark:bg-indigo-500/15 rounded-t h-[30%]"></div>
                      <div className="w-full bg-indigo-500/40 dark:bg-indigo-500/25 rounded-t h-[60%]"></div>
                      <div className="w-full bg-indigo-500/35 dark:bg-indigo-500/20 rounded-t h-[50%]"></div>
                      <div className="w-full bg-indigo-600 rounded-t h-[80%]"></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Primary Uses & Dosage</p>
                    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1.5 ml-1 marker:text-tertiary leading-relaxed">
                      {selectedMed.uses.map((use, idx) => (
                        <li key={idx}>{use}</li>
                      ))}
                      <li className="font-semibold mt-3 list-none flex gap-2 items-start text-slate-700 dark:text-slate-350">
                        <Info className="w-4 h-4 text-slate-450 shrink-0 mt-0.5" />
                        <span>Standard dose: {selectedMed.standardDose}</span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>

              {/* Right Panel (Search Results Grid) 65% */}
              <div className="w-full lg:w-[65%] animate-fade-in-up delay-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                    {filterCategory === 'All' ? 'Top Verified Medicines' : `Top Results for "${filterCategory}"`}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                    Showing {filteredMeds.length} of {MEDICINES_DATA.length} entries
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMeds.map((item) => (
                    <Card
                      key={item.id}
                      onClick={() => setSelectedMedId(item.id)}
                      className={`p-5 flex flex-col gap-3.5 hover:shadow-md hover:border-indigo-500/30 hover:-translate-y-0.5 transition-all bg-white dark:bg-slate-900/90 shadow-sm border ${selectedMedId === item.id
                          ? 'border-indigo-500/50 dark:border-indigo-500/50 shadow-indigo-500/5 shadow-lg bg-indigo-50/10 dark:bg-indigo-950/10'
                          : 'border-slate-200/50 dark:border-slate-805'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 hover:text-primary transition-colors">
                              {item.name}
                            </h4>
                            <span
                              className="material-symbols-outlined text-emerald-500 text-[14px]"
                              title="Verified Authentic"
                            >
                              verified
                            </span>
                          </div>
                          <p className="text-[10px] font-semibold text-slate-450 mt-0.5 leading-none">{item.generic}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-slate-800 dark:text-white">Rs. {item.price}</p>
                          <p className="text-[9px] font-bold text-slate-450 uppercase mt-0.5 leading-none">
                            {item.isBrand ? 'Brand Name' : 'Generic'}
                          </p>
                        </div>
                      </div>

                      {/* Info tags and ratings row */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-850/80 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-2 py-0.5 rounded-lg">
                          {item.category}
                        </span>

                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {filteredMeds.length === 0 && (
                    <div className="col-span-2 py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-md">
                      <MaterialIcon name="search_off" size="3xl" className="text-slate-350 dark:text-slate-600 mb-4" />
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No medicines found</h3>
                      <p className="text-xs text-slate-450 mt-1">Try adjusting your filters or search terms.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
