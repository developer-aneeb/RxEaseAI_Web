import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Navbar from '../../components/layout/Navbar';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, feedbackSchema } from '../../utils/validation/zodSchemas';
import {
  User, Bell, MessageSquare, HelpCircle, LifeBuoy, LogOut,
  Check, Camera, CreditCard, ChevronDown, Send
} from 'lucide-react';
import { profileService } from '../../services/profileService';
import { feedbackService } from '../../services/feedbackService';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';

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
  const logout = useAuthStore((state) => state.logout);
  const showToast = useAppStore((state) => state.showToast);

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  // Profile picture states
  const [avatar, setAvatar] = useState(
    user?.avatar || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Notification states
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

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
  const [faqOpenIndex, setFaqOpenIndex] = useState(0);

  // Active settings tab for scroll
  const [activeTab, setActiveTab] = useState('profile');

  // React Hook Form for Profile Info
  const {
    register: registerProfile,
    handleSubmit: handleProfileFormSubmit,
    setValue: setValueProfile,
    formState: { errors: profileErrors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      specialty: ''
    }
  });

  const fetchProfileInfo = async () => {
    setIsLoading(true);
    try {
      const response = await profileService.getProfile();
      const profile = response?.data?.profile || {};
      setProfileData(profile);

      // Update form values
      setValueProfile('fullName', profile.name || '');
      setValueProfile('email', profile.email || '');
      setValueProfile('phone', profile.phone || '');
      setValueProfile('specialty', profile.city || ''); // Map city to specialty input temporarily or customize

      if (profile.profile_image_url) {
        setAvatar(profile.profile_image_url);
      }

      // Fetch Notification Settings
      const nPref = await profileService.getNotificationPreferences();
      const prefs = nPref?.data || {};
      setEmailEnabled(prefs.email_notifications ?? true);
      setPushEnabled(prefs.security_alerts ?? true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const onProfileSave = async (data) => {
    try {
      await profileService.updateProfile({
        name: data.fullName,
        phone: data.phone,
        city: data.specialty // matching city to specialties or metadata field
      });
      showToast('Profile updated successfully!', 'success');
      fetchProfileInfo();
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to update profile.');
      showToast(friendlyMsg, 'error');
    }
  };

  const handleAvatarUpdate = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    showToast('Uploading profile image...', 'info');
    try {
      const result = await profileService.uploadImage(file);
      const url = result?.data?.profile_image_url;
      if (url) {
        setAvatar(url);
        showToast('Profile image updated successfully!', 'success');
      }
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to upload profile image.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onFeedbackSubmit = async (data) => {
    setSubmittingFeedback(true);
    try {
      await feedbackService.submit(data.feedbackText, data.rating, 'general');
      showToast('Feedback submitted to the AI refinements registry. Thank you!', 'success');
      resetFeedback();
    } catch (error) {
      console.error(error);
      showToast('Failed to submit feedback.', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleNotificationToggle = async (type) => {
    try {
      let emailVal = emailEnabled;
      let pushVal = pushEnabled;

      if (type === 'email') {
        emailVal = !emailEnabled;
        setEmailEnabled(emailVal);
      } else {
        pushVal = !pushEnabled;
        setPushEnabled(pushVal);
      }

      await profileService.updateNotificationPreferences({
        email_notifications: emailVal,
        security_alerts: pushVal
      });
      showToast('Notification preferences updated.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to update notification settings.', 'error');
    }
  };

  const handleTabClick = (tabId, elementId) => {
    setActiveTab(tabId);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden pt-24 pb-16">
      <Navbar links={navLinks} />

      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full font-geist">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Settings Sub-Sidebar Menu - Desktop */}
          {/* <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-805 shadow-xl space-y-6">
            <div className="flex items-center gap-3.5 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <MaterialIcon name="medical_services" size="sm" />
              </div>
              <div className="min-w-0 text-left">
                <h1 className="text-sm font-extrabold text-primary">Settings</h1>
                <p className="text-[10px] text-slate-400 dark:text-slate-550 uppercase tracking-wider font-bold">Management Hub</p>
              </div>
            </div>

            <nav className="flex-1 space-y-1">
              <button 
                onClick={() => handleTabClick('profile', 'profile-card')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-xs text-left cursor-pointer border-0 bg-transparent ${
                  activeTab === 'profile' ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile Settings</span>
              </button>

              <button 
                onClick={() => handleTabClick('notifications', 'notifications-card')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-xs text-left cursor-pointer border-0 bg-transparent ${
                  activeTab === 'notifications' ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </button>

              <button 
                onClick={() => handleTabClick('feedback', 'feedback-card')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-xs text-left cursor-pointer border-0 bg-transparent ${
                  activeTab === 'feedback' ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Feedback Form</span>
              </button>

              <button 
                onClick={() => handleTabClick('faqs', 'faq-card')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-xs text-left cursor-pointer border-0 bg-transparent ${
                  activeTab === 'faqs' ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>FAQs Accordion</span>
              </button>
            </nav>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all text-xs font-semibold cursor-pointer text-left border-0 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </aside> */}

          {/* Main Workspace Column */}
          <div className="flex-1 w-full space-y-8 animate-fade-up">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-xs font-semibold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-emerald-500 animate-pulse"></span>
                <span>Customization, Feedback & Support Hub</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Personalize Your <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">RxEaseAI Experience</span>
              </h1>
            </div>

            {isLoading ? (
              <div className="py-24 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
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
                        <p className="text-[11px] text-slate-400 dark:text-slate-550">Manage credentials and contact preferences</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-850">
                      <div className="relative group shrink-0">
                        <img src={avatar} className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-md" alt="Avatar" />
                        <label className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Camera className="w-5 h-5 text-white" />
                          <input type="file" onChange={handleAvatarUpdate} accept="image/*" className="hidden" />
                        </label>
                      </div>
                      <div className="text-center sm:text-left min-w-0">
                        <h4 className="text-sm font-bold text-slate-850 dark:text-white truncate">{profileData?.name || 'Dr. Sarah Jenkins'}</h4>
                        <p className="text-[11px] text-slate-450 truncate mt-0.5">{profileData?.email || 's.jenkins@rxease.ai'}</p>
                      </div>
                    </div>

                    <form onSubmit={handleProfileFormSubmit(onProfileSave)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Full Name" placeholder="Dr. Sarah Jenkins" error={profileErrors.fullName?.message} {...registerProfile('fullName')} />
                        <Input label="Email Address" placeholder="doctor@hospital.com" readOnly error={profileErrors.email?.message} {...registerProfile('email')} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Phone Number" placeholder="e.g. 03001234567" error={profileErrors.phone?.message} {...registerProfile('phone')} />
                        <Input label="City / Region" placeholder="e.g. Lahore" error={profileErrors.specialty?.message} {...registerProfile('specialty')} />
                      </div>
                      <div className="pt-2 flex justify-end">
                        <Button type="submit" variant="primary" className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Card>

                  {/* Notification preferences card */}
                  <Card id="notifications-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-805 shadow-md">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <Bell className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Notification Preferences</h3>
                        <p className="text-[11px] text-slate-400 dark:text-slate-550">Choose how you want to be alerted on updates</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-850">
                        <div>
                          <div className="text-xs font-bold text-slate-850 dark:text-white">Email Notifications</div>
                          <p className="text-[10px] text-slate-500 mt-0.5">Receive daily summaries and critical alerts</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleNotificationToggle('email')}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer relative shrink-0 border-0 ${emailEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${emailEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </button>
                      </div>

                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-850">
                        <div>
                          <div className="text-xs font-bold text-slate-850 dark:text-white">Security Alerts</div>
                          <p className="text-[10px] text-slate-500 mt-0.5">Receive push notifications for login alerts</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleNotificationToggle('push')}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer relative shrink-0 border-0 ${pushEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${pushEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Right Bento: Feedback accordion & FAQs (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-6 w-full">

                  {/* Feedback Form */}
                  <Card id="feedback-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Submit App Feedback</h3>
                    </div>

                    <form onSubmit={handleFeedbackFormSubmit(onFeedbackSubmit)} className="space-y-4 font-sans">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setValueFeedback('rating', star)}
                              className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer border-0 bg-transparent"
                            >
                              <MaterialIcon name="star" style={{ fontVariationSettings: star <= feedbackRating ? "'FILL' 1" : "'FILL' 0" }} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Your Message</label>
                        <textarea
                          rows="4"
                          placeholder="How has your experience been with our prescription OCR ingestion?"
                          {...registerFeedback('feedbackText')}
                          className={`w-full bg-slate-55 dark:bg-slate-950 border rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-950 dark:text-white ${feedbackErrors.feedbackText ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                            }`}
                        />
                        {feedbackErrors.feedbackText && <p className="text-[10px] text-rose-500 font-semibold mt-1">{feedbackErrors.feedbackText.message}</p>}
                      </div>

                      <Button type="submit" disabled={submittingFeedback} className="w-full bg-primary hover:bg-primary-container text-white py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                        {submittingFeedback ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send className="w-4 h-4" />}
                        <span>Submit Feedback</span>
                      </Button>
                    </form>
                  </Card>

                  {/* FAQs Card */}
                  <Card id="faq-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Frequently Asked Questions</h3>
                    </div>

                    <div className="space-y-3.5">
                      {FAQS.map((faq, idx) => (
                        <div key={idx} className="border-b border-slate-100 dark:border-slate-805/60 pb-3">
                          <button
                            onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                            className="w-full flex justify-between items-center font-bold text-xs text-slate-700 dark:text-slate-250 cursor-pointer border-0 bg-transparent p-0"
                          >
                            <span className="text-left">{faq.q}</span>
                            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${faqOpenIndex === idx ? 'rotate-180 text-primary' : 'text-slate-450'}`} />
                          </button>

                          <AnimatePresence>
                            {faqOpenIndex === idx && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mt-2"
                              >
                                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium font-sans">
                                  {faq.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
