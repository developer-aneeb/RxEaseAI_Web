import { User, Bell, MessageSquare, HelpCircle, LogOut, HeartPulse, ShieldAlert, Users, KeyRound } from 'lucide-react';

export default function HorizontalTabNavigation({ activeTab, onTabClick, onLogout }) {
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security & Email', icon: KeyRound },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'medical', label: 'Medical Info', icon: HeartPulse },
    { id: 'allergies', label: 'Allergies', icon: ShieldAlert },
    { id: 'emergency', label: 'Emergency Contacts', icon: Users },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center justify-between gap-2 min-w-max p-2 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md">
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabClick(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all text-xs font-bold cursor-pointer border-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-md shadow-primary/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
        {/* {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all text-xs font-semibold cursor-pointer border-0 bg-transparent shrink-0 ml-2"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        )} */}
      </div>
    </div>
  );
}
