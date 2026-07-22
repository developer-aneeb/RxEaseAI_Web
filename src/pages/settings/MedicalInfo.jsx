import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HeartPulse, Plus, Trash2, Code, LayoutList } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { useAppStore } from '../../store/useAppStore';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function MedicalInfoSection({ profileData, onSaveSuccess }) {
  const showToast = useAppStore((state) => state.showToast);
  const [isUpdatingMedical, setIsUpdatingMedical] = useState(false);
  const [jsonMode, setJsonMode] = useState(false);

  // Structured list builder state
  const [chronicList, setChronicList] = useState([]);
  const [familyList, setFamilyList] = useState([]);

  // New item input states
  const [newChronicCondition, setNewChronicCondition] = useState('');
  const [newChronicDetails, setNewChronicDetails] = useState('');
  const [newFamilyRelative, setNewFamilyRelative] = useState('');
  const [newFamilyCondition, setNewFamilyCondition] = useState('');

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
  const chronicTextValue = watch('chronic_diseases_text');
  const familyTextValue = watch('family_history_text');

  // Convert JSON object to builder lists
  const parseJsonToBuilder = (chronicObj, familyObj) => {
    // Chronic
    if (chronicObj && typeof chronicObj === 'object') {
      const items = [];
      for (const [key, val] of Object.entries(chronicObj)) {
        items.push({ condition: key, details: typeof val === 'string' ? val : JSON.stringify(val) });
      }
      setChronicList(items);
    } else {
      setChronicList([]);
    }

    // Family
    if (familyObj && typeof familyObj === 'object') {
      const items = [];
      for (const [key, val] of Object.entries(familyObj)) {
        items.push({ relative: key, condition: typeof val === 'string' ? val : JSON.stringify(val) });
      }
      setFamilyList(items);
    } else {
      setFamilyList([]);
    }
  };

  useEffect(() => {
    if (profileData) {
      setValue('condition_name', profileData.condition_name || '');
      setValue('status', profileData.status || 'Active');
      setValue('consent_to_share_data', profileData.consent_to_share_data || false);

      const cObj = profileData.chronic_diseases || null;
      const fObj = profileData.family_medical_history || null;

      setValue('chronic_diseases_text', cObj ? JSON.stringify(cObj, null, 2) : '');
      setValue('family_history_text', fObj ? JSON.stringify(fObj, null, 2) : '');

      parseJsonToBuilder(cObj, fObj);
    }
  }, [profileData, setValue]);

  const handleAddChronic = () => {
    if (!newChronicCondition.trim()) return;
    const updated = [...chronicList, { condition: newChronicCondition.trim(), details: newChronicDetails.trim() || 'Active' }];
    setChronicList(updated);
    setNewChronicCondition('');
    setNewChronicDetails('');

    // Sync to textarea
    const obj = {};
    updated.forEach(item => { obj[item.condition] = item.details; });
    setValue('chronic_diseases_text', JSON.stringify(obj, null, 2));
  };

  const handleRemoveChronic = (index) => {
    const updated = chronicList.filter((_, i) => i !== index);
    setChronicList(updated);
    const obj = {};
    updated.forEach(item => { obj[item.condition] = item.details; });
    setValue('chronic_diseases_text', updated.length > 0 ? JSON.stringify(obj, null, 2) : '');
  };

  const handleAddFamily = () => {
    if (!newFamilyRelative.trim() || !newFamilyCondition.trim()) return;
    const updated = [...familyList, { relative: newFamilyRelative.trim(), condition: newFamilyCondition.trim() }];
    setFamilyList(updated);
    setNewFamilyRelative('');
    setNewFamilyCondition('');

    // Sync to textarea
    const obj = {};
    updated.forEach(item => { obj[item.relative] = item.condition; });
    setValue('family_history_text', JSON.stringify(obj, null, 2));
  };

  const handleRemoveFamily = (index) => {
    const updated = familyList.filter((_, i) => i !== index);
    setFamilyList(updated);
    const obj = {};
    updated.forEach(item => { obj[item.relative] = item.condition; });
    setValue('family_history_text', updated.length > 0 ? JSON.stringify(obj, null, 2) : '');
  };

  const toggleJsonMode = () => {
    if (!jsonMode) {
      // Switching to JSON mode: already synced from visual changes
      setJsonMode(true);
    } else {
      // Switching to visual mode: parse textareas into lists
      try {
        const cObj = chronicTextValue.trim() ? JSON.parse(chronicTextValue) : null;
        const fObj = familyTextValue.trim() ? JSON.parse(familyTextValue) : null;
        parseJsonToBuilder(cObj, fObj);
        setJsonMode(false);
      } catch (e) {
        showToast('Invalid JSON format in text fields. Please fix syntax errors before switching back to Visual Builder.', 'error');
      }
    }
  };

  const onMedicalSave = async (data) => {
    let chronicJson = null;
    let familyJson = null;

    try {
      if (data.chronic_diseases_text.trim()) {
        chronicJson = JSON.parse(data.chronic_diseases_text);
      } else if (chronicList.length > 0) {
        chronicJson = {};
        chronicList.forEach(item => { chronicJson[item.condition] = item.details; });
      }

      if (data.family_history_text.trim()) {
        familyJson = JSON.parse(data.family_history_text);
      } else if (familyList.length > 0) {
        familyJson = {};
        familyList.forEach(item => { familyJson[item.relative] = item.condition; });
      }
    } catch (parseError) {
      showToast('Chronic Diseases or Family History must be valid JSON objects.', 'error');
      return;
    }

    if (!data.condition_name?.trim()) {
      showToast('Primary Condition Name is required.', 'warning');
      return;
    }

    setIsUpdatingMedical(true);
    try {
      await profileService.updateMedicalInfo({
        condition_name: data.condition_name.trim(),
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
      <div className="flex justify-between items-start mb-6 border-b border-slate-101 dark:border-slate-800 pb-3 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Medical Information & Clinical History</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Update clinical diagnoses, family histories, and FHIR data sharing consents</p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleJsonMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border-0 cursor-pointer"
        >
          {jsonMode ? <LayoutList className="w-3.5 h-3.5 text-primary" /> : <Code className="w-3.5 h-3.5 text-primary" />}
          <span>{jsonMode ? 'Switch to Visual Builder' : 'Switch to Raw JSON'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onMedicalSave)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Primary Condition Name" placeholder="e.g. Hypertension, Asthma, Type 2 Diabetes" error={errors.condition_name?.message} {...register('condition_name', { required: 'Condition name is required' })} />
          
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-2">Diagnosis Status</span>
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
                  <span className={statusValue === statusOption ? 'text-primary font-bold' : 'text-slate-700 dark:text-slate-300'}>{statusOption}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {jsonMode ? (
          /* RAW JSON MODE */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Chronic Diseases (JSON Object)</label>
              <textarea
                rows="5"
                placeholder='{&#10;  "diabetes": "Type 2 - Controlled",&#10;  "hypertension": "Stage 1"&#10;}'
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white font-mono"
                {...register('chronic_diseases_text')}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Family Medical History (JSON Object)</label>
              <textarea
                rows="5"
                placeholder='{&#10;  "father": "Coronary Artery Disease",&#10;  "maternal_grandfather": "Stroke"&#10;}'
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white font-mono"
                {...register('family_history_text')}
              />
            </div>
          </div>
        ) : (
          /* VISUAL BUILDER MODE */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chronic Diseases Builder */}
            <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-850 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-850 dark:text-white block mb-3">Chronic Diseases Registry</span>
                {chronicList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">No chronic diseases listed.</p>
                ) : (
                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
                    {chronicList.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs">
                        <div className="min-w-0">
                          <span className="font-bold text-slate-850 dark:text-white block truncate">{item.condition}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{item.details}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveChronic(idx)}
                          className="text-slate-400 hover:text-rose-500 bg-transparent border-0 cursor-pointer p-1 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800 grid grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="Condition (e.g. Asthma)"
                  value={newChronicCondition}
                  onChange={(e) => setNewChronicCondition(e.target.value)}
                  className="col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Details (e.g. Mild)"
                  value={newChronicDetails}
                  onChange={(e) => setNewChronicDetails(e.target.value)}
                  className="col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddChronic}
                  className="col-span-2 bg-primary hover:bg-primary-container text-white rounded-xl flex items-center justify-center cursor-pointer border-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Family History Builder */}
            <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-850 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-850 dark:text-white block mb-3">Family Medical History</span>
                {familyList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">No family medical history listed.</p>
                ) : (
                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
                    {familyList.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs">
                        <div className="min-w-0">
                          <span className="font-bold text-primary block truncate">{item.relative}</span>
                          <span className="text-[11px] text-slate-700 dark:text-slate-300 block truncate">{item.condition}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFamily(idx)}
                          className="text-slate-400 hover:text-rose-500 bg-transparent border-0 cursor-pointer p-1 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800 grid grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="Relative (e.g. Father)"
                  value={newFamilyRelative}
                  onChange={(e) => setNewFamilyRelative(e.target.value)}
                  className="col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Condition (e.g. Heart Disease)"
                  value={newFamilyCondition}
                  onChange={(e) => setNewFamilyCondition(e.target.value)}
                  className="col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddFamily}
                  className="col-span-2 bg-primary hover:bg-primary-container text-white rounded-xl flex items-center justify-center cursor-pointer border-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
          <div className="flex items-center h-5 mt-0.5">
            <input
              id="consent_to_share_data"
              type="checkbox"
              className="w-4 h-4 text-primary border-slate-300 dark:border-slate-700 rounded focus:ring-primary cursor-pointer"
              {...register('consent_to_share_data')}
            />
          </div>
          <div>
            <label htmlFor="consent_to_share_data" className="text-xs font-bold text-slate-850 dark:text-white cursor-pointer">Consent to Share Anonymized Clinical Data</label>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Permits sharing extracted prescription and condition data in aggregated, de-identified form for medical research and pharmacovigilance registries.</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" disabled={isUpdatingMedical} variant="primary" className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer">
            {isUpdatingMedical ? 'Updating Medical Record...' : 'Save Medical Info'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

