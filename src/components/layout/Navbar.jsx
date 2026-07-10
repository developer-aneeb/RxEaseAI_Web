import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity, ChevronRight, Sun, Moon, Bell } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../ui/Button';

export default function Navbar({ links }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const getInitials = (name) => {
        const str = name || 'User';
        const parts = str.trim().split(/[ @]/).filter(Boolean);
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0].substring(0, 2).toUpperCase();
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const defaultLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Workflow', href: '#workflow' },
        { name: 'Home', href: '#home' },
        { name: 'Analytics', href: '#analytics' },
        { name: 'FAQ', href: '#faq' },
    ];

    const navLinks = links || defaultLinks;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glassmorphism py-3 shadow-lg' : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                            RxEaseAI<span className="text-indigo-500">AI</span>
                        </span>
                    </a>
                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => {
                                    if (link.onClick) {
                                        link.onClick(e);
                                    }
                                }}
                                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors duration-200"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                    {/* CTA & Theme Controls */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Theme Toggle Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleTheme}
                            animate={true}
                            aria-label="Toggle Theme"
                            className="p-2.5!"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>

                        {/* Desktop Bell Notification Icon */}
                        {isAuthenticated && (
                            <button
                                onClick={() => window.location.hash = '#notifications'}
                                className="relative text-slate-600 dark:text-slate-350 hover:text-primary dark:hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 outline-none shrink-0"
                                title="Notification Center"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse ring-2 ring-white dark:ring-slate-900"></span>
                            </button>
                        )}

                        {isAuthenticated ? (
                            <>
                                <div
                                    onClick={() => window.location.hash = '#settings'}
                                    className="hidden sm:flex items-center gap-3 px-4 border-r border-slate-250 dark:border-slate-800 mr-2 text-left cursor-pointer hover:opacity-80 transition-opacity"
                                    title="View Profile Settings"
                                >
                                    <div>
                                        {/* <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{user?.fullName}</div> */}
                                        {/* <div className="text-[10px] text-slate-500">Clinical Admin</div> */}
                                    </div>
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-primary/20" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {getInitials(user?.fullName || user?.name || user?.email)}
                                        </div>
                                    )}
                                </div>
                                <Button variant="ghost" size="sm" onClick={logout}>
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => window.location.hash = '#signin'}>
                                    Sign In
                                </Button>
                                {/* <Button variant="accent" size="sm" icon={ChevronRight} onClick={() => window.location.hash = '#signup'}>
                                    Get Started
                                </Button> */}
                            </>
                        )}
                    </div>
                    {/* Mobile menu and theme buttons */}
                    <div className="flex md:hidden items-center gap-2">
                        {/* Mobile Theme Toggle */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleTheme}
                            animate={true}
                            aria-label="Toggle Theme"
                            className="p-2!"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>

                        {/* Mobile Notification Bell */}
                        {isAuthenticated && (
                            <button
                                onClick={() => window.location.hash = '#notifications'}
                                className="relative text-slate-600 dark:text-slate-350 hover:text-primary transition-colors cursor-pointer p-2 outline-none"
                                title="Notification Center"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                            </button>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2!"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden glassmorphism border-t border-slate-200 dark:border-slate-800"
                    >
                        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => {
                                        setIsOpen(false);
                                        if (link.onClick) {
                                            link.onClick(e);
                                        }
                                    }}
                                    className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/55 transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}

                            {isAuthenticated ? (
                                <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-800/80 px-3 flex flex-col gap-3 text-left">
                                    <div
                                        onClick={() => { setIsOpen(false); window.location.hash = '#settings'; }}
                                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all"
                                    >
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-primary/20" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {getInitials(user?.fullName || user?.name || user?.email)}
                                            </div>
                                        )}
                                        <div>
                                            {/* <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{user?.fullName}</div>
                                            <div className="text-xs text-slate-500">Clinical Settings</div> */}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1 text-center py-2 bg-slate-50 dark:bg-slate-900/50" onClick={() => { setIsOpen(false); window.location.hash = '#settings'; }}>
                                            Settings
                                        </Button>
                                        <Button variant="ghost" className="flex-1 text-center py-2 bg-slate-50 dark:bg-slate-900/50 hover:bg-rose-500/10 hover:text-rose-500" onClick={() => { setIsOpen(false); logout(); }}>
                                            Sign Out
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-800/80 px-3 flex flex-col gap-3">
                                    <Button variant="ghost" className="w-full text-center py-2.5" onClick={() => { setIsOpen(false); window.location.hash = '#signin'; }}>
                                        Sign In
                                    </Button>
                                    <Button variant="accent" className="w-full text-center py-2.5" onClick={() => { setIsOpen(false); window.location.hash = '#signup'; }}>
                                        Get Started
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}