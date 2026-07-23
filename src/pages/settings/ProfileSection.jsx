import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Camera, CheckCircle2, Shield, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import MaterialIcon from '../../components/ui/MaterialIcon';
import { profileService } from '../../services/profileService';
import { useAppStore } from '../../store/useAppStore';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import { profileSchema } from '../../utils/validation/zodSchemas';

export default function ProfileSection({ profileData, avatar, setAvatar, onSaveSuccess }) {
  const showToast = useAppStore((state) => state.showToast);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      specialty: '',
      date_of_birth: '',
      gender: '',
      blood_group: '',
      height: '',
      weight: '',
      address: '',
      city: '',
      province: '',
      country: ''
    }
  });

  const genderValue = watch('gender');
  const bloodGroupValue = watch('blood_group');

  useEffect(() => {
    if (profileData) {
      setValue('fullName', profileData.name || '');
      setValue('email', profileData.email || '');
      setValue('phone', profileData.phone || '');

      // Display role nicely
      let displayRole = 'General User';
      if (profileData.role) {
        displayRole = profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1);
      } else if (profileData.role_id === 1) {
        displayRole = 'Administrator';
      }
      setValue('specialty', displayRole);

      setValue('date_of_birth', profileData.date_of_birth ? profileData.date_of_birth.substring(0, 10) : '');
      setValue('gender', profileData.gender || '');
      setValue('blood_group', profileData.blood_group || '');
      setValue('height', profileData.height ? String(profileData.height) : '');
      setValue('weight', profileData.weight ? String(profileData.weight) : '');
      setValue('address', profileData.address || '');
      setValue('city', profileData.city || '');
      setValue('province', profileData.province || '');
      setValue('country', profileData.country || 'Pakistan');
    }
  }, [profileData, setValue]);

  const onProfileSave = async (data) => {
    setIsSaving(true);
    try {
      const parsedHeight = data.height ? parseFloat(data.height) : null;
      const parsedWeight = data.weight ? parseFloat(data.weight) : null;

      await profileService.updateProfile({
        name: data.fullName.trim(),
        phone: data.phone?.trim() || null,
        date_of_birth: data.date_of_birth || null,
        gender: data.gender || null,
        blood_group: data.blood_group || null,
        height: !isNaN(parsedHeight) ? parsedHeight : null,
        weight: !isNaN(parsedWeight) ? parsedWeight : null,
        address: data.address?.trim() || null,
        city: data.city?.trim() || null,
        province: data.province?.trim() || null,
        country: data.country?.trim() || 'Pakistan'
      });
      showToast('Profile settings saved successfully.', 'success');
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to update profile.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsSaving(false);
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
        onSaveSuccess();
      }
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to upload profile image.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!profileData?.profile_image_url && avatar.includes('photo-1612349317150')) {
      showToast('No custom profile photo is currently uploaded.', 'warning');
      return;
    }
    showToast('Removing profile image...', 'info');
    try {
      await profileService.deleteImage();
      setAvatar('https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face');
      showToast('Profile image removed successfully!', 'success');
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      showToast('Failed to remove profile image.', 'error');
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const hasCustomAvatar = Boolean(profileData?.profile_image_url || !avatar.includes('photo-1612349317150'));

  return (
    <Card id="profile-card" variant="glass" className="p-6 relative overflow-hidden bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>

      <div className="flex items-center gap-2 mb-6 border-b border-slate-105 dark:border-slate-800 pb-3">
        <MaterialIcon name="manage_accounts" size="sm" className="text-primary" />
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Profile Settings</h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Manage identity credentials, biometric parameters, and contact preferences</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
        <div className="relative group shrink-0">
          <img src={avatar} className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-md" alt="User Avatar" />
          <label className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="w-5 h-5 text-white" />
            <input type="file" onChange={handleAvatarUpdate} accept="image/jpeg,image/png,image/jpg,image/gif" className="hidden" />
          </label>
        </div>
        <div className="text-center sm:text-left min-w-0 flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-slate-850 dark:text-white truncate">{profileData?.name || 'RxEaseAI User'}</h4>
            {profileData?.is_active !== undefined && (
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${profileData.is_active ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600'
                }`}>
                {profileData.is_active ? 'Active Account' : 'Deactivated'}
              </span>
            )}
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1">
            <p className="text-[11px] text-slate-500 truncate">{profileData?.email}</p>
            {profileData?.email_verified !== undefined && (
              profileData.email_verified ? (
                <span title="Email Verified" className="text-emerald-500 flex items-center gap-0.5 text-[10px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <span title="Email Not Verified" className="text-amber-500 flex items-center gap-0.5 text-[10px] font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> Unverified
                </span>
              )
            )}
          </div>
          {hasCustomAvatar && (
            <button
              type="button"
              onClick={handleAvatarDelete}
              className="mt-2 text-[10px] text-rose-500 hover:text-rose-700 flex items-center gap-1 font-bold bg-transparent border-0 cursor-pointer p-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Photo</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onProfileSave)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="Enter your full name" error={errors.fullName?.message} {...register('fullName')} />

          <div className="relative">
            <Input
              label="Email Address (Locked)"
              placeholder="user@rxeaseai.com"
              readOnly
              className="bg-slate-100 dark:bg-slate-950 text-slate-500 cursor-not-allowed pr-10"
              error={errors.email?.message}
              {...register('email')}
            />
            <Shield className="w-4 h-4 text-slate-400 absolute right-3 top-[34px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Phone Number" placeholder="e.g. +923001234567" error={errors.phone?.message} {...register('phone')} />
          <Input label="City / Region" placeholder="e.g. Lahore" error={errors.city?.message} {...register('city')} />
          <Input label="Province" placeholder="e.g. Punjab" error={errors.province?.message} {...register('province')} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Country" placeholder="e.g. Pakistan" error={errors.country?.message} {...register('country')} />
          <Input label="Date of Birth" type="date" error={errors.date_of_birth?.message} {...register('date_of_birth')} />

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Gender</span>
            <div className="flex gap-4 h-[44px] items-center">
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    value={g}
                    checked={genderValue === g}
                    onChange={() => setValue('gender', g)}
                    className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Blood Group</label>
            <select
              value={bloodGroupValue || ''}
              onChange={(e) => setValue('blood_group', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-3 text-xs outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white h-[46px] font-semibold"
            >
              <option value="">Select Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <Input label="Height (cm)" placeholder="e.g. 175" type="number" step="0.1" error={errors.height?.message} {...register('height')} />
          <Input label="Weight (kg)" placeholder="e.g. 70" type="number" step="0.1" error={errors.weight?.message} {...register('weight')} />

          <div className="relative">
            <Input
              label="Assigned Role (Locked)"
              placeholder="General User"
              readOnly
              className="bg-slate-100 dark:bg-slate-950 text-slate-500 cursor-not-allowed pr-10 font-bold"
              error={errors.specialty?.message}
              {...register('specialty')}
            />
            <Shield className="w-4 h-4 text-slate-400 absolute right-3 top-[34px]" />
          </div>
        </div>

        <Input label="Residential Address" placeholder="e.g. 123 Main Street" error={errors.address?.message} {...register('address')} />

        <div className="pt-2 flex justify-end">
          <Button type="submit" disabled={isSaving} variant="primary" className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer">
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  );
}