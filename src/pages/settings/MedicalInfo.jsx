import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HeartPulse } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { useAppStore } from '../../store/useAppStore';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function MedicalInfoSection({ profileData, onSaveSuccess }) {
  const showToast = useAppStore((state) => state.showToast);
  const [isUpdatingMedical, setIsUpdatingMedical] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      condition_name: '',
      status: 'Active',
      consent_to_share_data: false,
      chronic_diseases_text: '',
      family_history_text: ''
    }
  });

  const statusValue = watch('status');

  useEffect(() => {
    if (profileData) {
      setValue('condition_name', profileData.condition_name || '');
      setValue('status', profileData.status || 'Active');
      setValue('consent_to_share_data', profileData.consent_to_share_data || false);
      setValue('chronic_diseases_text', profileData.chronic_diseases ? JSON.stringify(profileData.chronic_diseases, null, 2) : '');
      setValue('family_history_text', profileData.family_medical_history ? JSON.stringify(profileData.family_medical_history, null, 2) : '');
    }
  }, [profileData, setValue]);

  const onMedicalSave = async (data) => {
    let chronicJson = null;
    let familyJson = null;

    try {
      if (data.chronic_diseases_text.trim()) {
        chronicJson = JSON.parse(data.chronic_diseases_text);
      }
      if (data.family_history_text.trim()) {
        familyJson = JSON.parse(data.family_history_text);
      }
    } catch (parseError) {
      showToast('Chronic Diseases or Family History must be valid JSON objects.', 'error');
      return;
    }

    setIsUpdatingMedical(true);
    try {
      await profileService.updateMedicalInfo({
        condition_name: data.condition_name,
        status: data.status,
        consent_to_share_data: data.consent_to_share_data,
        chronic_diseases: chronicJson,
        family_medical_history: familyJson
      });
      showToast('Medical details updated successfully.', 'success');
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to update medical details.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsUpdatingMedical(false);
    }
  };

  return (
    <Card id="medical-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-101 dark:border-slate-800 pb-3">
        <HeartPulse className="w-5 h-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Medical Information</h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Update clinical conditions, histories, and data sharing consents</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onMedicalSave)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Primary Condition Name" placeholder="e.g. Hypertension" error={errors.condition_name?.message} {...register('condition_name', { required: 'Condition name is required' })} />
          
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-2">Status</span>
            <div className="flex gap-4 h-[44px] items-center">
              {['Active', 'Resolved', 'Chronic'].map((statusOption) => (
                <label key={statusOption} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    value={statusOption}
                    checked={statusValue === statusOption}
                    onChange={() => setValue('status', statusOption)}
                    className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                  />
                  <span>{statusOption}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Chronic Diseases (JSON)</label>
            <textarea
              rows="4"
              placeholder='e.g. { "diabetes": "type-2", "asthma": "mild" }'
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white font-mono"
              {...register('chronic_diseases_text')}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Family Medical History (JSON)</label>
            <textarea
              rows="4"
              placeholder='e.g. { "father": "heart_disease", "mother": "stroke" }'
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white font-mono"
              {...register('family_history_text')}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
          <div className="flex items-center h-5 mt-0.5">
            <input
              id="consent_to_share_data"
              type="checkbox"
              className="w-4 h-4 text-primary border-slate-300 dark:border-slate-700 rounded focus:ring-primary"
              {...register('consent_to_share_data')}
            />
          </div>
          <div>
            <label htmlFor="consent_to_share_data" className="text-xs font-bold text-slate-850 dark:text-white cursor-pointer">Consent to Share Anonymized Clinical Data</label>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Permits sharing extracted prescription data in aggregated form for medical research registries.</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" disabled={isUpdatingMedical} variant="primary" className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer">
            {isUpdatingMedical ? 'Updating...' : 'Save Medical Info'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
