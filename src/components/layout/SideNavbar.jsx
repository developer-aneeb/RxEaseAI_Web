import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../ui/Button';
import MaterialIcon from '../ui/MaterialIcon';

export default function SideNavbar({ activeRoute = '#home' }) {
  const user = useAuthStore((state) => state.user);

  const getInitials = (name) => {
    const str = name || 'User';
    return str.split(/[ @]/).filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const navItems = [
    { name: 'Dashboard', href: '#home', icon: 'dashboard' },
    { name: 'Prescriptions', href: '#history', icon: 'medication' },
    { name: 'Medical History', href: '#history', icon: 'history', skipHighlight: true }, // Medical history uses same href but is usually inactive
    { name: 'History Dashboard', href: '#history-dashboard', icon: 'monitoring' },
    { name: 'Recommendations', href: '#recommendations', icon: 'neurology' },
    { name: 'Reminders Center', href: '#reminders', icon: 'notifications_active' },
    { name: 'Medicine Search', href: '#search', icon: 'search' },
    { name: 'Analytics & Reports', href: '#analytics', icon: 'analytics' },
    { name: 'Notification Center', href: '#notifications', icon: 'notifications' },
    { name: 'Billing & Ops', href: '#billing', icon: 'credit_card' }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-xl space-y-6">
      <div className="flex items-center gap-3.5 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="w-12 h-12 rounded-full bg-primary/15 dark:bg-primary/20 text-primary font-bold text-base flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md">
          {getInitials(user?.fullName)}
        </div>
        <div className="min-w-0 text-left">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user?.fullName || 'Dr. Aris Thorne'}</h2>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Clinical Director</p>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={() => window.location.hash = '#upload'}
        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
      >
        <MaterialIcon name="add" size="sm" />
        <span>New Prescription</span>
      </Button>

      <nav className="flex-1 space-y-1 text-left">
        {navItems.map((item, index) => {
          // Special handling for the second "#history" link ("Medical History") which shouldn't be active if we meant "Prescriptions"
          const isActive = activeRoute === item.href && !item.skipHighlight;

          return (
            <a
              key={index}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-xs ${isActive
                  ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                  : 'text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary dark:hover:text-white'
                }`}
            >
              <MaterialIcon name={item.icon} size="xs" />
              <span>{item.name}</span>
            </a>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-1 text-left">
        <a href="#settings" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-xs font-medium ${activeRoute === '#settings'
            ? 'bg-primary/10 text-primary font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}>
          <MaterialIcon name="settings" size="xs" />
          <span>Settings Hub</span>
        </a>
        <a href="#home" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all text-xs font-medium">
          <MaterialIcon name="verified_user" size="xs" />
          <span>Compliance</span>
        </a>
      </div>
    </aside>
  );
}
