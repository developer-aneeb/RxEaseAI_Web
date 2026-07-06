import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Navbar from '../../components/layout/Navbar';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { useForm } from 'react-hook-form';
import { profileService } from '../../services/profileService';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import { Bell, KeyRound } from 'lucide-react';

import FaqSection from './FaqSection';
import FeedbackSection from './FeedbackSection';
import SideNavbar from './SideNavbar';
import ProfileSection from './ProfileSection';
import MedicalInfoSection from './MedicalInfo';
import AllergySection from './Allergy';
import EmergencyContactSection from './EmergencyContact';

export default function SettingsPage() {
  const logout = useAuthStore((state) => state.logout);
  const showToast = useAppStore((state) => state.showToast);

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  // Lists and nested objects
  const [allergies, setAllergies] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  // Avatar state
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
  );

  // Notification states
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  // Active settings tab for scroll
  const [activeTab, setActiveTab] = useState('profile');

  // React Hook Form for Email / Password Security
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const {
    register: registerSecurity,
    handleSubmit: handleSecuritySubmit,
    reset: resetSecurity,
    formState: { errors: securityErrors }
  } = useForm({
    defaultValues: {
      newEmail: '',
      currentPassword: ''
    }
  });

  const fetchProfileInfo = async () => {
    setIsLoading(true);
    try {
      const response = await profileService.getProfile();
      const profile = response?.data?.profile || {};
      setProfileData(profile);

      if (profile.profile_image_url) {
        setAvatar(profile.profile_image_url);
      } else {
        setAvatar('https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face');
      }

      setAllergies(profile.allergies || []);
      setEmergencyContacts(profile.emergency_contacts || []);

      // Fetch Notification Settings
      setEmailEnabled(profile.notification_preferences?.email_notifications ?? true);
      setPushEnabled(profile.notification_preferences?.security_alerts ?? true);
    } catch (error) {
      console.error(error);
      showToast('Failed to retrieve profile data from servers.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

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

  // Email updates
  const onSecuritySave = async (data) => {
    setIsUpdatingEmail(true);
    try {
      await profileService.updateEmail({
        email: data.newEmail,
        current_password: data.currentPassword
      });
      showToast('Re-verification email sent to your new address.', 'success');
      resetSecurity();
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to update email address.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsUpdatingEmail(false);
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
    { name: 'Upload', href: '#upload' },
    { name: 'History', href: '#history' },
    { name: 'Search', href: '#search' },
    { name: 'Reminders', href: '#reminders' },
    { name: 'Notifications', href: '#notifications' },
    { name: 'Billing', href: '#billing' }
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
          <SideNavbar activeTab={activeTab} onTabClick={handleTabClick} onLogout={logout} />

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
              <div className="grid grid-cols-1 gap-8">

                {/* Profile settings card */}
                <ProfileSection
                  profileData={profileData}
                  avatar={avatar}
                  setAvatar={setAvatar}
                  onSaveSuccess={fetchProfileInfo}
                />

                {/* Security settings card */}
                <Card id="security-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <KeyRound className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Security & Email Configuration</h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-550">Update registered email (requires password confirmation)</p>
                    </div>
                  </div>

                  <form onSubmit={handleSecuritySubmit(onSecuritySave)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="New Email Address" type="email" placeholder="new.email@hospital.com" error={securityErrors.newEmail?.message} {...registerSecurity('newEmail', { required: 'New email is required' })} />
                      <Input label="Current Password" type="password" placeholder="Confirm your password" error={securityErrors.currentPassword?.message} {...registerSecurity('currentPassword', { required: 'Password validation required' })} />
                    </div>
                    <div className="pt-2 flex justify-end">
                      <Button type="submit" disabled={isUpdatingEmail} variant="primary" className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer">
                        {isUpdatingEmail ? 'Updating...' : 'Update Email Address'}
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* Notification preferences card */}
                <Card id="notifications-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
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

                {/* Medical Information card */}
                <MedicalInfoSection
                  profileData={profileData}
                  onSaveSuccess={fetchProfileInfo}
                />

                {/* Allergies Registry card */}
                <AllergySection
                  allergies={allergies}
                  onSaveSuccess={fetchProfileInfo}
                />

                {/* Emergency Contacts card */}
                <EmergencyContactSection
                  emergencyContacts={emergencyContacts}
                  onSaveSuccess={fetchProfileInfo}
                />

                {/* Feedback form */}
                <FeedbackSection />

                {/* FAQs accordion */}
                <FaqSection />

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
