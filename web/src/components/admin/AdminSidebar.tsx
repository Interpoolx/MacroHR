import React from 'react';
import {
    LayoutDashboard,
    Users,
    Settings,
    Shield,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    LogOut,
    Home,
    Palette,
    Box
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { signOut } from '@shared/lib/supabase';
import { useSiteConfig } from '@config';
import { themes } from '@shared/lib/themes';
import { modules } from '@config';
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
}

const NAV_ITEMS = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/roles', label: 'Roles & Permissions', icon: Shield },
    { to: '/admin/settings', label: 'System Settings', icon: Settings },
];

const AdminSidebar: React.FC<SidebarProps> = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onCollapse
}) => {
    const { config, setTheme, setModule } = useSiteConfig();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (e) { }

        localStorage.removeItem('admin_session')
        localStorage.removeItem('user_email')
        localStorage.removeItem('user_role')
        localStorage.removeItem('macrohr_demo_user')

        window.dispatchEvent(new Event('auth-change'))
        window.location.href = '/'
    }

    const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 bg-[var(--color-sidebar)] text-[var(--color-sidebar-foreground)] border-r border-[var(--color-sidebar-border)] transition-all duration-300 ease-in-out
    ${isCollapsed ? 'w-20' : 'w-64'}
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

    const [showSwitchers, setShowSwitchers] = React.useState(false);

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            <aside className={sidebarClasses}>
                <div className="flex flex-col h-full">
                    {/* Admin Logo Section */}
                    <div className={`p-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                        {!isCollapsed && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 accent-gradient rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20">M+</div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-black uppercase italic tracking-tighter leading-none">Macro<span className="text-primary text-xl">HR</span></span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Admin Panel</span>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={onCollapse}
                            className="hidden lg:flex p-2 rounded-xl bg-muted/20 border border-border/10 hover:bg-muted/30 text-muted-foreground transition-all"
                        >
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 px-4 mt-4 space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isDashboard = item.to === '/admin';
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    activeOptions={{ exact: isDashboard }}
                                    onClick={() => isMobileOpen && onMobileToggle()}
                                    activeProps={{
                                        className: 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]'
                                    }}
                                    inactiveProps={{
                                        className: 'text-muted-foreground/80 hover:bg-muted/20 hover:text-foreground'
                                    }}
                                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group font-black uppercase italic text-xs tracking-widest overflow-hidden"
                                >
                                    <Icon size={18} className="shrink-0" />
                                    {!isCollapsed && (
                                        <span className="truncate">{item.label}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Collapsible Switchers Section */}
                    {!isCollapsed && (
                        <div className="px-6 py-2 border-t border-border/5">
                            <button
                                onClick={() => setShowSwitchers(!showSwitchers)}
                                className="w-full flex items-center justify-between px-2 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-colors italic group"
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
                                        <div className="flex items-center gap-2 px-2 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">
                                            <span>Visual Theme</span>
                                        </div>
                                        <Select value={config.currentTheme} onValueChange={(v) => setTheme(v as any)}>
                                            <SelectTrigger className="h-10 bg-muted/20 border-border/50 rounded-xl text-[10px] font-black uppercase italic tracking-widest text-foreground focus:ring-primary/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-border rounded-xl">
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
                                        <div className="flex items-center gap-2 px-2 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">
                                            <span>Core Architecture</span>
                                        </div>
                                        <Select value={config.currentModule} onValueChange={(v) => setModule(v as any)}>
                                            <SelectTrigger className="h-10 bg-muted/20 border-border/50 rounded-xl text-[10px] font-black uppercase italic tracking-widest text-foreground focus:ring-primary/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-border rounded-xl">
                                                {Object.entries(modules).map(([id, mod]: [string, any]) => (
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

                    {/* Footer Actions */}
                    <div className="p-6 mt-auto border-t border-border/10 space-y-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

                        <Link
                            to="/"
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-muted-foreground hover:bg-muted/20 hover:text-foreground transition-all font-black uppercase italic text-xs tracking-widest ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <Home size={18} />
                            {!isCollapsed && <span className="truncate">Back to Site</span>}
                        </Link>

                        {!isCollapsed && (
                            <div className="px-4 py-2 mt-2">
                                <a
                                    href="https://web4strategy.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover:text-primary transition-colors">By @Web4strategy</span>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="h-[2px] w-4 bg-primary/20 rounded-full group-hover:w-full transition-all duration-500" />
                                    </div>
                                </a>
                            </div>
                        )}

                        <button
                            onClick={handleSignOut}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black uppercase italic text-xs tracking-widest ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <LogOut size={18} />
                            {!isCollapsed && <span className="truncate">Log Out</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
