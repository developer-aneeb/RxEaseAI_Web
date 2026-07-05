import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Navbar from '../../components/layout/Navbar';
import Input from '../../components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, feedbackSchema, supportTicketSchema } from '../../utils/validation/zodSchemas';
import { 
  User, Bell, MessageSquare, HelpCircle, LifeBuoy, LogOut, 
  Check, Camera, CreditCard, ChevronDown, Send
} from 'lucide-react';

const FAQS = [
  {
    q: "How accurate is the RxEaseAI OCR engine?",
    a: "Our clinical vision models achieve a 99.8% extraction accuracy on high-resolution clinical prescription documents, utilizing advanced character-segmentation and clinical FHIR dictionary checks."
  },
  {
    q: "Are patient records HIPAA compliant?",
    a: "Yes, RxEaseAI enforces strict HIPAA-compliant protocols. All patient identifier nodes (FHIR resources) are fully encrypted at rest and in transit using industry-standard SSL and AES-256."
  },
  {
    q: "Can I review and edit OCR extracted medicine data before saving?",
    a: "Yes! After uploading or scanning a prescription document, our clinical result workspace provides an interactive review panel where you can edit dosages, frequencies, and drug names before final clinical verification."
  },
  {
    q: "How do I download or share my verified prescription reports?",
    a: "You can download single or multiple prescription analysis reports in PDF format directly from the Prescription History page, or generate secure sharing links for patients and collaborating physicians."
  },
  {
    q: "What should I do if a potential drug-drug interaction is flagged?",
    a: "When the system flags a severe contraindication or drug interaction, review the clinical severity badge and the AI-suggested therapeutic alternatives before dispensing or finalizing the treatment regimen."
  },
  {
    q: "Can I customize notification alert groups and frequency?",
    a: "Yes! In the Notification Preferences card on this page, you can toggle instant mobile push notifications, weekly adherence email digests, and critical safety SMS alerts."
  }
];

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const showToast = useAppStore((state) => state.showToast);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || 'Dr. Sarah Jenkins',
      email: user?.email || 's.jenkins@rxease.ai',
      phone: user?.phone || '+1 (555) 392-8192',
      specialty: user?.specialty || 'Senior Clinical Pharmacist',
    }
  });

  const [avatar, setAvatar] = useState(
    user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAn0xuu7bSFhPne6CVzx4AFbRMxKOzm2Gx0nXd6yHEWhA8fanIR_L9wOY_MhKDbcTU7u6--77gXZKmPSiOLERPLuFsm1Q61vyEq85COf05chN2JTVDRZs0-TJwF5lMI9vTcGaeXD9jME7TFuoGVu-V9ghm_HGzbJVs4G3vUKH0f4pZTl-UELHyG3U--IdXvmeWy9m61QRE2gz1IGMyF1BxJheVLjlr1Tzi3q5wDRtXRgWuR6zs9j9A9i5i3pOTKXM8kDQIid1KDBw'
  );

  // Notification states
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  // Feedback form
  const {
    register: registerFeedback,
    handleSubmit: handleFeedbackFormSubmit,
    setValue: setValueFeedback,
    watch: watchFeedback,
    reset: resetFeedback,
    formState: { errors: feedbackErrors }
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 5,
      feedbackText: ''
    }
  });

  const feedbackRating = watchFeedback('rating');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Accordion states
  const [faqOpenIndex, setFaqOpenIndex] = useState(0); // Open first FAQ by default for immediate visual richness

  // Support form
  const {
    register: registerSupport,
    handleSubmit: handleSupportFormSubmit,
    reset: resetSupport,
    formState: { errors: supportErrors }
  } = useForm({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      subject: '',
      description: ''
    }
  });

  const [submittingSupport, setSubmittingSupport] = useState(false);

  // Active settings tab for scroll/highlight mapping
  const [activeTab, setActiveTab] = useState('profile');

  const onProfileSave = (data) => {
    // Update local store user object so it reflects reactively in the header/dashboard
    setUser({
      ...user,
      ...data,
      avatar: avatar
    });
    showToast('Clinical profile settings updated successfully!', 'success');
  };

  const handleAvatarUpdate = () => {
    showToast('Avatar updates are simulated. High-resolution portrait validated!', 'info');
  };

  const onFeedbackSubmit = (data) => {
    setSubmittingFeedback(true);
    setTimeout(() => {
      showToast('Feedback submitted to the AI refinement registry. Thank you!', 'success');
      resetFeedback();
      setSubmittingFeedback(false);
    }, 1200);
  };

  const onSupportSubmit = (data) => {
    setSubmittingSupport(true);
    setTimeout(() => {
      showToast(`Support ticket opened successfully. Ticket Ref: RXE-${Math.floor(1000 + Math.random() * 9000)}`, 'success');
      resetSupport();
      setSubmittingSupport(false);
    }, 1500);
  };

  const handleUpgradePlan = () => {
    window.location.hash = '#billing';
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
    { name: 'Settings', href: '#settings' }
  ];

  const handleTabClick = (tabId, elementId) => {
    setActiveTab(tabId);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden pt-24 pb-16">
      <Navbar links={navLinks} />

      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-tertiary/15 blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full font-geist">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Settings Sub-Sidebar Menu - Desktop */}
          <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3.5 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <MaterialIcon name="medical_services" size="sm" />
              </div>
              <div className="min-w-0 text-left">
                <h1 className="text-sm font-extrabold text-primary">Settings</h1>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Management Hub</p>
              </div>
            </div>

            <nav className="flex-1 space-y-1">
              <button 
                onClick={() => handleTabClick('profile', 'profile-card')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-xs text-left cursor-pointer ${
                  activeTab === 'profile' ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile Settings</span>
              </button>

              <button 
                onClick={() => handleTabClick('notifications', 'notifications-card')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-xs text-left cursor-pointer ${
                  activeTab === 'notifications' ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </button>

              <button 
                onClick={() => handleTabClick('feedback', 'feedback-card')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-xs text-left cursor-pointer ${
                  activeTab === 'feedback' ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Feedback Form</span>
              </button>

              <button 
                onClick={() => handleTabClick('faqs', 'faq-card')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-xs text-left cursor-pointer ${
                  activeTab === 'faqs' ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>FAQs Accordion</span>
              </button>

              <button 
                onClick={() => handleTabClick('support', 'support-card')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-xs text-left cursor-pointer ${
                  activeTab === 'support' ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <LifeBuoy className="w-4 h-4" />
                <span>Support Center</span>
              </button>
            </nav>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <Button 
                variant="primary" 
                onClick={handleUpgradePlan}
                className="w-full text-xs py-2 bg-gradient-to-r from-primary to-indigo-600 text-white font-semibold rounded-xl shadow-md cursor-pointer"
              >
                Upgrade Plan
              </Button>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all text-xs font-semibold cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* Main Workspace Column */}
          <div className="flex-1 w-full space-y-8">

            {/* Header section */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-xs font-semibold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-emerald-500 animate-pulse"></span>
                <span>Customization, Feedback & Support Hub</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Personalize Your <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">RxEaseAI Experience</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                Manage your clinical dashboard profile, configure intelligent compliance notification alerts, explore FAQs, and support our model refinements.
              </p>
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left Bento: Profile settings & Notification pref (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6 w-full">

                {/* Profile settings card */}
                <Card id="profile-card" variant="glass" className="p-6 relative overflow-hidden bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                  
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <MaterialIcon name="manage_accounts" size="sm" className="text-primary" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Profile Settings</h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">Manage clinician credentials and contact preferences</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                      {/* Avatar container */}
                      <div className="flex flex-col items-center gap-2.5 shrink-0">
                        <div onClick={handleAvatarUpdate} className="relative group cursor-pointer w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-md">
                          <img src={avatar} alt="Doctor profile" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Camera className="w-4 h-4" />
                          </div>
                        </div>
                        <button type="button" onClick={handleAvatarUpdate} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wide cursor-pointer">Update Avatar</button>
                      </div>

                      {/* Fields */}
                      <div className="flex-1 w-full space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input 
                            label="Full Name" 
                            error={profileErrors.fullName?.message} 
                            {...registerProfile('fullName')} 
                          />
                          <Input 
                            label="Specialty / Role" 
                            error={profileErrors.specialty?.message} 
                            {...registerProfile('specialty')} 
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input 
                            type="email" 
                            label="Email Address" 
                            error={profileErrors.email?.message} 
                            {...registerProfile('email')} 
                          />
                          <Input 
                            label="Phone Number (SMS Alert Target)" 
                            error={profileErrors.phone?.message} 
                            {...registerProfile('phone')} 
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Clinical ID (Verified License Ref)</label>
                          <input 
                            type="text" 
                            value="RXE-492-881" 
                            disabled
                            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-2.5 text-xs text-slate-400 dark:text-slate-500 cursor-not-allowed font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Billing Tier subcard */}
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Active Subscription Plan</p>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">Enterprise AI Tier (Unlimited OCR & Analytics)</p>
                        </div>
                      </div>
                      <button type="button" onClick={handleUpgradePlan} className="text-xs font-bold text-primary hover:underline cursor-pointer">Manage Billing</button>
                    </div>

                    {/* Form actions */}
                    <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                      <Button type="submit" variant="primary" className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        <span>Save Profile Settings</span>
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* Notifications Preferences card */}
                <Card id="notifications-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <MaterialIcon name="notifications_active" size="sm" className="text-emerald-500" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Notification Preferences</h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">Configure real-time clinical alerts and report delivery</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Toggle 1: Push notifications */}
                    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <div className="max-w-[80%]">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Push Notifications</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Receive instant on-screen browser alerts for critical diagnostic OCR extractions and interaction flags.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => { setPushEnabled(!pushEnabled); showToast(`Push notifications ${!pushEnabled ? 'enabled' : 'disabled'}`, 'info'); }}
                        className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer relative shrink-0 ${pushEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </button>
                    </div>

                    {/* Toggle 2: Email alert logs */}
                    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <div className="max-w-[80%]">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Email Compliance Alerts</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Receive weekly adherence digests, dosage schedules, and clinical audit logs directly in your mailbox.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => { setEmailEnabled(!emailEnabled); showToast(`Email compliance reports ${!emailEnabled ? 'enabled' : 'disabled'}`, 'info'); }}
                        className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer relative shrink-0 ${emailEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${emailEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </button>
                    </div>

                    {/* Toggle 3: SMS warnings */}
                    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <div className="max-w-[80%]">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">SMS Reminders & Flags</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Send instant SMS notifications to {phone} when high-risk drug safety interactions are detected.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => { setSmsEnabled(!smsEnabled); showToast(`SMS interactions warnings ${!smsEnabled ? 'enabled' : 'disabled'}`, 'info'); }}
                        className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer relative shrink-0 ${smsEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${smsEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                  </div>
                </Card>

              </div>

              {/* Right Bento: Feedback form, FAQ accordion, Support (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6 w-full">

                {/* Feedback Form Card */}
                <Card id="feedback-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <MaterialIcon name="rate_review" size="sm" className="text-tertiary" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">AI Feedback Portal</h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">Help refine our clinical vision and recommendation models</p>
                    </div>
                  </div>

                  <form onSubmit={handleFeedbackFormSubmit(onFeedbackSubmit)} className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Interface Refinement Score</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setValueFeedback('rating', star)}
                            className="p-1 focus:outline-none hover:scale-110 transition-transform cursor-pointer"
                            title={`Rate ${star} out of 5 stars`}
                          >
                            <span className={`material-symbols-outlined text-[26px] ${star <= feedbackRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} style={{ fontVariationSettings: star <= feedbackRating ? "'FILL' 1" : "'FILL' 0" }}>
                              star
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Input
                      type="textarea"
                      label="Clinician Comments & Observations"
                      placeholder="Share feedback on OCR character recognition accuracy, drug interaction alerts, or clinical recommendations..."
                      error={feedbackErrors.feedbackText?.message}
                      {...registerFeedback('feedbackText')}
                    />

                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={submittingFeedback}
                      className="w-full bg-tertiary hover:bg-tertiary/90 text-white py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 transition-all"
                    >
                      {submittingFeedback ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Clinical Feedback</span>
                        </>
                      )}
                    </Button>
                  </form>
                </Card>

                {/* FAQ Accordion Card */}
                <Card id="faq-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <MaterialIcon name="quiz" size="sm" className="text-primary" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Frequently Asked Questions</h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">Quick answers on OCR, HIPAA compliance, and data security</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {FAQS.map((faq, idx) => {
                      const isOpen = faqOpenIndex === idx;
                      return (
                        <div key={idx} className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-3">
                          <button
                            type="button"
                            onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                            className="w-full flex justify-between items-center text-left py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer hover:text-primary transition-colors focus:outline-none gap-2"
                          >
                            <span>{faq.q}</span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                          </button>
                          
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-normal bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                                  {faq.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Support ticket submission */}
                <Card id="support-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <MaterialIcon name="contact_support" size="sm" className="text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Help & Technical Support</h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">Need direct assistance from our engineering team?</p>
                    </div>
                  </div>

                  <form onSubmit={handleSupportFormSubmit(onSupportSubmit)} className="space-y-3">
                    <Input 
                      placeholder="Ticket Subject (e.g., HL7 FHIR Export Error)..."
                      error={supportErrors.subject?.message}
                      {...registerSupport('subject')}
                    />
                    <Input
                      type="textarea"
                      placeholder="Describe the technical issue, device browser, or error code you are encountering..."
                      error={supportErrors.description?.message}
                      {...registerSupport('description')}
                    />

                    <Button 
                      type="submit" 
                      variant="outline" 
                      disabled={submittingSupport}
                      className="w-full border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 transition-all"
                    >
                      {submittingSupport ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
                      ) : (
                        <>
                          <LifeBuoy className="w-3.5 h-3.5 text-primary" />
                          <span>Open Support Ticket</span>
                        </>
                      )}
                    </Button>
                  </form>
                </Card>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
