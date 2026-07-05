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
  Search, Info, Star, ChevronDown, Check,
  TrendingUp, Award, DollarSign, Filter, RefreshCw,
  X, CheckCircle, HeartPulse, Sparkles, Navigation
} from 'lucide-react';

const MEDICINES_DATABASE = {
  myteka: {
    name: 'Myteka',
    generic: 'Montelukast Sodium 10mg',
    price: 460,
    type: 'Anti-Asthmatic / Allergy',
    trend: '+18%',
    trendColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    recommendations: [
      {
        id: 'rec-1',
        name: 'Montair',
        manufacturer: 'Sami Pharmaceuticals',
        price: 315,
        savings: '31.5%',
        confidence: 99,
        rating: 4.8,
        reviewsCount: 42,
        pricePercent: 68, // width relative to Myteka
        safetyStatus: 'Passed',
        isBestValue: true
      },
      {
        id: 'rec-2',
        name: 'BreatheFree',
        manufacturer: 'Hilton Pharma',
        price: 380,
        savings: '17.3%',
        confidence: 98,
        rating: 4.5,
        reviewsCount: 29,
        pricePercent: 82,
        safetyStatus: 'Passed',
        isBestValue: false
      }
    ]
  },
  panadol: {
    name: 'Panadol Extra',
    generic: 'Paracetamol / Caffeine 500mg/65mg',
    price: 350,
    type: 'Analgesic / Antipyretic',
    trend: '+5%',
    trendColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    recommendations: [
      {
        id: 'rec-3',
        name: 'Calpol',
        manufacturer: 'GSK Consumer Healthcare',
        price: 240,
        savings: '31.4%',
        confidence: 97,
        rating: 4.7,
        reviewsCount: 88,
        pricePercent: 68,
        safetyStatus: 'Passed',
        isBestValue: true
      },
      {
        id: 'rec-4',
        name: 'Disprol',
        manufacturer: 'Reckitt Benckiser',
        price: 290,
        savings: '17.1%',
        confidence: 95,
        rating: 4.4,
        reviewsCount: 56,
        pricePercent: 82,
        safetyStatus: 'Passed',
        isBestValue: false
      }
    ]
  },
  lipitor: {
    name: 'Lipitor',
    generic: 'Atorvastatin Calcium 20mg',
    price: 890,
    type: 'Lipid-Lowering Agent',
    trend: '-3%',
    trendColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    recommendations: [
      {
        id: 'rec-5',
        name: 'Lipiget',
        manufacturer: 'Getz Pharma',
        price: 580,
        savings: '34.8%',
        confidence: 99,
        rating: 4.9,
        reviewsCount: 112,
        pricePercent: 65,
        safetyStatus: 'Passed',
        isBestValue: true
      },
      {
        id: 'rec-6',
        name: 'Lipirex',
        manufacturer: 'Highnoon Laboratories',
        price: 720,
        savings: '19.1%',
        confidence: 97,
        rating: 4.6,
        reviewsCount: 74,
        pricePercent: 80,
        safetyStatus: 'Passed',
        isBestValue: false
      }
    ]
  }
};

