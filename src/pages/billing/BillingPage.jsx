import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Navbar from '../../components/layout/Navbar';
import SideNavbar from '../../components/layout/SideNavbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import MaterialIcon from '../../components/ui/MaterialIcon';
import {
  CreditCard, Calendar, Activity, Receipt, Settings, HelpCircle,
  Check, ShieldCheck, ChevronRight, Download, Plus, Trash2,
  Loader2, AlertTriangle, Users, Mail, Building
} from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    cycle: 'forever',
    description: 'Basic clinical OCR scanning for small practices.',
    features: ['5 prescription uploads/mo', 'Basic OCR recognition', 'Standard medicine search', 'Email support']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '2,499',
    cycle: 'month',
    description: 'Advanced AI clinical intelligence and verification.',
    features: ['Unlimited uploads & scans', 'Advanced AI drug interaction alerts', 'Reminders & Timeline Center', 'Analytics dashboard', 'Priority support']
  },
  {
    id: 'team',
    name: 'Team',
    price: '9,999',
    cycle: 'month',
    description: 'Collaborative workspaces for clinics and pharmacies.',
    features: ['Includes up to 5 seats', 'Shared prescription history logs', 'Visual dashboard access', 'EHR HL7 API beta access', '24/7 dedicated support']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '24,999',
    cycle: 'month',
    description: 'SLA-backed systems for large hospital networks.',
    features: ['Custom seat allocation', 'Direct FHIR EHR API channel', 'Custom AI interaction dictionaries', 'Dedicated support manager', '99.9% uptime SLA']
  }
];

const INITIAL_PAYMENTS = [
  { id: 1, type: 'Card', brand: 'Visa', last4: '4242', exp: '12/28', default: true },
  { id: 2, type: 'Easypaisa', account: '0300****123', default: false }
];

const INITIAL_INVOICES = [
  { id: 'INV-492', date: 'Sep 15, 2026', amount: '2,499', status: 'Paid' },
  { id: 'INV-381', date: 'Aug 15, 2026', amount: '2,499', status: 'Paid' },
  { id: 'INV-204', date: 'Jul 15, 2026', amount: '2,499', status: 'Paid' }
];

