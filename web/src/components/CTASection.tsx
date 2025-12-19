import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { Button } from "@shared/components/ui/button";
import { Github, Rocket, CheckCircle2, Zap } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-40 px-6 relative overflow-hidden bg-black">
      {/* Intense glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <AnimatedSection>
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-[2rem] accent-gradient flex items-center justify-center mx-auto mb-10 glow-effect shadow-2xl shadow-primary/40"
          >
            <Rocket className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-6xl md:text-8xl font-black mb-8 uppercase italic leading-[0.85] tracking-tighter">
            Stop Building <br />
            <span className="gradient-text">Start Shipping.</span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            The kit is 100% free and open source. Clone it, star it, and build your next big thing today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <Button size="lg" className="accent-gradient border-0 text-xl px-12 py-8 font-black uppercase italic glow-effect group hover:scale-105 active:scale-95 text-white">
              <Zap className="mr-3 h-6 w-6 fill-current animate-pulse" />
              Get Started Now
            </Button>
            <a href="https://github.com/Interpoolx/MacroHR" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-xl px-12 py-8 font-black uppercase italic bg-secondary/30 border-border hover:bg-secondary/50 hover:border-primary/40 transition-all text-foreground">
                <Github className="mr-3 h-6 w-6" />
                Clone on GitHub
              </Button>
            </a>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>React 19 Ready</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Edge Optimized</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>No CC Required</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};