export default function RecommendationPage() {
  const user = useAuthStore((state) => state.user);
  const showToast = useAppStore((state) => state.showToast);

  const [searchQuery, setSearchQuery] = useState('Myteka');
  const [selectedKey, setSelectedKey] = useState('myteka');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterType, setFilterType] = useState('All'); // 'All' | 'Generic' | 'Lowest'

  // Rating Modal state
  const [ratingModalMed, setRatingModalMed] = useState(null); // Medication object to rate
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  // Local database replica to allow reviews to modify ratings dynamically
  const [localDatabase, setLocalDatabase] = useState(MEDICINES_DATABASE);

  const activeMed = localDatabase[selectedKey] || localDatabase.myteka;

  const getInitials = (name) => {
    if (!name) return 'CU';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleSearchSubmit = (key) => {
    if (localDatabase[key]) {
      setSelectedKey(key);
      setSearchQuery(localDatabase[key].name);
    } else {
      showToast(`No exact match for "${searchQuery}". Showing Myteka.`, 'warning');
      setSelectedKey('myteka');
      setSearchQuery('Myteka');
    }
    setShowSuggestions(false);
  };

  const handleRateSubmit = () => {
    if (!ratingModalMed) return;

    // Update the rating dynamically in localDatabase state
    setLocalDatabase(prevDb => {
      const updatedDb = { ...prevDb };
      const medList = updatedDb[selectedKey].recommendations;
      const index = medList.findIndex(m => m.id === ratingModalMed.id);

      if (index !== -1) {
        const med = medList[index];
        const oldTotal = med.rating * med.reviewsCount;
        const newReviewsCount = med.reviewsCount + 1;
        const newRating = parseFloat(((oldTotal + userRating) / newReviewsCount).toFixed(2));

        medList[index] = {
          ...med,
          rating: newRating,
          reviewsCount: newReviewsCount
        };
      }
      return updatedDb;
    });

    showToast(`Successfully submitted rating of ${userRating} stars for ${ratingModalMed.name}!`, 'success');
    setRatingModalMed(null);
    setUserRating(5);
    setReviewComment('');
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
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-secondary-container/10 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* SideNavBar - Desktop only (matches Stitch Layout style) */}
          {/* <SideNavbar activeRoute="#recommendations" /> */}

          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-6">

            {/* Header / Search Area */}
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span>Smart Medicine Recommendation System</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-850 dark:text-white leading-tight">
                Find <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent">Affordable Medicine</span> Alternatives
              </h1>

              {/* Dynamic Auto-Search Bar */}
              <div className="max-w-3xl relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                </div>

                <input
                  type="text"
                  placeholder="Enter medicine name, brand, or generic compound..."
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  className="block w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-2xl text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium text-slate-700 dark:text-slate-100 shadow-lg"
                />

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="p-2 bg-slate-50 dark:bg-slate-955 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2.5 z-30"
                    >
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1.5 border-b border-slate-50 dark:border-slate-850 mb-1">
                        Popular Prescribed Drugs
                      </div>

                      <div className="space-y-0.5">
                        <button
                          onClick={() => handleSearchSubmit('myteka')}
                          className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-250 flex items-center justify-between"
                        >
                          <span>Myteka (Montelukast Sodium 10mg)</span>
                          <Badge variant="neutral">Anti-Asthmatic</Badge>
                        </button>
                        <button
                          onClick={() => handleSearchSubmit('panadol')}
                          className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-250 flex items-center justify-between"
                        >
                          <span>Panadol Extra (Paracetamol / Caffeine)</span>
                          <Badge variant="neutral">Analgesic</Badge>
                        </button>
                        <button
                          onClick={() => handleSearchSubmit('lipitor')}
                          className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-250 flex items-center justify-between"
                        >
                          <span>Lipitor (Atorvastatin Calcium 20mg)</span>
                          <Badge variant="neutral">Lipid-Lowering</Badge>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType('All')}
                  className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-colors cursor-pointer ${filterType === 'All'
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                >
                  All Matches
                </button>
                <button
                  onClick={() => setFilterType('Generic')}
                  className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-colors cursor-pointer ${filterType === 'Generic'
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                >
                  Generic Brands
                </button>
                <button
                  onClick={() => setFilterType('Lowest')}
                  className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${filterType === 'Lowest'
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                >
                  Lowest Price <MaterialIcon name="arrow_downward" size="xs" />
                </button>
              </div>
            </div>

            {/* Layout Grid: 35/65 Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* LEFT PANEL (35%) */}
              <div className="lg:col-span-4 flex flex-col gap-6 animate-fade-in-up delay-100">

                {/* Selected Medicine Card */}
                <Card variant="glass" className="p-5 relative overflow-hidden group hover:-translate-y-0.5 transition-all shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-[72px] text-primary">medication</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Target Medicine</div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1">{activeMed.name}</h2>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">{activeMed.generic}</p>

                  <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-805 space-y-3.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Market Price</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 line-through decoration-slate-400/50">Rs. {activeMed.price}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-250 flex items-center gap-1">
                        <MaterialIcon name="verified" size="xs" className="text-emerald-500" />
                        <span>Lowest Found Price</span>
                      </span>
                      <span className="text-lg font-black text-emerald-500">Rs. {activeMed.recommendations[0]?.price}</span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Potential Savings</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/10">
                        Rs. {activeMed.price - activeMed.recommendations[0]?.price} / pack
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Trend Insights */}
                <Card variant="flat" className="p-5 flex flex-col justify-between hover:shadow-lg transition-shadow border-l-2 border-l-primary bg-white dark:bg-slate-900">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span>Market Trend</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${activeMed.trendColor}`}>
                      <MaterialIcon name={activeMed.trend.startsWith('+') ? 'arrow_upward' : 'arrow_downward'} size="xs" />
                      <span>{activeMed.trend}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    Interest in generic alternatives for <span className="font-bold text-slate-750 dark:text-slate-300">{activeMed.generic.split(' ')[0]}</span> is trending up this week due to recent supply chain adjustments.
                  </p>

                  {/* Minimal Sparkline Graphic */}
                  <div className="h-10 w-full flex items-end gap-1 px-1 mt-2">
                    <div className="w-1/6 bg-primary/10 dark:bg-primary/20 h-1/4 rounded"></div>
                    <div className="w-1/6 bg-primary/20 dark:bg-primary/30 h-2/4 rounded"></div>
                    <div className="w-1/6 bg-primary/15 dark:bg-primary/25 h-1/3 rounded"></div>
                    <div className="w-1/6 bg-primary/30 dark:bg-primary/45 h-3/4 rounded"></div>
                    <div className="w-1/6 bg-primary/80 h-full rounded relative">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-primary/25 animate-ping"></div>
                    </div>
                    <div className="w-1/6 bg-primary/30 dark:bg-primary/40 h-2/3 rounded"></div>
                  </div>
                </Card>

                {/* Verification Badge */}
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                    <MaterialIcon name="health_and_safety" size="sm" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Medical Database Verified</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">Sources cross-checked via DRAP guidelines.</div>
                  </div>
                </div>

              </div>

              {/* RIGHT PANEL (65%) */}
              <div className="lg:col-span-8 flex flex-col gap-6">

                {/* AI Summary Header */}
                <div className="glassmorphism p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 animate-fade-in-up delay-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <MaterialIcon name="robot_2" size="sm" className="text-primary animate-bounce" />
                      <span>RxEaseAI Insights</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5">Analyzing {activeMed.recommendations.length} verified generic matches.</p>
                  </div>

                  <div className="flex gap-6">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg. Confidence</div>
                      <div className="text-lg font-black text-primary dark:text-primary-fixed-dim mt-0.5">98.5%</div>
                    </div>
                    <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 hidden sm:block align-self-center"></div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Max Savings</div>
                      <div className="text-lg font-black text-emerald-500 mt-0.5">31.5%</div>
                    </div>
                  </div>
                </div>

                {/* Recommendation Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeMed.recommendations
                    .filter(rec => {
                      if (filterType === 'Generic') return rec.name !== '';
                      if (filterType === 'Lowest') return rec.price <= 350;
                      return true;
                    })
                    .map((rec) => (
                      <Card
                        key={rec.id}
                        variant="glass"
                        className="p-5 flex flex-col gap-4 hover:border-indigo-500/30 transition-all hover:-translate-y-0.5 shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-md relative overflow-hidden"
                      >
                        {/* Best Value Absolute Tag */}
                        {rec.isBestValue && (
                          <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-bl-2xl text-[9px] font-black tracking-wider uppercase shadow-sm flex items-center gap-1 z-10">
                            <Star className="w-3 h-3 fill-white" />
                            <span>Best Value</span>
                          </div>
                        )}

                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-2 pr-16">
                          <div>
                            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">{rec.name}</h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">{rec.manufacturer}</p>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-black text-slate-850 dark:text-slate-100">Rs. {rec.price}</div>
                            <div className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 dark:bg-emerald-500/20 px-1 rounded-md mt-0.5 inline-block">
                              -{rec.savings}
                            </div>
                          </div>
                        </div>

                        {/* Match Confidence Progress Bar */}
                        <div>
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 flex items-center gap-1">
                              <MaterialIcon name="psychology" size="xs" className="text-primary" />
                              <span>Match Confidence</span>
                            </span>
                            <span className="text-[10px] font-bold text-primary">{rec.confidence}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full animate-progress"
                              style={{ width: `${rec.confidence}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Visual Price Comparison Line */}
                        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-3 border border-slate-200/50 dark:border-slate-850 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-16 text-right text-[10px] font-bold text-slate-400">{activeMed.name}</div>
                            <div className="flex-grow h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full">
                              <div className="h-full bg-slate-400 dark:bg-slate-600 rounded-full w-full"></div>
                            </div>
                            <div className="w-10 text-[10px] font-bold text-slate-600 dark:text-slate-400">{activeMed.price}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-16 text-right text-[10px] font-bold text-emerald-500">{rec.name}</div>
                            <div className="flex-grow h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${rec.pricePercent}%` }}
                              ></div>
                            </div>
                            <div className="w-10 text-[10px] font-bold text-emerald-600">{rec.price}</div>
                          </div>
                        </div>

                        {/* Interactive Clinician Rating Section */}
                        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-850/80">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{rec.rating}</span>
                            <span className="text-[10px] text-slate-400">({rec.reviewsCount} reviews)</span>
                          </div>

                          <button
                            onClick={() => setRatingModalMed(rec)}
                            className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5" />
                            <span>Rate Medicine</span>
                          </button>
                        </div>

                      </Card>
                    ))}
                </div>

                {/* Disclaimer / Footer */}
                <div className="mt-4 flex items-start gap-2 text-slate-400 dark:text-slate-500 text-[10px] font-medium max-w-2xl leading-relaxed">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Prices are estimates based on recent database updates and may vary by local pharmacy. Always consult with a healthcare professional before switching active clinical prescriptions.</p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Clinician Rating Modal */}
      <AnimatePresence>
        {ratingModalMed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRatingModalMed(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 font-sans"
            >
              <button
                onClick={() => setRatingModalMed(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 fill-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Rate Clinician Experience
                </h3>
                <p className="text-xs text-slate-450 mt-1">
                  Rate your clinical observation and efficacy of {ratingModalMed.name}.
                </p>
              </div>

              {/* Star Rating Select Area */}
              <div className="space-y-6">
                <div className="flex justify-center items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= (hoverRating || userRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 dark:text-slate-800'
                          }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Optional comment */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Clinical Notes (Optional)</label>
                  <textarea
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Enter notes regarding efficacy, tolerability, or patient response..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-colors focus:outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setRatingModalMed(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleRateSubmit}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-primary-container"
                >
                  Submit Rating
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