export default function BillingPage() {
  const showToast = useAppStore((state) => state.showToast);
  const user = useAuthStore((state) => state.user);

  // States
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'plans' | 'payment' | 'invoices' | 'tax' | 'team'
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [paymentType, setPaymentType] = useState('Card'); // 'Card' | 'Easypaisa' | 'JazzCash' | 'Bank'

  // Form states
  const [cardNo, setCardNo] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [walletPhone, setWalletPhone] = useState('');

  // Tax / NTN states
  const [billingName, setBillingName] = useState('Sarah Jenkins Clinical Practice');
  const [ntnNo, setNtnNo] = useState('3928192-4');
  const [billingAddress, setBillingAddress] = useState('Suite 402, Medical Heights, Jail Road, Lahore, Pakistan');

  // Team Seats states
  const [teamMembers, setTeamMembers] = useState([
    { email: 'a.khan@rxease.ai', role: 'Staff Doctor' },
    { email: 'm.ahmed@rxease.ai', role: 'Clinical Pharmacist' }
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // Simulating Actions
  const handleSelectPlan = (planId) => {
    if (planId === currentPlan) return;
    setCurrentPlan(planId);
    showToast(`Subscription plan updated to ${planId.toUpperCase()} successfully!`, 'success');
  };

  const handleAddPaymentMethod = (e) => {
    e.preventDefault();
    let newMethod = {};
    if (paymentType === 'Card') {
      if (!cardNo || !cardExp) {
        showToast('Please fill out card details.', 'warning');
        return;
      }
      newMethod = {
        id: Date.now(),
        type: 'Card',
        brand: 'Visa',
        last4: cardNo.slice(-4) || '1111',
        exp: cardExp,
        default: false
      };
    } else {
      if (!walletPhone) {
        showToast('Please fill out your account phone number.', 'warning');
        return;
      }
      newMethod = {
        id: Date.now(),
        type: paymentType,
        account: `${walletPhone.slice(0, 4)}****${walletPhone.slice(-3)}`,
        default: false
      };
    }

    setPayments(prev => [...prev, newMethod]);
    setShowAddMethod(false);
    setCardNo('');
    setCardExp('');
    setWalletPhone('');
    showToast(`${paymentType} payment method added successfully!`, 'success');
  };

  const handleSetDefault = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, default: true } : { ...p, default: false }));
    showToast('Default payment method updated.', 'success');
  };

  const handleDeleteMethod = (id) => {
    setPayments(prev => prev.filter(p => p.id !== id));
    showToast('Payment method removed.', 'info');
  };

  const handleDownloadInvoice = (invId) => {
    showToast(`Downloading invoice ${invId} in PDF format...`, 'success');
  };

  const handleSaveTax = (e) => {
    e.preventDefault();
    showToast('PKR Tax/NTN billing profile updated successfully!', 'success');
  };

  const handleInviteMember = (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;
    if (teamMembers.length >= 5 && currentPlan === 'team') {
      showToast('Maximum team seat limit of 5 reached. Please upgrade to Enterprise.', 'warning');
      return;
    }
    setTeamMembers(prev => [...prev, { email: newMemberEmail, role: 'Staff Doctor' }]);
    setNewMemberEmail('');
    showToast(`Invite sent to ${newMemberEmail}.`, 'success');
  };

  const handleRemoveMember = (email) => {
    setTeamMembers(prev => prev.filter(m => m.email !== email));
    showToast('Team member removed from workspace.', 'info');
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
    { name: 'Billing', href: '#billing' },
  ];

  const getInitials = (name) => {
    const str = name || 'User';
    return str.split(/[ @]/).filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden pt-24 pb-16">
      <Navbar links={navLinks} />

      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full font-geist">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* SideNavBar - Desktop only (matches Stitch Layout style) */}
          {/* <SideNavbar activeRoute="#billing" /> */}

          {/* Main Workspace */}
          <div className="flex-1 w-full space-y-8 text-left">

            {/* Header Section */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
                <MaterialIcon name="monetization_on" size="xs" className="text-primary mr-1" />
                <span className="text-xs font-bold uppercase tracking-wide">Billing & Subscription</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Manage Your RxEaseAI <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Plan in Pakistan</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                View your current subscription, monitor API usage limits, manage invoices, and configure local Pakistani billing preferences.
              </p>
            </div>

            {/* Overview Stats (Bento Grid) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card variant="glass" className="p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Current Plan</span>
                  <MaterialIcon name="workspace_premium" className="text-primary" size="sm" />
                </div>
                <div className="flex items-end gap-2 mt-1">
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-none">
                    {PLANS.find(p => p.id === currentPlan)?.name}
                  </h3>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ring-1 ring-emerald-500/10">Active</span>
                </div>
              </Card>

              <Card variant="glass" className="p-5 flex flex-col gap-2">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Next Renewal</span>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1 leading-none">Oct 15</h3>
                <p className="text-[10px] text-slate-400 font-medium">24 days remaining</p>
              </Card>

              <Card variant="glass" className="p-5 flex flex-col gap-2">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Monthly Usage</span>
                  <Activity className="w-4 h-4 text-tertiary" />
                </div>
                <div className="flex items-end gap-1 mt-1">
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-none">78%</h3>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-850 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-tertiary h-full rounded-full w-[78%]"></div>
                </div>
              </Card>

              <Card variant="glass" className="p-5 flex flex-col gap-2">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Currency</span>
                  <MaterialIcon name="language" className="text-slate-400" size="sm" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1 leading-none">PKR</h3>
                <p className="text-[10px] text-slate-400 font-medium">Pakistani Rupee</p>
              </Card>
            </div>

            {/* Content Switcher Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-4 hide-scrollbar">
              {[
                { id: 'overview', name: 'Billing Overview' },
                { id: 'plans', name: 'Plans & Upgrades' },
                { id: 'payment', name: 'Payment Methods' },
                { id: 'invoices', name: 'Invoices' },
                { id: 'tax', name: 'Tax Profile (NTN)' },
                { id: 'team', name: 'Team Seats' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3.5 border-b-2 font-bold text-xs transition-all whitespace-nowrap cursor-pointer px-1 ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Switchable Workspaces */}
            <div className="space-y-6">

              {/* Tab: Billing Overview */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                  {/* Current Active Plan Details (7 cols) */}
                  <div className="md:col-span-8 space-y-6">
                    <Card variant="glass" className="p-6 relative border-primary/20">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Subscription Plan</p>
                          <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">
                            {PLANS.find(p => p.id === currentPlan)?.name} Plan
                          </h3>
                        </div>
                        <span className="bg-primary/10 text-primary text-xs font-black uppercase px-3 py-1 rounded-full">
                          PKR {PLANS.find(p => p.id === currentPlan)?.price} / mo
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Included Features:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {PLANS.find(p => p.id === currentPlan)?.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Auto-renew is active on Oct 15, 2026.</span>
                        <button className="text-primary font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('plans')}>Change Plan</button>
                      </div>
                    </Card>

                    {/* Detailed Usage Metrics */}
                    <Card variant="glass" className="p-6">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                        <MaterialIcon name="data_usage" size="sm" className="text-tertiary" /> Usage Limits
                      </h3>
                      <div className="space-y-5 text-xs font-medium">

                        {/* Meter 1 */}
                        <div>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-slate-700 dark:text-slate-300">OCR Scans Processed</span>
                            <span className="text-slate-550">156 / 200 scans</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full w-[78%]"></div>
                          </div>
                        </div>

                        {/* Meter 2 */}
                        <div>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-slate-700 dark:text-slate-300">Medication Reminders Sent</span>
                            <span className="text-slate-550">324 / 500 notifications</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full w-[65%]"></div>
                          </div>
                        </div>

                        {/* Meter 3 */}
                        <div>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-slate-700 dark:text-slate-300">FHIR API Database Storage</span>
                            <span className="text-slate-550">1.2 GB / 5.0 GB used</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                            <div className="bg-tertiary h-full rounded-full w-[24%]"></div>
                          </div>
                        </div>

                      </div>
                    </Card>
                  </div>

                  {/* Sidebar stats & alert (4 cols) */}
                  <div className="md:col-span-4 space-y-6">
                    {/* Active Seats indicator */}
                    <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl p-6 text-xs font-medium space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold mb-1">
                        <Users className="w-4 h-4" />
                        <span className="uppercase tracking-wider">Seat Allocations</span>
                      </div>
                      <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-850">
                        <span className="text-slate-500">Active Seats Used</span>
                        <span className="font-black text-slate-800 dark:text-white">{teamMembers.length} / 5</span>
                      </div>
                      <button className="text-xs text-primary font-bold hover:underline" onClick={() => setActiveTab('team')}>Manage Team Seats</button>
                    </div>

                    {/* Downgrade safety block */}
                    <div className="border border-rose-200/40 dark:border-rose-950/40 bg-rose-50/20 dark:bg-rose-950/10 rounded-2xl p-6 text-xs space-y-3">
                      <div className="flex items-center gap-2 text-rose-500 font-bold">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="uppercase tracking-wider">Danger Zone</span>
                      </div>
                      <p className="text-slate-500 leading-relaxed">Downgrades or cancellation will pause clinical OCR alerts and restrict dashboard analytics access.</p>
                      <button
                        onClick={() => {
                          showToast('Downgrade flow must contact support directly.', 'info');
                        }}
                        className="text-rose-500 font-bold hover:underline text-[11px]"
                      >
                        Cancel Subscription Plan
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab: Plans & Upgrades */}
              {activeTab === 'plans' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {PLANS.map(plan => {
                    const isCurrent = plan.id === currentPlan;
                    return (
                      <Card
                        key={plan.id}
                        variant="glass"
                        className={`p-5 flex flex-col justify-between transition-all hover:shadow-lg border-2 ${isCurrent
                            ? 'border-primary shadow-[0_4px_25px_rgba(0,107,251,0.08)] bg-white'
                            : 'border-slate-200 dark:border-slate-800 bg-white/50'
                          }`}
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-base font-black text-slate-800 dark:text-white">{plan.name}</h3>
                            {isCurrent && (
                              <span className="bg-primary/10 text-primary text-[9px] font-black uppercase px-2 py-0.5 rounded-full ring-1 ring-primary/20">Current</span>
                            )}
                          </div>

                          <div>
                            <div className="flex items-baseline text-slate-850 dark:text-white leading-none">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">PKR</span>
                              <span className="text-3xl font-black">{plan.price}</span>
                              <span className="text-slate-400 text-[10px] font-bold uppercase ml-1">/ {plan.cycle}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed font-medium">{plan.description}</p>
                          </div>

                          <ul className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-medium text-slate-600 dark:text-slate-350">
                            {plan.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="leading-tight">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-6">
                          <Button
                            onClick={() => handleSelectPlan(plan.id)}
                            disabled={isCurrent}
                            className={`w-full py-2.5 rounded-xl font-bold text-xs ${isCurrent
                                ? 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary-container text-white shadow-md cursor-pointer'
                              }`}
                          >
                            {isCurrent ? 'Active Plan' : 'Select Plan'}
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Tab: Payment Methods */}
              {activeTab === 'payment' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                  {/* Left (7 cols): Payment methods list & form */}
                  <div className="md:col-span-8 space-y-6">
                    <Card variant="glass" className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-slate-400" /> Saved Payment Methods
                        </h3>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddMethod(!showAddMethod)}
                          className="border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5 text-primary" /> Add Method
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {payments.map(item => (
                          <div key={item.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/50 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-850 text-slate-500 shrink-0">
                                <CreditCard className="w-5 h-5 text-primary" />
                              </div>
                              <div className="text-xs font-medium">
                                <p className="text-slate-850 dark:text-white font-bold">
                                  {item.type === 'Card' ? `${item.brand} Ending in ${item.last4}` : `${item.type} Account`}
                                </p>
                                <p className="text-slate-400 mt-0.5">
                                  {item.type === 'Card' ? `Expires ${item.exp}` : item.account}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {item.default ? (
                                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Default</span>
                              ) : (
                                <button onClick={() => handleSetDefault(item.id)} className="text-[10px] font-bold text-slate-400 hover:text-primary hover:underline">Set Default</button>
                              )}
                              {!item.default && (
                                <button onClick={() => handleDeleteMethod(item.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Add Payment Method Form */}
                    <AnimatePresence>
                      {showAddMethod && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <Card variant="glass" className="p-6 border-slate-250 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-5">
                              <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Configure New Payment Method</h4>
                              <button onClick={() => setShowAddMethod(false)} className="text-slate-400 hover:text-slate-655"><X className="w-4 h-4" /></button>
                            </div>

                            {/* Wallet selection tabs */}
                            <div className="flex border-b border-slate-200 dark:border-slate-850 gap-4 mb-5">
                              {['Card', 'Easypaisa', 'JazzCash', 'Bank Transfer'].map(type => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setPaymentType(type)}
                                  className={`py-2 border-b-2 font-bold text-xs cursor-pointer ${paymentType === type ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>

                            <form onSubmit={handleAddPaymentMethod} className="space-y-4 text-xs font-medium">
                              {paymentType === 'Card' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">Card Number</label>
                                    <input
                                      type="text"
                                      placeholder="4242 4242 4242 4242"
                                      value={cardNo}
                                      onChange={(e) => setCardNo(e.target.value)}
                                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">Expiry Date</label>
                                    <input
                                      type="text"
                                      placeholder="MM/YY"
                                      value={cardExp}
                                      onChange={(e) => setCardExp(e.target.value)}
                                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">{paymentType} Registered Mobile No.</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 03001234567"
                                    value={walletPhone}
                                    onChange={(e) => setWalletPhone(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                                  />
                                </div>
                              )}

                              <div className="flex justify-end gap-3 pt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setShowAddMethod(false)}
                                  className="border-slate-250 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs py-2 px-4 rounded-xl font-bold"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  className="bg-primary hover:bg-primary-container text-white py-2 px-5 rounded-xl font-bold text-xs"
                                >
                                  Add Method
                                </Button>
                              </div>
                            </form>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right (4 cols): Secure badge */}
                  <div className="md:col-span-4">
                    <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 text-xs text-left space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="uppercase tracking-wider">Secured System</span>
                      </div>
                      <p className="text-slate-500 leading-relaxed">All transaction processes are fully end-to-end encrypted using PCI-DSS compliant gateways. Local payments are authenticated via verified 3D secure protocols.</p>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab: Invoices */}
              {activeTab === 'invoices' && (
                <Card variant="glass" className="p-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-slate-400" /> Invoice History
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left font-medium">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4 font-bold">Invoice Ref</th>
                          <th className="py-3 px-4 font-bold">Billing Date</th>
                          <th className="py-3 px-4 font-bold">Amount (PKR)</th>
                          <th className="py-3 px-4 font-bold">Status</th>
                          <th className="py-3 px-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map(inv => (
                          <tr key={inv.id} className="border-b border-slate-100 dark:border-slate-850 last:border-0 hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                            <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white">{inv.id}</td>
                            <td className="py-3.5 px-4 text-slate-500">{inv.date}</td>
                            <td className="py-3.5 px-4 text-slate-800 dark:text-white font-bold">PKR {inv.amount}</td>
                            <td className="py-3.5 px-4">
                              <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">{inv.status}</span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleDownloadInvoice(inv.id)}
                                className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
                              >
                                <Download className="w-3.5 h-3.5" /> PDF
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* Tab: Tax Profile (NTN) */}
              {activeTab === 'tax' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                  {/* Tax Profile Form */}
                  <div className="md:col-span-8">
                    <Card variant="glass" className="p-6">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-400" /> Pakistani Tax & NTN Profile
                      </h3>

                      <form onSubmit={handleSaveTax} className="space-y-4 text-xs font-medium">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">Registered Billing Name</label>
                            <input
                              type="text"
                              value={billingName}
                              onChange={(e) => setBillingName(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-primary outline-none text-slate-800 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">NTN Number (National Tax No.)</label>
                            <input
                              type="text"
                              value={ntnNo}
                              onChange={(e) => setNtnNo(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-primary outline-none text-slate-800 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">Company Office Address</label>
                          <input
                            type="text"
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-primary outline-none text-slate-800 dark:text-white"
                          />
                        </div>

                        <div className="flex justify-end pt-2">
                          <Button type="submit" variant="primary" className="bg-primary hover:bg-primary-container text-white py-2 px-6 rounded-xl font-bold text-xs">
                            Save Tax Info
                          </Button>
                        </div>
                      </form>
                    </Card>
                  </div>

                  {/* Tax Note */}
                  <div className="md:col-span-4">
                    <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 text-xs text-left space-y-3">
                      <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wide">FBR Invoice Policy</span>
                      <p className="text-slate-500 leading-relaxed">Providing a verified NTN updates tax deductions automatically in invoice records, complying with FBR healthcare services tax requirements in Pakistan.</p>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab: Team Seats */}
              {activeTab === 'team' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                  {/* Left List */}
                  <div className="md:col-span-8">
                    <Card variant="glass" className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" /> Invite Clinical Collaborators
                        </h3>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{teamMembers.length} / 5 Seats Occupied</span>
                      </div>

                      {/* Invite form */}
                      <form onSubmit={handleInviteMember} className="flex gap-3 mb-6">
                        <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 focus-within:border-primary/50 transition-colors">
                          <Mail className="w-4 h-4 text-slate-400 mr-2" />
                          <input
                            type="email"
                            placeholder="collaborator@clinic.com"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            className="bg-transparent border-none outline-none text-xs w-full py-2.5 text-slate-800 dark:text-white placeholder:text-slate-450 focus:ring-0 p-0"
                          />
                        </div>
                        <Button type="submit" className="bg-primary hover:bg-primary-container text-white py-2 px-5 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5" /> Invite
                        </Button>
                      </form>

                      {/* Members List */}
                      <div className="space-y-3">
                        {teamMembers.map((member, i) => (
                          <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/50 flex justify-between items-center text-xs font-medium">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase">
                                {member.email[0]}
                              </div>
                              <div>
                                <p className="text-slate-805 dark:text-white font-bold">{member.email}</p>
                                <p className="text-slate-400 mt-0.5 text-[10px]">{member.role}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.email)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Right Policy */}
                  <div className="md:col-span-4">
                    <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 text-xs text-left space-y-3">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <Users className="w-5 h-5" />
                        <span className="uppercase tracking-wider">Multi-User Seats</span>
                      </div>
                      <p className="text-slate-500 leading-relaxed">Workspace seats allow team physicians and pharmacists to securely verify uploaded prescriptions under a single billing account.</p>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
