import { ChevronRight, HeartPulse, ShieldAlert, Users, Activity, Ruler, Weight, Droplet, Plus } from 'lucide-react';
import Card from '../../components/ui/Card';

export default function HealthProfileDashboard({ profileData, allergies, emergencyContacts, onCategoryClick }) {
  const allergiesCount = allergies?.length || 0;
  const contactsCount = emergencyContacts?.length || 0;

  // Extract vitals
  const height = profileData?.height ? `${profileData.height} cm` : 'Not set';
  const weight = profileData?.weight ? `${profileData.weight} kg` : 'Not set';
  const bloodType = profileData?.blood_group || 'Not set';

  // Extract chronic conditions
  const chronicDiseases = profileData?.chronic_diseases 
    ? Object.keys(profileData.chronic_diseases)
    : [];

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto pb-24">
      {/* Header / Overview Card */}
      <div className="bg-teal-700 text-white rounded-[24px] p-6 shadow-xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-teal-600/50 blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Health Overview</h2>
              <p className="text-sm text-teal-100">Stay on top of your health journey</p>
            </div>
          </div>

          <div className="flex items-center justify-center mt-8 px-4">
            <div className="flex-1 text-center border-r border-teal-600/50">
              <div className="flex justify-center mb-1">
                <ShieldAlert className="w-4 h-4 text-teal-200" />
              </div>
              <div className="text-2xl font-bold">{allergiesCount}</div>
              <div className="text-xs text-teal-200 uppercase tracking-wider font-semibold">Allergies</div>
            </div>
            <div className="flex-1 text-center">
              <div className="flex justify-center mb-1">
                <Users className="w-4 h-4 text-teal-200" />
              </div>
              <div className="text-2xl font-bold">{contactsCount}</div>
              <div className="text-xs text-teal-200 uppercase tracking-wider font-semibold">Contacts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Vitals */}
      <Card variant="glass" className="p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white">Key Vitals</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[120px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
              <Ruler className="w-3.5 h-3.5 text-amber-500" /> Height
            </div>
            <div className="font-bold text-slate-800 dark:text-white text-lg">{height}</div>
          </div>
          <div className="flex-1 min-w-[120px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
              <Weight className="w-3.5 h-3.5 text-slate-400" /> Weight
            </div>
            <div className="font-bold text-slate-800 dark:text-white text-lg">{weight}</div>
          </div>
          <div className="flex-[2] min-w-[140px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
              <Droplet className="w-3.5 h-3.5 text-rose-500" /> Blood Type
            </div>
            <div className="font-bold text-slate-800 dark:text-white text-lg">{bloodType}</div>
          </div>
        </div>
      </Card>

      {/* Chronic Conditions */}
      <Card variant="glass" className="p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
            <HeartPulse className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white">Chronic Conditions</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {chronicDiseases.length > 0 ? (
            chronicDiseases.map((condition, idx) => (
              <span key={idx} className="px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-semibold border border-orange-100 dark:border-orange-800/50 shadow-sm">
                {condition}
              </span>
            ))
          ) : (
            <div className="text-sm text-slate-500 italic">No chronic conditions recorded.</div>
          )}
        </div>
      </Card>

      {/* Health Categories */}
      <div className="pt-2">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 px-1">Health Categories</h3>
        <div className="space-y-3">
          {/* Medical Info Row */}
          <button 
            onClick={() => onCategoryClick('medical')}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">Medical Information</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Blood type, conditions & lifestyle</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* Allergies Row */}
          <button 
            onClick={() => onCategoryClick('allergies')}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">Allergies & Conditions</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{allergiesCount} allergy recorded</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* Emergency Contacts Row */}
          <button 
            onClick={() => onCategoryClick('emergency')}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">Emergency Contacts</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{contactsCount} contacts saved</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
