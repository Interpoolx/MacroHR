import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Shield,
    TrendingUp,
    Activity,
    UserPlus,
    Clock,
    CheckCircle2,
    Calendar,
    Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const data = [
    { name: 'Mon', revenue: 4000, users: 2400 },
    { name: 'Tue', revenue: 3000, users: 1398 },
    { name: 'Wed', revenue: 2000, users: 9800 },
    { name: 'Thu', revenue: 2780, users: 3908 },
    { name: 'Fri', revenue: 1890, users: 4800 },
    { name: 'Sat', revenue: 2390, users: 3800 },
    { name: 'Sun', revenue: 3490, users: 4300 },
];

const COLORS = ['#FF6B00', '#3b82f6', '#10b981', '#f59e0b'];

const stats = [
    {
        title: 'Total Users',
        value: '12,842',
        trend: '+12.5%',
        isUp: true,
        icon: Users,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10'
    },
    {
        title: 'Revenue',
        value: '$48,290',
        trend: '+8.2%',
        isUp: true,
        icon: TrendingUp,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        title: 'Active Sessions',
        value: '2,402',
        trend: '-3.1%',
        isUp: false,
        icon: Zap,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    },
    {
        title: 'Security Audits',
        value: '98/100',
        trend: 'Stable',
        isUp: true,
        icon: Shield,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    },
];

const activities = [
    { id: 1, user: 'John Doe', action: 'Created new project', time: '2 mins ago', icon: Zap },
    { id: 2, user: 'Sarah Wilson', action: 'Updated system settings', time: '15 mins ago', icon: Settings },
    { id: 3, user: 'Mike Johnson', action: 'New user registered', time: '1 hour ago', icon: UserPlus },
    { id: 4, user: 'System', action: 'Backup completed successfully', time: '5 hours ago', icon: CheckCircle2 },
];

import { Settings } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-foreground">
                        Admin <span className="text-primary">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">Real-time performance overview & metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-[var(--radius)] text-muted-foreground font-bold text-sm">
                        <Calendar size={18} />
                        <span>Last 30 Days</span>
                    </div>
                    <button className="accent-gradient h-12 px-6 rounded-[var(--radius)] font-black uppercase italic text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-primary-foreground">
                        <ArrowUpRight size={18} /> Export Data
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="glass border-border rounded-[var(--radius)] bg-card overflow-hidden hover:border-primary/30 transition-all group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                                        <stat.icon size={24} className={stat.color} />
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm font-black italic rounded-full px-3 py-1 ${stat.isUp ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                                        {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {stat.trend}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] mb-1">{stat.title}</h3>
                                    <div className="text-3xl font-black italic tracking-tighter tabular-nums leading-none text-foreground">{stat.value}</div>
                                </div>
                                <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '70%' }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                        className={`h-full ${stat.isUp ? 'bg-primary' : 'bg-destructive'}`}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass border-border bg-card rounded-[var(--radius)] p-8 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-foreground">Revenue Growth</CardTitle>
                            <CardDescription className="font-bold text-muted-foreground uppercase italic text-[10px] tracking-widest mt-1">Daily revenue generated this week</CardDescription>
                        </div>
                        <TrendingUp size={24} className="text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '16px', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#FF6B00' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#FF6B00"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="glass border-border bg-card rounded-[var(--radius)] p-8 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-foreground">User Acquisition</CardTitle>
                            <CardDescription className="font-bold text-muted-foreground uppercase italic text-[10px] tracking-widest mt-1">New user signups over the last 7 days</CardDescription>
                        </div>
                        <Activity size={24} className="text-blue-500" />
                    </div>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '16px', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="users" radius={[8, 8, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 glass border-border bg-card rounded-[var(--radius)] p-8 shadow-2xl overflow-hidden relative">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-foreground">Recent Activities</CardTitle>
                            <CardDescription className="font-bold text-muted-foreground uppercase italic text-[10px] tracking-widest mt-1">Most recent actions performed on the platform</CardDescription>
                        </div>
                        <Clock size={24} className="text-muted-foreground" />
                    </div>
                    <div className="space-y-6">
                        {activities.map((activity, i) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-12 h-12 rounded-[var(--radius)] bg-muted/50 border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                    <activity.icon size={20} className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black italic uppercase text-sm tracking-tighter text-foreground">
                                        {activity.user} <span className="text-muted-foreground normal-case italic font-bold ml-1">{activity.action}</span>
                                    </p>
                                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">{activity.time}</p>
                                </div>
                                <button className="w-8 h-8 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-white/10">
                                    <ArrowRight size={14} className="text-slate-400" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-4 border border-border bg-muted/30 rounded-[var(--radius)] font-black uppercase italic text-xs tracking-widest hover:bg-muted/50 transition-all text-foreground">
                        View All Activity
                    </button>
                </Card>

                {/* Quick Tips/Metrics */}
                <Card className="glass border-border rounded-[var(--radius)] p-8 shadow-2xl bg-gradient-to-br from-primary/20 via-transparent to-transparent">
                    <div className="w-14 h-14 rounded-[var(--radius)] accent-gradient flex items-center justify-center shadow-2xl shadow-primary/20 mb-6">
                        <Zap className="text-primary-foreground fill-current" size={32} />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-4 text-foreground">Quick Insights</h3>
                    <p className="font-bold text-muted-foreground uppercase italic text-xs tracking-widest leading-relaxed mb-8">
                        Your platform performance is <span className="text-primary italic">15% higher</span> than the last quarter average.
                    </p>
                    <div className="space-y-4">
                        <div className="p-4 bg-card border border-border rounded-[var(--radius)] flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                            <span className="font-black uppercase italic text-xs tracking-widest">System Health: 100%</span>
                        </div>
                        <div className="p-4 bg-card border border-border rounded-[var(--radius)] flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                            <span className="font-black uppercase italic text-xs tracking-widest">Active nodes: 12</span>
                        </div>
                        <div className="p-4 bg-card border border-border rounded-[var(--radius)] flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_#f59e0b]" />
                            <span className="font-black uppercase italic text-xs tracking-widest">Pending PRs: 4</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

import { ArrowRight } from 'lucide-react';
