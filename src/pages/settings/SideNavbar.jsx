import { User, Bell, MessageSquare, HelpCircle, LogOut, HeartPulse, ShieldAlert, Users, KeyRound } from 'lucide-react';
import MaterialIcon from '../../components/ui/MaterialIcon';

export default function SideNavbar({ activeTab, onTabClick, onLogout }) {
  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security & Email', icon: KeyRound },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'medical', label: 'Medical Information', icon: HeartPulse },
    { id: 'allergies', label: 'Allergies Registry', icon: ShieldAlert },
    { id: 'emergency', label: 'Emergency Contacts', icon: Users },
    { id: 'feedback', label: 'Feedback Form', icon: MessageSquare },
    { id: 'faqs', label: 'FAQs Accordion', icon: HelpCircle },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[280px] shrink-0 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-xl space-y-6">
      <div className="flex items-center gap-3.5 pb-6 border-b border-slate-105 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <MaterialIcon name="medical_services" size="sm" />
        </div>
        <div className="min-w-0 text-left">
          <h1 className="text-sm font-extrabold text-primary">Settings</h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Management Hub</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id, `${tab.id}-card`)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-xs text-left cursor-pointer border-0 bg-transparent ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all text-xs font-semibold cursor-pointer text-left border-0 bg-transparent"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
