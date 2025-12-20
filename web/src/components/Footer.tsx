import { Github, Twitter, Mail } from "lucide-react";
import { useSiteConfig } from "@config";

export const Footer = () => {
  const { config } = useSiteConfig();
  const module = config.module || { logo: { icon: '📋', text: 'MacroHR' }, description: 'Professional Dashboard Kit', name: 'MacroHR' };

  return (
    <footer className="border-t border-border py-24 px-6 bg-[var(--color-footer)] text-[var(--color-footer-foreground)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2 space-y-8">
            <div className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center">
                <span className="text-primary-foreground text-xl font-black italic">{module.logo.icon}</span>
              </div>
              <span className="gradient-text">{module.logo.text}</span>
            </div>
            <p className="opacity-80 max-w-sm text-lg font-medium leading-relaxed">
              {module.description}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center hover:text-primary hover:border-primary/30 transition-all glass">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center hover:text-primary hover:border-primary/30 transition-all glass">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center hover:text-primary hover:border-primary/30 transition-all glass">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs text-primary mb-8">Product</h4>
            <ul className="space-y-4 opacity-70 font-bold uppercase text-sm tracking-tighter">
              <li><a href="/#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="/#demo" className="hover:text-primary transition-colors">Interactive Demo</a></li>
              <li><a href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="/#testimonials" className="hover:text-primary transition-colors">Testimonials</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs text-primary mb-8">Legal</h4>
            <ul className="space-y-4 opacity-70 font-bold uppercase text-sm tracking-tighter">
              <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="/cookie" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
          <div>© {new Date().getFullYear()} {module.name}. Professional Dashboard Kit.</div>
          <div className="flex items-center gap-6">
            <a href="https://web4strategy.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">By @Web4strategy</a>
            <div className="w-1 h-1 rounded-full bg-border" />
            <a href="https://x.com/web4strategy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors italic lowercase tracking-widest">x.com/web4strategy</a>
            <div className="w-1 h-1 rounded-full bg-border" />
            <a href="https://github.com/Interpoolx/MacroHR" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors italic lowercase tracking-widest underline decoration-primary/30 underline-offset-4">Source Code</a>
          </div>
        </div>
      </div>
    </footer>
  );
};