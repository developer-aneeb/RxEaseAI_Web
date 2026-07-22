import { useState } from 'react';
import { ShieldAlert, Edit, Trash2 } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { useAppStore } from '../../store/useAppStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function AllergySection({ allergies, onSaveSuccess }) {
  const showToast = useAppStore((state) => state.showToast);
  
  // Allergy Form States
  const [allergenInput, setAllergenInput] = useState('');
  const [allergyTypeInput, setAllergyTypeInput] = useState('Drug');
  const [reactionInput, setReactionInput] = useState('');
  const [editingAllergyId, setEditingAllergyId] = useState(null);
  const [isSavingAllergy, setIsSavingAllergy] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const activeAllergies = (allergies || []).filter((a) => !a.is_deleted);

  const handleSaveAllergy = async () => {
    if (!allergenInput.trim()) {
      showToast('Please enter an allergen name.', 'warning');
      return;
    }
    setIsSavingAllergy(true);
    try {
      if (editingAllergyId) {
        await profileService.updateAllergy(editingAllergyId, {
          allergy_type: allergyTypeInput,
          allergen: allergenInput.trim(),
          reaction: reactionInput.trim() || null
        });
        showToast('Allergy details updated successfully.', 'success');
      } else {
        await profileService.addAllergy({
          allergy_type: allergyTypeInput,
          allergen: allergenInput.trim(),
          reaction: reactionInput.trim() || null
        });
        showToast('Allergy added successfully.', 'success');
      }
      setAllergenInput('');
      setReactionInput('');
      setEditingAllergyId(null);
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      showToast('Failed to save allergy details.', 'error');
    } finally {
      setIsSavingAllergy(false);
    }
  };

  const handleEditAllergy = (allergy) => {
    setEditingAllergyId(allergy.id);
    setAllergyTypeInput(allergy.allergy_type || 'Drug');
    setAllergenInput(allergy.allergen || '');
    setReactionInput(allergy.reaction || '');
    const formElement = document.getElementById('allergy-form-anchor');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleDeleteAllergy = async (allergy) => {
    if (!window.confirm(`Are you sure you want to remove "${allergy.allergen}" from your allergies registry?`)) {
      return;
    }
    setDeletingId(allergy.id);
    try {
      await profileService.updateAllergy(allergy.id, {
        allergy_type: allergy.allergy_type,
        allergen: allergy.allergen,
        reaction: allergy.reaction,
        is_deleted: true,
        deleted_at: new Date().toISOString()
      });
      showToast('Allergy removed from active registry.', 'success');
      if (editingAllergyId === allergy.id) {
        setEditingAllergyId(null);
        setAllergenInput('');
        setReactionInput('');
      }
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      showToast('Failed to remove allergy.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card id="allergies-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-101 dark:border-slate-800 pb-3">
        <ShieldAlert className="w-5 h-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Allergies Registry</h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Track food, drug, and environmental contraindications</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {activeAllergies.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">No active allergies registered in your health profile.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAllergies.map((allergy) => (
              <div key={allergy.id} className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex justify-between items-start gap-3 hover:border-primary/40 transition-all">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{allergy.allergen}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">{allergy.allergy_type}</span>
                  </div>
                  {allergy.reaction ? (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-1">Observed Reaction: {allergy.reaction}</p>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic mt-1">No specific reaction noted</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditAllergy(allergy)}
                    className="text-slate-400 hover:text-primary bg-transparent border-0 cursor-pointer p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                    title="Edit Allergy"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === allergy.id}
                    onClick={() => handleDeleteAllergy(allergy)}
                    className="text-slate-400 hover:text-rose-500 bg-transparent border-0 cursor-pointer p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Delete Allergy"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div id="allergy-form-anchor" className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
        <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
          {editingAllergyId ? 'Edit Allergy Details' : 'Add New Contraindication / Allergy'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Category Type</span>
            <div className="flex gap-4 h-[44px] items-center">
              {['Drug', 'Food', 'Other'].map((typeOption) => (
                <label key={typeOption} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    value={typeOption}
                    checked={allergyTypeInput === typeOption}
                    onChange={() => setAllergyTypeInput(typeOption)}
                    className="w-4 h-4 text-primary border-slate-300 focus:ring-primary cursor-pointer"
                  />
                  <span className={allergyTypeInput === typeOption ? 'text-primary font-bold' : 'text-slate-700 dark:text-slate-300'}>{typeOption}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-1">Allergen Name</label>
            <input
              type="text"
              value={allergenInput}
              onChange={(e) => setAllergenInput(e.target.value)}
              placeholder="e.g. Penicillin, Aspirin, Peanuts"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-3 text-xs outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white h-[46px]"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-1">Observed Reaction</label>
            <input
              type="text"
              value={reactionInput}
              onChange={(e) => setReactionInput(e.target.value)}
              placeholder="e.g. Anaphylaxis, Hives, Severe Nausea"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-3 text-xs outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white h-[46px]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          {editingAllergyId && (
            <Button
              type="button"
              onClick={() => {
                setEditingAllergyId(null);
                setAllergenInput('');
                setReactionInput('');
              }}
              variant="ghost"
              className="px-6 py-2.5 rounded-xl cursor-pointer"
            >
              Cancel Edit
            </Button>
          )}
          <Button type="button" onClick={handleSaveAllergy} disabled={isSavingAllergy} variant="primary" className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer">
            {isSavingAllergy ? 'Saving...' : editingAllergyId ? 'Save Updates' : 'Add Allergy'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

