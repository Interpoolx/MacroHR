import { Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { supabase, signOut } from '@shared/lib/supabase'
import { User, LogOut, Shield, LayoutDashboard, Zap } from 'lucide-react'
import { useSiteConfig } from '@shared/config/SiteConfigFromDB'
import { NavLink } from './NavLink'
import { Button } from "@shared/components/ui/button"

export function Navbar() {
    const config = useSiteConfig()
    const [user, setUser] = useState<any>(null)
    const [showMenu, setShowMenu] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        // Project-specific session keys to avoid conflicts
        const SESSION_KEY = 'macrohr_demo_user';

        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user) {
                    setUser(session.user)
                    return;
                }
            } catch (e) {
                // Supabase not configured or failed
            }

            // Fallback to local demo session if Supabase is not active
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
        }

        checkAuth()

        // Safely subscribe to auth changes if supabase is active
        let subscription: any = null;
        try {
            const result = supabase.auth.onAuthStateChange((_event: any, session: any) => {
                if (session?.user) {
                    setUser(session.user)
                } else {
                    checkAuth(); // Re-check demo session
                }
            });
            subscription = result.data?.subscription;
        } catch (e) { }

        const handleAuthChange = () => checkAuth()
        window.addEventListener('auth-change', handleAuthChange)

        return () => {
            subscription?.unsubscribe();
            window.removeEventListener('auth-change', handleAuthChange)
        }
    }, [])

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (e) { }

        localStorage.removeItem('admin_session')
        localStorage.removeItem('user_email')
        localStorage.removeItem('user_role')
        localStorage.removeItem('macrohr_demo_user')

        // Dispatch event for UI and perform a hard reset for safety
        window.dispatchEvent(new Event('auth-change'))
        setShowMenu(false)
        window.location.href = '/'
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (showMenu && !(e.target as Element).closest('.user-menu')) {
                setShowMenu(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [showMenu])

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 glass"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 font-black text-2xl hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                        <Zap className="w-6 h-6 text-white text-xl fill-current" />
                    </div>
                    <span className="gradient-text uppercase italic tracking-tighter">{config.logo.text}</span>
                </Link>

                <NavLink />

                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="relative user-menu">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
                                className="w-12 h-12 rounded-2xl accent-gradient text-white font-black italic flex items-center justify-center hover:scale-105 active:scale-95 transition-all overflow-hidden shadow-xl shadow-primary/20 border-2 border-white/10"
                            >
                                {user.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" />
                                ) : (
                                    (user.email?.[0] || 'U').toUpperCase()
                                )}
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-16 w-56 bg-card rounded-2xl shadow-2xl border border-white/5 py-3 animate-in fade-in slide-in-from-top-4 backdrop-blur-xl">
                                    <div className="px-5 py-3 border-b border-white/5 mb-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Authenticated</p>
                                        <p className="text-sm font-bold text-foreground truncate">{user.user_metadata?.name || 'User'}</p>
                                    </div>
                                    <Link
                                        to="/user/dashboard"
                                        search={{ role: 'user' }}
                                        onClick={() => setShowMenu(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-bold uppercase tracking-tighter text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                                    >
                                        <LayoutDashboard size={18} className="text-primary" /> User Portal
                                    </Link>
                                    <Link
                                        to="/user/dashboard"
                                        search={{ role: 'manager' }}
                                        onClick={() => setShowMenu(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-bold uppercase tracking-tighter text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                                    >
                                        <Shield size={18} className="text-[#ff6600]" /> HR Manager
                                    </Link>
                                    <Link
                                        to="/admin"
                                        onClick={() => setShowMenu(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-bold uppercase tracking-tighter text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                                    >
                                        <Shield size={18} className="text-primary/60" /> Admin Access
                                    </Link>
                                    <Link
                                        to="/profile"
                                        onClick={() => setShowMenu(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-bold uppercase tracking-tighter text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                                    >
                                        <User size={18} className="text-primary" /> My Account
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold uppercase tracking-tighter text-red-500 hover:bg-red-500/10 transition-colors text-left mt-2 border-t border-white/5"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/auth" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary hidden sm:block transition-colors">Sign In</Link>
                            <Link to="/auth">
                                <Button className="accent-gradient border-0 font-black uppercase italic px-8 py-6 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-white">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div >
        </motion.nav >
    )
}
