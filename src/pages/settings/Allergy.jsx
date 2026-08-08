import { useState } from 'react';
import { ShieldAlert, Edit, Trash2, Plus } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { useAppStore } from '../../store/useAppStore';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Comprehensive list of common allergies
const COMMON_ALLERGIES = {
  Drug: [
    'Penicillin', 'Amoxicillin', 'Aspirin', 'Ibuprofen', 'Sulfa drugs', 
    'Codeine', 'Morphine', 'NSAIDs', 'ACE inhibitors', 'Statins',
    '化疗药物', '疫苗', 'Contrast dye', 'Local anesthetics', 'Antibiotics'
  ],
  Food: [
    'Peanuts', 'Tree nuts (almonds, walnuts, cashews)', 'Milk', 'Eggs', 'Wheat',
    'Soy', 'Fish (salmon, tuna, cod)', 'Shellfish (shrimp, crab, lobster)', 'Sesame',
    'Corn', 'Chicken', 'Beef', 'Pork', 'Fruits (banana, avocado, kiwi)',
    'Chocolate', 'MSG', 'Food dyes', 'Preservatives'
  ],
  Environmental: [
    'Pollen (tree, grass, ragweed)', 'Dust mites', 'Mold', 'Pet dander (cats, dogs)',
    'Cockroach droppings', 'Insect stings (bees, wasps, hornets)', 'Latex',
    'Feathers', 'Cedar wood', 'Nickel', 'Hair dyes', 'Cosmetics'
  ],
  Other: [
    'Latex', 'Iron', 'Anesthetic agents', 'Insulin', 'Heparin',
    'Vaccines', 'Contrast dye', 'Preservatives', 'Food additives', 'Tick bites'
  ]
};

export default function AllergySection({ allergies, onSaveSuccess }) {
  const showToast = useAppStore((state) => state.showToast);
  
  // Allergy Form States
  const [allergenInput, setAllergenInput] = useState('');
  const [allergyTypeInput, setAllergyTypeInput] = useState('Drug');
  const [reactionInput, setReactionInput] = useState('');
  const [editingAllergyId, setEditingAllergyId] = useState(null);
  const [isSavingAllergy, setIsSavingAllergy] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCommonOptions, setShowCommonOptions] = useState(false);

  const activeAllergies = (allergies || []).filter((a) => !a.is_deleted);

  // Get common allergies for current type
  const commonAllergiesForType = COMMON_ALLERGIES[allergyTypeInput] || [];

  // Reset form when showing add form
  const handleShowAddForm = () => {
    setAllergenInput('');
    setReactionInput('');
    setEditingAllergyId(null);
    setAllergyTypeInput('Drug');
    setShowAddForm(true);
    const formElement = document.getElementById('allergy-form-anchor');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCancelAdd = () => {
    setAllergenInput('');
    setReactionInput('');
    setEditingAllergyId(null);
    setShowAddForm(false);
    setShowCommonOptions(false);
  };

  const handleSelectCommonAllergen = (allergen) => {
    setAllergenInput(allergen);
    setShowCommonOptions(false);
  };

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
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to save allergy details.');
      showToast(friendlyMsg, 'error');
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
    setDeletingId(allergy.id);
    try {
      await profileService.deleteAllergy(allergy.id);
      showToast('Allergy removed from active registry.', 'success');
      if (editingAllergyId === allergy.id) {
        setEditingAllergyId(null);
        setAllergenInput('');
        setReactionInput('');
      }
      setConfirmDeleteId(null);
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to remove allergy.');
      showToast(friendlyMsg, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card id="allergies-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md relative">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-101 dark:border-slate-800 pb-3">
        <ShieldAlert className="w-5 h-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Allergies Registry</h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Track food, drug, and environmental contraindications</p>
        </div>
        {!showAddForm && (
          <Button
            type="button"
            onClick={handleShowAddForm}
            variant="primary"
            className="ml-auto bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Allergy
          </Button>
        )}
      </div>

      {!showAddForm && (
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
                  {confirmDeleteId === allergy.id ? (
                    <div className="flex items-center gap-1 bg-rose-500/10 dark:bg-rose-500/20 p-1 rounded-xl border border-rose-500/30 animate-fade-in shrink-0">
                      <button
                        type="button"
                        disabled={deletingId === allergy.id}
                        onClick={() => handleDeleteAllergy(allergy)}
                        className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-rose-600 border-0 cursor-pointer transition-colors"
                      >
                        {deletingId === allergy.id ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-slate-300 border-0 cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
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
                        onClick={() => setConfirmDeleteId(allergy.id)}
                        className="text-slate-400 hover:text-rose-500 bg-transparent border-0 cursor-pointer p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete Allergy"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showAddForm && (
        <div id="allergy-form-anchor" className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4 mb-6 animate-fade-in">
          <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
            {editingAllergyId ? 'Edit Allergy Details' : 'Add New Contraindication / Allergy'}
          </h4>
          
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Category Type</span>
            <div className="flex gap-4 h-[44px] items-center">
              {['Drug', 'Food', 'Environmental', 'Other'].map((typeOption) => (
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

          {/* Common Allergy Options */}
          {showCommonOptions && commonAllergiesForType.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-950/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700 animate-fade-in">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Common {allergyTypeInput} Allergens</span>
              <div className="flex flex-wrap gap-2">
                {commonAllergiesForType.map((allergen) => (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => handleSelectCommonAllergen(allergen)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-primary/10 hover:border-primary dark:hover:bg-slate-700 transition-colors"
                  >
                    {allergen}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowCommonOptions(false)}
                className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-primary mt-3 transition-colors"
              >
                Hide common options
              </button>
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-1">Allergen Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={allergenInput}
                  onChange={(e) => setAllergenInput(e.target.value)}
                  onFocus={() => setShowCommonOptions(true)}
                  placeholder={editingAllergyId ? 'Edit allergen name' : 'Select or type allergen'}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-3 text-xs outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white h-[46px]"
                />
                {allergenInput.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setShowCommonOptions(!showCommonOptions)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-[10px] font-semibold hover:text-primary/80 transition-colors"
                  >
                    {showCommonOptions ? 'Hide' : 'View Options'}
                  </button>
                )}
              </div>
              {allergenInput.length === 0 && commonAllergiesForType.length > 0 && (
                <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
                  Click "View Options" to select from common {allergyTypeInput} allergens
                </p>
              )}
            </div>

            <div className="flex-1 flex flex-col">
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
                  setShowAddForm(false);
                  setShowCommonOptions(false);
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
      )}

      {/* Floating Add Button (when form is hidden and no allergies) */}
      {!showAddForm && activeAllergies.length === 0 && (
        <div className="flex justify-center pt-4">
          <Button
            type="button"
            onClick={handleShowAddForm}
            variant="primary"
            className="bg-primary text-white text-sm font-bold px-6 py-3 rounded-2xl hover:bg-primary/90 transition-colors flex items-center gap-2 w-full md:w-auto"
          >
            <Plus className="w-5 h-5" />
            Add Your First Allergy
          </Button>
        </div>
      )}
    </Card>
  );
}

