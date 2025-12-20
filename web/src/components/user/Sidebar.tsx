// src/components/Sidebar.tsx (or wherever your Sidebar component lives)

import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    LogOut,
    Palette,
    Box
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { signOut } from '@shared/lib/supabase';
import { useSiteConfig } from '@config/SiteConfigFromDB';
import { themes } from '@shared/lib/themes';
import { modules } from '@config/modules';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SidebarProps {
    isMobileOpen: boolean;
    onMobileToggle: () => void;
    isCollapsed: boolean;
    onCollapse: () => void;
    role: 'user' | 'manager';
}

type NavItem = {
    to: string;
    label: string;
    icon: React.ElementType;
    managerOnly?: boolean;
    userOnly?: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onCollapse,
    role,
}) => {
    const { config, setTheme, setModule } = useSiteConfig();
    const navigate = useNavigate();
    const [showSwitchers, setShowSwitchers] = React.useState(false);

    // Get sidebar items from current module config
    const sidebarItems: readonly NavItem[] = config.module?.sidebarNav || [];

    const filteredNavItems = sidebarItems.filter((item) => {
        if (role === 'manager') return !item.userOnly;
        if (role === 'user') return !item.managerOnly;
        return true;
    });

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (e) {
            console.error(e);
        }

        localStorage.removeItem('admin_session');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
        localStorage.removeItem('macrohr_demo_user');

        window.dispatchEvent(new Event('auth-change'));
        window.location.href = '/';
    };

    const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 bg-[var(--color-sidebar)] text-[var(--color-sidebar-foreground)] border-r border-[var(--color-sidebar-border)] transition-all duration-300 ease-in-out
    ${isCollapsed ? 'w-20' : 'w-64'}
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-background/60 backdrop-blur-md z-30 lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            <aside className={sidebarClasses}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <Link
                        to="/"
                        className={`p-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} hover:opacity-80 transition-all group`}
                    >
                        {!isCollapsed && (
                            <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 accent-gradient rounded-2xl flex items-center justify-center text-primary-foreground font-black italic shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                     {config.module?.logo?.icon || '📋'}
                                 </div>
                                 <div className="flex flex-col">
                                     <span className="text-lg font-black uppercase italic tracking-tighter leading-none text-[var(--color-sidebar-foreground)] text-balance">
                                         {config.module?.logo?.text || 'MacroHR'}
                                     </span>
                                    <span className="text-[10px] font-bold text-[var(--color-sidebar-foreground)]/60 uppercase tracking-widest mt-1">
                                        {role === 'manager' ? 'Admin Hub' : 'User Portal'}
                                    </span>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onCollapse();
                            }}
                            className="hidden lg:flex p-2 rounded-xl bg-muted/20 border border-[var(--color-sidebar-border)] hover:bg-muted/40 text-[var(--color-sidebar-foreground)]/80 transition-all"
                        >
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>
                    </Link>

                    {/* Navigation Items */}
                    <nav className="flex-1 px-4 mt-4 space-y-2 overflow-y-auto custom-scrollbar">
                        {filteredNavItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    search={{ role }}
                                    onClick={() => isMobileOpen && onMobileToggle()}
                                    activeProps={{
                                        className: 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]',
                                    }}
                                    inactiveProps={{
                                        className: 'text-[var(--color-sidebar-foreground)]/60 hover:bg-muted/30 hover:text-[var(--color-sidebar-foreground)]',
                                    }}
                                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group font-black uppercase italic text-xs tracking-widest overflow-hidden"
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <Icon size={18} className="shrink-0" />
                                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Collapsible Switchers Section */}
                    {!isCollapsed && (
                        <div className="px-6 py-2 border-t border-[var(--color-sidebar-border)]/10">
                            <button
                                onClick={() => setShowSwitchers(!showSwitchers)}
                                className="w-full flex items-center justify-between px-2 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--color-sidebar-foreground)]/40 hover:text-primary transition-colors italic group"
                            >
                                <div className="flex items-center gap-2">
                                    <Palette size={10} className={showSwitchers ? "text-primary" : ""} />
                                    <span>Engine Control</span>
                                </div>
                                <div className={`transition-transform duration-300 ${showSwitchers ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={10} />
                                </div>
                            </button>

                            {showSwitchers && (
                                <div className="space-y-4 pt-2 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 px-2 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--color-sidebar-foreground)]/30 italic">
                                            <span>Visual Theme</span>
                                        </div>
                                        <Select value={config.currentTheme} onValueChange={(v) => setTheme(v as any)}>
                                            <SelectTrigger className="h-10 bg-muted/20 border-[var(--color-sidebar-border)]/50 rounded-xl text-[10px] font-black uppercase italic tracking-widest text-[var(--color-sidebar-foreground)] focus:ring-primary/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-[var(--color-sidebar-border)] rounded-xl">
                                                {Object.entries(themes).map(([id, theme]) => (
                                                    <SelectItem
                                                        key={id}
                                                        value={id}
                                                        className="text-[10px] font-black uppercase italic tracking-widest focus:bg-primary/10 focus:text-primary transition-colors py-3"
                                                    >
                                                        {theme.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 px-2 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--color-sidebar-foreground)]/30 italic">
                                            <span>Core Architecture</span>
                                        </div>
                                        <Select value={config.currentModule} onValueChange={(v) => setModule(v as any)}>
                                            <SelectTrigger className="h-10 bg-muted/20 border-[var(--color-sidebar-border)]/50 rounded-xl text-[10px] font-black uppercase italic tracking-widest text-[var(--color-sidebar-foreground)] focus:ring-primary/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-[var(--color-sidebar-border)] rounded-xl">
                                                {Object.entries(modules).map(([id, mod]) => (
                                                    <SelectItem
                                                        key={id}
                                                        value={id}
                                                        className="text-[10px] font-black uppercase italic tracking-widest focus:bg-primary/10 focus:text-primary transition-colors py-3"
                                                    >
                                                        {mod.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer Branding & Actions */}
                    <div className="p-6 mt-auto border-t border-[var(--color-sidebar-border)]/10 space-y-2 relative overflow-hidden">
                        {!isCollapsed && (
                            <div className="px-4 py-3 mb-4 bg-muted/20 rounded-2xl border border-[var(--color-sidebar-border)] border-dashed">
                                <a
                                    href="https://web4strategy.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group text-center"
                                >
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-sidebar-foreground)]/40 group-hover:text-primary transition-colors">
                                        Innovated by
                                    </span>
                                    <span className="block text-[11px] font-black uppercase italic tracking-tighter text-[var(--color-sidebar-foreground)] mt-1 group-hover:scale-110 transition-transform">
                                        @Web4strategy
                                    </span>
                                </a>
                            </div>
                        )}

                        <button
                            onClick={handleSignOut}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black uppercase italic text-xs tracking-widest ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <LogOut size={18} />
                            {!isCollapsed && <span className="truncate">Sign Out</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;