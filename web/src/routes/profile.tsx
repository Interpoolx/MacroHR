import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase, signOut } from '@shared/lib/supabase'
import { User, Mail, Shield, Bell, Lock, LogOut, Camera, Zap, CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from '../components/Navbar'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      } else {
        const demoUser = localStorage.getItem('macrohr_demo_user')
        if (demoUser) setUser(JSON.parse(demoUser))
        else navigate({ to: '/auth' })
      }
    }
    checkAuth()
  }, [navigate])

  const handleSignOut = async () => {
    await signOut()
    localStorage.removeItem('macrohr_demo_user')
    window.dispatchEvent(new Event('auth-change'))
    navigate({ to: '/' })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-8 mb-12">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] accent-gradient p-1 shadow-2xl shadow-primary/20">
                <div className="w-full h-full rounded-[2.3rem] bg-black flex items-center justify-center overflow-hidden border-4 border-black">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-primary" />
                  )}
                </div>
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
                <Camera size={18} />
              </button>
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
                {user.user_metadata?.name || 'User Profile'}
              </h1>
              <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full w-fit">
                <Zap size={10} className="fill-current" /> Verified Member
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-2">
              {[
                { icon: User, label: "Account Overview", active: true },
                { icon: Lock, label: "Security Setup" },
                { icon: Bell, label: "Notifications" },
                { icon: Shield, label: "Data & Privacy" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black uppercase italic text-xs tracking-widest ${item.active
                      ? 'bg-primary text-white shadow-xl shadow-primary/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black uppercase italic text-xs tracking-widest mt-8 border border-red-500/10"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>

            {/* Content */}
            <div className="md:col-span-2 space-y-8">
              <div className="glass rounded-[2.5rem] p-8 border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <CheckCircle2 size={120} className="text-primary" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-widest mb-8 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Personal Identity
                </h3>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500 ml-1">Full Name</Label>
                      <Input defaultValue={user.user_metadata?.name || ''} className='bg-white/5 border-white/10 rounded-2xl h-14 px-6 focus:ring-primary focus:border-primary text-white' />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500 ml-1">Email Registry</Label>
                      <Input defaultValue={user.email} disabled className="bg-white/5 border-white/10 rounded-2xl h-14 px-6 opacity-50 cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500 ml-1">Professional Bio</Label>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 focus:ring-primary focus:border-primary h-32 transition-all outline-none resize-none" placeholder="Details about your professional journey..." defaultValue="Senior Technical Lead with a passion for high-performance React architectures. Bridging the gap between design and high-velocity engineering." />
                  </div>
                  <Button className="accent-gradient h-14 px-10 rounded-2xl font-black uppercase italic tracking-widest border-0 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                    Save Adjustments
                  </Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="glass rounded-[2.5rem] p-8 border-white/5 group hover:border-primary/20 transition-all">
                  <Lock className="text-primary mb-4" size={24} />
                  <h4 className="font-black uppercase italic tracking-widest mb-1">Two-Factor</h4>
                  <p className="text-slate-500 text-xs font-bold tracking-tight mb-6">Enhanced security protocols enabled.</p>
                  <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5 uppercase text-[10px] font-black italic tracking-widest">Configure</Button>
                </div>
                <div className="glass rounded-[2.5rem] p-8 border-white/5 group hover:border-primary/20 transition-all">
                  <Mail className="text-sky-400 mb-4" size={24} />
                  <h4 className="font-black uppercase italic tracking-widest mb-1">Subscriptions</h4>
                  <p className="text-slate-500 text-xs font-bold tracking-tight mb-6">Manage your mail communication.</p>
                  <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5 uppercase text-[10px] font-black italic tracking-widest">Preferences</Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
