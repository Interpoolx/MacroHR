import React from 'react';
import {
    LayoutDashboard,
    Users,
    Settings,
    Shield,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Home
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { signOut } from '@shared/lib/supabase';

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
    fixed inset-y-0 left-0 z-40 bg-[#050505] border-r border-white/5 transition-all duration-300 ease-in-out
    ${isCollapsed ? 'w-20' : 'w-64'}
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

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
                            className="hidden lg:flex p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 transition-all"
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
                                        className: 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                    }}
                                    inactiveProps={{
                                        className: 'text-slate-400 hover:bg-white/5 hover:text-white'
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

                    {/* Footer Actions */}
                    <div className="p-6 mt-auto border-t border-white/5 space-y-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

                        <Link
                            to="/"
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-black uppercase italic text-xs tracking-widest ${isCollapsed ? 'justify-center' : ''}`}
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
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-primary transition-colors">By @Web4strategy</span>
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
