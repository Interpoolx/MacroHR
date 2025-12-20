import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Clock,
    Calendar,
    CheckCircle2,
    Zap,
    ArrowUpRight,
    Briefcase,
    Timer,
    Activity
} from 'lucide-react'
import { Button } from "@shared/components/ui/button"
import { Progress } from "@shared/components/ui/progress"
import { Badge } from "@shared/components/ui/badge"

export const Route = createFileRoute('/user/dashboard')({
    component: UserDashboard,
})


function UserDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const stats = [
        { label: 'Work Hours', value: '164h', icon: Timer, color: 'text-primary' },
        { label: 'Tasks Done', value: '42', icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'Attendance', value: '98%', icon: Calendar, color: 'text-sky-500' },
        { label: 'Efficiency', value: '+12%', icon: Activity, color: 'text-orange-500' },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-foreground">
            {/* Header / Hero Section */}
            <div className="relative group overflow-hidden bg-card p-10 rounded-[var(--radius)] border border-border glass shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/20 font-black uppercase italic tracking-widest px-3 py-1 text-[10px]">
                                Employee workspace
                            </Badge>
                            <span className="text-muted-foreground font-bold uppercase italic text-[10px] tracking-widest flex items-center gap-2">
                                <Clock size={12} className="text-primary animate-pulse" />
                                {currentTime.toLocaleTimeString()}
                            </span>
                        </div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4">
                            Good Morning, <span className="text-primary">Employee!</span> 👋
                        </h1>
                        <p className="text-muted-foreground font-bold uppercase italic text-xs tracking-[0.2em] leading-relaxed max-w-xl">
                            You have <span className="text-foreground">5 active tasks</span> and 2 meetings scheduled for today. Your performance rating is currently in the top <span className="text-primary underline underline-offset-4">5%</span>.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Button className="h-14 px-8 accent-gradient border-0 rounded-2xl font-black uppercase italic shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm group flex items-center gap-3">
                            <Zap size={18} className="fill-current" />
                            Clock In (Shift Start)
                        </Button>
                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-border bg-muted/50 font-black uppercase italic text-xs tracking-widest hover:bg-muted/80 transition-all">
                            View Shift Schedule
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass bg-card border border-border rounded-3xl p-6 hover:border-primary/30 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl bg-muted/50 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={20} />
                            </div>
                            <ArrowUpRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                        <p className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">{stat.label}</p>
                        <h3 className="text-3xl font-black italic tracking-tighter mt-1">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Tasks & Projects */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass bg-card border border-border rounded-[var(--radius)] p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Assigned tasks</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Operational Roadmap for Q1</p>
                            </div>
                            <Button variant="ghost" className="text-primary hover:bg-primary/10 font-black uppercase italic text-[10px] tracking-widest">
                                View Registry
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: 'Update HR SEO Meta tags', category: 'Marketing', progress: 75, deadline: '2h' },
                                { title: 'Refactor Hono Proxy Logic', category: 'Dev', progress: 90, deadline: '4h' },
                                { title: 'Employee Handbook Review', category: 'Legal', progress: 30, deadline: '明天' },
                            ].map((task, idx) => (
                                <div key={idx} className="p-5 bg-muted/30 rounded-2xl border border-border hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black italic">#{idx + 1}</div>
                                            <span className="font-black uppercase italic text-xs tracking-tight group-hover:text-primary transition-colors">{task.title}</span>
                                        </div>
                                        <Badge className="bg-muted border-border text-[9px] font-black uppercase tracking-tighter">{task.category}</Badge>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Progress value={task.progress} className="h-1.5 flex-1 bg-muted" />
                                        <span className="text-[10px] font-black italic text-muted-foreground">{task.progress}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass bg-card border border-border rounded-[var(--radius)] p-8 group hover:border-primary/20 transition-all">
                            <Briefcase className="text-primary mb-4" size={24} />
                            <h4 className="font-black uppercase italic tracking-widest mb-1">Upcoming Milestone</h4>
                            <p className="text-muted-foreground text-xs font-bold tracking-tight mb-6 leading-relaxed">Yearly Performance Review is coming up in 2 weeks. Prepare your artifacts.</p>
                            <Button variant="outline" className="w-full rounded-xl border-border hover:bg-muted/50 uppercase text-[10px] font-black italic tracking-widest">Review guidelines</Button>
                        </div>
                        <div className="glass border-2 border-primary/20 rounded-[var(--radius)] p-8 accent-gradient-tr relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="font-black uppercase italic tracking-widest mb-1 text-primary-foreground">MacroHR Docs</h4>
                                <p className="text-primary-foreground/80 text-xs font-bold tracking-tight mb-6 leading-relaxed">Access internal engineering and design systems documentation instantly.</p>
                                <Button className="w-full rounded-xl bg-background text-foreground hover:bg-muted uppercase text-[10px] font-black italic tracking-widest border-0">Explore docs</Button>
                            </div>
                            <CheckCircle2 className="absolute -bottom-4 -right-4 w-24 h-24 text-primary-foreground/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                    </div>
                </div>

                {/* Vertical Timeline / Calendar */}
                <div className="space-y-8">
                    <div className="glass bg-card border border-border rounded-[var(--radius)] p-8">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">Daily timeline</h3>
                        <div className="space-y-8 relative before:absolute before:inset-0 before:left-[15px] before:w-[2px] before:bg-muted before:my-4">
                            {[
                                { time: '09:00 AM', event: 'Daily Standup', type: 'meeting' },
                                { time: '11:30 AM', event: 'Code Review Session', type: 'work' },
                                { time: '01:00 PM', event: 'Lunch Break', type: 'break' },
                                { time: '03:45 PM', event: 'Design Sync', type: 'meeting' },
                            ].map((item, idx) => (
                                <div key={idx} className="relative pl-10">
                                    <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-background z-10 flex items-center justify-center ${idx === 0 ? 'bg-primary' : 'bg-muted'}`}>
                                        <div className="w-2 h-2 rounded-full bg-foreground" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase italic tracking-widest text-primary">{item.time}</p>
                                    <h4 className="font-bold text-sm tracking-tight text-foreground mt-1">{item.event}</h4>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-primary rounded-[var(--radius)] shadow-2xl shadow-primary/30 relative overflow-hidden">
                        <div className="relative z-10 text-white">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Benefit Summary</h3>
                            <p className="text-xs font-bold opacity-80 mb-6 italic uppercase tracking-widest">Medical • 401k • Wellness</p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs font-black uppercase italic tracking-widest">
                                    <span>Accrued PTO</span>
                                    <span>14.5 Days</span>
                                </div>
                                <Progress value={65} className="h-2 bg-white/20" />
                            </div>
                        </div>
                        <Activity className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-white/10" />
                    </div>
                </div>
            </div>
        </div>
    )
}
