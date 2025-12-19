import React from 'react';
import {
    LayoutDashboard,
    Users,
    Receipt,
    CalendarCheck,
    Gift,
    TrendingUp,
    User,
    Briefcase,
    FileText,
    Settings,
    LifeBuoy,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { signOut } from '@shared/lib/supabase';

interface SidebarProps {
    isMobileOpen: boolean;
    onMobileToggle: () => void;
    isCollapsed: boolean;
    onCollapse: () => void;
    role: 'user' | 'manager';
}

interface NavItem {
    to: string;
    label: string;
    icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
    { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/user/people', label: 'People', icon: Users, managerOnly: true },
    { to: '/user/payslip', label: 'Payslips', icon: Receipt, managerOnly: true },
    { to: '/user/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/user/tasks', label: 'My Tasks', icon: FileText, userOnly: true },
    { to: '/user/benefits', label: 'Benefits', icon: Gift, managerOnly: true },
    { to: '/user/performance', label: 'Performance', icon: TrendingUp, managerOnly: true },
    { to: '/user/personal', label: 'Personal Details', icon: User, managerOnly: true },
    { to: '/user/job-reference', label: 'Job Reference', icon: Briefcase, managerOnly: true },
    { to: '/user/documents', label: 'Documents', icon: FileText, managerOnly: true },
    { to: '/user/settings', label: 'Settings', icon: Settings, managerOnly: true },
    { to: '/user/support', label: 'Support', icon: LifeBuoy, managerOnly: true },
];

interface NavItem {
    to: string;
    label: string;
    icon: React.ElementType;
    managerOnly?: boolean;
    userOnly?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onCollapse,
    role
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

    const filteredNavItems = NAV_ITEMS.filter(item => {
        if (role === 'manager') return !item.userOnly;
        if (role === 'user') return !item.managerOnly;
        return true;
    });

    const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 bg-[#050505] border-r border-white/5 transition-all duration-300 ease-in-out
    ${isCollapsed ? 'w-20' : 'w-64'}
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            <aside className={sidebarClasses}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <Link to="/" className={`p-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} hover:opacity-80 transition-all group`}>
                        {!isCollapsed && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 accent-gradient rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">M+</div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-black uppercase italic tracking-tighter leading-none text-white text-balance">Macro<span className="text-primary text-xl">HR</span></span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                        {role === 'manager' ? 'HR Manager' : 'Employee Hub'}
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
                            className="hidden lg:flex p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 transition-all"
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
                                        className: 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                    }}
                                    inactiveProps={{
                                        className: 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }}
                                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group font-black uppercase italic text-xs tracking-widest overflow-hidden"
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <Icon size={18} className="shrink-0" />
                                    {!isCollapsed && (
                                        <span className="truncate">{item.label}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer Branding & Actions */}
                    <div className="p-6 mt-auto border-t border-white/5 space-y-2 relative overflow-hidden">
                        {!isCollapsed && (
                            <div className="px-4 py-3 mb-4 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                <a
                                    href="https://web4strategy.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group text-center"
                                >
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-primary transition-colors">Innovated by</span>
                                    <span className="block text-[11px] font-black uppercase italic tracking-tighter text-white mt-1 group-hover:scale-110 transition-transform">@Web4strategy</span>
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
