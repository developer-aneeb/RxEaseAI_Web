import { AlertTriangle, Bell, CheckCircle2, KeyRound, RefreshCw, ShieldCheck, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';

import AllergySection from './Allergy';
import EmergencyContactSection from './EmergencyContact';
import FaqSection from './FaqSection';
import FeedbackSection from './FeedbackSection';
import MedicalInfoSection from './MedicalInfo';
import ProfileSection from './ProfileSection';
import SideNavbar from './SideNavbar';

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

  // 2FA states
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [setupStep, setSetupStep] = useState(null); // null | 'setup' | 'backup_codes'
  const [qrData, setQrData] = useState(null);
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [isDeactivating, setIsDeactivating] = useState(false);

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

      // Fetch 2FA status
      try {
        const twoFaRes = await authService.get2FAStatus();
        setIs2FAEnabled(Boolean(twoFaRes?.data?.enabled || twoFaRes?.enabled || profile.is_2fa_enabled));
      } catch (err) {
        console.warn('2FA status check fallback:', err);
      }
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

  // ── 2FA Handlers ──
  const handleSetup2FA = async () => {
    setIs2FALoading(true);
    try {
      const res = await authService.setup2FA();
      if (res?.data || res?.secret || res?.qrCode) {
        setQrData(res.data || res);
        setSetupStep('setup');
      } else {
        showToast('2FA setup initiated. Check your authenticator app.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to start 2FA setup. Make sure your account is verified.', 'error');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!otpCodeInput.trim()) {
      showToast('Please enter the 6-digit code from your authenticator app.', 'warning');
      return;
    }
    setIs2FALoading(true);
    try {
      const res = await authService.verify2FA(otpCodeInput.trim());
      setIs2FAEnabled(true);
      setSetupStep(null);
      setOtpCodeInput('');
      if (res?.data?.backupCodes || res?.backupCodes) {
        setBackupCodes(res?.data?.backupCodes || res?.backupCodes || []);
        setSetupStep('backup_codes');
      }
      showToast('Two-Factor Authentication verified and enabled!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Invalid verification code. Please try again.', 'error');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm('Are you sure you want to disable Two-Factor Authentication? This decreases your account security.')) {
      return;
    }
    setIs2FALoading(true);
    try {
      await authService.disable2FA();
      setIs2FAEnabled(false);
      showToast('Two-Factor Authentication disabled.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to disable 2FA.', 'error');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    setIs2FALoading(true);
    try {
      const res = await authService.regenerateBackupCodes();
      const codes = res?.data?.backupCodes || res?.backupCodes || [];
      if (codes.length > 0) {
        setBackupCodes(codes);
        setSetupStep('backup_codes');
        showToast('New backup codes generated successfully!', 'success');
      } else {
        showToast('Backup codes regenerated.', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to regenerate backup codes.', 'error');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleAccountDeactivation = async () => {
    if (!window.confirm('CRITICAL: Are you sure you want to deactivate your account? You will be logged out immediately.')) {
      return;
    }
    setIsDeactivating(true);
    try {
      await authService.deactivateAccount();
      showToast('Account deactivated successfully.', 'info');
      logout();
    } catch (err) {
      console.error(err);
      showToast('Failed to deactivate account.', 'error');
    } finally {
      setIsDeactivating(false);
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
                      <p className="text-[11px] text-slate-400 dark:text-slate-550">Update registered email address and manage multi-factor authentication</p>
                    </div>
                  </div>

                  {/* Email Update Form */}
                  <form onSubmit={handleSecuritySubmit(onSecuritySave)} className="space-y-4 mb-8">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Change Email Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="New Email Address" type="email" placeholder="user@rxeaseai.com" error={securityErrors.newEmail?.message} {...registerSecurity('newEmail', { required: 'New email is required' })} />
                      <Input label="Current Password" type="password" placeholder="Confirm your password" error={securityErrors.currentPassword?.message} {...registerSecurity('currentPassword', { required: 'Password validation required' })} />
                    </div>
                    <div className="pt-2 flex justify-end">
                      <Button type="submit" disabled={isUpdatingEmail} variant="primary" className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer">
                        {isUpdatingEmail ? 'Updating...' : 'Update Email Address'}
                      </Button>
                    </div>
                  </form>

                  {/* Two-Factor Authentication (2FA) */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-2xl bg-primary/10 text-primary mt-0.5">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Two-Factor Authentication (2FA)</h4>
                            {is2FAEnabled ? (
                              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Enabled
                              </span>
                            ) : (
                              <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Disabled
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            Add an extra layer of clinical security using TOTP apps (Google Authenticator, Authy).
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {is2FAEnabled ? (
                          <>
                            <Button
                              type="button"
                              onClick={handleRegenerateBackupCodes}
                              disabled={is2FALoading}
                              variant="outline"
                              className="px-4 py-2 rounded-xl text-xs font-bold border-slate-200 dark:border-slate-800 cursor-pointer flex items-center gap-1.5"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${is2FALoading ? 'animate-spin' : ''}`} />
                              <span>Backup Codes</span>
                            </Button>
                            <Button
                              type="button"
                              onClick={handleDisable2FA}
                              disabled={is2FALoading}
                              className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border-0"
                            >
                              {is2FALoading ? 'Disabling...' : 'Disable 2FA'}
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="button"
                            onClick={handleSetup2FA}
                            disabled={is2FALoading}
                            variant="primary"
                            className="bg-primary text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>{is2FALoading ? 'Starting...' : 'Enable 2FA'}</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* 2FA Setup Step Modal/Section */}
                    {setupStep === 'setup' && qrData && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 mt-4 animate-fade-in">
                        <h5 className="text-xs font-bold text-slate-800 dark:text-white">Step 1: Scan QR Code or enter Secret</h5>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {qrData.qrCode || qrData.qrCodeUrl ? (
                            <img src={qrData.qrCode || qrData.qrCodeUrl} alt="2FA QR Code" className="w-36 h-36 bg-white p-2 rounded-xl shadow border border-slate-200" />
                          ) : null}
                          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                            <p>Scan the QR code with your authenticator app, or manually enter this secret key:</p>
                            {qrData.secret && (
                              <code className="bg-slate-200 dark:bg-slate-900 px-3 py-1.5 rounded-lg text-primary font-mono font-bold block w-fit">
                                {qrData.secret}
                              </code>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800 space-y-3">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-white">Step 2: Enter 6-Digit Verification Code</h5>
                          <div className="flex gap-3 items-center max-w-sm">
                            <input
                              type="text"
                              maxLength="6"
                              placeholder="e.g. 123456"
                              value={otpCodeInput}
                              onChange={(e) => setOtpCodeInput(e.target.value)}
                              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-center font-bold tracking-widest outline-none focus:border-primary"
                            />
                            <Button
                              type="button"
                              onClick={handleVerify2FA}
                              disabled={is2FALoading}
                              variant="primary"
                              className="bg-primary text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                            >
                              {is2FALoading ? 'Verifying...' : 'Verify & Activate'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Backup Codes Modal/Section */}
                    {setupStep === 'backup_codes' && backupCodes.length > 0 && (
                      <div className="p-4 bg-amber-500/10 dark:bg-amber-500/5 rounded-2xl border border-amber-500/20 space-y-3 mt-4 animate-fade-in">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Save Your Emergency Backup Codes</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          Store these single-use recovery codes in a secure vault. If you lose access to your phone, you can use one of these codes to sign in.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2">
                          {backupCodes.map((code, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-amber-500/20 text-center font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                              {code}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            onClick={() => setSetupStep(null)}
                            variant="primary"
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs cursor-pointer"
                          >
                            I've Saved My Codes
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account Deactivation / Danger Zone */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
                    <div className="flex justify-between items-center gap-4 flex-wrap p-4 bg-rose-500/5 dark:bg-rose-500/5 rounded-2xl border border-rose-500/20">
                      <div>
                        <h4 className="text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" /> Account Deactivation
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                          Temporarily disable your clinical workspace and revoke active API access tokens.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={handleAccountDeactivation}
                        disabled={isDeactivating}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border-0 shrink-0"
                      >
                        {isDeactivating ? 'Deactivating...' : 'Deactivate Account'}
                      </Button>
                    </div>
                  </div>
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
