import { useState } from 'react';
import { Users, Edit, Trash2 } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { useAppStore } from '../../store/useAppStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function EmergencyContactSection({ emergencyContacts, onSaveSuccess }) {
  const showToast = useAppStore((state) => state.showToast);

  // Emergency Contact Form States
  const [contactNameInput, setContactNameInput] = useState('');
  const [relationshipInput, setRelationshipInput] = useState('');
  const [contactPhoneInput, setContactPhoneInput] = useState('');
  const [contactAddressInput, setContactAddressInput] = useState('');
  const [editingContactId, setEditingContactId] = useState(null);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const activeContacts = (emergencyContacts || []).filter((c) => !c.is_deleted);

  const handleSaveContact = async () => {
    if (!contactNameInput.trim() || !contactPhoneInput.trim()) {
      showToast('Name and Phone are required for emergency contact.', 'warning');
      return;
    }
    setIsSavingContact(true);
    try {
      if (editingContactId) {
        await profileService.updateEmergencyContact(editingContactId, {
          contact_name: contactNameInput.trim(),
          relationship: relationshipInput.trim() || null,
          phone: contactPhoneInput.trim(),
          address: contactAddressInput.trim() || null
        });
        showToast('Emergency contact updated successfully.', 'success');
      } else {
        await profileService.addEmergencyContact({
          contact_name: contactNameInput.trim(),
          relationship: relationshipInput.trim() || null,
          phone: contactPhoneInput.trim(),
          address: contactAddressInput.trim() || null
        });
        showToast('Emergency contact added successfully.', 'success');
      }
      setContactNameInput('');
      setRelationshipInput('');
      setContactPhoneInput('');
      setContactAddressInput('');
      setEditingContactId(null);
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      showToast('Failed to save contact details.', 'error');
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContactId(contact.id);
    setContactNameInput(contact.contact_name || '');
    setRelationshipInput(contact.relationship || '');
    setContactPhoneInput(contact.phone || '');
    setContactAddressInput(contact.address || '');
    const formElement = document.getElementById('contact-form-anchor');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleDeleteContact = async (contact) => {
    if (!window.confirm(`Are you sure you want to remove "${contact.contact_name}" from your emergency contacts?`)) {
      return;
    }
    setDeletingId(contact.id);
    try {
      await profileService.updateEmergencyContact(contact.id, {
        contact_name: contact.contact_name,
        relationship: contact.relationship,
        phone: contact.phone,
        address: contact.address,
        is_deleted: true,
        deleted_at: new Date().toISOString()
      });
      showToast('Emergency contact removed.', 'success');
      if (editingContactId === contact.id) {
        setEditingContactId(null);
        setContactNameInput('');
        setRelationshipInput('');
        setContactPhoneInput('');
        setContactAddressInput('');
      }
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      showToast('Failed to remove emergency contact.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card id="emergency-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-101 dark:border-slate-800 pb-3">
        <Users className="w-5 h-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Emergency Contacts</h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Manage backup contacts for health emergencies</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {activeContacts.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">No active emergency contacts registered.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeContacts.map((contact) => (
              <div key={contact.id} className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex justify-between items-start gap-3 hover:border-primary/40 transition-all">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{contact.contact_name}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">{contact.relationship || 'Contact'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold mt-1">Phone: {contact.phone}</p>
                  {contact.address && <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">Address: {contact.address}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditContact(contact)}
                    className="text-slate-400 hover:text-primary bg-transparent border-0 cursor-pointer p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                    title="Edit Contact"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === contact.id}
                    onClick={() => handleDeleteContact(contact)}
                    className="text-slate-400 hover:text-rose-500 bg-transparent border-0 cursor-pointer p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div id="contact-form-anchor" className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
        <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
          {editingContactId ? 'Edit Emergency Contact Details' : 'Add Emergency Contact'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-1">Name</label>
            <input
              type="text"
              value={contactNameInput}
              onChange={(e) => setContactNameInput(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-3 text-xs outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white h-[46px]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-1">Relationship</label>
            <input
              type="text"
              value={relationshipInput}
              onChange={(e) => setRelationshipInput(e.target.value)}
              placeholder="e.g. Spouse, Parent, Brother"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-3 text-xs outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white h-[46px]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-1">Phone Number</label>
            <input
              type="text"
              value={contactPhoneInput}
              onChange={(e) => setContactPhoneInput(e.target.value)}
              placeholder="e.g. +923001234567"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-3 text-xs outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white h-[46px]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block mb-1">Address</label>
            <input
              type="text"
              value={contactAddressInput}
              onChange={(e) => setContactAddressInput(e.target.value)}
              placeholder="e.g. Lahore, Pakistan"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-3 text-xs outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white h-[46px]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          {editingContactId && (
            <Button
              type="button"
              onClick={() => {
                setEditingContactId(null);
                setContactNameInput('');
                setRelationshipInput('');
                setContactPhoneInput('');
                setContactAddressInput('');
              }}
              variant="ghost"
              className="px-6 py-2.5 rounded-xl cursor-pointer"
            >
              Cancel Edit
            </Button>
          )}
          <Button type="button" onClick={handleSaveContact} disabled={isSavingContact} variant="primary" className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer">
            {isSavingContact ? 'Saving...' : editingContactId ? 'Save Updates' : 'Register Contact'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

