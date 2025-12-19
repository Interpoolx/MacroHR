import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteConfig } from '@shared/config/SiteConfigFromDB'
import { Button } from "@shared/components/ui/button"
import { Shield, User, Zap, ArrowRight, Lock, Mail, CheckCircle2, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

const demoAccounts = [
  {
    role: 'Admin',
    email: 'admin@admin.com',
    password: 'admin123',
    icon: Shield,
    color: 'from-orange-500 to-red-600',
    description: 'Full system access & user management',
    target: '/admin'
  },
  {
    role: 'Manager',
    email: 'manager@staff.com',
    password: 'manager123',
    icon: Zap,
    color: 'from-blue-500 to-indigo-600',
    description: 'Team performance & project oversight',
    target: '/user/dashboard?role=manager'
  },
  {
    role: 'Employee',
    email: 'user@user.com',
    password: 'user123',
    icon: User,
    color: 'from-emerald-500 to-teal-600',
    description: 'Personal dashboard & task tracking',
    target: '/user/dashboard'
  }
]

function AuthPage() {
  const config = useSiteConfig()
  const navigate = useNavigate()
  const [selectedAccount, setSelectedAccount] = useState<typeof demoAccounts[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAccount) {
      setError('Please select a demo account to proceed')
      return
    }

    setIsLoading(true)
    setError(null)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200))

    const demoUser = {
      email: selectedAccount.email,
      user_metadata: {
        name: selectedAccount.role,
        role: selectedAccount.role.toLowerCase(),
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAccount.role}`
      }
    }

    localStorage.setItem('macrohr_demo_user', JSON.stringify(demoUser))
    window.dispatchEvent(new Event('auth-change'))

    const targetParts = selectedAccount.target.split('?')
    const to = targetParts[0]
    const search: any = {}
    if (targetParts[1]) {
      const params = new URLSearchParams(targetParts[1])
      params.forEach((value, key) => { search[key] = value })
    }

    setIsLoading(false)
    navigate({ to: to as any, search })
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full grid lg:grid-cols-2 gap-12 items-center relative z-10"
      >
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:block space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl accent-gradient flex items-center justify-center shadow-2xl shadow-primary/20">
              <Zap className="w-7 h-7 text-white fill-current" />
            </div>
            <span className="text-3xl font-black italic uppercase tracking-tighter gradient-text">
              {config.name}
            </span>
          </div>

          <h1 className="text-6xl font-black uppercase italic leading-[0.9] tracking-tighter">
            Experience the <br />
            <span className="text-primary">Next Generation</span> <br />
            of Dashboards.
          </h1>

          <div className="space-y-4">
            {[
              "React 19 & Hono Framework",
              "Enterprise-grade Security",
              "Real-time Edge Analytics",
              "Pixel-perfect Components"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-lg font-bold text-white/70">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="glass rounded-[2.5rem] p-8 md:p-12 border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black uppercase italic mb-2 tracking-tight">Demo Login</h2>
            <p className="text-white/50 font-medium">Select a role to preview the full dashboard experience.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid gap-4">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => {
                    setSelectedAccount(account)
                    setError(null)
                  }}
                  className={`group relative flex items-center gap-4 p-5 rounded-3xl border-2 transition-all duration-300 text-left ${selectedAccount?.role === account.role
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                    }`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${account.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <account.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black uppercase italic text-sm tracking-tight">{account.role}</p>
                    <p className="text-xs text-white/60 font-medium leading-tight">{account.description}</p>
                  </div>
                  <AnimatePresence>
                    {selectedAccount?.role === account.role && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {selectedAccount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-4 border-t border-white/5"
                >
                  <div className="grid gap-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input
                        type="email"
                        readOnly
                        value={selectedAccount.email}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white/50 focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input
                        type="password"
                        readOnly
                        value={selectedAccount.password}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm font-bold animate-shake">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full accent-gradient border-0 h-16 rounded-[1.5rem] text-xl font-black uppercase italic glow-effect group shadow-xl shadow-primary/20"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Launch Dashboard
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em]">
              Powered by <span className="text-white/50 italic">{config.name} React 19 Engine</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
