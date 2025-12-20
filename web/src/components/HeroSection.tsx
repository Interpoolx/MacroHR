import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Rocket, Zap, Layout, Code2, Layers } from "lucide-react";
import { useSiteConfig } from "@config/SiteConfigFromDB";

export const HeroSection = () => {
  const { config } = useSiteConfig();
  const module = config.module || { name: 'MacroHR', description: 'Comprehensive HR Management', url: '/', githubUrl: '/' };

  // Split name for styling: "MacroHR" -> "Macro" and "HR"
  const nameParts = module.name.replace(/([A-Z])/g, ' $1').trim().split(' ');
  const firstName = nameParts[0] || module.name;
  const restName = nameParts.slice(1).join('') || 'Suite';

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: "1s" }} />

      {/* Floating code symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["{ }", "</>", "( )", "[ ]", "=>", "!!"].map((symbol, i) => (
          <motion.span
            key={symbol}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08, y: [0, -30, 0] }}
            transition={{ duration: 5, delay: i * 0.7, repeat: Infinity }}
            className="absolute text-5xl font-mono text-primary/30"
            style={{
              top: `${15 + i * 18}%`,
              left: i % 2 === 0 ? "8%" : "88%",
            }}
          >
            {symbol}
          </motion.span>
        ))}
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-8 border border-primary/20 backdrop-blur-sm"
        >
          <Zap className="w-4 h-4 fill-current animate-pulse" />
          Modernize Your {module.name} Operations with React 19
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] mb-8 text-balance uppercase italic"
        >
          {firstName} <br />
          <span className="text-foreground">Your </span>
          <span className="gradient-text">{restName}.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed font-medium"
        >
          {module.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-6 mb-12"
        >
          <a href={module.url} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="accent-gradient border-0 text-xl px-10 py-8 font-black uppercase italic glow-effect group transition-all hover:scale-105 active:scale-95 text-white">
              <Rocket className="mr-3 h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Launch {module.name}
            </Button>
          </a>
          <a href={module.githubUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="text-xl px-10 py-8 font-black uppercase italic bg-secondary/30 border-border hover:bg-secondary/50 hover:border-primary/50 transition-all">
              <Github className="mr-3 h-6 w-6" />
              Star on GitHub
            </Button>
          </a>
        </motion.div>

        {/* Social Proof / Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-10 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground"
        >
          {[
            { icon: Layout, label: "TanStack Router" },
            { icon: Zap, label: "TanStack Query" },
            { icon: Layers, label: "TanStack Table" },
            { icon: Code2, label: "Cloudflare D1" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 group cursor-default">
              <item.icon className="w-5 h-5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="group-hover:text-foreground transition-colors">{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Hero Demo Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative px-4 md:px-0"
        >
          <div className="absolute inset-x-0 -top-10 h-40 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
          <div className="glass rounded-3xl p-3 md:p-4 glow-effect max-w-6xl mx-auto border-primary/10">
            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-2xl relative">
              <div className="code-header justify-between bg-black/40 backdrop-blur-md">
                <div className="flex gap-2">
                  <span className="code-dot bg-red-500/50" />
                  <span className="code-dot bg-yellow-500/50" />
                  <span className="code-dot bg-green-500/50" />
                </div>
                <span className="text-primary/60 text-[10px] font-black tracking-widest uppercase">dashboard_preview.tsx</span>
                <div className="w-12 h-1 px-4 bg-muted/20" />
              </div>
              <div className="aspect-[16/10] bg-black/60 flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-primary blur-3xl opacity-20 animate-pulse" />
                    <img
                      src="/dashboard-preview.png"
                      alt="Dashboard Preview"
                      className="rounded-xl border border-border relative z-10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 max-w-full h-auto"
                    />
                  </div>
                  <p className="text-primary/60 font-black uppercase tracking-widest text-xs mt-8 animate-bounce">Interactive Preview Below</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};