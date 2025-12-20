// src/components/Navbar.tsx (or wherever your Navbar lives)

import { Link, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, signOut } from '@shared/lib/supabase';
import { User, LogOut, Shield, LayoutDashboard } from 'lucide-react';
import { siteConfig } from '@config/site'; // ← Central config with current module
import { NavLink } from './NavLink';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Palette, Box, ChevronDown } from 'lucide-react';
import { modules } from '@config/modules';
import type { ModuleName } from '@config/modules';
import { themes } from '@shared/lib/themes';
import type { ThemeName } from '@shared/lib/themes';
import { toast } from 'sonner';
import { useSiteConfig } from '@config';

export function Navbar() {
    const { config, setModule, setTheme } = useSiteConfig();

    // All module-specific content comes from the active module
    const module = config.module;
    const logo = module?.logo || { icon: '📋', text: 'MacroHR' };

    const [user, setUser] = useState<any>(null);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const SESSION_KEY = 'macrohr_demo_user'; // Can be made module-aware later if needed

        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);
                    return;
                }
            } catch (e) {
                // Supabase not available
            }

            // Fallback to local demo session
            const demoUser = localStorage.getItem(SESSION_KEY);
            if (demoUser) {
                try {
                    setUser(JSON.parse(demoUser));
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkAuth();

        // Listen to Supabase auth changes (if available)
        let subscription: any = null;
        try {
            const result = supabase.auth.onAuthStateChange((_event: any, session: any) => {
                if (session?.user) {
                    setUser(session.user);
                } else {
                    checkAuth();
                }
            });
            subscription = result.data?.subscription;
        } catch (e) { }

        const handleAuthChange = () => checkAuth();
        window.addEventListener('auth-change', handleAuthChange);

        return () => {
            subscription?.unsubscribe();
            window.removeEventListener('auth-change', handleAuthChange);
        };
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (e) { }

        localStorage.removeItem('admin_session');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
        localStorage.removeItem('macrohr_demo_user'); // Could be dynamic per module later

        window.dispatchEvent(new Event('auth-change'));
        setShowMenu(false);
        window.location.href = '/';
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (showMenu && !(e.target as Element).closest('.user-menu')) {
                setShowMenu(false);
            }
        };

        // Smooth scroll implementation for bookmark links
        const handleBookmarkClick = (e: MouseEvent) => {
            const target = e.target as HTMLAnchorElement;
            if (target.hash && target.origin === window.location.origin && target.pathname === window.location.pathname) {
                e.preventDefault();
                const element = document.querySelector(target.hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    // Update URL without jump
                    window.history.pushState(null, '', target.hash);
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleBookmarkClick as any);
        });

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.removeEventListener('click', handleBookmarkClick as any);
            });
        };
    }, [showMenu]);

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 glass border-b border-border bg-[var(--color-header)]/80 text-[var(--color-header-foreground)] backdrop-blur-xl"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Dynamic Logo & App Name */}
                <Link to="/" className="flex items-center gap-3 font-black text-2xl hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                        {/* Icon can be text (e.g., "A+", "⚖️") or future SVG/image */}
                        <span className="text-primary-foreground text-xl font-black italic">{logo.icon}</span>
                    </div>
                    <span className="gradient-text uppercase italic tracking-tighter">
                        {logo.text}
                    </span>
                </Link>

                {/* Central Navigation Links (e.g., Features, Pricing) */}
                <NavLink />

                {/* Switchers */}
                <div className="hidden lg:flex items-center gap-2 mr-4">
                    {/* Module Switcher */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 px-3 gap-2 rounded-xl hover:bg-muted/50 font-black uppercase italic text-[10px] tracking-widest text-muted-foreground hover:text-foreground transition-all">
                                <Box size={14} className="text-primary" />
                                {config.currentModule}
                                <ChevronDown size={12} className="opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] glass border-border shadow-2xl rounded-2xl p-2">
                            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1.5">Active Module</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border" />
                            {Object.keys(modules).map((m) => (
                                <DropdownMenuItem
                                    key={m}
                                    className={`rounded-xl font-black uppercase italic text-[10px] tracking-widest cursor-pointer px-3 py-2 ${config.currentModule === m ? 'bg-primary/20 text-primary' : 'focus:bg-muted/50'}`}
                                    onClick={() => {
                                        setModule(m as ModuleName);
                                        toast.info(`Switching to ${m.toUpperCase()} module...`);
                                    }}
                                >
                                    {m}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Switcher */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 px-3 gap-2 rounded-xl hover:bg-muted/50 font-black uppercase italic text-[10px] tracking-widest text-muted-foreground hover:text-foreground transition-all">
                                <Palette size={14} className="text-primary" />
                                {config.currentTheme}
                                <ChevronDown size={12} className="opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] glass border-border shadow-2xl rounded-2xl p-2">
                            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1.5">System Theme</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border" />
                            {Object.keys(themes).map((t) => (
                                <DropdownMenuItem
                                    key={t}
                                    className={`rounded-xl font-black uppercase italic text-[10px] tracking-widest cursor-pointer px-3 py-2 ${config.currentTheme === t ? 'bg-primary/20 text-primary' : 'focus:bg-muted/50'}`}
                                    onClick={() => {
                                        setTheme(t as ThemeName);
                                        toast.info(`Theme synchronized: ${t.toUpperCase()}`);
                                    }}
                                >
                                    {t}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Right Side: Auth Controls */}
                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="relative user-menu">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                                className="w-12 h-12 rounded-2xl accent-gradient text-primary-foreground font-black italic flex items-center justify-center hover:scale-105 active:scale-95 transition-all overflow-hidden shadow-xl shadow-primary/20 border-2 border-border"
                            >
                                {user.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                                ) : (
                                    (user.email?.[0] || user.user_metadata?.name?.[0] || 'U').toUpperCase()
                                )}
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-16 w-56 bg-card rounded-2xl shadow-2xl border border-border py-3 animate-in fade-in slide-in-from-top-4 backdrop-blur-xl">
                                    <div className="px-5 py-3 border-b border-border mb-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                                            Authenticated
                                        </p>
                                        <p className="text-sm font-bold text-foreground truncate">
                                            {user.user_metadata?.name || user.email || 'User'}
                                        </p>
                                    </div>

                                    {/* These links can be made module-specific later if needed */}
                                    <Link
                                        to="/user/dashboard"
                                        search={{ role: 'user' }}
                                        onClick={() => setShowMenu(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-bold uppercase tracking-tighter text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                    >
                                        <LayoutDashboard size={18} className="text-primary" /> User Portal
                                    </Link>
                                    <Link
                                        to="/user/dashboard"
                                        search={{ role: 'manager' }}
                                        onClick={() => setShowMenu(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-bold uppercase tracking-tighter text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                    >
                                        <Shield size={18} className="text-primary" /> Manager Portal
                                    </Link>
                                    <Link
                                        to="/admin"
                                        onClick={() => setShowMenu(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-bold uppercase tracking-tighter text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                    >
                                        <Shield size={18} className="text-primary/60" /> Admin Access
                                    </Link>
                                    <Link
                                        to="/profile"
                                        onClick={() => setShowMenu(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-bold uppercase tracking-tighter text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                    >
                                        <User size={18} className="text-primary" /> My Account
                                    </Link>

                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold uppercase tracking-tighter text-red-500 hover:bg-red-500/10 transition-colors text-left mt-2 border-t border-border"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/auth"
                                className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary hidden sm:block transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link to="/auth">
                                <Button className="accent-gradient border-0 font-black uppercase italic px-8 py-6 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-primary-foreground">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}