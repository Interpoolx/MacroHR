import { Github, Twitter, Mail, Zap } from "lucide-react";
import { useSiteConfig } from '@shared/config/SiteConfigFromDB'

export const Footer = () => {
  const config = useSiteConfig()
  return (
    <footer className="border-t border-white/5 py-24 px-6 bg-black relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2 space-y-8">
            <div className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="gradient-text">{config.name}</span>
            </div>
            <p className="text-muted-foreground max-w-sm text-lg font-medium leading-relaxed">
              The ultimate HR Management & Workforce Orchestration suite.
              Built with React 19, Hono, and TanStack.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-secondary/50 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-secondary/50 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-secondary/50 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs text-primary mb-8">Product</h4>
            <ul className="space-y-4 text-muted-foreground font-bold uppercase text-sm tracking-tighter">
              <li><a href="/#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="/#demo" className="hover:text-foreground transition-colors">Interactive Demo</a></li>
              <li><a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              <li><a href="/#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs text-primary mb-8">Legal</h4>
            <ul className="space-y-4 text-muted-foreground font-bold uppercase text-sm tracking-tighter">
              <li><a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="/cookie" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
          <div>© {new Date().getFullYear()} {config.name}. Professional Dashboard Kit.</div>
          <div className="flex items-center gap-6">
            <a href="https://web4strategy.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">By @Web4strategy</a>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <a href="https://x.com/web4strategy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors italic lowercase tracking-widest">x.com/web4strategy</a>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <a href="https://github.com/Interpoolx/MacroHR" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors italic lowercase tracking-widest underline decoration-primary/30 underline-offset-4">Source Code</a>
          </div>
        </div>
      </div>
    </footer>
  );
};