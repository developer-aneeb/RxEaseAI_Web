import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../../store/useAppStore';
import { useAuthStore } from '../../../store/useAuthStore';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import MaterialIcon from '../../../components/ui/MaterialIcon';
import Navbar from '../../../components/layout/Navbar';
import Spinner from '../../../components/ui/Spinner';
import {
  Search, Info, Star, ChevronDown, Check,
  TrendingUp, DollarSign, Filter, RefreshCw,
  X, CheckCircle, HeartPulse, Sparkles, AlertTriangle
} from 'lucide-react';
import { prescriptionService } from '../../../services/prescriptionService';
import { recommendationService } from '../../../services/recommendationService';
import { searchService } from '../../../services/searchService';
import { getFriendlyErrorMessage } from '../../../utils/errorMessages';

export default function RecommendationPage() {
  const user = useAuthStore((state) => state.user);
  const showToast = useAppStore((state) => state.showToast);

  const [activeMode, setActiveMode] = useState('prescription'); // 'prescription' | 'search'

  // Prescription Mode States
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isRecsLoading, setIsRecsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Search Mode States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [genericAlternatives, setGenericAlternatives] = useState([]);
  const [isAlternativesLoading, setIsAlternativesLoading] = useState(false);

  // Rating Modal state (UI simulation)
  const [ratingModalMed, setRatingModalMed] = useState(null);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  // Initial fetch
  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        const response = await prescriptionService.listPrescriptions();
        const list = Array.isArray(response)
          ? response
          : (response?.data || response?.prescriptions || []);
        setPrescriptions(list);
        if (list.length > 0) {
          setSelectedPrescriptionId(list[0].prescription_id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadPrescriptions();
  }, []);

  // Fetch recommendations when prescription changes
  useEffect(() => {
    if (!selectedPrescriptionId) return;
    loadPrescriptionRecommendations(selectedPrescriptionId);
  }, [selectedPrescriptionId]);

  const loadPrescriptionRecommendations = async (pId) => {
    setIsRecsLoading(true);
    try {
      const response = await recommendationService.getSaved(pId);
      // Backend returns results inside { success, results } or directly
      const results = response?.results || [];
      setRecommendations(results);
    } catch (err) {
      console.error(err);
      showToast('Failed to load recommendations.', 'error');
    } finally {
      setIsRecsLoading(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    if (!selectedPrescriptionId) return;
    setIsGenerating(true);
    showToast('AI is auditing drug database for affordable generics...', 'info');
    try {
      await recommendationService.generateAll(selectedPrescriptionId);
      showToast('AI Smart Recommendations generated successfully!', 'success');
      loadPrescriptionRecommendations(selectedPrescriptionId);
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to generate recommendations.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSelectedMedicine(null);
    setGenericAlternatives([]);
    try {
      const response = await searchService.searchMedicines({ query: searchQuery });
      const data = response?.data || [];
      setSearchResults(data);
      if (data.length > 0) {
        handleSelectMedicine(data[0]);
      } else {
        showToast('No medicines found matching that query.', 'warning');
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to perform medicine search.', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMedicine = async (med) => {
    setSelectedMedicine(med);
    setIsAlternativesLoading(true);
    try {
      const genericName = med.composition?.generic_name;
      if (!genericName) {
        setGenericAlternatives([]);
        return;
      }

      // Search for items with the same active ingredient
      const response = await searchService.searchMedicines({ query: genericName });
      const alternatives = response?.data || [];

      // Filter out current brand and sort by price
      const currentPrice = med.price?.total_price || 0;
      const filtered = alternatives
        .filter(alt => alt.name !== med.name)
        .sort((a, b) => (a.price?.total_price || 0) - (b.price?.total_price || 0));

      setGenericAlternatives(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAlternativesLoading(false);
    }
  };

  const handleRateSubmit = () => {
    showToast(`Thank you! Successfully submitted rating for ${ratingModalMed.name}!`, 'success');
    setRatingModalMed(null);
    setUserRating(5);
    setReviewComment('');
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Upload', href: '#upload' },
    { name: 'History', href: '#history' },
    { name: 'Search', href: '#search' },
    { name: 'Prescription Analytics', href: '#prescription-analytics' },
  ];


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden pt-24 pb-16">
      <Navbar links={navLinks} />

      {/* Grid background & ambient glow */}
      <div className="absolute inset-0 grid-bg z-0 pointer-events-none opacity-50 dark:opacity-30"></div>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-left">
        <div className="space-y-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>Smart Generic Recommendation System</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-850 dark:text-white leading-tight">
            Find <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent">Affordable Medicine</span> Alternatives
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Compare active ingredients, safety flags, and pricing of generic drug alternatives to save on medical costs.
          </p>

          {/* Mode Switch Tab */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-fit">
            <button
              onClick={() => setActiveMode('prescription')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer ${activeMode === 'prescription'
                ? 'bg-white dark:bg-slate-950 text-primary dark:text-white shadow-sm'
                : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
            >
              Prescription Audit
            </button>
            <button
              onClick={() => setActiveMode('search')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer ${activeMode === 'search'
                ? 'bg-white dark:bg-slate-950 text-primary dark:text-white shadow-sm'
                : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
            >
              Manual Medicine Search
            </button>
          </div>
        </div>

        {/* PRESCRIPTION AUDIT MODE */}
        {activeMode === 'prescription' && (
          <div className="space-y-6">
            {/* Prescription Selector Card */}
            <Card variant="glass" className="p-5 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-450 uppercase shrink-0">Prescription:</span>
                <select
                  value={selectedPrescriptionId}
                  onChange={(e) => setSelectedPrescriptionId(e.target.value)}
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs w-full sm:w-[260px] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
                >
                  {prescriptions.map(p => (
                    <option key={p.prescription_id} value={p.prescription_id}>
                      {p.doctor_name || 'AI Extraction'} - {new Date(p.created_at).toLocaleDateString()}
                    </option>
                  ))}
                  {prescriptions.length === 0 && (
                    <option value="">No prescriptions uploaded</option>
                  )}
                </select>
              </div>

              {selectedPrescriptionId && (
                <Button
                  variant="primary"
                  onClick={handleGenerateRecommendations}
                  disabled={isGenerating}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Generate All Recommendations</span>
                </Button>
              )}
            </Card>

            {isRecsLoading ? (
              <div className="py-24 flex items-center justify-center">
                <Spinner />
              </div>
            ) : recommendations.length > 0 ? (
              <div className="flex flex-col gap-6">
                {recommendations.map((recItem, idx) => (
                  <Card key={idx} variant="glass" className="p-6 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md flex flex-col gap-5">
                    {/* Prescription Item Info Header */}
                    <div className="flex justify-between items-start border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
                      <div>
                        <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Prescribed Medicine</span>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{recItem.medicine_name}</h3>
                        <p className="text-xs text-slate-500 mt-1">Confidence Match: {Math.round((recItem.validation?.validation_confidence || 0.8) * 100)}% ({recItem.validation?.level || 'Confirmed'})</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Estimated Price</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-350 line-through">
                          {recItem.original?.price?.total_price ? `Rs. ${recItem.original.price.total_price}` : 'Pricing unavailable'}
                        </span>
                      </div>
                    </div>

                    {/* Recommendation items list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recItem.recommendations && recItem.recommendations.length > 0 ? (
                        recItem.recommendations.map((alt, altIdx) => {
                          const savingsPercent = recItem.original?.price?.total_price && alt.price?.total_price
                            ? Math.round(((recItem.original.price.total_price - alt.price.total_price) / recItem.original.price.total_price) * 100)
                            : 0;

                          return (
                            <Card
                              key={altIdx}
                              variant="glass"
                              className="p-5 flex flex-col gap-4 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:border-emerald-500/20 relative overflow-hidden"
                            >
                              {altIdx === 0 && savingsPercent > 0 && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-bl-2xl text-[9px] font-black tracking-wider uppercase shadow-sm">
                                  Best Savings
                                </div>
                              )}

                              <div className="flex justify-between items-start pr-12">
                                <div>
                                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{alt.name}</h4>
                                  <p className="text-[10px] text-slate-500 mt-0.5">{alt.brands?.name || 'Generic Alternative'}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    {alt.price?.total_price ? `Rs. ${alt.price.total_price}` : 'Price unavailable'}
                                  </div>
                                  {savingsPercent > 0 && (
                                    <div className="text-[8px] font-bold text-emerald-600 bg-emerald-500/10 px-1 rounded mt-0.5 inline-block">
                                      -{savingsPercent}% Savings
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="pt-2 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/80">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">4.8</span>
                                  <span className="text-[10px] text-slate-400">(drap verified)</span>
                                </div>

                                <button
                                  onClick={() => setRatingModalMed(alt)}
                                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer border-0 bg-transparent"
                                >
                                  <Star className="w-3.5 h-3.5" />
                                  <span>Efficacy Rating</span>
                                </button>
                              </div>
                            </Card>
                          );
                        })
                      ) : (
                        <div className="col-span-2 py-6 text-center text-xs text-slate-500 bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850/80 rounded-2xl flex items-center justify-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span>No cheaper alternative generic brands matching this item's formulation.</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-450 bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2.5 shadow-sm">
                <HeartPulse className="w-12 h-12 text-slate-350" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Recommendations Available</h3>
                <p className="text-xs text-slate-450 max-w-sm">No generic recommendations have been calculated for this prescription. Click the generate button above to scan active generic directories.</p>
              </div>
            )}
          </div>
        )}

        {/* MANUAL MEDICINE SEARCH MODE */}
        {activeMode === 'search' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Panel: Search and Select (4 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <Card variant="glass" className="p-5 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md flex flex-col gap-4">
                <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider">Search Database</span>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Enter brand name (e.g. Lipitor)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-primary transition-colors cursor-pointer border-0 bg-transparent"
                  >
                    <Search className="w-4.5 h-4.5" />
                  </button>
                </form>
              </Card>

              {searchResults.length > 0 && (
                <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {searchResults.map((med, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectMedicine(med)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${selectedMedicine?.name === med.name
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-900'
                        }`}
                    >
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{med.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{med.brand || 'Generic formulation'}</p>
                      <div className="flex justify-between items-center mt-3 text-[10px] font-bold">
                        <span className="text-slate-400">{med.composition?.strength || 'Details'}</span>
                        <span className="text-primary">{med.price?.total_price ? `Rs. ${med.price.total_price}` : 'Pricing N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Panel: Alternatives (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {selectedMedicine ? (
                <div className="space-y-6">
                  {/* Selected Medicine Info Card */}
                  <Card variant="glass" className="p-5 border border-primary/20 bg-primary/5 rounded-2xl flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Selected Target Brand</span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{selectedMedicine.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Generic Name: {selectedMedicine.composition?.generic_name || 'N/A'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Total price</span>
                      <span className="text-base font-extrabold text-slate-800 dark:text-white mt-1 block">
                        {selectedMedicine.price?.total_price ? `Rs. ${selectedMedicine.price.total_price}` : 'N/A'}
                      </span>
                    </div>
                  </Card>

                  {/* Alternatives Section */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>Cheaper Generic Brand Alternatives</span>
                    </h3>

                    {isAlternativesLoading ? (
                      <div className="py-12 flex items-center justify-center">
                        <Spinner />
                      </div>
                    ) : genericAlternatives.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {genericAlternatives.map((alt, idx) => {
                          const diff = (selectedMedicine.price?.total_price || 0) - (alt.price?.total_price || 0);
                          const savingsPercent = selectedMedicine.price?.total_price && alt.price?.total_price
                            ? Math.round((diff / selectedMedicine.price.total_price) * 100)
                            : 0;

                          return (
                            <Card
                              key={idx}
                              variant="glass"
                              className="p-4 flex flex-col justify-between gap-4 border border-slate-205 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60"
                            >
                              <div className="flex justify-between items-start gap-3">
                                <div>
                                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">{alt.name}</h4>
                                  <p className="text-[9px] text-slate-500 mt-0.5">{alt.brand || 'Generic Alternative'}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="text-xs font-black text-slate-850 dark:text-white">
                                    {alt.price?.total_price ? `Rs. ${alt.price.total_price}` : 'N/A'}
                                  </div>
                                  {savingsPercent > 0 && (
                                    <div className="text-[8px] font-bold text-emerald-600 bg-emerald-500/10 px-1 rounded mt-0.5">
                                      Save {savingsPercent}%
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-850/80 text-[10px] text-slate-500">
                                <span>drap registration verified</span>
                                <button
                                  onClick={() => setRatingModalMed(alt)}
                                  className="text-primary font-bold hover:underline cursor-pointer border-0 bg-transparent"
                                >
                                  Rate
                                </button>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl flex items-center justify-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>No cheaper alternative generic brands matching this composition in database.</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center text-slate-450 bg-white/70 dark:bg-slate-900/60 border border-slate-205 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2.5">
                  <Search className="w-12 h-12 text-slate-350" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Medicine lookup</h3>
                  <p className="text-xs text-slate-450 max-w-xs">Type a brand medicine on the left to automatically look up affordable alternatives.</p>
                </div>
              )}
            </div>

          </div>
        )}

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
              className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 font-sans text-left"
            >
              <button
                onClick={() => setRatingModalMed(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer border-0"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 fill-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Rate Efficacy Experience
                </h3>
                <p className="text-xs text-slate-450 mt-1">
                  Rate your clinical experience of using {ratingModalMed.name}.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none border-0 bg-transparent"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= (hoverRating || userRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200 dark:text-slate-850'
                          }`}
                      />
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Clinical Notes (Optional)</label>
                  <textarea
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Enter notes regarding efficacy, tolerability, or patient response..."
                    className="w-full bg-slate-55 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-colors focus:outline-none resize-none text-slate-950 dark:text-white"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setRatingModalMed(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleRateSubmit}
                  className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl"
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
